const $=id=>document.getElementById(id);

let originalBuffer=null, resultBuffer=null, resultBlob=null, resultUrl=null, revision=0, needsRebuild=false, busy=false, sourceName="audio", renderToken=0, activeRender=0, previewOwner=0, sessionEdited=false;
const pipeline=SonicDSP.createPipeline();
const pageEffect=document.body.dataset.effect||'';
let editingMode=new URLSearchParams(location.search).get('mode')==='single'?'single':'combine';
let selected=pageEffect||(editingMode==='single'?'reverb':''),chain=selected?[selected]:[],values={},audio=new Audio(),objectUrl=null,buffer=null,loading=false,loadId=0;
audio.volume=.8;effects.forEach(e=>values[e.id]={controls:e.controls.map(c=>c[1]),enabled:true});
function animateElement(element,name='event-in'){if(matchMedia('(prefers-reduced-motion: reduce)').matches||!element.animate)return;element.getAnimations().forEach(a=>a.cancel());element.animate([{opacity:.4,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'});}
function setProgress(fraction,label){const percent=Math.round(fraction*100);$('render-progress').hidden=false;$('progress-fill').style.width=percent+'%';$('progress-percent').textContent=percent+'%';$('progress-meter').setAttribute('aria-valuenow',percent);$('progress-label').textContent=label;window.SonicActivity?.progress(fraction,label);}
function syncTheme(){const dark=document.documentElement.dataset.theme==='dark';$('theme-toggle').innerHTML=dark?'☀ <span>Light mode</span>':'☾ <span>Dark mode</span>';$('theme-toggle').setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');draw();}
$('theme-toggle').onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('sonic-theme',document.documentElement.dataset.theme)}catch{}syncTheme();};
function notify(message){animateElement($('status'),'toast-in');$('status').textContent=message;$('status').style.display='block';clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('status').style.display='none',4500)}
function renderEffects(){$('effects').innerHTML=effects.map(e=>`<button class="effect-card ${selected===e.id?'selected':''}" data-effect="${e.id}" aria-pressed="${chain.includes(e.id)&&values[e.id].enabled}"><span class="symbol">${e.icon}</span>${e.ai?'<span class="ai">AI</span>':''}<span class="dot"></span>${chain.includes(e.id)&&values[e.id].enabled?'<span class="included">✓ Included</span>':''}<strong>${e.name}</strong><span class="desc">${e.desc}</span></button>`).join('');document.querySelectorAll('[data-effect]').forEach(b=>b.onclick=()=>selectEffect(b.dataset.effect))}
function selectEffect(id){if(busy||loading)return;if(pageEffect&&id!==pageEffect){window.SonicNavigation.go('effect-'+id+'.html');return;}sessionEdited=true;const added=!chain.includes(id);selected=id;if(editingMode==='single'){chain=[id];values[id].enabled=true;}else if(added){chain.push(id);values[id].enabled=true;}renderEffects();renderSettings();renderChain(added);window.SonicMobileStudio?.showSettings();window.SonicWorkflow?.changed();}
const soundPresets={reverb:{'Vocal':[35,25],'Bathroom':[45,60],'Small room':[15,25],'Medium room':[45,35],'Large room':[75,45],'Church hall':[90,55],'Cathedral':[100,65]},bass:{'Very light':[3,140],'Light':[6,140],'Moderate':[12,140],'Heavy':[20,140],'Extreme':[30,140]}};
function renderSettings(){animateElement($('settings-body'));if(!selected){$('settings-body').innerHTML='<div class="chain-empty">'+SonicI18n.translate('Select an effect to apply.')+'</div>';return;}const e=effects.find(e=>e.id===selected),v=values[e.id];$('settings-body').innerHTML=`<div class="selected-heading"><span>${e.icon}</span><h3>${e.name}</h3></div><p class="setting-description">${e.detail}</p>${soundPresets[e.id]?'<label class="range-label" for="sound-preset">Preset</label><select id="sound-preset"><option value="">Custom settings</option>'+Object.keys(soundPresets[e.id]).map(name=>'<option value="'+name+'">'+name+'</option>').join('')+'</select>':''}${e.controls.map((c,i)=>`<div class="setting-control"><label class="range-label" for="setting-${i}">${c[0]}<output id="value-${i}">${v.controls[i]}${c[4]}</output></label><input id="setting-${i}" type="range" min="${c[2]}" max="${c[3]}" value="${v.controls[i]}" step="${c[7]??(c[4]===' Hz'?10:1)}"><div class="range-extents"><span>${c[5]}</span><span>${c[6]}</span></div></div>`).join('')}<label class="toggle-row">Enable effect<input id="enabled" type="checkbox" ${v.enabled?'checked':''}></label><div class="info-box">${e.note}</div><button class="add-button" id="add">${chain.includes(e.id)?'Remove this effect':'+ Include this effect'}</button>`;if($('sound-preset'))$('sound-preset').value=v.preset||'';}

// Bind once to the persistent settings panel: replacing a file or switching effects
// must not leave controls attached to a previous render's state.
function changeSetting(event){
 const target=event.target,effect=effects.find(effect=>effect.id===selected);
 if(!effect)return;
 const state=values[effect.id],match=target.id?.match(/^setting-(\d+)$/);
 if(match){
  const index=Number(match[1]),control=effect.controls[index];if(!control)return;
  const value=Number(target.value);if(!Number.isFinite(value))return;
  state.controls[index]=Math.max(control[2],Math.min(control[3],value));state.preset='';sessionEdited=true;
  if($('sound-preset'))$('sound-preset').value='';
  $('value-'+index).textContent=state.controls[index]+control[4];markDirty();window.SonicWorkflow?.changed('control:'+effect.id+':'+index,event.type);
 }else if(event.type==='change'&&target.id==='sound-preset'){
  const preset=soundPresets[effect.id]?.[target.value];if(!preset)return;
  state.controls=[...preset];state.preset=target.value;sessionEdited=true;markDirty();renderSettings();window.SonicWorkflow?.changed();
 }else if(event.type==='change'&&target.id==='enabled'){
  if(busy||loading){target.checked=state.enabled;return;}
  state.enabled=target.checked;sessionEdited=true;
  if(state.enabled&&!chain.includes(effect.id)){if(editingMode==='single')chain=[effect.id];else chain.push(effect.id);}
  renderEffects();renderChain();window.SonicWorkflow?.changed();if(!state.enabled)rebuildAfterRemoval();
 }
}
$('settings-body').addEventListener('input',changeSetting);
$('settings-body').addEventListener('change',changeSetting);
$('settings-body').addEventListener('click',event=>{
 if(!event.target.closest('#add')||busy||loading||!selected)return;
 if(chain.includes(selected)){removeEffect(selected);return;}
 if(editingMode==='single')chain=[selected];else chain.push(selected);
 values[selected].enabled=true;sessionEdited=true;renderEffects();renderChain();renderSettings();window.SonicWorkflow?.changed();
});

function renderChain(changed=true){if(changed)markDirty();$('count').textContent=chain.length;
 const tabs=chain.map(id=>{const e=effects.find(e=>e.id===id);return '<button type="button" data-edit="'+id+'" aria-pressed="'+(selected===id)+'">'+e.name+(values[id].enabled?'':' (off)')+'</button>'}).join('');
 let nav=$('effect-navigation');if(!nav){nav=document.createElement('div');nav.id='effect-navigation';nav.setAttribute('aria-label','Edit included effects');$('settings-body').before(nav);}nav.innerHTML=tabs;
 $('chain').innerHTML=chain.length?chain.map(id=>{const e=effects.find(e=>e.id===id);return '<div class="chain-item '+(selected===id?'active':'')+'"><button class="chain-edit" data-edit="'+id+'" aria-pressed="'+(selected===id)+'"><span>'+e.icon+'</span> '+e.name+(values[id].enabled?'':' (off)')+'</button><button data-remove="'+id+'" aria-label="Remove '+e.name+'">×</button></div>'}).join(''):'<div class="chain-empty">Your effects will appear here</div>';
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{selected=b.dataset.edit;renderEffects();renderSettings();renderChain(false);window.SonicMobileStudio?.showSettings();});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>removeEffect(b.dataset.remove));
}

