const oldOrigin='https://sonic-audio-studio.atharva23.chatgpt.site';
const locales=new Set(['es','ja','fr','de','pt','ko','it']);
async function normalize(response,request,env,status){
 const headers=new Headers(response.headers),type=headers.get('content-type')||'';
 if(status){headers.set('X-Robots-Tag','noindex, follow');if(status===503)headers.set('Retry-After','60');}
 if(type.includes('text/html')||new URL(request.url).pathname.match(/\/(sitemap\.xml|robots\.txt)$/)){
  const origin=env.SITE_ORIGIN||new URL(request.url).origin;
  const text=(await response.text()).replaceAll(oldOrigin,origin);
  for(const name of ['content-length','content-encoding','etag'])headers.delete(name);
  headers.set('Cache-Control','public, max-age=0, must-revalidate');
  return new Response(request.method==='HEAD'?null:text,{status:status||response.status,headers});
 }
 return new Response(request.method==='HEAD'?null:response.body,{status:status||response.status,headers});
}
async function errorPage(request,env,code){
 const url=new URL(request.url),segment=url.pathname.split('/')[1],prefix=locales.has(segment)?'/'+segment:'';
 url.pathname=prefix+'/'+code+'.html';url.search='';
 const response=await env.ASSETS.fetch(new Request(url,{method:'GET'}));
 return normalize(response,request,env,code);
}
export default {
 async fetch(request,env){
  try{
   const url=new URL(request.url);
   if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
   try{if(decodeURIComponent(url.pathname).includes('\0'))return errorPage(request,env,400);}catch{return errorPage(request,env,400);}
   const explicit=url.pathname.match(/\/(400|403|404|500|502|503)\.html$/);if(explicit)return errorPage(request,env,Number(explicit[1]));
   if(/^\/(?:es|ja|fr|de|pt|ko|it)$/.test(url.pathname)){url.pathname+='/';return Response.redirect(url,301);}
   if(/^\/(?:es\/|ja\/|fr\/|de\/|pt\/|ko\/|it\/)?index\.html$/.test(url.pathname)){url.pathname=url.pathname.slice(0,-10);return Response.redirect(url,301);}
   const assetUrl=new URL(url);if(url.pathname==='/'||/^\/(?:es|ja|fr|de|pt|ko|it)\/$/.test(url.pathname))assetUrl.pathname+='index.html';
   const response=await env.ASSETS.fetch(new Request(assetUrl,request));
   if(response.status===404)return errorPage(request,env,404);
   if(response.status>=500)return errorPage(request,env,503);
   return normalize(response,request,env);
  }catch{
   try{return await errorPage(request,env,500);}catch{return new Response('The studio is temporarily unavailable. Please try again later.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','Retry-After':'60','X-Robots-Tag':'noindex'}});}
  }
 }
};
