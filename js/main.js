/* ---- Photo and video upload settings (see README) ----
   Create a free Cloudinary account, add an UNSIGNED upload preset, then fill these two lines.
   While they are empty, the form only sends the text message (and offers phone sharing). */
var CLOUD_NAME='eibdrxfm';
var UPLOAD_PRESET='sathya_uploads';
/* ------------------------------------------------------- */
var UP=!!(CLOUD_NAME&&UPLOAD_PRESET);
var files=[],urls=[],last='',MAX=5;
var form=document.getElementById('f'),inp=document.getElementById('ph'),pv=document.getElementById('pv'),st=document.getElementById('st'),sh=document.getElementById('sh'),hint=document.querySelector('.hint');
if(UP&&hint){hint.textContent='Your photos and videos are uploaded and their links are added to the WhatsApp message.';}
function isVid(f){return f.type.indexOf('video/')===0;}
function isImg(f){return f.type.indexOf('image/')===0;}
function canShareFiles(){
var mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
return mobile&&files.length>0&&!!navigator.canShare&&navigator.canShare({files:files});
}
function refreshShare(){sh.hidden=UP||!canShareFiles();}
inp.addEventListener('change',function(){
var jobs=[],skipped=false;
Array.prototype.slice.call(inp.files).forEach(function(f){
if(files.length+jobs.length>=MAX){skipped=true;return;}
var ok=(isImg(f)&&f.size<15*1048576)||(isVid(f)&&f.size<30*1048576);
if(!ok){skipped=true;return;}
jobs.push(f.arrayBuffer().then(function(b){return new File([b],f.name||'tv-file',{type:f.type});}).catch(function(){return null;}));
});
Promise.all(jobs).then(function(res){
var bad=false;
res.forEach(function(x){if(x){if(files.length<MAX)files.push(x);}else{bad=true;}});
inp.value='';
st.textContent=bad?'One file could not be read. Please choose it again.':(skipped?'You can add up to 5 files. Photos must be under 15 MB and videos under 30 MB.':'');
draw();
});
});
function draw(){
urls.forEach(function(u){URL.revokeObjectURL(u);});urls=[];
pv.innerHTML='';
files.forEach(function(f,i){
var d=document.createElement('div');d.className='th';
var u=URL.createObjectURL(f);urls.push(u);
var m;
if(isVid(f)){
m=document.createElement('video');m.src=u+'#t=0.1';m.muted=true;m.preload='metadata';m.setAttribute('playsinline','');
d.appendChild(m);
var tag=document.createElement('i');tag.textContent='Video';d.appendChild(tag);
}else{
m=document.createElement('img');m.src=u;m.alt='TV photo '+(i+1);d.appendChild(m);
}
var b=document.createElement('button');b.type='button';b.textContent='\u00d7';b.setAttribute('aria-label','Remove file '+(i+1));
b.onclick=function(){files.splice(i,1);draw();};
d.appendChild(b);pv.appendChild(d);
});
refreshShare();
}
function shrink(f){
if(!isImg(f)||!window.createImageBitmap)return Promise.resolve(f);
return createImageBitmap(f).then(function(bm){
var s=Math.min(1,1600/Math.max(bm.width,bm.height));
var c=document.createElement('canvas');c.width=Math.round(bm.width*s);c.height=Math.round(bm.height*s);
c.getContext('2d').drawImage(bm,0,0,c.width,c.height);
return new Promise(function(res){c.toBlob(function(b){res(b||f);},'image/jpeg',0.82);});
}).catch(function(){return f;});
}
function upload(f){
return shrink(f).then(function(b){
var fd=new FormData();fd.append('file',b,f.name);fd.append('upload_preset',UPLOAD_PRESET);
return fetch('https://api.cloudinary.com/v1_1/'+CLOUD_NAME+'/auto/upload',{method:'POST',body:fd});
}).then(function(r){return r.json().then(function(j){
if(!r.ok||!j.secure_url)throw new Error((j&&j.error&&j.error.message)||('Upload failed ('+r.status+')'));
return j.secure_url;});});
}
function note(msg,wa){
st.textContent='';
st.appendChild(document.createTextNode(msg+' '));
var a=document.createElement('a');a.href=wa;a.target='_blank';a.rel='noopener';a.textContent='Tap here to open the chat.';
st.appendChild(a);
}
function describe(){
var v=files.filter(isVid).length,p=files.length-v,w=[];
if(p)w.push(p+' photo'+(p>1?'s':''));
if(v)w.push(v+' video'+(v>1?'s':''));
return w.join(' and ');
}
form.addEventListener('submit',function(e){
e.preventDefault();
var n=files.length,what=describe();
var base='Hello Sathya Electronics, I am '+document.getElementById('n').value+'. I need: '+document.getElementById('t').value+'. '+document.getElementById('m').value;
var btn=form.querySelector('button[type=submit]');
if(n&&UP){
btn.disabled=true;
st.textContent='Uploading your '+what+'. Please wait...';
Promise.all(files.map(upload)).then(function(links){
var t=base+'\n\nMy TV '+what+':\n'+links.join('\n');
var wa='https://wa.me/919177638337?text='+encodeURIComponent(t);
note('Uploaded. Opening WhatsApp.',wa);
window.location.href=wa;
}).catch(function(err){
var t=base+' I could not upload my '+what+'. I will send them here.';
var wa='https://wa.me/919177638337?text='+encodeURIComponent(t);
last=t;
note('Upload problem: '+((err&&err.message)||'unknown')+'. WhatsApp will open with the message only. Add the files with the paperclip in the chat.',wa);
setTimeout(function(){window.location.href=wa;},4000);
}).then(function(){btn.disabled=false;});
return;
}
var t=base+(n?' I will send '+what+' of my TV here.':'');
last=t;
var wa='https://wa.me/919177638337?text='+encodeURIComponent(t);
var w=window.open(wa,'_blank');
if(!w){window.location.href=wa;return;}
note((n?'WhatsApp should open with your message. In the chat, tap the paperclip and add your '+what+'. ':'WhatsApp should open with your message. ')+'If it did not open,',wa);
refreshShare();
});
sh.addEventListener('click',function(){
navigator.share({files:files,text:last||'Photos and videos of my TV'}).catch(function(err){
if(!err||err.name!=='AbortError'){st.textContent='Sharing is not available here. Please add the files from the paperclip in the WhatsApp chat.';}
});
});
