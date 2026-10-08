(() => {
 'use strict';
 const t=value=>window.SonicI18n?.translate(value)||value;
 let dialog,resolvePending,returnFocus,allowExit=false;
 function dismiss(accepted){if(!resolvePending)return;const resolve=resolvePending;resolvePending=null;dialog.close();if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});resolve(accepted);}
 function create(){
  dialog=document.createElement('dialog');dialog.className='sonic-confirm';dialog.setAttribute('role','alertdialog');dialog.setAttribute('aria-labelledby','confirm-title');dialog.setAttribute('aria-describedby','confirm-message');dialog.setAttribute('data-lenis-prevent','');
  dialog.innerHTML='<div class="confirm-symbol" aria-hidden="true">!</div><h2 id="confirm-title"></h2><p id="confirm-message"></p><div class="confirm-actions"><button type="button" class="confirm-cancel"></button><button type="button" class="confirm-accept"></button></div>';
  document.body.append(dialog);
  dialog.querySelector('.confirm-cancel').onclick=()=>dismiss(false);dialog.querySelector('.confirm-accept').onclick=()=>dismiss(true);
  dialog.addEventListener('cancel',event=>{event.preventDefault();dismiss(false);});
 }
 window.SonicConfirm={ask({title,message,accept,cancel='Cancel'}){
  if(resolvePending)return Promise.resolve(false);
  if(!dialog)create();returnFocus=document.activeElement;
  dialog.querySelector('h2').textContent=t(title);dialog.querySelector('p').textContent=t(message);dialog.querySelector('.confirm-accept').textContent=t(accept);dialog.querySelector('.confirm-cancel').textContent=t(cancel);
  return new Promise(resolve=>{resolvePending=resolve;dialog.showModal();dialog.querySelector('.confirm-cancel').focus({preventScroll:true});});
 }};
 const hasChanges=()=>Boolean(window.SonicStudio?.hasChanges());
 async function go(destination){
  if(hasChanges()){
   const accepted=await window.SonicConfirm.ask({title:'Leave the studio?',message:'Your audio, effect settings and changes are stored only in this session. If you leave, they will be lost. Download your result first if you want to keep it.',accept:'Leave studio',cancel:'Stay in studio'});
   if(!accepted)return false;
  }
  allowExit=true;location.assign(destination);return true;
 }
 window.SonicNavigation={go};
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||!hasChanges())return;
  const link=event.target.closest?.('a[href]');if(!link||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const destination=new URL(link.href,location.href),current=new URL(location.href);
  if(!['http:','https:'].includes(destination.protocol))return;
  if(destination.origin===current.origin&&destination.pathname===current.pathname&&destination.search===current.search&&destination.hash)return;
  event.preventDefault();event.stopImmediatePropagation();go(destination.href);
 },true);
 window.addEventListener('beforeunload',event=>{if(!allowExit&&hasChanges()){event.preventDefault();event.returnValue='';}});
 window.addEventListener('pageshow',()=>{allowExit=false;});
})();
