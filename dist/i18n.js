(() => {
  'use strict';
  const data = window.SonicI18nData || { dictionary: {} };
  const dictionary = data.dictionary;
  function format(key, values = {}) {
    return (dictionary[key] || key).replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
  }
  function translate(value) {
    const key = value.trim();
    if (!key) return value;
    let translated = dictionary[key];
    let match;
    if (!translated && data.units && (match=key.match(/^(-?[\d.]+) (seconds|semitones)$/))) translated=match[1]+' '+data.units[match[2]==='seconds'?0:1];
    if (!translated && (match = key.match(/^Ready to apply: (.+)$/))) translated = format('Ready to apply: {effects}', {effects:match[1]});
    if (!translated && (match = key.match(/^(Processed audio|Result) · Revision (\d+)$/))) translated = format(match[1]+' · Revision {n}', {n:match[2]});
    if (!translated && (match = key.match(/^Revision (\d+) ready · Applied: (.+?)\. (?:Reused (\d+) completed effects?; processed (\d+) new or changed effects?\. )?Press play to hear the result\.$/))) {
      translated = format('Revision {n} ready · Applied: {effects}. Press play to hear the result.', {n:match[1],effects:match[2]});
      if(match[3]) translated += ' '+format('Reused {reused} completed effects; processed {processed} new or changed effects.', {reused:match[3],processed:match[4]});
    }
    if (!translated && (match = key.match(/^Applied (\d+) effects?( to your previous result\.|\. Listening source: Result\.)$/))) translated = format(match[2].startsWith(' to')?'Applied {n} effects to your previous result.':'Applied {n} effects. Listening source: Result.', {n:match[1]});
    if (!translated && key.endsWith(' (off)')) translated = key.slice(0,-6)+' '+format('(off)');
    if (!translated && key.startsWith('Remove ')) translated = format('Remove')+' '+key.slice(7);
    return translated ? value.replace(key,translated) : value;
  }
  window.SonicI18n = {
    translate,
    localizeEffects(effects) {
      if(!data.effects) return;
      for(const effect of effects){
        const copy = data.effects[effect.id];
        effect.name=copy.name; effect.desc=copy.short; effect.detail=copy.detail;
        effect.note=format('Your original stays available for comparison. Apply effects to update the result before downloading.');
        for(const control of effect.controls){control[0]=translate(control[0]);control[5]=translate(control[5]);control[6]=translate(control[6]);}
      }
    }
  };
  // These strings are created after load by the existing audio editor and form.
  // Translate only known UI messages, never user filenames or message contents.
  function localizeNode(node) {
    if(node.nodeType===3){
      if(node.parentElement?.closest('script, style, textarea, #filename, #filemeta, #track-title')) return;
      const text=translate(node.nodeValue);
      if(text!==node.nodeValue) node.nodeValue=text;
      return;
    }
    if(node.nodeType!==1 || node.matches('script, style, textarea, input')) return;
    for(const name of ['aria-label','title','placeholder']){
      if(node.hasAttribute(name)){
        const value=node.getAttribute(name),text=translate(value);
        if(text!==value) node.setAttribute(name,text);
      }
    }
    node.childNodes.forEach(localizeNode);
  }
  function boot(){
    if(document.documentElement.lang!=='en'){
      // Presets retain their English keys so localization cannot change DSP lookup.
      const observer=new MutationObserver(records=>{
        for(const record of records){
          if(record.type==='characterData') localizeNode(record.target);
          else if(record.type==='attributes') localizeNode(record.target);
          else record.addedNodes.forEach(localizeNode);
        }
      });
      localizeNode(document.body);
      observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
    }
    const menu=document.querySelector('.language-switcher');
    if(!menu)return;
    menu.querySelectorAll('a').forEach(link=>{
      // Keep the editor mode, but start translated pages at the top.
      const destination=new URL(link.href);destination.search=location.search;destination.hash='';link.href=destination.href;
    });
    document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
    document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus();}});
  }
  document.addEventListener('DOMContentLoaded',boot,{once:true});
})();
