var files=[],inp=document.getElementById('ph'),pv=document.getElementById('pv'),st=document.getElementById('st');
inp.addEventListener('change',function(){
for(var i=0;i<inp.files.length&&files.length<5;i++){var f=inp.files[i];if(f.type.indexOf('image/')===0&&f.size<15*1048576)files.push(f);}
inp.value='';draw();
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
var t='Hello Sathya Electronics, I am '+document.getElementById('n').value+'. I need: '+document.getElementById('t').value+'. '+document.getElementById('m').value;
if(files.length)t+=' I have '+files.length+' photo(s) of my TV.';
function fallback(){
window.open('https://wa.me/919177638337?text='+encodeURIComponent(t),'_blank');
st.textContent=files.length?'WhatsApp should open with your message. Tap the attach button in the chat and add your photos.':'';
}
if(files.length&&navigator.canShare&&navigator.canShare({files:files})){
navigator.share({files:files,text:t}).then(function(){
st.textContent='In the share list, choose WhatsApp, then the chat with Sathya Electronics (91776 38337).';
}).catch(function(err){if(!err||err.name!=='AbortError')fallback();});
}else{fallback();}
});
