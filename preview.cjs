const http=require('http'),fs=require('fs'),path=require('path');
const languages=['es','ja','fr','de','pt','ko','it'],codes=new Set([400,403,404,500,502,503]);
function createServer({fileSystem=fs,root=path.join(__dirname,'dist')}={}){
 const error=(req,res,status,name='')=>{
  const lang=name.split('/')[1],folder=languages.includes(lang)?lang:'';
  const finish=data=>{res.writeHead(status,{'Content-Type':'text/html; charset=utf-8','X-Robots-Tag':'noindex, follow','X-Content-Type-Options':'nosniff',...(status===503?{'Retry-After':'60'}:{})});res.end(req.method==='HEAD'?undefined:data);};
  fileSystem.readFile(path.join(root,folder,status+'.html'),(err,data)=>{
   if(!err)return finish(data);
   fileSystem.readFile(path.join(root,status+'.html'),(fallback,body)=>finish(fallback?'<!doctype html><html lang="en"><title>'+status+' | Sonic</title><h1>'+status+'</h1><p>Please try again later.</p><a href="/">Home</a></html>':body));
  });
 };
 return http.createServer((req,res)=>{
  let name;
  try{name=decodeURIComponent(req.url.split('?')[0]);if(name.includes('\0'))throw Error('Invalid path');}catch{return error(req,res,400);}
  const explicit=name.match(/\/(400|403|404|500|502|503)\.html$/);if(explicit)return error(req,res,Number(explicit[1]),name);
  let file=path.resolve(root,'.'+name);
  if(file!==root&&!file.startsWith(root+path.sep))return error(req,res,403,name);
  fileSystem.stat(file,(statError,stat)=>{
   if(statError&&!['ENOENT','ENOTDIR'].includes(statError.code))return error(req,res,500,name);
   if(!statError&&stat.isDirectory()){
    if(!name.endsWith('/')){res.writeHead(301,{Location:name+'/'+(req.url.includes('?')?'?'+req.url.split('?')[1]:'')});return res.end();}
    file=path.join(file,'index.html');
   }
   fileSystem.readFile(file,(err,data)=>{
    if(err)return error(req,res,['ENOENT','ENOTDIR'].includes(err.code)?404:500,name);
    res.setHeader('Content-Type',({'.css':'text/css','.js':'text/javascript','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json'})[path.extname(file)]||'text/html; charset=utf-8');
    res.end(req.method==='HEAD'?undefined:data);
   });
  });
 });
}
module.exports={createServer};
if(require.main===module)createServer().listen(Number(process.env.PORT)||4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+(Number(process.env.PORT)||4173)));
