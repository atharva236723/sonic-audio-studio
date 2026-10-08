(() => {
  const t = value => window.SonicI18n?.translate(value) || value;
  const modal = document.createElement('dialog');
  modal.className = 'activity-dialog';
  modal.setAttribute('aria-labelledby', 'activity-title');
  modal.setAttribute('aria-describedby', 'activity-detail');
  modal.setAttribute('data-lenis-prevent', '');
  modal.innerHTML = `<div class="activity-art" aria-hidden="true"><div class="activity-orbit"></div><div class="activity-wave">${Array.from({length:9},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><span class="activity-check">✓</span></div><h2 id="activity-title"></h2><p id="activity-detail" role="status" aria-live="polite"></p><ol class="activity-effects" aria-label="${t('YOUR EFFECT CHAIN')}" hidden></ol><div class="activity-progress" role="progressbar" aria-label="${t('Processing audio')}" aria-valuemin="0" aria-valuemax="100"><div></div></div><strong class="activity-percent"></strong><div class="activity-wait" hidden><p class="activity-wait-note"></p><p class="activity-wait-joke" role="status" aria-live="polite" aria-atomic="true"></p></div><button class="activity-dismiss" type="button"></button>`;
  document.body.append(modal);
  const title=modal.querySelector('h2'),detail=modal.querySelector('p'),meter=modal.querySelector('[role=progressbar]'),fill=meter.firstElementChild,percent=modal.querySelector('.activity-percent'),button=modal.querySelector('button');
  const effectList=modal.querySelector('.activity-effects');
  const wait=modal.querySelector('.activity-wait'),waitNote=modal.querySelector('.activity-wait-note'),joke=modal.querySelector('.activity-wait-joke');
  const jokes=['Your song is taking the scenic route.','The beat is moving slowly. The drama is right on time.','Teaching your notes how to make a grand entrance.','Good things take time. Apparently, so does this bassline.'];
  let jokeTimer=null,jokeIndex=0;
  function stopWaiting(){clearInterval(jokeTimer);jokeTimer=null;wait.hidden=true;joke.textContent='';}
  function startWaiting(){wait.hidden=false;waitNote.textContent=t('Slowed + Reverb can take some time, especially with longer audio. Keep this tab open while we finish.');jokeIndex=0;joke.textContent=t(jokes[0]);jokeTimer=setInterval(()=>{if(!active){stopWaiting();return;}jokeIndex=(jokeIndex+1)%jokes.length;joke.textContent=t(jokes[jokeIndex]);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&joke.animate)joke.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});},5000);}
  let timer, active=false, previousFocus, last=0;
  function markEffects(label,complete=false){const items=[...effectList.children],index=items.findIndex(item=>item.dataset.name===label);items.forEach((item,i)=>{item.dataset.state=complete||index>=0&&i<index?'done':i===index?'current':'pending';if(i===index&&!complete)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');item.firstElementChild.textContent=item.dataset.state==='done'?'✓':String(i+1);});}
  const close=()=>{clearTimeout(timer);stopWaiting();active=false;modal.close();previousFocus?.focus?.({preventScroll:true});};
  modal.addEventListener('cancel',e=>{if(active)e.preventDefault();});
  button.onclick=close;window.addEventListener('pagehide',stopWaiting);
  window.SonicActivity={
    start(kind,effects=[]){clearTimeout(timer);stopWaiting();effectList.replaceChildren();effectList.hidden=kind!=='audio'||!effects.length;effects.forEach(effect=>{const item=document.createElement('li'),number=document.createElement('span'),name=document.createElement('span');item.dataset.name=effect.name;item.dataset.id=effect.id;name.textContent=effect.name;item.append(number,name);effectList.append(item);});markEffects('');last=0;previousFocus=document.activeElement;active=true;modal.dataset.state='working';modal.dataset.kind=kind;title.textContent=t(kind==='contact'?'Sending your message':kind==='export'?'Preparing your download':'Applying effects…');detail.textContent=t(kind==='contact'?'Connecting securely…':kind==='export'?'Creating MP3':'Preparing audio');meter.hidden=kind==='contact';percent.hidden=kind==='contact';button.hidden=true;fill.style.width='0%';percent.textContent='0%';meter.setAttribute('aria-valuenow','0');if(!modal.open)modal.showModal();if(kind==='audio'&&effects.some(effect=>effect.id==='slowed'))startWaiting();},
    progress(fraction,label){if(!active)return;last=Math.max(last,Math.min(99,Math.round(fraction*100)));fill.style.width=last+'%';percent.textContent=last+'%';meter.setAttribute('aria-valuenow',last);detail.textContent=t(label);if(['Creating WAV','Balancing output','Your audio is ready'].includes(label))markEffects('',true);else markEffects(label);},
    finish(success,message){stopWaiting();if(!modal.open)return;active=false;modal.dataset.state=success?'success':'error';title.textContent=t(success?(modal.dataset.kind==='contact'?'Message sent':'Your audio is ready'):'Something went wrong');detail.textContent=t(message);if(success){markEffects('',true);fill.style.width='100%';percent.textContent='100%';meter.setAttribute('aria-valuenow','100');}else{meter.hidden=true;percent.hidden=true;}button.textContent=t(success?'Done':'Close');button.hidden=false;button.focus({preventScroll:true});if(success&&modal.dataset.kind!=='contact')timer=setTimeout(close,1400);},
    close
  };
})();
