
const $=s=>document.querySelector(s),ov=$('#ov'),mn=$('#main'),R='இந்த புலம் அவசியம்.';
const REQ='This field is required.',PH='Please enter a valid contact number.';
function open_(){ov.classList.add('on');ov.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';document.documentElement.style.overflow='hidden';mn.inert=true;$('header').inert=true;$('footer').inert=true;setTimeout(()=>$('#nm').focus(),50)}
function close_(){ov.classList.remove('on');ov.setAttribute('aria-hidden','true');document.body.style.overflow='';document.documentElement.style.overflow='';mn.inert=false;$('header').inert=false;$('footer').inert=false;try{sessionStorage.setItem('bk','1')}catch(e){}}
document.querySelectorAll('[data-open]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();$('#fw').style.display='';$('#ok').style.display='none';$('#nv').classList.remove('on');open_()}));
['#cl','#ca','#ok2'].forEach(s=>$(s).addEventListener('click',close_));
ov.addEventListener('mousedown',e=>{if(e.target===ov)close_()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ov.classList.contains('on'))close_()});
function setE(el,m){el.closest('.f').querySelector('.err').textContent=m||'';return !m}
$('#fm').addEventListener('submit',e=>{e.preventDefault();let ok=true;
 ok&=setE($('#nm'),$('#nm').value.trim()?'':REQ);
 const p=$('#ph').value.replace(/[\s-]/g,'').replace(/^(\+91|91|0)(?=\d{10}$)/,'');
 ok&=setE($('#ph'),!$('#ph').value.trim()?REQ:(/^[6-9]\d{9}$/.test(p)?'':PH));
 ok&=setE($('#gn'),document.querySelector('input[name=g]:checked')?'':REQ);
 ok&=setE($('#md'),$('#md').value?'':REQ);ok&=setE($('#tm'),$('#tm').value?'':REQ);
 ok&=setE($('#cn'),$('#cn').checked?'':REQ);
 if(ok){$('#fw').style.display='none';$('#ok').style.display='block';$('#fm').reset()}});
(function(){const hd=document.querySelector('header'),pg=document.createElement('div');pg.id='pg';hd.appendChild(pg);
function sc(){const y=scrollY,m=document.documentElement.scrollHeight-innerHeight;hd.classList.toggle('sc',y>10);pg.style.transform='scaleX('+(m>0?y/m:0)+')'}addEventListener('scroll',sc,{passive:true});sc();
const G=[['.hl>div','z'],['.cap','z'],['.st',''],['.about .pic','l'],['.about>div:last-child>*','r'],['#faq h2','' ],['details',''],['.ft>div',''],['.steps','']];
G.forEach(([s,c])=>document.querySelectorAll(s).forEach((e,i)=>{e.classList.add('rv');if(c)e.classList.add(c);if(s!=='.steps')e.style.setProperty('--d',(i*.12)+'s')}));
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});document.querySelectorAll('.rv').forEach(e=>io.observe(e))}else document.querySelectorAll('.rv').forEach(e=>e.classList.add('in'))})();
(function(){const nv=$('#nv'),bg=$('#bg');const sync=()=>{const o=nv.classList.contains('on');bg.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);bg.setAttribute('aria-label',o?'மெனுவை மூடு':'மெனு')};new MutationObserver(sync).observe(nv,{attributes:true,attributeFilter:['class']});
bg.addEventListener('click',e=>{e.stopPropagation();nv.classList.toggle('on')});
nv.querySelectorAll('a:not(.btn)').forEach(a=>a.addEventListener('click',()=>nv.classList.remove('on')));
document.addEventListener('click',e=>{if(nv.classList.contains('on')&&!nv.contains(e.target))nv.classList.remove('on')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nv.classList.contains('on')){nv.classList.remove('on');bg.focus()}});
addEventListener('scroll',()=>nv.classList.remove('on'),{passive:true});addEventListener('resize',()=>nv.classList.remove('on'));
const L=[...nv.querySelectorAll('a:not(.btn)')],S=L.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){const so=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){L.forEach(a=>a.classList.toggle('act',a.getAttribute('href')==='#'+x.target.id))}}),{rootMargin:'-45% 0px -50% 0px'});S.forEach(s=>so.observe(s))}})();
(function(){const s=document.querySelector('.doc img'),d=document.getElementById('ill1');if(s&&d)d.src=s.src})();
let seen=false;try{seen=sessionStorage.getItem('bk')}catch(e){}
if(!seen)open_();
(function(){
const box=document.querySelector('.process-rings');if(!box)return;
const C=314.16,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const ds=[...box.querySelectorAll('.process-ring')].map(r=>{
 const target=parseFloat(r.style.getPropertyValue('--target'))||0;
 const head=document.createElement('span');head.className='ring-head';
 const lab=document.createElement('span');lab.className='ring-pct';lab.textContent='0%';
 r.append(head,lab);
 return {r,fill:r.querySelector('.ring-fill'),pct:Math.round((1-target/C)*100),head,lab,run:false,raf:0,tm:0};
});
function set(d,p){const v=p*d.pct/100;d.fill.style.strokeDashoffset=C*(1-v);d.head.style.transform='rotate('+(v*360)+'deg)';d.lab.textContent=Math.round(p*d.pct)+'%'}
function play(d,delay){
 clearTimeout(d.tm);cancelAnimationFrame(d.raf);
 d.tm=setTimeout(()=>{const t0=performance.now(),T=1700;
  (function step(n){const k=Math.min((n-t0)/T,1),e=1-Math.pow(1-k,3);set(d,e);if(k<1)d.raf=requestAnimationFrame(step)})(t0)},delay);
}
function reset(d){clearTimeout(d.tm);cancelAnimationFrame(d.raf);d.run=false;d.r.classList.remove('on');set(d,0)}
box.classList.add('pr-js');
if(reduce||!('IntersectionObserver' in window)){ds.forEach(d=>{d.r.classList.add('on');set(d,1)});return}
ds.forEach(d=>set(d,0));
const map=new Map(ds.map(d=>[d.r,d]));
const io=new IntersectionObserver(es=>{let b=0;es.forEach(e=>{const d=map.get(e.target);
 if(e.intersectionRatio>=.35&&!d.run){d.run=true;d.r.style.transitionDelay=(b*.18)+'s';d.r.classList.add('on');play(d,b*180+150);b++}
 else if(e.intersectionRatio===0&&d.run){d.r.style.transitionDelay='0s';reset(d)}})},{threshold:[0,.35]});
ds.forEach(d=>io.observe(d.r));
})();
