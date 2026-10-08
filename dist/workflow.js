(()=>{
 const api=window.SonicStudio;if(!api)return;
 const $=id=>document.getElementById(id),t=text=>window.SonicI18n?.translate(text)||text;
 const history=window.SonicHistory(api.getState());let restoring=false,job=0,preparing=false,urls=[];
 const panel=$('quick-preview'),status=$('preview-status'),meter=$('preview-meter'),start=$('preview-start'),duration=$('preview-length');
 function pause(){for(const id of ['preview-original','preview-result'])$(id).pause();}
 function clearPreview(){job++;preparing=false;api.cancelPreview?.();pause();for(const url of urls)URL.revokeObjectURL(url);urls=[];for(const id of ['preview-original','preview-result']){$(id).removeAttribute('src');$(id).load();}$('preview-players').hidden=true;meter.hidden=true;status.textContent=t('Preview a short section before processing the whole track.');refresh();}
 function refresh(){const busy=api.isWorking(),source=api.getSource();$('undo-edit').disabled=busy||!history.canUndo;$('redo-edit').disabled=busy||!history.canRedo;$('preview-run').disabled=busy||!source||!api.getState().chain.some(id=>api.getState().values[id].enabled);start.disabled=busy||!source;duration.disabled=busy||!source;$('preview-cancel').hidden=!preparing;start.max=source?String(Math.max(0,Math.floor(source.duration-.001))):'0';if(Number(start.value)>Number(start.max))start.value=start.max;}
 function restore(direction){if(api.isWorking())return;const state=history[direction]();if(!state)return;restoring=true;try{api.restoreState(state);}finally{restoring=false;refresh();}}
 $('undo-edit').onclick=()=>restore('undo');$('redo-edit').onclick=()=>restore('redo');
 $('preview-cancel').onclick=()=>clearPreview();start.addEventListener('change',clearPreview);duration.addEventListener('change',clearPreview);
 $('preview-run').onclick=async()=>{
  if(api.isWorking())return;clearPreview();const ticket=++job;preparing=true;status.textContent=t('Creating quick preview…');meter.hidden=false;meter.value=0;refresh();
  try{const result=await api.preview({start:Number(start.value),duration:Number(duration.value),onProgress:fraction=>{if(ticket===job){meter.value=Math.round(fraction*100);meter.setAttribute('aria-valuetext',Math.round(fraction*100)+'%');}}});if(ticket!==job)return;if(!result){status.textContent=t('Preview cancelled.');return;}
   urls=[URL.createObjectURL(result.original),URL.createObjectURL(result.processed)];$('preview-original').src=urls[0];$('preview-result').src=urls[1];$('preview-players').hidden=false;meter.value=100;status.textContent=t('Preview ready. Your full result and download are unchanged.')+' '+result.start.toFixed(1)+'–'+(result.start+result.duration).toFixed(1)+' s';
  }catch(error){if(ticket===job)status.textContent=error.message||t('Preview could not be created. Try again.');}finally{if(ticket===job){preparing=false;refresh();}}
 };
 for(const id of ['preview-original','preview-result'])$(id).addEventListener('play',()=>{api.pausePlayback();window.SonicExamples?.pause();for(const other of ['preview-original','preview-result'])if(other!==id)$(other).pause();});
 document.addEventListener('keydown',event=>{if(document.querySelector('dialog[open]'))return;if(!(event.ctrlKey||event.metaKey)||event.altKey||event.target.closest('input,textarea,select,[contenteditable="true"]'))return;const key=event.key.toLowerCase(),action=key==='z'?(event.shiftKey?'redo':'undo'):key==='y'?'redo':null;if(!action)return;event.preventDefault();restore(action);});
 window.SonicWorkflow={changed(key,phase){if(restoring)return;const changed=history.record(api.getState(),key,phase);if(changed)clearPreview();refresh();},reset(){history.reset(api.getState());clearPreview();refresh();},clearPreview,refresh,pause};
 window.addEventListener('pagehide',clearPreview);refresh();
})();