// Rebuild only when a processed result exists. The pipeline reuses its longest unchanged prefix.
function rebuildAfterRemoval(){
 if(editingMode!=='combine'||!originalBuffer||!resultBuffer||busy||loading)return;
 needsRebuild=true;
 applyEffects({allowEmpty:true});
}
async function removeEffect(id){
 if(busy||loading||!chain.includes(id))return;
 const effect=effects.find(effect=>effect.id===id);
 const warning=SonicI18n.translate('Remove {effect} from the chain? Any processed result will be updated without this effect.').replace('{effect}',effect.name);
 if(!await window.SonicConfirm.ask({title:'Remove effect?',message:warning,accept:'Remove effect'}))return;
 if(busy||loading||!chain.includes(id))return;
 sessionEdited=true;
 chain=chain.filter(effect=>effect!==id);
 if(selected===id)selected=chain[0]||'';
 renderEffects();renderChain();renderSettings();window.SonicWorkflow?.changed();rebuildAfterRemoval();
}

function time(t){if(!Number.isFinite(t))return '0:00';return Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0')}
let waveFrame=0,waveCache={source:null,bars:0,peaks:[]};
function draw(){if(waveFrame)return;waveFrame=requestAnimationFrame(()=>{waveFrame=0;paintWave()});}
function paintWave(){if(document.hidden)return;const c=$('wave'),r=c.getBoundingClientRect();if(!r.width||!r.height)return;const d=Math.min(devicePixelRatio||1,2),width=Math.round(r.width*d),height=Math.round(r.height*d);if(c.width!==width||c.height!==height){c.width=width;c.height=height;}const ctx=c.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,r.width,r.height);const n=Math.max(1,Math.floor(r.width/5)),data=buffer?.getChannelData(0);
 if(waveCache.source!==buffer||waveCache.bars!==n){const peaks=[];for(let i=0;i<n;i++){let amp=.05+.18*Math.abs(Math.sin(i*.47)*Math.cos(i*.13));if(data){let peak=0;const start=Math.floor(i*data.length/n),end=Math.floor((i+1)*data.length/n);for(let j=start;j<end;j+=Math.max(1,Math.ceil((end-start)/100)))peak=Math.max(peak,Math.abs(data[j]));amp=Math.max(.025,peak);}peaks.push(amp)}waveCache={source:buffer,bars:n,peaks};}
 const dark=document.documentElement.dataset.theme==='dark',position=audio.currentTime/(audio.duration||1);for(let i=0;i<n;i++){const h=waveCache.peaks[i]*r.height*.85;ctx.fillStyle=buffer&&i/n<position?(dark?'#b5c2d8':'#5268bb'):(dark?'#4b505b':'#cad2e6');ctx.fillRect(i*5,(r.height-h)/2,2.5,h);}}

