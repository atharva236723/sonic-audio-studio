(() => {
 'use strict';
 const format=document.getElementById('output-format'),download=document.getElementById('export');if(!format||!download)return;
 const t=value=>window.SonicI18n?.translate(value)||value;
 let worker=null,job=0,working=false,cached=null,cachedUrl=null;
 function cancel(){job++;worker?.terminate();worker=null;if(working){working=false;window.SonicActivity?.close();}if(cachedUrl)URL.revokeObjectURL(cachedUrl);cachedUrl=null;cached=null;}
 window.SonicMP3={cancel};
 format.addEventListener('change',()=>window.SonicStudio.refreshDownload());
 download.addEventListener('click',async event=>{
  if(format.value!=='mp3')return;
  event.preventDefault();const state=window.SonicStudio.getExport();if(!state||working)return;
  const save=url=>{const link=document.createElement('a');link.href=url;link.download=state.name.replace(/\.[^.]+$/,'')+'-sonic-r'+state.revision+'.mp3';document.body.append(link);link.click();link.remove();};
  if(cached?.buffer===state.buffer){save(cachedUrl);return;}
  const ticket=++job;working=true;window.SonicActivity.start('export');
  try{
   if(typeof Worker!=='function')throw Error('MP3 export is unavailable in this browser. Please choose WAV.');
   let buffer=state.buffer;
   const supported=[8000,11025,12000,16000,22050,24000,32000,44100,48000];
   if(!supported.includes(buffer.sampleRate)){
    const Offline=window.OfflineAudioContext||window.webkitOfflineAudioContext,ctx=new Offline(Math.min(2,buffer.numberOfChannels),Math.ceil(buffer.duration*48000),48000),source=ctx.createBufferSource();source.buffer=buffer;source.connect(ctx.destination);source.start();buffer=await ctx.startRendering();
   }
   if(ticket!==job)return;
   const samples=Array.from({length:Math.min(2,buffer.numberOfChannels)},(_,channel)=>buffer.getChannelData(channel).slice());
   worker=new Worker('/mp3-worker.js?v=39');
   const blob=await new Promise((resolve,reject)=>{
    worker.onmessage=({data})=>{if(ticket!==job)return;if(data.error)reject(Error(data.error));else if(data.blob)resolve(data.blob);else window.SonicActivity.progress(data.progress*.99,'Creating MP3');};
    worker.onerror=()=>reject(Error('MP3 export failed. Please try again or choose WAV.'));
    worker.postMessage({sampleRate:buffer.sampleRate,samples},samples.map(sample=>sample.buffer));
   });
   if(ticket!==job)return;
   if(cachedUrl)URL.revokeObjectURL(cachedUrl);cachedUrl=URL.createObjectURL(blob);cached={buffer:state.buffer};
   save(cachedUrl);window.SonicActivity.finish(true,'Your MP3 download is ready.');
  }catch(error){if(ticket===job)window.SonicActivity.finish(false,t(error.message));}
  finally{if(ticket===job){worker?.terminate();worker=null;working=false;}}
 });
 window.addEventListener('pagehide',cancel);
})();
