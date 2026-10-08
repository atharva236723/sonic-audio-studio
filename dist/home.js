const picker=document.getElementById('mode-picker'),scene=document.getElementById('music-scene'),card=document.getElementById('music-card'),motion=document.getElementById('motion-toggle');
document.getElementById('start-creating').onclick=()=>picker.showModal();
document.getElementById('close-picker').onclick=()=>picker.close();
picker.addEventListener('click',event=>{if(event.target===picker){const r=picker.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)picker.close();}});
const wave=document.getElementById('mini-wave');for(let i=0;i<44;i++){const bar=document.createElement('i');bar.style.height=(8+Math.abs(Math.sin(i*1.6)*Math.cos(i*.24))*26)+'px';bar.style.setProperty('--delay',(-i*.13)+'s');wave.append(bar);}
motion.onclick=()=>{const paused=scene.classList.toggle('motion-paused');motion.textContent=paused?'▶':'Ⅱ';motion.setAttribute('aria-pressed',String(paused));motion.setAttribute('aria-label',paused?'Resume card animation':'Pause card animation');};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0;
scene.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType!=='mouse')return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const r=scene.getBoundingClientRect(),x=(event.clientX-r.left)/r.width-.5,y=(event.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*18-8}deg) rotateX(${-y*12+5}deg) rotateZ(5deg)`;});});
scene.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);card.style.transform='';});
document.addEventListener('visibilitychange',()=>{scene.classList.toggle('tab-hidden',document.hidden);});


// Native details remain usable without JavaScript; animate both directions when enhanced.
document.querySelectorAll('.faq-item').forEach(item=>{
 const summary=item.querySelector('summary'),panel=item.querySelector('.faq-answer');
 let expanded=item.open,animation=null;
 summary.addEventListener('click',event=>{
  event.preventDefault();expanded=!expanded;
  const from=item.open?panel.getBoundingClientRect().height:0;
  if(animation){animation.cancel();animation=null;}
  if(reduced.matches||!panel.animate){item.open=expanded;return;}
  item.open=true;
  const next=panel.animate([{height:from+'px',opacity:from?1:0},{height:(expanded?panel.scrollHeight:0)+'px',opacity:expanded?1:0}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
  animation=next;
  next.onfinish=()=>{if(animation!==next)return;item.open=expanded;next.cancel();animation=null;};
 });
});