async function loadAudio(file){
 if(file.size>50*1024*1024){notify('Please choose an audio file smaller than 50 MB.');return;}
 window.SonicWorkflow?.clearPreview();window.SonicExamples?.pause();window.SonicMP3?.cancel();const ticket=++loadId;loading=true;renderToken++;activeRender=0;busy=false;window.SonicActivity?.close();document.querySelector('.settings').classList.remove('rendering');updateActions();audio.pause();$('play').disabled=true;$('demo').disabled=true;notify('Opening your audio…');
 let ctx;
 try{
  const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext;
  ctx=Offline?new Offline(1,1,48000):new (window.AudioContext||window.webkitAudioContext)();
  const decoded=await ctx.decodeAudioData(await file.arrayBuffer());if(ticket!==loadId)return;
  if(decoded.duration>600)throw new Error('Please use a clip under 10 minutes.');
  const nextUrl=URL.createObjectURL(file);
  window.SonicWorkflow?.clearPreview();clearResult();animateElement($('file-info'));originalBuffer=decoded;sourceName=file.name;buffer=decoded;
  if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=nextUrl;audio.src=objectUrl;
  $('filename').textContent=file.name;$('filemeta').textContent=(file.size/1024/1024).toFixed(2)+' MB · '+time(buffer.duration)+' · '+buffer.sampleRate/1000+' kHz';
  $('drop').hidden=true;$('drop').style.display='none';$('file-info').hidden=false;$('wave-empty').style.display='none';$('track-title').textContent=file.name;$('track-subtitle').textContent='Original audio · Local playback';
  $('elapsed').textContent='0:00';$('seek').value=0;$('duration').textContent=time(buffer.duration);$('seek').disabled=false;$('play').disabled=false;$('play-label').textContent='Original audio';$('original').setAttribute('aria-pressed','true');$('processed').setAttribute('aria-pressed','false');draw();window.SonicWorkflow?.reset();notify('Audio ready. Press play to listen.');
 }catch(error){
  if(ticket===loadId){$('play').disabled=!buffer;notify(error.message?.includes('10 minutes')?error.message:'This file could not be decoded. Try a WAV or MP3 audio file.');}
 }finally{
  // Unlock first: a suspended/rejected context close must never freeze the editor.
  if(ticket===loadId){loading=false;markDirty();$('demo').disabled=false;}
  if(typeof ctx?.close==='function'){try{Promise.resolve(ctx.close()).catch(()=>{});}catch{}}
 }
}
$('drop').onclick=()=>$('file').click();$('replace').onclick=()=>$('file').click();$('file').onchange=()=>{if($('file').files[0])loadAudio($('file').files[0]);$('file').value=''};
['dragenter','dragover'].forEach(name=>$('drop').addEventListener(name,e=>{e.preventDefault();$('drop').classList.add('drag')}));$('drop').ondragleave=()=>$('drop').classList.remove('drag');$('drop').ondrop=e=>{e.preventDefault();$('drop').classList.remove('drag');if(e.dataTransfer.files[0])loadAudio(e.dataTransfer.files[0])};
$('play').onclick=async()=>{window.SonicWorkflow?.pause();window.SonicExamples?.pause();if(audio.paused){try{await audio.play()}catch{notify('Playback could not start. Please try another audio file.')}}else audio.pause()};audio.onplay=()=>{document.querySelector('.player').classList.add('playing');$('play').textContent='Ⅱ';$('play').setAttribute('aria-label','Pause audio')};audio.onpause=()=>{document.querySelector('.player').classList.remove('playing');$('play').textContent='▶';$('play').setAttribute('aria-label','Play audio')};audio.ontimeupdate=()=>{$('elapsed').textContent=time(audio.currentTime);$('seek').value=1000*audio.currentTime/(audio.duration||1);draw()};audio.onloadedmetadata=()=>$('duration').textContent=time(audio.duration);audio.onerror=()=>{if(audio.getAttribute('src'))notify('Audio playback is unavailable for this file.')};$('seek').oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(e.target.value)/1000*audio.duration};$('volume').oninput=e=>audio.volume=Number(e.target.value);$('restart').onclick=()=>{if(buffer)audio.currentTime=0};
$('demo').onclick=()=>{const rate=22050,seconds=12,n=rate*seconds,bytes=new ArrayBuffer(44+n*2),v=new DataView(bytes);const str=(o,s)=>[...s].forEach((c,i)=>v.setUint8(o+i,c.charCodeAt(0)));str(0,'RIFF');v.setUint32(4,36+n*2,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,rate,true);v.setUint32(28,rate*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,n*2,true);const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];for(let i=0;i<n;i++){const t=i/rate,beat=t% .5,f=notes[Math.floor(t*2)%notes.length],env=Math.exp(-beat*6)*Math.min(1,t*3)*Math.min(1,(seconds-t)*2);const val=(Math.sin(t*2*Math.PI*f)*.22+Math.sin(t*2*Math.PI*f/2)*.12+Math.sin(t*2*Math.PI*f*2)*.035)*env;v.setInt16(44+i*2,val*32767,true)}loadAudio(new File([bytes],'Midnight keys — sample.wav',{type:'audio/wav'}))};
$('reset').onclick=()=>{loadId++;renderToken++;activeRender=0;busy=false;window.SonicActivity?.close();originalBuffer=null;clearResult();loading=false;audio.pause();audio.removeAttribute('src');audio.load();if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=null;buffer=null;chain=pageEffect?[pageEffect]:editingMode==='single'?['reverb']:[];effects.forEach(e=>values[e.id]={controls:e.controls.map(c=>c[1]),enabled:true});selected=chain[0]||'';$('drop').hidden=false;$('drop').style.display='flex';$('file-info').hidden=true;$('wave-empty').style.display='grid';$('track-title').textContent=SonicI18n.translate('Your audio canvas');$('track-subtitle').textContent='Upload a file or try the sample to listen';$('elapsed').textContent=$('duration').textContent='0:00';$('seek').value=0;$('seek').disabled=true;$('play').disabled=true;$('demo').disabled=false;$('volume').value=.8;audio.volume=.8;$('play-label').textContent='Ready when you are';renderEffects();renderSettings();renderChain();draw();sessionEdited=false;window.SonicWorkflow?.reset();notify('Session reset.')};
if($('help'))$('help').onclick=()=>$('guide').showModal();$('close-help').onclick=$('got-it').onclick=()=>$('guide').close();window.addEventListener('resize',draw);renderEffects();renderSettings();renderChain();draw();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'select_audio_effect',description:'Include an effect and open its settings. Click Apply effects to render audio.',inputSchema:{type:'object',properties:{effect:{type:'string',enum:effects.map(e=>e.id)}},required:['effect'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!input||!effects.some(e=>e.id===input.effect))throw new Error('Unknown effect');selectEffect(input.effect);return {selectedEffect:selected,processingConnected:true}}})).catch(()=>{})}catch{}}
function updateActions(){
 $('apply').disabled=!originalBuffer||busy||loading||(!chain.some(id=>values[id].enabled)&&!needsRebuild);
 $('export').setAttribute('aria-disabled',String(!resultBlob||needsRebuild||busy||loading));if(resultBlob&&!needsRebuild&&!busy&&!loading){$('export').href=resultUrl;$('export').download=sourceName.replace(/\.[^.]+$/,'')+'-sonic-r'+revision+'.wav';}else $('export').removeAttribute('href');
 $('original').disabled=!originalBuffer||busy||loading;
 $('processed').disabled=!resultBuffer||needsRebuild||busy||loading;
 $('apply').textContent=busy?'Processing…':'Apply effects';
 window.SonicWorkflow?.refresh();window.SonicExport?.refresh();
 const format=$('output-format')?.value||'wav';$('export').textContent=SonicI18n.translate(format==='mp3'?'↓ Download MP3':'↓ Download WAV');
}
function markDirty(){if(!$('process-state'))return;$('process-state').textContent=originalBuffer&&!chain.some(id=>values[id].enabled)?'Select an effect first. Download keeps your last applied result.':resultBuffer?(editingMode==='combine'?'Apply to process new or changed effects. Completed effects are reused. Download keeps your last applied result.':'Settings changed? Apply again to update your result. Download keeps the last applied version.'):originalBuffer?(chain.some(id=>values[id].enabled)?'Ready to apply: '+chain.filter(id=>values[id].enabled).map(id=>effects.find(e=>e.id===id).name).join(', '):'Select an effect to apply.'):'Upload audio to get started.';updateActions();}
function clearResult(){window.SonicMP3?.cancel();needsRebuild=false;pipeline.reset();renderToken++;$('render-progress').hidden=true;document.querySelector('.settings').classList.remove('rendering','render-complete');resultBuffer=null;resultBlob=null;revision=0;if(resultUrl)URL.revokeObjectURL(resultUrl);resultUrl=null;markDirty();}
function listenTo(result){window.SonicWorkflow?.pause();window.SonicExamples?.pause();if(!(result?resultBuffer:originalBuffer))return;audio.pause();$('play').textContent='▶';$('play').setAttribute('aria-label','Play audio');buffer=result?resultBuffer:originalBuffer;audio.src=result?resultUrl:objectUrl;$('elapsed').textContent='0:00';$('seek').value=0;$('duration').textContent=time(buffer.duration);$('track-subtitle').textContent=result?'Processed audio · Revision '+revision:'Original audio · Unchanged';$('play-label').textContent=result?'Result · Revision '+revision:'Original audio';$('original').setAttribute('aria-pressed',String(!result));$('processed').setAttribute('aria-pressed',String(result));draw();}
$('original').onclick=()=>listenTo(false);$('processed').onclick=()=>listenTo(true);
async function applyEffects({allowEmpty=false}={}){
 if(!originalBuffer||busy||loading)return;
 if(!allowEmpty&&!needsRebuild&&!chain.some(id=>values[id].enabled)){notify('Select at least one enabled effect first.');return;}
 const ticket=++renderToken,snapshot=JSON.parse(JSON.stringify(values)),steps=chain.filter(id=>values[id].enabled);busy=true;activeRender=ticket;audio.pause();window.SonicActivity?.start('audio',steps.map(id=>({id,name:effects.find(e=>e.id===id).name})));document.querySelector('.settings').classList.remove('render-complete');document.querySelector('.settings').classList.add('rendering');setProgress(0,'Preparing audio');updateActions();$('process-state').textContent='Applying effects…';
 try{await new Promise(r=>setTimeout(r,30));const progress=(fraction,id)=>{if(ticket!==renderToken)return;setProgress(fraction,id==='finalizing'?'Balancing output':id==='encoding'?'Creating WAV':(effects.find(e=>e.id===id)?.name||'Processing audio'));};const outcome=editingMode==='combine'?await pipeline.render(originalBuffer,steps,snapshot,progress,()=>ticket===renderToken):{buffer:await SonicDSP.render(originalBuffer,steps,snapshot,progress),reused:0,processed:steps.length};const rendered=outcome.buffer;if(ticket!==renderToken)return;setProgress(.96,'Creating WAV');const blob=await SonicDSP.wavAsync(rendered, fraction=>setProgress(.96+fraction*.039,'Creating WAV'));if(ticket!==renderToken)return;if(resultUrl)URL.revokeObjectURL(resultUrl);window.SonicMP3?.cancel();resultBuffer=rendered;resultBlob=blob;needsRebuild=false;resultUrl=URL.createObjectURL(blob);revision++;setProgress(1,'Your audio is ready');window.SonicActivity?.finish(true,'Press play to hear the result.');document.querySelector('.settings').classList.add('render-complete');animateElement(document.querySelector('.player'));listenTo(true);$('process-state').textContent=steps.length?'Revision '+revision+' ready · Applied: '+steps.map(id=>effects.find(e=>e.id===id).name).join(', ')+'. '+(outcome.reused?'Reused '+outcome.reused+' completed effect'+(outcome.reused===1?'':'s')+'; processed '+outcome.processed+' new or changed effect'+(outcome.processed===1?'':'s')+'. ':'')+'Press play to hear the result.':'Original audio · Unchanged';notify(!steps.length?'Original audio · Unchanged':outcome.processed?'Applied '+outcome.processed+' effect'+(outcome.processed===1?'':'s')+(outcome.reused?' to your previous result.':'. Listening source: Result.'):'Your result is already up to date.');}
 catch(error){if(ticket===renderToken){if(needsRebuild)listenTo(false);$('render-progress').hidden=true;$('process-state').textContent=error.message||'Processing failed. Try a shorter audio clip.';notify($('process-state').textContent);window.SonicActivity?.finish(false,$('process-state').textContent);}}
 finally{if(activeRender===ticket){if(ticket!==renderToken)window.SonicActivity?.close();activeRender=0;busy=false;document.querySelector('.settings').classList.remove('rendering');updateActions();}}
}
$('apply').onclick=()=>applyEffects();

