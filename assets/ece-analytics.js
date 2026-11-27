/* ECE VIP: consent-gated, allowlisted event analytics. */
(function tracking(){
  "use strict";
  const id=document.querySelector('meta[name="ece-ga4-id"]')?.content.trim()||"";
  const valid=/^G-[A-Z0-9]+$/.test(id);
  const key="ece_analytics_consent_v1";
  let allowed=false,loaded=false,choice="";
  try{choice=localStorage.getItem(key)||"";}catch{}
  const events=new Set(["whatsapp_click","phone_click","appointment_cta","contact_form_start","contact_form_whatsapp","pdf_preview","pdf_download","library_open","quiz_start","quiz_complete","program_match","program_details","math_lab_open","share_link","section_view"]);
  const places=new Set(["anasayfa","programlar","iletisim","pdf-kutuphanesi","kaynaklar","seviye-testi","matematik-lab","calisma-salonu","galeri","kamplar","sinav-takvimi","neden-ece","kayit-daveti","footer","mobile","other"]);
  const campaigns={utm_source:new Set(["instagram","whatsapp","google","ece_site"]),utm_medium:new Set(["social","referral","organic","qr"]),utm_campaign:new Set(["bio","kamp_pdf","deneme","paylasim","on_gorusme"]),utm_content:new Set(["bio","story","reels","post","qr","library"])};
  const page=new URL(location.origin+location.pathname);
  const incoming=new URLSearchParams(location.search);
  for(const [k,v] of Object.entries(campaigns)){const value=incoming.get(k);if(v.has(value))page.searchParams.set(k,value);}
  let ref="";
  try{if(document.referrer)ref=new URL(document.referrer).origin+"/";}catch{}
  function section(el){
    if(el.closest(".mobile-contact"))return "mobile";
    if(el.closest("footer"))return "footer";
    const s=el.closest("section[id]")?.id||"other";
    return places.has(s)?s:"other";
  }
  function send(name,place="other"){
    if(!valid||!allowed||!events.has(name))return;
    window.gtag("event",name,{ece_section:places.has(place)?place:"other",page_location:page.href,page_referrer:ref});
  }
  window.eceTrack=send;
  function load(){
    if(!valid||loaded)return;
    loaded=true;
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    window.gtag("consent","default",{analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
    window.gtag("consent","update",{analytics_storage:"granted"});
    window.gtag("js",new Date());
    window.gtag("config",id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:page.href,page_referrer:ref});
    window.gtag("event","page_view",{page_location:page.href,page_referrer:ref});
    const script=document.createElement("script");
    script.async=true;script.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(id);
    document.head.append(script);
  }
  const panel=document.getElementById("eceConsent");
  const settings=document.getElementById("eceConsentSettings");
  function setChoice(value){
    choice=value;allowed=value==="yes";
    try{localStorage.setItem(key,value);}catch{}
    if(valid){
      window["ga-disable-"+id]=!allowed;
      if(allowed){if(loaded)window.gtag("consent","update",{analytics_storage:"granted"});else load();}
      else if(loaded)window.gtag("consent","update",{analytics_storage:"denied"});
    }
    if(panel)panel.hidden=true;
  }
  if(valid){
    if(settings)settings.hidden=false;
    if(choice==="yes")setChoice("yes");
    else if(choice!=="no"&&panel)panel.hidden=false;
    settings?.addEventListener("click",()=>{if(panel){panel.hidden=false;panel.querySelector("button")?.focus();}});
    document.getElementById("eceConsentYes")?.addEventListener("click",()=>setChoice("yes"));
    document.getElementById("eceConsentNo")?.addEventListener("click",()=>setChoice("no"));
  }
  document.addEventListener("click",e=>{
    if(!e.isTrusted||!(e.target instanceof Element))return;
    const el=e.target.closest("a,button");
    if(!el)return;
    const loc=section(el);
    if(el.matches("[data-lib-filter]")&&el.getAttribute("aria-expanded")!=="true")send("library_open",loc);
    if(el.matches("button[data-pdf]"))send("pdf_preview",loc);
    if(el.matches(".program-toggle")&&el.getAttribute("aria-expanded")!=="true")send("program_details","programlar");
    if(!el.matches("a"))return;
    let u;try{u=new URL(el.href,location.href);}catch{return;}
    if(u.protocol==="tel:")send("phone_click",loc);
    else if(["wa.me","api.whatsapp.com","web.whatsapp.com"].includes(u.hostname))send("whatsapp_click",loc);
    else if(u.origin===location.origin&&(/\.pdf$/i.test(u.pathname)||el.hasAttribute("download")))send("pdf_download",loc);
    else if(u.origin===location.origin&&/\/math-lab\.html$/i.test(u.pathname))send("math_lab_open",loc);
    else if(u.origin===location.origin&&["#iletisim","#contactForm"].includes(u.hash))send("appointment_cta",loc);
  },true);
  let formStarted=false;
  document.getElementById("contactForm")?.addEventListener("focusin",()=>{if(allowed&&!formStarted){formStarted=true;send("contact_form_start","iletisim");}});
  if("IntersectionObserver" in window){
    const observer=new IntersectionObserver(entries=>{
      for(const e of entries)if(e.isIntersecting&&allowed){send("section_view",e.target.id);observer.unobserve(e.target);}
    },{threshold:.15});
    for(const s of document.querySelectorAll("section[id]"))if(places.has(s.id))observer.observe(s);
  }
  const share=document.getElementById("eceShareLibrary");
  const status=document.getElementById("eceShareStatus");
  share?.addEventListener("click",async()=>{
    const url=location.origin+"/?utm_source=ece_site&utm_medium=referral&utm_campaign=paylasim&utm_content=library#pdf-kutuphanesi";
    try{
      if(navigator.share)await navigator.share({title:"ECE VIP Akademi – Ücretsiz PDF Kütüphanesi",url});
      else if(navigator.clipboard){await navigator.clipboard.writeText(url);if(status)status.textContent="Bağlantı kopyalandı.";}
      else{if(status)status.textContent="Paylaşım bağlantısı: "+url;return;}
      send("share_link","pdf-kutuphanesi");
    }catch(e){if(e.name!=="AbortError"&&status)status.textContent="Paylaşım bağlantısı: "+url;}
  });
})();
