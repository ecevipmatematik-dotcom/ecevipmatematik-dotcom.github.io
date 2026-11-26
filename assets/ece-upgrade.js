/* ECE VIP — no dependencies, no personal data collection */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
const button=(cls,text)=>{const b=el('button',cls,text);b.type='button';return b};
const norm=s=>String(s).toLocaleLowerCase('tr-TR').replace(/ı/g,'i').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const main=$('#mainContent');if(!main||$('#soru-studyo'))return;
const questions=[
 {eq:'3(x − 2) = 15',steps:['Her iki tarafı 3 ile böl: x − 2 = 5.','Her iki tarafa 2 ekle: x = 7.','Kontrol: 3(7 − 2) = 15.'],alt:'Dağıt: 3x − 6 = 15 → 3x = 21 → x = 7.',dna:['Parantez ve dağılma özelliği','Eşitliğin iki tarafında aynı işlem','Ters işlem ve yerine koyma'],wrong:'Bir öğrenci 3(x − 2) = 15 denkleminden 3x − 2 = 15 yazıyor. Hata nerede?',opts:['3 sayısı yalnızca x ile çarpılmış.','15 sayısı yanlış bölünmüş.','Her iki tarafa 2 eklenmiş.'],correct:0,why:'3 hem x hem −2 ile çarpılmalıdır: 3x − 6 = 15.'},
 {eq:'−4 + 9 − 7',steps:['−4 + 9 = 5.','5 − 7 = −2.','Sayı doğrusunda son nokta −2.'],alt:'Pozitifleri ve negatifleri grupla: 9 − (4 + 7) = 9 − 11 = −2.',dna:['İşaretli tam sayılar','Toplama ve çıkarma','Sayı doğrusu ve karşıt sayılar'],wrong:'Bir öğrenci −4 + 9 − 7 = 12 sonucuna ulaşıyor. 5 − 7 adımında neyi karıştırmış olabilir?',opts:['Toplama değişme özelliğini.','Çıkarmayı toplama ile karıştırmış.','Sıfırın çarpmadaki rolünü.'],correct:1,why:'5 − 7, 5 + 7 değildir. Sayı doğrusunda 7 birim sola gidilir.'},
 {eq:'2/3 + 1/6',steps:['Ortak payda 6.','2/3 = 4/6.','4/6 + 1/6 = 5/6.'],alt:'2/3, altıda dört parçadır. Bir parça daha eklenince altıda beş elde edilir.',dna:['Denk kesirler','Ortak payda','Aynı paydalı kesirlerde toplama'],wrong:'Bir öğrenci 2/3 + 1/6 = 3/9 yazıyor. Hata nedir?',opts:['Payları yanlış toplamış.','Kesirleri sadeleştirmiş.','Farklı paydaları doğrudan toplamış.'],correct:2,why:'Önce paydalar eşitlenmeli; payda sabit kalıp paylar toplanmalıdır.'}
];
let index=0,mode=0;const modes=['Sorunun Anatomisi','Soru DNA’sı','Matematik Röntgeni'];
const section=el('section');section.id='soru-studyo';section.setAttribute('aria-labelledby','ece-studio-title');
const wrap=el('div','wrap'),heading=el('h2','','Bir sorunun içine yolculuk.');heading.id='ece-studio-title';
wrap.append(el('p','ece-kicker','ECE VIP / MATEMATİK KEŞİF STÜDYOSU'),heading,el('p','ece-intro','Bir soruyu çözmekten fazlası: adımları gör, temel becerilerini keşfet ve yanlış düşünceyi yakala.'));
const grid=el('div','ece-studio-grid'),left=el('div','ece-studio-card'),panel=el('div','ece-studio-card ece-panel');panel.id='ece-studio-panel';
const label=el('p','ece-question-label'),eq=el('div','ece-equation'),copy=el('p','ece-question-copy','Üç farklı bakış açısıyla incele.');
label.setAttribute('aria-live','polite');
const modeList=el('div','ece-modes');modeList.setAttribute('role','group');modeList.setAttribute('aria-label','İnceleme yöntemi');
const modeButtons=modes.map((m,i)=>{const b=button('ece-mode',String(i+1).padStart(2,'0')+' / '+m);b.setAttribute('aria-controls',panel.id);b.addEventListener('click',()=>{mode=i;render()});modeList.append(b);return b});
const next=button('ece-next','Başka soru →');next.addEventListener('click',()=>{index=(index+1)%questions.length;render()});
left.append(label,eq,copy,modeList,next);grid.append(left,panel);wrap.append(grid);section.append(wrap);const lab=$('#matematik-lab');if(lab)lab.before(section);else main.append(section);
function render(){const q=questions[index];label.textContent='ÖRNEK '+(index+1)+' / '+questions.length;eq.textContent=q.eq;modeButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===mode)));panel.replaceChildren(el('h3','',modes[mode]));
 if(mode===0){const list=el('ol','ece-steps');q.steps.forEach(s=>list.append(el('li','',s)));panel.append(el('p','','Adım adım çözüm'),list,el('div','ece-chip','Alternatif yöntem: '+q.alt))}
 if(mode===1){panel.append(el('p','','Bu sorunun çözümü için gereken üç temel beceri.'));q.dna.forEach((d,i)=>panel.append(el('div','ece-chip','0'+(i+1)+' / '+d)))}
 if(mode===2){panel.append(el('p','',q.wrong));const group=el('div');group.setAttribute('role','group');group.setAttribute('aria-label','Hata seçenekleri');const feedback=el('p','ece-feedback');feedback.setAttribute('role','status');const options=q.opts.map((opt,i)=>{const b=button('ece-option',opt);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>{options.forEach(o=>o.setAttribute('aria-pressed',String(o===b)));feedback.textContent=i===q.correct?'Doğru. '+q.why:'Tekrar düşün: hangi işlem yanlış uygulanmış?'});group.append(b);return b});panel.append(group,feedback)}
 panel.classList.remove('ece-enter');requestAnimationFrame(()=>{if(panel.isConnected)panel.classList.add('ece-enter')});
}
render();
const hero=$('.hero-actions');if(hero){const a=el('a','ece-jump','Matematik Keşif Stüdyosu ↗');a.href='#soru-studyo';hero.append(a)}
const nav=$('#navLinks'),menu=$('#menuBtn'),primary=new Set(['#programlar','#pdf-kutuphanesi','#matematik-lab','#iletisim','#kamplar']);
if(nav&&menu&&typeof HTMLDialogElement!=='undefined'&&typeof HTMLDialogElement.prototype.showModal==='function'){
 const entries=new Map();$$('a[href^="#"]',nav).forEach(a=>{const id=a.getAttribute('href');if(id.length>1&&document.getElementById(id.slice(1))){entries.set(id,a.textContent.trim());if(!primary.has(id))a.classList.add('ece-secondary')}});
 $$('section[id]',main).forEach(s=>{const id='#'+s.id,h=$('h2,h1',s);if(h&&!entries.has(id))entries.set(id,h.textContent.trim())});
 entries.set('#soru-studyo','Sorunun Anatomisi · Soru DNA’sı · Matematik Röntgeni');
 entries.set('#matematik-lab','MATH LAB · Matematik Laboratuvarı');
 const d=el('dialog','ece-dialog');d.id='ece-quick-nav';d.setAttribute('aria-labelledby','ece-search-title');
 const head=el('div','ece-dialog-head'),h=el('h2','','Hızlı keşif');h.id='ece-search-title';const close=button('ece-close','×');close.setAttribute('aria-label','Aramayı kapat');head.append(h,close);
 const body=el('div','ece-search-body'),searchLabel=el('label','','Nereye gitmek istersiniz?');searchLabel.htmlFor='ece-search';const input=el('input');input.id='ece-search';input.type='search';input.placeholder='Örn. deneme, kamp, laboratuvar';input.autocomplete='off';
 const status=el('p','ece-search-status');status.setAttribute('role','status');const results=el('div','ece-result-list');body.append(searchLabel,input,status,results);d.append(head,body);document.body.append(d);
 const launch=button('ece-search-launch','Keşfet');const kbd=el('kbd','','Ctrl K');kbd.setAttribute('aria-hidden','true');launch.append(kbd);launch.setAttribute('aria-haspopup','dialog');launch.setAttribute('aria-controls',d.id);launch.setAttribute('aria-keyshortcuts','Control+K Meta+K');menu.before(launch);nav.classList.add('ece-enhanced');
 let origin=null,destination=null;
 function draw(){const needle=norm(input.value).trim();const found=[...entries].filter(([id,name])=>norm(id+' '+name).includes(needle));results.replaceChildren();status.textContent=found.length?found.length+' bölüm bulundu.':'Bölüm bulunamadı. Farklı bir kelime deneyin.';found.forEach(([id,name])=>{const a=el('a','ece-result',name);a.href=id;const arrow=el('span','','↗');arrow.setAttribute('aria-hidden','true');a.append(arrow);a.addEventListener('click',e=>{e.preventDefault();destination=document.getElementById(id.slice(1));d.close();try{history.pushState(null,'',id)}catch(_){location.hash=id}if(destination){if(!destination.hasAttribute('tabindex'))destination.tabIndex=-1;destination.focus({preventScroll:true});destination.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}});results.append(a)})}
 function open(){if(d.open||$('dialog[open]')||$('#lightbox.open'))return;origin=document.activeElement;if(nav.classList.contains('open')){menu.click();origin=launch}destination=null;input.value='';draw();d.showModal();input.focus()}
 launch.addEventListener('click',open);close.addEventListener('click',()=>d.close());input.addEventListener('input',draw);d.addEventListener('click',e=>{if(e.target===d)d.close()});d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();d.close()}else if(e.key==='Enter'&&e.target===input){const first=$('.ece-result',results);if(first){e.preventDefault();first.click()}}});d.addEventListener('close',()=>{if(!destination&&origin?.isConnected)origin.focus()});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!e.altKey&&!e.shiftKey){if(d.open||!$('dialog[open]')&&!$('#lightbox.open')){e.preventDefault();if(d.open)input.focus();else open()}}});
}
const lightbox=$('#lightbox');if(lightbox)document.addEventListener('keydown',e=>{if(e.key!=='Tab'||!lightbox.classList.contains('open'))return;const items=$$('button:not([disabled]),a[href]',lightbox).filter(x=>x.getClientRects().length);if(!items.length)return;const first=items[0],last=items[items.length-1];if(e.shiftKey&&(document.activeElement===first||!lightbox.contains(document.activeElement))){e.preventDefault();last.focus()}else if(!e.shiftKey&&(document.activeElement===last||!lightbox.contains(document.activeElement))){e.preventDefault();first.focus()}});
})();