updateActions();

// Seek within whichever source is currently selected, without changing play/pause state.
$('wave').addEventListener('click',event=>{
 if(!buffer||loading||busy||!Number.isFinite(audio.duration)||audio.duration<=0)return;
 const rect=$('wave').getBoundingClientRect();if(!rect.width)return;
 const fraction=Math.max(0,Math.min(1,(event.clientX-rect.left)/rect.width));
 audio.currentTime=fraction*audio.duration;
 $('seek').value=fraction*1000;$('elapsed').textContent=time(audio.currentTime);draw();
});

syncTheme();

if(window.ResizeObserver)new ResizeObserver(draw).observe($('wave'));document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw()});

function setEditingMode(mode){if(pageEffect)mode='single';editingMode=mode;if(mode==='single'&&chain.length>1){chain=[chain.includes(selected)?selected:chain[0]];selected=chain[0];}const single=mode==='single';$('single-mode').setAttribute('aria-pressed',String(single));$('combine-mode').setAttribute('aria-pressed',String(!single));document.querySelector('.effects-note').textContent=single?'Choose an effect, adjust it, then apply. Choosing another effect replaces your selection. Revisions start from your original.':'Effects run in the order shown. Apply, then add another effect to build on your result. Completed effects are reused; changing an earlier effect updates it and the effects after it.';const url=new URL(location.href);url.searchParams.set('mode',mode);history.replaceState(null,'',url);renderEffects();renderSettings();renderChain();window.SonicWorkflow?.changed();}
$('single-mode').onclick=()=>{window.SonicNavigation.go('effects.html')};$('combine-mode').onclick=()=>setEditingMode('combine');setEditingMode(editingMode);

