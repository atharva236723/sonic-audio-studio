/* Browser-only DSP: sources are immutable; all effects render into new buffers. */
(()=>{
const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext;
const make=(channels,length,rate)=>new Offline(channels,Math.max(1,length),rate).createBuffer(channels,Math.max(1,length),rate);
const pause=()=>new Promise(r=>setTimeout(r,0));
// Waveform-similarity overlap-add: align overlapping grains across all channels.
async function stretch(input,factor){
 if(Math.abs(factor-1)<.00001)return input;
 const rate=input.sampleRate,channels=input.numberOfChannels,n=Math.max(1,Math.round(input.length*factor));
 const out=make(channels,n,rate),ins=Array.from({length:channels},(_,c)=>input.getChannelData(c)),outs=Array.from({length:channels},(_,c)=>out.getChannelData(c));
 const frame=Math.min(input.length,Math.round(rate*.04)),hop=Math.max(1,Math.floor(frame/2)),search=Math.round(rate*.012);
 let previous=0;
 for(let dest=0,grain=0;dest<n;dest+=hop,grain++){
 let source=Math.min(Math.max(0,input.length-frame),Math.round(dest/factor));
 if(dest>0&&frame>=32){
 const ref=previous+hop;let best=-Infinity,bestAt=source;
 const low=Math.max(previous+1,source-search,0),high=Math.min(input.length-frame,source+search);
 // Coarse candidate search with normalized correlation, then refine locally.
 const score=pos=>{let xy=0,xx=0,yy=0;for(let i=0;i<hop&&ref+i<input.length;i+=8){const x=ins[0][ref+i],y=ins[0][pos+i];xy+=x*y;xx+=x*x;yy+=y*y;}return xy/Math.sqrt(xx*yy+1e-20)-Math.abs(pos-source)*1e-7;};
 for(let pos=low;pos<=high;pos+=8){const value=score(pos);if(value>best){best=value;bestAt=pos;}}
 const center=bestAt;for(let pos=Math.max(low,center-7);pos<=Math.min(high,center+7);pos++){const value=score(pos);if(value>best){best=value;bestAt=pos;}}
 source=bestAt;
 }
 for(let c=0;c<channels;c++)for(let i=0;i<frame&&dest+i<n&&source+i<input.length;i++){
 const sample=ins[c][source+i];if(dest===0||i>=hop)outs[c][dest+i]=sample;else{const mix=i/hop;outs[c][dest+i]=outs[c][dest+i]*(1-mix)+sample*mix;}
 }
 previous=source;if(grain%8===0)await pause();
 }
 return out;
}
// Deterministic sample processors; original buffers are never modified.
async function creative(input,id,controls,onProgress){
 if(!['fade','normalize','compressor','chorus','phaser','tremolo','bitcrusher'].includes(id))return null;
 const rate=input.sampleRate,n=input.length,channels=input.numberOfChannels,out=make(channels,n,rate);
 const ins=Array.from({length:channels},(_,c)=>input.getChannelData(c)),outs=Array.from({length:channels},(_,c)=>out.getChannelData(c));
 const [a,b,c,d,e]=controls;const block=32768;
 let normalization=1;
 if(id==='normalize'){
  let peak=0;
  for(let start=0;start<n;start+=block){for(let i=start;i<Math.min(n,start+block);i++)for(let ch=0;ch<channels;ch++)peak=Math.max(peak,Math.abs(ins[ch][i]));onProgress(.4*Math.min(n,start+block)/n);await pause();}
  normalization=peak>0?Math.pow(10,a/20)/peak:1;
 }
 let fadeIn=Math.round(a*rate/1000),fadeOut=Math.round(b*rate/1000);
 if(id==='fade'&&fadeIn+fadeOut>n){const scale=n/(fadeIn+fadeOut);fadeIn=Math.floor(fadeIn*scale);fadeOut=n-fadeIn;}
 const ratio=b,attack=Math.exp(-1/(Math.max(1,c)*rate/1000)),release=Math.exp(-1/(Math.max(1,d)*rate/1000));let reduction=0;
 const filterStates=Array.from({length:channels},()=>Array.from({length:6},()=>({x:0,y:0})));
 const held=new Float64Array(channels);let holdPhase=1;
 for(let start=0;start<n;start+=block){
  for(let i=start;i<Math.min(n,start+block);i++){
   let gain=1;
   if(id==='fade'){if(fadeIn>0)gain*=Math.min(1,i/Math.max(1,fadeIn-1));if(fadeOut>0)gain*=Math.min(1,(n-1-i)/Math.max(1,fadeOut-1));}
   if(id==='compressor'){
    let peak=0;for(let ch=0;ch<channels;ch++)peak=Math.max(peak,Math.abs(ins[ch][i]));
    const level=20*Math.log10(Math.max(1e-12,peak)),target=Math.max(0,level-a)*(1-1/ratio),smoothing=target>reduction?attack:release;
    reduction=smoothing*reduction+(1-smoothing)*target;gain=Math.pow(10,(e-reduction)/20);
   }
   if(id==='tremolo')gain=1-b/100*(.5-.5*Math.cos(2*Math.PI*a*i/rate));
   if(id==='bitcrusher'&&holdPhase>=1){holdPhase-=Math.floor(holdPhase);for(let ch=0;ch<channels;ch++)held[ch]=ins[ch][i];}
   for(let ch=0;ch<channels;ch++){
    const x=ins[ch][i];let y=x;
    if(id==='fade'||id==='compressor'||id==='tremolo')y=x*gain;
    if(id==='normalize')y=x*normalization;
    if(id==='bitcrusher'){const levels=Math.pow(2,a-1);y=x*(1-c/100)+Math.round(held[ch]*levels)/levels*c/100;}
    if(id==='chorus'){
     const delay=(.015+b/1000*Math.sin(2*Math.PI*i/(rate*a/1000)+ch*Math.PI/2))*rate,pos=i-delay,j=Math.floor(pos),fraction=pos-j;
     const delayed=(j>=0?ins[ch][j]:0)*(1-fraction)+(j+1>=0?ins[ch][j+1]:0)*fraction;
     y=x*(1-c/100)+delayed*c/100;
    }
    if(id==='phaser'){
     const sweep=Math.sin(2*Math.PI*i/(rate*a/1000)),frequency=Math.min(rate*.4,500*Math.pow(4,sweep*b/100)),t=Math.tan(Math.PI*frequency/rate),coefficient=(t-1)/(t+1);
     let wet=x;for(const state of filterStates[ch]){const next=coefficient*wet+state.x-coefficient*state.y;state.x=wet;state.y=next;wet=next;}
     y=x*(1-c/100)+wet*c/100;
    }
    outs[ch][i]=y;
   }
   if(id==='bitcrusher')holdPhase+=Math.min(rate,b)/rate;
  }
  onProgress((id==='normalize'?.4:0)+(id==='normalize'?.5:.9)*Math.min(n,start+block)/n);await pause();
 }
 return out;
}

async function render(input,chain,values,onProgress=()=>{}){
 if(!Offline)throw new Error('Use a browser that supports Web Audio processing.');
 let current=input;let completed=0;const total=chain.filter(id=>values[id]?.enabled&&id!=='loudness').length;
 for(const id of chain){
 if(!values[id]?.enabled||id==='loudness')continue;
 onProgress(total?completed/total*.9:0,id);
 try{
 const [a,b]=values[id].controls,rate=current.sampleRate,channels=current.numberOfChannels;
 const additional=await creative(current,id,values[id].controls,fraction=>onProgress(total?(completed+fraction)/total*.9:0,id));if(additional){current=additional;continue;}
 if(id==='trim'){
 if(a>=b)throw new Error('Trim start must be before trim end.');
 const start=Math.floor(current.length*a/100),end=Math.max(start+1,Math.floor(current.length*b/100)),out=make(channels,end-start,rate);
 for(let c=0;c<channels;c++)out.getChannelData(c).set(current.getChannelData(c).subarray(start,end));current=out;continue;
 }
 if(id==='spatial'){
 const out=make(channels,current.length,rate);for(let c=0;c<channels;c++)out.getChannelData(c).set(current.getChannelData(c));
 if(channels>=2){const l=current.getChannelData(0),r=current.getChannelData(1),ol=out.getChannelData(0),or=out.getChannelData(1);for(let i=0;i<current.length;i++){const mid=(l[i]+r[i])*.5,side=(l[i]-r[i])*.5*a/100;ol[i]=mid+side;or[i]=mid-side;}}
 current=out;continue;
 }
 if(id==='reverse'){const out=make(channels,current.length,rate);for(let c=0;c<channels;c++){const src=current.getChannelData(c),dst=out.getChannelData(c);for(let i=0;i<src.length;i++)dst[i]=src[src.length-1-i];}current=out;continue;}
 if(id==='tempo'){current=await stretch(current,100/a);continue;}
 if(id==='pitch'||id==='tuning'){
 const ratio=(id==='tuning'?432/440:Math.pow(2,a/12)),length=current.length,stretched=await stretch(current,ratio),out=make(channels,length,rate);
 for(let c=0;c<channels;c++){const src=stretched.getChannelData(c),dst=out.getChannelData(c);for(let i=0;i<length;i++){const p=i*ratio,j=Math.floor(p),t=p-j;dst[i]=(src[Math.min(j,src.length-1)]||0)*(1-t)+(src[Math.min(j+1,src.length-1)]||0)*t;}}
 current=out;continue;
 }
 const speed=(id==='slowed'||id==='sped')?a/100:1,wet=(id==='slowed'||id==='reverb'?b:0)/100;
 const decay=id==='reverb'?.4+a*.055:id==='slowed'?3.5:0;
 const tail=wet?decay:0;
 const ctx=new Offline((id==='eightd'||id==='pan')?2:channels,Math.ceil(current.length/speed+tail*rate),rate),src=ctx.createBufferSource();src.buffer=current;src.playbackRate.value=speed;
 if(id==='pan'){const pan=ctx.createStereoPanner();pan.pan.value=a/100;src.connect(pan);pan.connect(ctx.destination);
 }else if(id==='eightd'){
 const pan=ctx.createStereoPanner(),motion=ctx.createOscillator(),depth=ctx.createGain();
 motion.frequency.value=1/a;depth.gain.value=b/100;motion.connect(depth);depth.connect(pan.pan);src.connect(pan);pan.connect(ctx.destination);motion.start();
 }else if(id==='equalizer'){
 let last=src;const frequencies=[60,150,400,1000,2400,6000,10000,16000];
 frequencies.forEach((frequency,i)=>{if(frequency>=rate/2)return;const filter=ctx.createBiquadFilter();filter.type=i===0?'lowshelf':i===7?'highshelf':'peaking';filter.frequency.value=frequency;filter.Q.value=1;filter.gain.value=values[id].controls[i];last.connect(filter);last=filter;});last.connect(ctx.destination);
 }else if(id==='bass'||id==='treble'){
 const filter=ctx.createBiquadFilter();filter.type=id==='bass'?'lowshelf':'highshelf';filter.frequency.value=Math.min(b,rate*.45);filter.gain.value=a;src.connect(filter);filter.connect(ctx.destination);
 }else if(id==='radio'){
 let last=src;for(const [type,freq] of [['highpass',a],['highpass',a],['lowpass',b],['lowpass',b]]){const filter=ctx.createBiquadFilter();filter.type=type;filter.frequency.value=Math.min(freq,rate*.45);filter.Q.value=.707;last.connect(filter);last=filter;}last.connect(ctx.destination);
 }else if(id==='distortion'){
 const shaper=ctx.createWaveShaper(),dry=ctx.createGain(),send=ctx.createGain(),curve=new Float32Array(32769),drive=1+a*.4;
 for(let i=0;i<curve.length;i++){const x=i*2/(curve.length-1)-1;curve[i]=a===0?x:Math.tanh(drive*x)/Math.tanh(drive);}
 shaper.curve=curve;shaper.oversample='2x';dry.gain.value=1-b/100;send.gain.value=b/100;src.connect(dry);dry.connect(ctx.destination);src.connect(shaper);shaper.connect(send);send.connect(ctx.destination);
 }else if(wet){
 const dry=ctx.createGain(),send=ctx.createGain(),conv=ctx.createConvolver();dry.gain.value=Math.cos(wet*Math.PI/2);send.gain.value=Math.sin(wet*Math.PI/2);conv.normalize=false;
 const impulse=ctx.createBuffer(channels,Math.ceil(decay*rate),rate);let seed=123456;
 for(let c=0;c<channels;c++){
 const d=impulse.getChannelData(c);let energy=0;
 for(let i=0;i<d.length;i++){seed=(1664525*seed+1013904223)>>>0;const envelope=Math.exp(-6*i/d.length);d[i]=(seed/2147483648-1)*envelope;energy+=d[i]*d[i];}
 const scale=.85/Math.sqrt(energy);for(let i=0;i<d.length;i++)d[i]*=scale;
 // Discrete early reflections make the sense of space audible on sustained material.
 for(const [seconds,gain] of [[.031,.55],[.053,.4],[.089,.3],[.137,.22]]){const index=Math.round((seconds+c*.004)*rate);if(index<d.length)d[index]+=gain;}
 }
 conv.buffer=impulse;src.connect(dry);dry.connect(ctx.destination);src.connect(conv);conv.connect(send);send.connect(ctx.destination);
 }else src.connect(ctx.destination);
 src.start();current=await ctx.startRendering();await pause();
 }finally{completed++;onProgress(total?completed/total*.9:.9,id);}
 }
 onProgress(.92,'finalizing');
 let peak=0;for(let c=0;c<current.numberOfChannels;c++){const d=current.getChannelData(c);for(let i=0;i<d.length;i++)peak=Math.max(peak,Math.abs(d[i]));}
 if(peak>.99){const copy=make(current.numberOfChannels,current.length,current.sampleRate);for(let c=0;c<current.numberOfChannels;c++){const src=current.getChannelData(c),out=copy.getChannelData(c);for(let i=0;i<src.length;i++)out[i]=src[i]*.99/peak;}current=copy;}
 // Master loudness follows peak protection so normalization cannot undo the gain.
 if(chain.includes('loudness')&&values.loudness?.enabled){
 const db=values.loudness.controls[0],gain=Math.pow(10,db/20);
 if(db!==0){const out=make(current.numberOfChannels,current.length,current.sampleRate);
 for(let c=0;c<current.numberOfChannels;c++){const src=current.getChannelData(c),dst=out.getChannelData(c);for(let i=0;i<src.length;i++){const x=src[i]*gain,mag=Math.abs(x);dst[i]=db>0&&mag>.8?Math.sign(x)*(.8+.19*Math.tanh((mag-.8)/.19)):x;}}
 current=out;}
 }
 onProgress(.96,'encoding');
 return current;
}
async function wavAsync(buffer,onProgress=()=>{}){const channels=buffer.numberOfChannels,n=buffer.length,bytes=new ArrayBuffer(44+n*channels*2),v=new DataView(bytes);const str=(offset,s)=>[...s].forEach((c,i)=>v.setUint8(offset+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,bytes.byteLength-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,channels,true);v.setUint32(24,buffer.sampleRate,true);v.setUint32(28,buffer.sampleRate*channels*2,true);v.setUint16(32,channels*2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*channels*2,true);const data=Array.from({length:channels},(_,c)=>buffer.getChannelData(c));for(let start=0;start<n;start+=32768){const end=Math.min(n,start+32768);for(let i=start;i<end;i++)for(let c=0;c<channels;c++){const x=Math.max(-1,Math.min(1,data[c][i]));v.setInt16(44+(i*channels+c)*2,Math.round(x*(x<0?32768:32767)),true);}onProgress(end/n);await pause();}return new Blob([bytes],{type:'audio/wav'});}
// Keep completed outputs so appending an effect never repeats earlier processing.
function createPipeline(maxBytes=128*1024*1024){
 let source=null,checkpoints=[];
 return {
 reset(){source=null;checkpoints=[];},
 async render(input,steps,values,onProgress=()=>{},isCurrent=()=>true){
  if(source!==input){source=input;checkpoints=[];}
  const keys=steps.map(id=>JSON.stringify([id,values[id].controls]));
  const matches=entry=>entry.keys.length<=keys.length&&entry.keys.every((key,i)=>key===keys[i]);
  const reusable=checkpoints.filter(matches).sort((a,b)=>b.keys.length-a.keys.length)[0];
  let current=reusable?.buffer||input,start=reusable?.keys.length||0;
  // Drop stale branches when settings, order, or included effects change.
  checkpoints=checkpoints.filter(matches);
  for(let i=start;i<steps.length;i++){
   if(!isCurrent())throw new Error('Processing cancelled.');
   const id=steps[i];
   current=await render(current,[id],values, fraction=>onProgress((i-start+Math.min(fraction,.96))/(steps.length-start)*.94,id));
   if(!isCurrent())throw new Error('Processing cancelled.');
   checkpoints.push({keys:keys.slice(0,i+1),buffer:current});
   // Always retain the newest result; keep earlier checkpoints within a memory budget.
   let bytes=checkpoints.reduce((sum,entry)=>sum+entry.buffer.length*entry.buffer.numberOfChannels*4,0);
   while(bytes>maxBytes&&checkpoints.length>1){const removed=checkpoints.shift();bytes-=removed.buffer.length*removed.buffer.numberOfChannels*4;}
  }
  return {buffer:current,reused:start,processed:steps.length-start};
 }
 };
}
window.SonicDSP={render,createPipeline,wavAsync, wav(buffer){const channels=buffer.numberOfChannels,n=buffer.length,bytes=new ArrayBuffer(44+n*channels*2),v=new DataView(bytes);const str=(offset,s)=>[...s].forEach((c,i)=>v.setUint8(offset+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,bytes.byteLength-8,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,channels,true);v.setUint32(24,buffer.sampleRate,true);v.setUint32(28,buffer.sampleRate*channels*2,true);v.setUint16(32,channels*2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*channels*2,true);const data=Array.from({length:channels},(_,c)=>buffer.getChannelData(c));for(let i=0;i<n;i++)for(let c=0;c<channels;c++){const x=Math.max(-1,Math.min(1,data[c][i]));v.setInt16(44+(i*channels+c)*2,Math.round(x*(x<0?32768:32767)),true);}return new Blob([bytes],{type:'audio/wav'});}};
})();
