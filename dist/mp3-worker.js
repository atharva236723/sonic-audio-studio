/* MP3 encoding uses the unmodified lamejs 1.2.1 encoder (LGPL-3.0).
   https://github.com/zhuker/lamejs | https://lame.sourceforge.net/
   Corresponding source: /vendor/lame-1.2.1.source.js */
importScripts('vendor/lame-1.2.1.min.js');
self.onmessage=({data})=>{
 try{
  const {samples,sampleRate}=data,channels=samples.length,total=samples[0].length;
  const encoder=new lamejs.Mp3Encoder(channels,sampleRate,192),parts=[];
  const pcm=(data,start,end)=>{const out=new Int16Array(end-start);for(let i=start;i<end;i++){const x=Math.max(-1,Math.min(1,data[i]));out[i-start]=Math.round(x*(x<0?32768:32767));}return out;};
  for(let start=0;start<total;start+=1152){const end=Math.min(total,start+1152),left=pcm(samples[0],start,end),right=channels===2?pcm(samples[1],start,end):undefined;const bytes=encoder.encodeBuffer(left,right);if(bytes.length)parts.push(new Int8Array(bytes));if(start% (1152*32)===0)self.postMessage({progress:end/total});}
  const tail=encoder.flush();if(tail.length)parts.push(new Int8Array(tail));
  const blob=new Blob(parts,{type:'audio/mpeg'});self.postMessage({blob});
 }catch(error){self.postMessage({error:error.message||'MP3 encoding failed.'});}
};
