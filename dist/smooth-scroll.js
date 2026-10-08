(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lenis = null;
  const header=document.querySelector('body > header');
  const measureHeader=()=>{const height=header?.getBoundingClientRect().height||0;document.documentElement.style.setProperty('--site-header-height',height+'px');if(lenis)lenis.options.anchors.offset=-height-20;};
  if(header&&window.ResizeObserver)new ResizeObserver(measureHeader).observe(header);
  window.addEventListener('resize',measureHeader);measureHeader();

  function syncDialog() {
    if (!lenis) return;
    if (document.querySelector('dialog[open]')) lenis.stop();
    else lenis.start();
  }

  function initialize() {
    if (lenis || reducedMotion.matches || typeof window.Lenis !== 'function') return;
    lenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      // Preserve the browser's touch momentum and pinch-to-zoom behavior.
      syncTouch: false,
      anchors: {offset: -(header?.getBoundingClientRect().height||0)-20},
      allowNestedScroll: true,
      prevent: node => node.matches?.('dialog, textarea, [data-lenis-prevent]') || false
    });
    syncDialog();
  }

  window.SonicScroll={to(target){
    const offset=-(header?.getBoundingClientRect().height||0)-20;
    if(lenis)lenis.scrollTo(target,{offset});
    else window.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+window.scrollY+offset),behavior:reducedMotion.matches?'instant':'smooth'});
  }};

  function destroy() {
    lenis?.destroy();
    lenis = null;
  }

  const dialogs = new MutationObserver(syncDialog);
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.setAttribute('data-lenis-prevent', '');
    dialogs.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
  dialogs.observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['open']});
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) destroy();
    else initialize();
  });
  window.addEventListener('pagehide', destroy);
  window.addEventListener('pageshow', initialize);
  initialize();
})();
