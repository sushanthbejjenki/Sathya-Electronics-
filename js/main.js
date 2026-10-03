var files=[],inp=document.getElementById('ph'),pv=document.getElementById('pv'),st=document.getElementById('st');
inp.addEventListener('change',function(){
var jobs=[];
Array.prototype.slice.call(inp.files).forEach(function(f){
if(files.length+jobs.length>=5)return;
if(f.type.indexOf('image/')!==0||f.size>=15*1048576)return;
jobs.push(f.arrayBuffer().then(function(buf){
return new File([buf],f.name||'tv-photo.jpg',{type:f.type});
}).catch(function(){return null;}));
});
Promise.all(jobs).then(function(res){
var bad=false;
res.forEach(function(x){if(x){if(files.length<5)files.push(x);}else{bad=true;}});
inp.value='';
st.textContent=bad?'One photo could not be read. Please choose it again.':'';
draw();
});
});
function draw(){
pv.innerHTML='';
files.forEach(function(f,i){
var d=document.createElement('div');d.className='th';
var im=document.createElement('img');im.src=URL.createObjectURL(f);im.alt='TV photo '+(i+1);
im.onload=function(){URL.revokeObjectURL(im.src)};
var b=document.createElement('button');b.type='button';b.textContent='\u00d7';b.setAttribute('aria-label','Remove photo '+(i+1));
b.onclick=function(){files.splice(i,1);draw()};
d.appendChild(im);d.appendChild(b);pv.appendChild(d);
});
}
document.getElementById('f').addEventListener('submit',function(e){
e.preventDefault();
var n=files.length;
var t='Hello Sathya Electronics, I am '+document.getElementById('n').value+'. I need: '+document.getElementById('t').value+'. '+document.getElementById('m').value;
if(n)t+=' I will send '+n+' photo(s) of my TV here.';
var wa='https://wa.me/919177638337?text='+encodeURIComponent(t);
var mobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
function link(msg){
st.textContent='';
st.appendChild(document.createTextNode(msg+' '));
var a=document.createElement('a');a.href=wa;a.target='_blank';a.rel='noopener';a.textContent='Tap here to open the chat.';
st.appendChild(a);
}
function chat(){
window.open(wa,'_blank');
link(n?'WhatsApp should open with your message. In the chat, tap the attach (paperclip) button and add your '+n+' photo(s). If it did not open,':'WhatsApp should open with your message. If it did not open,');
}
if(n&&mobile&&navigator.canShare&&navigator.canShare({files:files})){
navigator.share({files:files,text:t}).then(function(){
link('In the share list, choose WhatsApp and then the Sathya Electronics chat. If that did not work,');
}).catch(function(err){
if(err&&err.name==='AbortError'){link('Sharing was cancelled. To send your message without photos,');}else{chat();}
});
}else{chat();}
});
