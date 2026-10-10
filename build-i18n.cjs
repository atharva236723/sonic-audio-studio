const fs=require('fs'),path=require('path'),vm=require('vm');
const root=__dirname,dist=path.join(root,'dist');
const {languages,dictionaries}=require('./i18n/ui.cjs');
const {names,details}=require('./i18n/effects.cjs');require('./i18n/extra.cjs');require('./i18n/new-effects.cjs');require('./i18n/workflow.cjs');
const search=require('./i18n/search.cjs');
const home=require('./i18n/home.cjs'),documents=require('./i18n/documents.cjs');
const origin=(process.env.SONIC_SITE_URL||'https://sonic-audio-studio.atharva23.chatgpt.site').replace(/\/$/,'');
const analyticsTag="<!-- google-analytics -->\n<!-- Google tag (gtag.js) -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-H1XKDD2XFL\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-H1XKDD2XFL');\n</script>\n<!-- /google-analytics -->";
const adsenseTag='<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3084454492205827" crossorigin="anonymous"></script>';
const nativeNames=['English','Español','日本語','Français','Deutsch','Português','한국어','Italiano'];
const ogLocales=['en_US','es_ES','ja_JP','fr_FR','de_DE','pt_BR','ko_KR','it_IT'];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&#x([a-f0-9]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n));
const effects=vm.runInNewContext(fs.readFileSync(path.join(dist,'effects.js'),'utf8')+';effects');
require('./build-new-effects.cjs')();
const files=fs.readdirSync(dist).filter(f=>f.endsWith('.html')&&!/^[45]\d{2}\.html$/.test(f)).sort();
const route=(lang,file)=>'/'+(lang==='en'?'':lang+'/')+(file==='index.html'?'':file);
const strip=h=>h.replace(/<!-- google-analytics -->[\s\S]*?<!-- \/google-analytics -->/g,'').replace(/<!-- i18n-head -->[\s\S]*?<!-- \/i18n-head -->/g,'').replace(/<!-- language-menu -->[\s\S]*?<!-- \/language-menu -->/g,'');
const english=Object.fromEntries(files.map(f=>[f,strip(fs.readFileSync(path.join(dist,f),'utf8'))]));
function translator(lang){return text=>{const key=decode(text.trim()),value=dictionaries[lang][key];return value?text.replace(text.trim(),esc(value)):text;};}
function translateHTML(html,lang){
  const translate=translator(lang);
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<[^>]+>|[^<]+/g,token=>{
    if(/^<(script|style)\b/i.test(token))return token;
    if(token.startsWith('<'))return token.replace(/(aria-label|title|placeholder)="([^"]*)"/g,(_,attr,text)=>attr+'="'+translate(text)+'"');
    return translate(token);
  });
}
function menu(lang,file){return '<!-- language-menu --><details class="language-switcher"><summary aria-label="'+esc(dictionaries[lang]['Choose language'])+'"><span aria-hidden="true">◎</span> '+nativeNames[languages.indexOf(lang)]+'</summary><nav class="language-menu" data-lenis-prevent aria-label="'+esc(dictionaries[lang].Language)+'">'+languages.map((l,i)=>'<a href="'+route(l,file)+'" hreflang="'+l+'" lang="'+l+'"'+(lang===l?' aria-current="page"':'')+'>'+nativeNames[i]+'</a>').join('')+'</nav></details><!-- /language-menu -->';}
function guide(lang,e,index){
  const t=s=>dictionaries[lang][s]||s;
  const params=e.controls.length?e.controls.map(c=>'<section><h3>'+esc(t(c[0]))+'</h3><span class="parameter-range">'+c[2]+esc(c[4])+' '+esc(t('to'))+' '+c[3]+esc(c[4])+' · '+esc(t('Default'))+' '+c[1]+esc(c[4])+'</span></section>').join(''):'<p>'+esc(t('This effect has no adjustable parameters.'))+'</p>';
  return `<section class="effect-guide" aria-labelledby="effect-guide-title"><div class="guide-intro"><div class="eyebrow">${esc(t('GET TO KNOW YOUR SOUND'))}</div><h2 id="effect-guide-title">${esc(names[e.id][index])}</h2><p>${esc(details[e.id][index])}</p></div><div class="guide-layout"><nav class="guide-toc" aria-label="${esc(t('Effect guide'))}">${['Understand the parameters','Find your starting point','What to listen for','Common question'].map((s,i)=>'<a href="#'+['parameters','starting-points','listen-for','effect-question'][i]+'">'+esc(t(s))+'</a>').join('')}</nav><div class="guide-content"><section id="parameters"><h2>${esc(t('Every parameter, explained'))}</h2><div class="parameter-guide">${params}</div></section><section id="starting-points"><h2>${esc(t('A good place to start'))}</h2><p>${esc(t('Start with the default settings, or try the sample before uploading your own recording. Adjust one control at a time, then apply and compare.'))}</p></section><section id="listen-for"><h2>${esc(t('What to listen for'))}</h2><p>${esc(t('Listen to both quiet and busy passages at a comfortable volume. Extreme settings may add artifacts or reduce clarity. Compare with the original before deciding.'))}</p></section><section id="effect-question"><h2>${esc(t('Can I revise and download the result?'))}</h2><p>${esc(t('Yes. In this single-effect studio, every revision starts from the original. Adjust, apply again and compare Original with Result. Download WAV saves the latest applied result; playback volume only changes listening volume.'))}</p></section></div></div></section>`;
}
function homepage(lang){
  const content=home[lang];
  return '<section class="home-editor-guide" aria-labelledby="audio-studio-guide"><div class="seo-guide-heading"><h2 id="audio-studio-guide">'+esc(content.guide)+'</h2><p>'+esc(content.lead)+'</p></div><article class="seo-guide-copy">'+content.sections.map(([title,text],i)=>'<section><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p>'+([1,2,3,4].includes(i)?'<p><a href="'+['','effects.html','effect-reverb.html','effect-slowed.html','effect-eightd.html'][i]+'">'+esc(dictionaries[lang].Explore)+'</a></p>':'')+'</section>').join('')+'</article></section><section class="home-faq" id="faq" aria-labelledby="faq-title"><div class="faq-heading"><h2 id="faq-title">'+esc(content.faqTitle)+'</h2><p>'+esc(content.lead)+'</p></div><div class="faq-list">'+content.faqs.map(([q,a],i)=>'<details class="faq-item" id="faq-'+(i+1)+'"><summary id="faq-question-'+(i+1)+'"><h3>'+esc(q)+'</h3><span class="faq-icon" aria-hidden="true"></span></summary><div class="faq-answer" role="region" aria-labelledby="faq-question-'+(i+1)+'"><div class="faq-answer-inner"><p>'+esc(a)+'</p></div></div></details>').join('')+'</div></section>';
}
function documentPage(lang,type){
  const doc=documents[lang],data=doc[type],t=s=>dictionaries[lang][s]||s;
  if(type==='contact'){
    let form=english['contact.html'].match(/<form id="contact-form"[\s\S]*?<\/form>/)[0];
    form=form.replace(/<p class="form-hint">[\s\S]*?<\/p>/g,'').replace('<button class="page-action"','<p class="form-hint">'+esc(data.hint)+' <a href="privacy.html">'+esc(t('Privacy policy'))+'</a></p><button class="page-action"');
    return '<div class="document-layout"><article class="document-card"><div class="document-callout"><strong>'+esc(data.heading)+'</strong><p>'+esc(data.text)+'</p></div>'+form+data.faqs.map(([q,a])=>'<details class="contact-faq"><summary>'+esc(q)+'</summary><p>'+esc(a)+'</p></details>').join('')+'</article></div>';
  }
  return '<div class="document-layout"><aside class="document-toc"><span class="eyebrow">'+esc(t('ON THIS PAGE'))+'</span>'+data.sections.map(([h],i)=>'<a href="#document-'+i+'">'+esc(h)+'</a>').join('')+'</aside><article class="document-card">'+(type==='about'?'':'<div class="document-meta">'+esc(doc.updated)+'</div>')+data.sections.map(([h,p],i)=>'<section class="document-section" id="document-'+i+'"><h2>'+esc(h)+'</h2><p>'+esc(p)+'</p></section>').join('')+'<section class="document-section"><a class="page-action" href="'+(type==='about'?'studio.html':'contact.html')+'">'+esc(t(type==='about'?'Studio':'Contact us'))+'</a>'+(type==='privacy'?'<p><a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">Formspree — '+esc(t('Privacy policy'))+'</a></p>':'')+'</section></article></div>';
}
function metadata(file,lang,index){
  if(lang==='en'&&!file.startsWith('effect-')){
    const source=english[file];return {title:file==='index.html'?'Audio Studio — Free Online Audio Editor | Sonic':file==='effects.html'?'Explore '+effects.length+' Audio Effects — Sonic':decode(source.match(/<title>([\s\S]*?)<\/title>/)[1]),description:decode(source.match(/<meta name="description" content="([^"]*)"/)[1])};
  }
  const t=s=>dictionaries[lang][s]||s;
  let title,description;
  if(file==='index.html'){title=t('Audio Studio — Free Online Audio Editor')+' | Sonic';description=home[lang].intro;}
  else if(file==='effects.html'){title=t('Explore 17 Audio Effects').replace('17',String(effects.length))+' — Sonic '+t('Online Audio Editor');description=home[lang].lead;}
  else if(file==='studio.html'){title=t('Combine Audio Effects Online')+' — Sonic';description=home[lang].sections[5][1].split(/[.!。]/)[0]+'.';}
  else if(file.startsWith('effect-')){const id=file.slice(7,-5);title=lang==='en'?search[id][0]+' — Free Online Tool | Sonic':names[id][index]+' — '+t('Online Audio Editor')+' | Sonic';description=lang==='en'?search[id][1]:details[id][index]+' '+t('Upload audio, adjust the effect, preview and download MP3 or WAV.');}
  else {const type=file.slice(0,-5);title=t({about:'About us',contact:'Contact us',privacy:'Privacy policy',terms:'Terms & conditions'}[type])+' — Sonic Audio Studio';description=documents[lang][type].intro;}
  return{title,description};
}
for(const lang of languages){
  const index=languages.indexOf(lang),t=s=>dictionaries[lang][s]||s;
  if(lang!=='en'){
    dictionaries[lang]['Effects run in order. Apply, then add another effect to build on your result. Completed effects are reused.']=t('Effects run in the order shown. Apply, then add another effect to build on your result. Completed effects are reused; changing an earlier effect updates it and the effects after it.');
    dictionaries[lang]['Select effects, adjust their settings, then click Apply effects. Revisions always start from your original.']=t('Choose an effect, adjust it, then apply. Choosing another effect replaces your selection. Revisions start from your original.');
  }
  const target=lang==='en'?dist:path.join(dist,lang);fs.mkdirSync(target,{recursive:true});
  const localizedEffects=Object.fromEntries(effects.map(e=>[e.id,{name:names[e.id][index],detail:details[e.id][index],short:details[e.id][index].split(/(?<=[.!。])\s/)[0]}]));
  if(lang!=='en')for(const effect of effects){
    dictionaries[lang][effect.name]=names[effect.id][index];
    dictionaries[lang][effect.detail]=details[effect.id][index];
    dictionaries[lang][effect.desc]=localizedEffects[effect.id].short;
    dictionaries[lang]['Explore '+effect.name]=t('Explore')+' '+names[effect.id][index];
    dictionaries[lang][effect.name+' settings']=names[effect.id][index]+' — '+t('Settings');
  }
  const units=lang==='ja'?['秒','半音']:lang==='ko'?['초','반음']:lang==='es'?['segundos','semitonos']:lang==='fr'?['secondes','demi-tons']:lang==='de'?['Sekunden','Halbtöne']:lang==='pt'?['segundos','semitons']:['secondi','semitoni'];
  for(const file of files){
    let html=english[file];
    if(file==='studio.html'||file.startsWith('effect-')){
      html=html.replace(/<div class="export-options">[\s\S]*?<\/div>/g,'');
      html=html.replace(/<p class="small">MP3 · [^<]*<\/p>/g,'');
      html=html.replace(/<div class="workflow-tools"[\s\S]*?(?=<button class="primary" id="apply")/g,'');
      html=html.replace('<button class="primary" id="apply"',"<div class=\"workflow-tools\" role=\"group\" aria-label=\"Edit history\"><button type=\"button\" id=\"undo-edit\" disabled>↶ Undo</button><button type=\"button\" id=\"redo-edit\" disabled>↷ Redo</button></div><section class=\"quick-preview\" id=\"quick-preview\" aria-labelledby=\"preview-title\"><h3 id=\"preview-title\">Quick preview</h3><div class=\"preview-fields\"><label for=\"preview-start\">Start time (seconds)<input id=\"preview-start\" type=\"number\" min=\"0\" max=\"0\" step=\"1\" value=\"0\" disabled></label><label for=\"preview-length\">Preview length<select id=\"preview-length\" disabled><option value=\"10\">10 seconds</option><option value=\"15\">15 seconds</option><option value=\"5\">5 seconds</option></select></label></div><div class=\"preview-actions\"><button type=\"button\" id=\"preview-run\" disabled>Preview effects</button><button type=\"button\" id=\"preview-cancel\" hidden>Cancel preview</button></div><progress id=\"preview-meter\" value=\"0\" max=\"100\" aria-label=\"Preview progress\" hidden></progress><p id=\"preview-status\" role=\"status\" aria-live=\"polite\">Preview a short section before processing the whole track.</p><p class=\"preview-hint\">Timing effects restart in the preview; tails and trimming can differ from the full track.</p><div class=\"comparison-players\" id=\"preview-players\" hidden><div><strong>Original section</strong><audio id=\"preview-original\" controls preload=\"none\" aria-label=\"Original preview section\"></audio></div><div><strong>With your effects</strong><audio id=\"preview-result\" controls preload=\"none\" aria-label=\"Processed preview section\"></audio></div></div></section>"+'<button class="primary" id="apply"');
      html=html.replace('<div class="workflow-tools"',"<div class=\"export-options\"><label class=\"export-quality-field\" for=\"export-quality\">MP3 quality<select id=\"export-quality\"><option value=\"128\">128 kbps</option><option value=\"192\" selected>192 kbps</option><option value=\"256\">256 kbps</option><option value=\"320\">320 kbps</option></select></label><label for=\"export-filename\">Download filename<input id=\"export-filename\" type=\"text\" maxlength=\"120\" autocomplete=\"off\" value=\"audio-sonic\"></label><p id=\"export-size\" class=\"small\" aria-live=\"polite\">Apply effects to see the download size.</p><p class=\"small\">MP3 is compressed; WAV preserves the processed samples at 16-bit resolution.</p></div>"+'<div class="workflow-tools"');
      html=html.replace(/<section class="sound-example"[\s\S]*?(?=<section class="effect-guide")/g,'');
      if(file.startsWith('effect-'))html=html.replace('<section class="effect-guide"',"<section class=\"sound-example\" id=\"sound-example\" aria-labelledby=\"example-heading\"><h2 id=\"example-heading\">Hear the difference</h2><p>Try a before-and-after example using our original six-second sample. No upload needed.</p><p id=\"example-settings\" class=\"example-settings\"></p><div class=\"example-actions\"><button type=\"button\" id=\"example-generate\">Create audio example</button></div><progress id=\"example-meter\" value=\"0\" max=\"100\" aria-label=\"Example progress\" hidden></progress><p id=\"example-status\" class=\"example-status\" role=\"status\" aria-live=\"polite\">Generated locally with the same audio engine used for your files.</p><div class=\"comparison-players\" id=\"example-players\" hidden><div><strong>Before · Original sample</strong><audio id=\"example-before\" controls preload=\"none\" aria-label=\"Before effect example\"></audio></div><div><strong>After · Effect applied</strong><audio id=\"example-after\" controls preload=\"none\" aria-label=\"After effect example\"></audio></div></div></section>"+'<section class="effect-guide"');
      if(file.startsWith('effect-')){html=html.replace(/<a class="example-jump"[^>]*>[\s\S]*?<\/a>/g,'');html=html.replace(/(<div class="title-row"><div>[\s\S]*?<\/p>)/,'$1<a class="example-jump" href="#sound-example">Hear an example</a>');}
      html=html.replace(/<script src="\/(?:history|workflow|examples)\.js[^"]*"><\/script>/g,'').replace(/<link rel="stylesheet" href="\/workflow\.css[^"]*">/g,'');
      html=html.replace('</head>','<link rel="stylesheet" href="/workflow.css?v=46"></head>').replace('</body>','<script src="/history.js?v=46"></script><script src="/workflow.js?v=46"></script>'+(file.startsWith('effect-')?'<script src="/examples.js?v=46"></script>':'')+'</body>');
    }

    if(lang!=='en'){
      if(file==='index.html'){
        html=html.replace(/(<div class="hero-copy">[\s\S]*?<\/h1><p>)[\s\S]*?(<\/p>)/,(_,a,b)=>a+esc(home[lang].intro)+b);
        html=html.replace(/<section class="home-editor-guide"[\s\S]*?(?=<footer)/,homepage(lang));
      }else if(file.startsWith('effect-')){
        const effect=effects.find(e=>e.id===file.slice(7,-5));
        html=html.replace(/<section class="effect-guide"[\s\S]*?(?=<footer)/,guide(lang,effect,index));
      }else if(['about.html','privacy.html','terms.html','contact.html'].includes(file)){
        const type=file.slice(0,-5);
        html=html.replace(/(<div class="page-intro">[\s\S]*?<\/h1><p>)[\s\S]*?(<\/p>)/,(_,a,b)=>a+esc(documents[lang][type].intro)+b);
        html=html.replace(/<div class="document-layout"[\s\S]*?(?=<footer)/,documentPage(lang,type));
      }
      html=translateHTML(html,lang).replace(/<html lang="en"/,'<html lang="'+lang+'"');
      html=html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g,'');
      const meta=metadata(file,lang,index);
      html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(meta.title)+'</title>');
      html=html.replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*"/g,(_,prefix)=>prefix+esc(meta.description)+'"');
      html=html.replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"/g,(_,prefix)=>prefix+esc(meta.title)+'"');
      html=html.replace(/(<link rel="canonical" href=")[^"]*"/,(_,a)=>a+origin+route(lang,file)+'"').replace(/(<meta property="og:url" content=")[^"]*"/,(_,a)=>a+origin+route(lang,file)+'"').replace(/(<meta property="og:locale" content=")[^"]*"/,(_,a)=>a+ogLocales[index]+'"');
      const url=origin+route(lang,file),graph=[{'@type':'WebPage','@id':url+'#webpage',url,name:meta.title,description:meta.description,inLanguage:lang,isPartOf:{'@id':origin+'/'+lang+'/#website'}}];
      if(file==='index.html')graph.push({'@type':'WebSite','@id':url+'#website',url,name:'Sonic Audio Studio',inLanguage:lang},{'@type':'SoftwareApplication',name:'Sonic Audio Studio',url,applicationCategory:'MultimediaApplication',operatingSystem:'Web browser',inLanguage:lang,description:meta.description,isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},featureList:effects.map(e=>names[e.id][index])});
      html=html.replace('</head>','<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')+'</script>'+(file==='index.html'?'<script type="application/ld+json" id="faq-schema">'+JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',inLanguage:lang,mainEntity:home[lang].faqs.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))}).replace(/</g,'\\u003c')+'</script>':'')+'</head>');
      // These unit labels are presentation-only and do not change numeric DSP values.
      html=html.replace(/ seconds/g,' '+units[0]).replace(/ semitones/g,' '+units[1]);
    }

    // Normalize every language, including English, through the same page metadata.
    const pageMeta=metadata(file,lang,index),pageUrl=origin+route(lang,file),siteUrl=origin+route(lang,'index.html');
    html=html.replace(/<title>[\s\S]*?<\/title>/,'<title>'+esc(pageMeta.title)+'</title>');
    html=html.replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*"/g,(_,prefix)=>prefix+esc(pageMeta.description)+'"');
    html=html.replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"/g,(_,prefix)=>prefix+esc(pageMeta.title)+'"');
    html=html.replace(/(<link rel="canonical" href=")[^"]*"/,(_,prefix)=>prefix+pageUrl+'"').replace(/(<meta property="og:url" content=")[^"]*"/,(_,prefix)=>prefix+pageUrl+'"');
    const effect=file.startsWith('effect-')?effects.find(e=>file==='effect-'+e.id+'.html'):null;
    if(effect)html=html.replace(/<h1>[\s\S]*?<\/h1>/,'<h1>'+esc(lang==='en'?search[effect.id][0]:names[effect.id][index])+'</h1>');
    html=html.replace(/<script type="application\/ld\+json"(?![^>]*id="faq-schema")[^>]*>[\s\S]*?<\/script>/g,'');
    const pageGraph=[{'@type':'WebPage','@id':pageUrl+'#webpage',url:pageUrl,name:pageMeta.title,description:pageMeta.description,inLanguage:lang,isPartOf:{'@id':siteUrl+'#website'}}];
    if(file==='index.html')pageGraph.push({'@type':'WebSite','@id':siteUrl+'#website',url:siteUrl,name:'Sonic Audio Studio',inLanguage:lang});
    if(effect||file==='index.html'){
      const app={'@type':'WebApplication','@id':pageUrl+'#tool',name:effect?(lang==='en'?search[effect.id][0]:names[effect.id][index]):'Sonic Audio Studio',url:pageUrl,description:pageMeta.description,applicationCategory:'MultimediaApplication',operatingSystem:'Web browser',inLanguage:lang,isAccessibleForFree:true,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'},featureList:effect?[names[effect.id][index]]:effects.map(e=>names[e.id][index])};
      pageGraph[0].mainEntity={'@id':app['@id']};pageGraph.push(app);
    }
    html=html.replace('</head>','<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@graph':pageGraph}).replace(/</g,'\\u003c')+'</script></head>');
    html=html.replace(/\?v=(?:30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45)(?=")/g,'?v=46');
    html=html.replace(/(src|href)="((?:vendor\/)?[a-z][a-z0-9.-]*\.(?:js|css)(?:\?[^" ]*)?)"/gi,(_,a,p)=>a+'="/'+p.replace(/\?v=\d+$/,'?v=46')+'"');
    const alternates=languages.map(l=>'<link rel="alternate" hreflang="'+l+'" href="'+origin+route(l,file)+'">').join('\n')+'\n<link rel="alternate" hreflang="x-default" href="'+origin+route('en',file)+'">';
    const extra='<!-- i18n-head --><link rel="stylesheet" href="/confirm.css?v=46"><script defer src="/confirm.js?v=46"></script><link rel="stylesheet" href="/activity.css?v=46"><script defer src="/activity.js?v=46"></script>'+alternates+languages.filter(l=>l!==lang).map(l=>'<meta property="og:locale:alternate" content="'+ogLocales[languages.indexOf(l)]+'">').join('')+'<link rel="stylesheet" href="/i18n.css?v=46">'+(lang==='en'?'':'<script src="/i18n/'+lang+'.js?v=46"></script>')+'<script src="/i18n.js?v=46"></script><!-- /i18n-head -->';
    html=html.replace('</head>',extra+'</head>').replace('</header>',menu(lang,file)+'</header>');
    if(file==='studio.html'||file.startsWith('effect-')){html=html.replace(/<script src="\/mobile-studio\.js[^"]*"><\/script>/g,'');html=html.replace('</body>','<script src="/mobile-studio.js?v=46"></script></body>');}
    html=html.replace(/<link rel="stylesheet" href="\/dropdowns\.css[^"]*">/g,'');
    html=html.replace(/(app\.js|style\.css)\?v=\d+/g,'$1?v=47');
    html=html.replace(/<script\b[^>]*src=["'][^"']*pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/gi,'');
    html=html.replace('</head>','<link rel="stylesheet" href="/dropdowns.css?v=46">'+analyticsTag+adsenseTag+'</head>');
    fs.writeFileSync(path.join(target,file),html);
  }
  if(lang!=='en'){
    const data={dictionary:dictionaries[lang],effects:localizedEffects,units};
    fs.mkdirSync(path.join(dist,'i18n'),{recursive:true});fs.writeFileSync(path.join(dist,'i18n',lang+'.js'),'window.SonicI18nData='+JSON.stringify(data).replace(/</g,'\\u003c')+';\n');
  }
}
const urls=languages.flatMap(lang=>files.map(file=>origin+route(lang,file)));
fs.writeFileSync(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(url=>'<url><loc>'+esc(url)+'</loc></url>').join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
console.log('Built '+urls.length+' pages in '+languages.length+' languages with reciprocal hreflang and localized metadata.');

require('./build-errors.cjs')(dist);

// Copy public assets to the site root for deployment.
const publicDir=path.join(root,'public');
if(fs.existsSync(publicDir))fs.cpSync(publicDir,dist,{recursive:true});
