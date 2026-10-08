const fs=require('fs'),vm=require('vm'),assert=require('assert');
(async()=>{let checks=0;const check=(ok,label)=>{assert(ok,label);checks++};const app=fs.readFileSync('dist/app.js','utf8'),effects=vm.runInNewContext(fs.readFileSync('dist/effects.js','utf8')+';effects');
function setup(){const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,{style:{},classList:{remove(){},add(){}},setAttribute(){},removeAttribute(){},innerHTML:'',value:'',listeners:{},addEventListener(type,fn){this.listeners[type]=fn}});return nodes.get(id)};const context={document:{body:{dataset:{}},getElementById:get,querySelector:()=>get('settings')},effects,SonicDSP:{createPipeline:()=>({reset(){}})},soundPresets:{},SonicI18n:{translate:s=>s},Audio:class{pause(){}},URLSearchParams,location:{search:'?mode=combine'},window:{SonicActivity:{close(){}}},URL:{createObjectURL:()=>Math.random().toString(),revokeObjectURL(){}},Promise,Number};vm.createContext(context);vm.runInContext(app.slice(0,app.indexOf('function animateElement')),context);for(const name of ['updateActions','notify','animateElement','draw','renderEffects','renderChain','markDirty','rebuildAfterRemoval'])context[name]=()=>{};context.time=()=> '0:12';context.clearResult=()=>vm.runInContext('resultBuffer=null;resultBlob=null;revision=0;',context);vm.runInContext(app.slice(app.indexOf('function renderSettings('),app.indexOf('function renderChain(')),context);vm.runInContext(app.slice(app.indexOf('async function loadAudio('),app.indexOf("$('drop').onclick")),context);return {context,get};}
const {context,get}=setup();let closed=0;const decoded={duration:12,sampleRate:48000};context.window.OfflineAudioContext=class{async decodeAudioData(){return decoded}close(){closed++;return new Promise(()=>{})}};context.file={name:'replacement.wav',size:100,arrayBuffer:async()=>new ArrayBuffer(4)};
vm.runInContext('originalBuffer={old:true};resultBuffer={old:true};chain=["treble"];selected="treble";busy=true;activeRender=42;',context);
await Promise.race([vm.runInContext('loadAudio(file)',context),new Promise((_,reject)=>setTimeout(()=>reject(Error('Replacement blocked on close')),200))]);
check(vm.runInContext('!loading&&!busy&&activeRender===0',context),'Replacement unlocks despite pending context close');check(closed===1,'Context cleanup attempted');check(vm.runInContext('originalBuffer.duration===12&&resultBuffer===null',context),'Replacement installs fresh source and clears prior result');
vm.runInContext('renderSettings()',context);get('settings-body').listeners.input({type:'input',target:{id:'setting-0',value:'-9'}});check(vm.runInContext('values.treble.controls[0]===-9',context),'Existing effect settings editable after replacement');
vm.runInContext('selected="bass";chain.push("bass");renderSettings()',context);get('settings-body').listeners.input({type:'input',target:{id:'setting-0',value:'20'}});check(vm.runInContext('values.bass.controls[0]===20',context),'New effect settings editable after replacement');
context.window.OfflineAudioContext=class{async decodeAudioData(){throw Error('bad audio')}close(){throw Error('close failed')}};await vm.runInContext('loadAudio(file)',context);check(vm.runInContext('!loading&&originalBuffer.duration===12',context),'Failed replacement unlocks and preserves previous source');
context.window.OfflineAudioContext=class{async decodeAudioData(){return decoded}close(){return Promise.reject(Error('rejected close'))}};await vm.runInContext('loadAudio(file)',context);check(vm.runInContext('!loading',context),'Rejected cleanup cannot freeze controls');await Promise.resolve();
let resolveOld;const latest={duration:6,sampleRate:48000};context.window.OfflineAudioContext=class{decodeAudioData(bytes){return bytes==='slow'?new Promise(resolve=>{resolveOld=resolve}):Promise.resolve(latest)}};context.slowFile={name:'slow.wav',size:100,arrayBuffer:async()=>'slow'};context.fastFile={name:'fast.wav',size:100,arrayBuffer:async()=>'fast'};const slow=vm.runInContext('loadAudio(slowFile)',context);await Promise.resolve();await Promise.resolve();await vm.runInContext('loadAudio(fastFile)',context);resolveOld({duration:30,sampleRate:48000});await slow;check(vm.runInContext('sourceName==="fast.wav"&&originalBuffer.duration===6&&!loading',context),'Older decoding cannot overwrite a newer replacement');check(vm.runInContext('values.bass.controls[0]===20',context),'Replacement preserves the chosen parameter values');