window.SonicStudio={refreshDownload:updateActions,getExport:()=>resultBuffer&&!needsRebuild&&!busy&&!loading?{buffer:resultBuffer,name:sourceName,revision}:null,getState:()=>({mode:editingMode,selected,chain:[...chain],values:JSON.parse(JSON.stringify(values))}),isWorking:()=>busy||loading,getSource:()=>originalBuffer,getSourceName:()=>sourceName,pausePlayback:()=>audio.pause(),restoreState:restoreEditorState,preview:previewEffects,cancelPreview:cancelPreview,hasChanges:()=>Boolean(originalBuffer||loading||busy||sessionEdited||(editingMode==='combine'&&chain.length))};
document.addEventListener('input',event=>{if(event.target.matches('#settings-body input, #settings-body select'))sessionEdited=true;});
document.addEventListener('change',event=>{if(event.target.matches('#settings-body input, #settings-body select'))sessionEdited=true;});

// Settings history stores small snapshots; audio remains immutable and is rebuilt through the existing pipeline.
function restoreEditorState(state){
 if(busy||loading)return false;
 const hadResult=Boolean(resultBuffer);editingMode=pageEffect?'single':state.mode;chain=[...state.chain];selected=state.selected;values=JSON.parse(JSON.stringify(state.values));setEditingMode(editingMode);sessionEdited=true;
 window.SonicWorkflow?.clearPreview();renderEffects();renderSettings();renderChain();
 if(hadResult){needsRebuild=true;listenTo(false);updateActions();applyEffects({allowEmpty:true});}else markDirty();
 return true;
}
async function previewEffects({start=0,duration=10,onProgress=()=>{}}={}){
 if(!originalBuffer||busy||loading)throw new Error('Upload audio and wait for processing to finish.');
 const steps=chain.filter(id=>values[id].enabled);if(!steps.length)throw new Error('Select at least one enabled effect first.');
 const source=originalBuffer,snapshot=JSON.parse(JSON.stringify(values)),rate=source.sampleRate;
 start=Math.max(0,Math.min(Number(start)||0,Math.max(0,source.duration-1/rate)));duration=Math.max(1,Math.min(15,Number(duration)||10));
 const offset=Math.min(source.length-1,Math.floor(start*rate)),length=Math.min(source.length-offset,Math.round(duration*rate));
 const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext,clip=new Offline(source.numberOfChannels,1,rate).createBuffer(source.numberOfChannels,length,rate);
 for(let c=0;c<source.numberOfChannels;c++)clip.getChannelData(c).set(source.getChannelData(c).subarray(offset,offset+length));
 const ticket=++renderToken;busy=true;activeRender=ticket;previewOwner=ticket;audio.pause();updateActions();
 const current=()=>ticket===renderToken&&source===originalBuffer;
 try{
  onProgress(0);const previewPipeline=SonicDSP.createPipeline(0);const outcome=editingMode==='combine'?await previewPipeline.render(clip,steps,snapshot,fraction=>{if(current())onProgress(fraction*.9);},current):{buffer:await SonicDSP.render(clip,steps,snapshot,fraction=>{if(current())onProgress(fraction*.9);})};
  if(!current())return null;const original=await SonicDSP.wavAsync(clip);if(!current())return null;const processed=await SonicDSP.wavAsync(outcome.buffer,fraction=>{if(current())onProgress(.9+.1*fraction);});
  if(!current())return null;return {original,processed,start:offset/rate,duration:clip.duration,steps:[...steps]};
 }finally{if(previewOwner===ticket)previewOwner=0;if(activeRender===ticket){activeRender=0;busy=false;updateActions();}}
}

function cancelPreview(){if(previewOwner&&activeRender===previewOwner){renderToken++;activeRender=0;previewOwner=0;busy=false;updateActions();}}
