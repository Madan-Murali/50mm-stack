(function(){
var D=window.KP,cats=D.cats,cur=null,view='grid',lbList=[],lbI=0,name='';
var $=function(s){return document.querySelector(s)};
$('#yr').textContent=new Date().getFullYear();
var reel=$('#reel');
D.hero.concat(D.hero).forEach(function(h){var i=new Image();i.src=h.f;i.alt='';i.decoding='async';reel.appendChild(i)});
var tabs=$('#tabs');
cats.forEach(function(c){var b=document.createElement('button');b.dataset.c=c.slug;b.setAttribute('role','tab');b.innerHTML=c.name+'<sup>'+c.items.length+'</sup>';b.onclick=function(){show(c.slug,true)};tabs.appendChild(b)});
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1),t=id==='top'?document.body:document.getElementById(id);if(!t)return;e.preventDefault();if(id==='top')scrollTo({top:0,behavior:'smooth'});else t.scrollIntoView({behavior:'smooth'})})});
document.querySelectorAll('#views button').forEach(function(b){b.onclick=function(){view=b.dataset.v;document.querySelectorAll('#views button').forEach(function(x){x.classList.toggle('on',x===b)});render()}});
function show(slug,keep){
  cur=slug;
  document.querySelectorAll('#tabs button').forEach(function(b){var on=b.dataset.c===slug;b.classList.toggle('on',on);if(on&&tabs.scrollWidth>tabs.clientWidth)tabs.scrollTo({left:Math.max(0,b.offsetLeft-tabs.clientWidth/2+b.offsetWidth/2),behavior:'smooth'})});
  render();
  try{history.replaceState(null,'','#'+slug)}catch(e){}
  if(keep){var w=$('#work');if(w.getBoundingClientRect().top<-10)w.scrollIntoView()}
}
function fig(c,it,i){var f=document.createElement('figure');f.innerHTML='<img src="'+it.t+'" width="'+it.w+'" height="'+it.h+'" loading="lazy" alt="'+c.name+' photograph '+(i+1)+'">';f.onclick=function(){openLb(c,i)};return f}
function render(){
  var c=cats.filter(function(x){return x.slug===cur})[0],s=$('#stage');
  s.style.animation='none';void s.offsetWidth;s.style.animation='';
  s.innerHTML='';
  var wrap=document.createElement('div');
  if(view==='grid'){
    wrap.className='grid';
    var n=ncols(),cols=[],hs=[];
    for(var k=0;k<n;k++){var d=document.createElement('div');d.className='col';cols.push(d);hs.push(0);wrap.appendChild(d)}
    c.items.forEach(function(it,i){var k=hs.indexOf(Math.min.apply(null,hs));cols[k].appendChild(fig(c,it,i));hs[k]+=it.h/it.w+.03});
  }else{
    wrap.className='slider';
    var t=document.createElement('div');t.className='track';
    c.items.forEach(function(it,i){t.appendChild(fig(c,it,i))});
    var a=document.createElement('div');a.className='arrows';
    a.innerHTML='<button aria-label="Previous">&lsaquo;</button><button aria-label="Next">&rsaquo;</button>';
    var step=function(d){t.scrollBy({left:d*t.clientWidth*.7,behavior:'smooth'})};
    a.children[0].onclick=function(){step(-1)};a.children[1].onclick=function(){step(1)};
    wrap.appendChild(t);wrap.appendChild(a);
  }
  s.appendChild(wrap);
}
function ncols(){return innerWidth<=700?2:innerWidth<=1100?3:3}
var lastN=ncols();addEventListener('resize',function(){var n=ncols();if(n!==lastN&&view==='grid'){lastN=n;render()}});
var lb=$('#lb'),li=$('#lb-img'),lc=$('#lb-c');
function openLb(c,i){lbList=c.items;name=c.name;lbI=i;lb.hidden=false;document.body.style.overflow='hidden';setLb()}
function setLb(){var it=lbList[lbI];li.src=it.f;li.alt=name+' photograph '+(lbI+1);lc.textContent=name+'  ·  '+(lbI+1)+' / '+lbList.length;
  [lbList[(lbI+1)%lbList.length],lbList[(lbI-1+lbList.length)%lbList.length]].forEach(function(n){new Image().src=n.f})}
function go(d){lbI=(lbI+d+lbList.length)%lbList.length;setLb()}
function closeLb(){lb.hidden=true;document.body.style.overflow=''}
$('.lb-x').onclick=closeLb;$('.lb-p').onclick=function(e){e.stopPropagation();go(-1)};$('.lb-n').onclick=function(e){e.stopPropagation();go(1)};
lb.onclick=function(e){if(e.target===lb)closeLb()};
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')closeLb();if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)});
var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)go(d<0?1:-1)});
var tp=$('#top'),mb=$('#menu-btn');
function menu(o){tp.classList.toggle('open',o);mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'}
mb.onclick=function(e){e.stopPropagation();menu(!tp.classList.contains('open'))};
document.querySelectorAll('#nav a').forEach(function(a){a.addEventListener('click',function(){menu(false)})});
document.addEventListener('click',function(e){if(tp.classList.contains('open')&&!tp.contains(e.target))menu(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&tp.classList.contains('open'))menu(false)});
addEventListener('scroll',function(){tp.classList.toggle('solid',scrollY>60)},{passive:true});
var h=location.hash.slice(1);
show(cats.some(function(c){return c.slug===h})?h:cats[0].slug,false);
})();