// Use the same persistent panel handlers across repeated replacements, every effect,
// both browser events, and switching between previously chosen and new effects.
const panel=get('settings-body'),inputHandler=panel.listeners.input,changeHandler=panel.listeners.change;
context.window.OfflineAudioContext=class{async decodeAudioData(){return decoded}};
for(let replacement=0;replacement<3;replacement++){
 await vm.runInContext('loadAudio(file)',context);
 check(panel.listeners.input===inputHandler&&panel.listeners.change===changeHandler,'Replacement retains persistent handlers');
 for(const effect of effects){
  context.effectId=effect.id;vm.runInContext('selected=effectId;renderSettings()',context);
  for(let index=0;index<effect.controls.length;index++){
   const c=effect.controls[index],value=c[2]+Math.floor((c[3]-c[2])/2);
   inputHandler({type:'input',target:{id:'setting-'+index,value:String(value)}});
   context.controlIndex=index;check(vm.runInContext('values[selected].controls[controlIndex]',context)===value,'Input updates '+effect.id+' after replacement');
   changeHandler({type:'change',target:{id:'setting-'+index,value:String(c[3])}});
   check(vm.runInContext('values[selected].controls[controlIndex]',context)===c[3],'Change commits '+effect.id+' after replacement');
  }
 }
}
vm.runInContext('selected="bass";soundPresets.bass={Heavy:[20,140]};renderSettings()',context);
changeHandler({type:'change',target:{id:'sound-preset',value:'Heavy'}});
check(vm.runInContext('values.bass.controls[0]===20&&values.bass.controls[1]===140',context),'Preset updates current effect after replacements');
changeHandler({type:'change',target:{id:'enabled',checked:false}});
check(vm.runInContext('values.bass.enabled===false',context),'Enable toggle updates current effect after replacements');

// Verify Apply receives the replacement buffer and the latest edited controls.
let renderedSource,renderedValues;
context.capture=(source,steps,snapshot)=>{renderedSource=source;renderedValues=snapshot;return {buffer:source,reused:0,processed:steps.length}};
context.setTimeout=fn=>{fn();return 1};context.setProgress=()=>{};context.listenTo=()=>{};
context.window.SonicActivity.start=()=>{};context.window.SonicActivity.finish=()=>{};
context.SonicDSP.wavAsync=async()=>({});context.SonicDSP.render=async(source,steps,snapshot)=>context.capture(source,steps,snapshot).buffer;
vm.runInContext('pipeline.render=async(source,steps,snapshot)=>capture(source,steps,snapshot)',context);
vm.runInContext(app.slice(app.indexOf('async function applyEffects('),app.indexOf("$('apply').onclick")),context);
for(const mode of ['combine','single']){
 context.testMode=mode;vm.runInContext('editingMode=testMode;busy=false;chain=["bass"];selected="bass";values.bass.enabled=true;renderSettings()',context);
 inputHandler({type:'input',target:{id:'setting-0',value:'17'}});
 await vm.runInContext('applyEffects()',context);
 check(renderedSource===decoded,mode+' renders the replacement source');
 check(renderedValues.bass.controls[0]===17,mode+' renders the newly edited value');
 check(vm.runInContext('!busy',context),mode+' releases render state');
}
// The stale renderer must not clear a newer render's ownership.
vm.runInContext('activeRender=99;busy=true;',context);const finalizer=app.match(/finally\{if\(activeRender===ticket\)[^\n]+/)[0];context.ticket=98;context.renderToken=99;vm.runInContext('try{}'+finalizer,context);check(vm.runInContext('busy&&activeRender===99',context),'Stale render cleanup leaves newer render active');
console.log('PASS '+checks+' audio replacement and render-ownership checks.');
})().catch(error=>{console.error(error);process.exitCode=1});
