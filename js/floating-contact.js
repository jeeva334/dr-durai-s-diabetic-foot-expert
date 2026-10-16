
(function(){const b=document.getElementById('fcall'),p=document.getElementById('fpop'),d=document.getElementById('fbd'),f=document.getElementById('fab');
function set(o){b.setAttribute('aria-expanded',o);f.classList.toggle('open',o);p.hidden=!o;d.hidden=!o;if(o){const a=p.querySelector('a');a&&a.focus({preventScroll:true})}}
b.addEventListener('click',function(){set(b.getAttribute('aria-expanded')!=='true')});
d.addEventListener('click',function(){set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!p.hidden){set(false);b.focus()}});
p.addEventListener('click',function(e){if(e.target.closest('a'))setTimeout(function(){set(false)},150)});
})();
