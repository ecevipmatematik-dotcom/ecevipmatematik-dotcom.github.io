/* ECE VIP — progressive classroom comparison */
(()=>{
'use strict';
const root=document.getElementById('neden-ece');if(!root)return;
const buttons=Array.from(root.querySelectorAll('[data-ece-class]'));
const group=root.querySelector('.ece-class-switch');
const status=root.querySelector('#ece-class-status');
if(group&&buttons.length===2){
 const panels=buttons.map(b=>document.getElementById(b.getAttribute('aria-controls')));
 if(panels.every(Boolean)){
  function activate(index,announce){
   buttons.forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));panels[i].hidden=i!==index;panels[i].classList.remove('ece-class-active')});
   if(announce){panels[index].classList.add('ece-class-active');if(status)status.textContent=index===0?'30 kişilik temsili sınıf gösteriliyor.':'ECE VİP: en fazla 6 kişilik sınıf gösteriliyor.'}
  }
  activate(0,false);group.hidden=false;
  buttons.forEach((b,i)=>b.addEventListener('click',()=>activate(i,true)));
 }
}
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduce.matches){
 const nums=Array.from(document.querySelectorAll('#anasayfa .hero-insight b')).filter(n=>/^\d+$/.test(n.textContent.trim()));
 nums.forEach(n=>{
  const final=n.textContent.trim(),target=Number(final),visible=document.createElement('span');
  visible.setAttribute('aria-hidden','true');visible.style.font='inherit';visible.style.color='inherit';visible.style.display='inline';
  const sr=document.createElement('span');sr.className='ece-sr-only';sr.textContent=final;
  n.replaceChildren(sr,visible);
  let start=null;
  function frame(now){if(start===null)start=now;const p=reduce.matches?1:Math.min((now-start)/550,1);visible.textContent=String(Math.round(target*(1-Math.pow(1-p,3)))).padStart(final.length,'0');if(p<1)requestAnimationFrame(frame)}
  visible.textContent=final;requestAnimationFrame(frame);
 });
}
})();
