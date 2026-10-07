var files=[],urls=[],last='',MAX=5;
var inp=document.getElementById('ph'),pv=document.getElementById('pv'),st=document.getElementById('st'),sh=document.getElementById('sh');
function isVid(f){return f.type.indexOf('video/')===0;}
function isImg(f){return f.type.indexOf('image/')===0;}
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
sh.hidden=true;
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
b.onclick=function(){files.splice(i,1);sh.hidden=true;draw();};
d.appendChild(b);pv.appendChild(d);
});
}
function canShareFiles(){
var mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
return mobile&&files.length>0&&navigator.canShare&&navigator.canShare({files:files});
}
document.getElementById('f').addEventListener('submit',function(e){
e.preventDefault();
var n=files.length,v=files.filter(isVid).length,p=n-v,what=[];
if(p)what.push(p+' photo'+(p>1?'s':''));
if(v)what.push(v+' video'+(v>1?'s':''));
var t='Hello Sathya Electronics, I am '+document.getElementById('n').value+'. I need: '+document.getElementById('t').value+'. '+document.getElementById('m').value;
if(n)t+=' I will send '+what.join(' and ')+' of my TV here.';
last=t;
var wa='https://wa.me/919177638337?text='+encodeURIComponent(t);
var w=window.open(wa,'_blank');
if(!w){window.location.href=wa;return;}
st.textContent='';
st.appendChild(document.createTextNode((n?'WhatsApp should open with your message. In the chat, tap the paperclip and add your '+what.join(' and ')+'. ':'WhatsApp should open with your message. ')+'If it did not open, '));
var a=document.createElement('a');a.href=wa;a.target='_blank';a.rel='noopener';a.textContent='tap here to open the chat.';
st.appendChild(a);
sh.hidden=!canShareFiles();
});
sh.addEventListener('click',function(){
navigator.share({files:files,text:last}).catch(function(err){
if(!err||err.name!=='AbortError'){st.textContent='Sharing is not available here. Please add the files from the paperclip in the WhatsApp chat.';}
});
});
