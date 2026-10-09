(() => {
 'use strict';
 const format=document.getElementById('output-format'),download=document.getElementById('export');if(!format||!download)return;
 const t=value=>window.SonicI18n?.translate(value)||value;
 const quality=document.getElementById('export-quality'),filename=document.getElementById('export-filename'),estimate=document.getElementById('export-size');
 let worker=null,job=0,working=false,cached=null,cachedUrl=null,customName=false,lastSource=null;
 const bitrate=()=>Number(quality?.value)||192;
 const cleanName=value=>String(value).replace(/\.(mp3|wav)$/i,'').replace(/[<>:"/\\|?*\u0000-\u001f]/g,'-').trim().replace(/[. ]+$/g,'').slice(0,120)||'audio-sonic';
 const downloadName=(state,extension=format.value)=>cleanName(filename?.value||state.name.replace(/\.[^.]+$/,'')+'-sonic-r'+state.revision)+'.'+extension;
 function refresh(){
  const state=window.SonicStudio?.getExport(),source=window.SonicStudio?.getSource?.();
  if(source!==lastSource){lastSource=source;customName=false;}
  if(filename&&!customName)filename.value=state?cleanName(state.name.replace(/\.[^.]+$/,'')+'-sonic-r'+state.revision):cleanName((window.SonicStudio?.getSourceName?.()||'audio').replace(/\.[^.]+$/,'')+'-sonic');
  if(quality){quality.disabled=format.value!=='mp3'||working;quality.closest('.export-quality-field').hidden=format.value!=='mp3';}
  if(filename)filename.disabled=working;
  if(state&&format.value==='wav')download.download=downloadName(state);
  if(estimate){if(!state){estimate.textContent=t('Apply effects to see the download size.');return;}const actual=format.value==='mp3'&&cached?.buffer===state.buffer&&cached.bitrate===bitrate();const bytes=format.value==='wav'?44+state.buffer.length*state.buffer.numberOfChannels*2:actual?cached.size:state.buffer.duration*bitrate()*1000/8;estimate.textContent=t(format.value==='wav'||actual?'Download size':'Estimated size')+': '+(bytes>=1000000?(bytes/1000000).toFixed(2)+' MB':(bytes/1000).toFixed(1)+' KB');}
 }
 window.SonicExport={refresh,cleanName};
 filename?.addEventListener('input',()=>{customName=true;refresh();});
 quality?.addEventListener('change',refresh);
 function cancel(){job++;worker?.terminate();worker=null;if(working){working=false;window.SonicActivity?.close();}if(cachedUrl)URL.revokeObjectURL(cachedUrl);cachedUrl=null;cached=null;}
 window.SonicMP3={cancel};
 format.addEventListener('change',()=>{window.SonicStudio.refreshDownload();refresh();});
 download.addEventListener('click',async event=>{
  if(format.value!=='mp3')return;
  event.preventDefault();const state=window.SonicStudio.getExport();if(!state||working)return;
  const selectedBitrate=bitrate();const save=url=>{const link=document.createElement('a');link.href=url;link.download=downloadName(state,'mp3');document.body.append(link);link.click();link.remove();};
  if(cached?.buffer===state.buffer&&cached.bitrate===selectedBitrate){save(cachedUrl);return;}
  const ticket=++job;working=true;refresh();window.SonicActivity.start('export');
  try{
   if(typeof Worker!=='function')throw Error('MP3 export is unavailable in this browser. Please choose WAV.');
   let buffer=state.buffer;
   const supported=[32000,44100,48000];
   if(!supported.includes(buffer.sampleRate)){
    const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext,ctx=new Offline(Math.min(2,buffer.numberOfChannels),Math.ceil(buffer.duration*48000),48000),source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);source.start();buffer=await ctx.startRendering();
   }
   if(ticket!==job)return;
   const samples=Array.from({length:Math.min(2,buffer.numberOfChannels)},(_,channel)=>buffer.getChannelData(channel).slice());
   worker=new Worker('/mp3-worker.js?v=45');
   const blob=await new Promise((resolve,reject)=>{
    worker.onmessage=({data})=>{if(ticket!==job)return;if(data.error)reject(Error(data.error));else if(data.blob)resolve(data.blob);else window.SonicActivity.progress(data.progress*.99,'Creating MP3');};
    worker.onerror=()=>reject(Error('MP3 export failed. Please try again or choose WAV.'));
    worker.postMessage({sampleRate:buffer.sampleRate,samples,bitrate:selectedBitrate},samples.map(sample=>sample.buffer));
   });
   if(ticket!==job)return;
   if(cachedUrl)URL.revokeObjectURL(cachedUrl);cachedUrl=URL.createObjectURL(blob);cached={buffer:state.buffer,bitrate:selectedBitrate,size:blob.size};
   save(cachedUrl);window.SonicActivity.finish(true,'Your MP3 download is ready.');
  }catch(error){if(ticket===job)window.SonicActivity.finish(false,t(error.message));}
  finally{if(ticket===job){worker?.terminate();worker=null;working=false;refresh();}}
 });
 window.addEventListener('pagehide',cancel);refresh();
})();
