(() => {
 'use strict';
 const studio=document.querySelector('.studio'),column=studio?.querySelector('.main-column'),player=column?.querySelector('.player'),settings=studio?.querySelector('.settings');
 if(!studio||!column||!player||!settings)return;
 const mobile=window.matchMedia('(max-width: 960px)');
 function arrange(){if(mobile.matches){if(player.parentElement!==studio)settings.after(player);}else if(player.parentElement!==column)column.append(player);}
 arrange();mobile.addEventListener('change',arrange);
 let frame;
 window.SonicMobileStudio={showSettings(){
  if(!mobile.matches)return;
  cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   if(!mobile.matches)return;
   if(window.SonicScroll)window.SonicScroll.to(settings);
   else settings.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
 }};
})();
