/* ECE VIP: mobile-friendly PDF sharing. */
(function pdfShare(){
  "use strict";
  const $=id=>document.getElementById(id);
  const dialog=$("eceShareDialog"),title=$("eceShareTitle"),name=$("eceShareName"),close=$("eceShareClose"),wa=$("eceShareWA"),native=$("eceShareNative"),copy=$("eceShareCopy"),fileButton=$("eceShareFile"),download=$("eceShareDownload"),field=$("eceShareURL"),status=$("eceShareFeedback");
  if(!dialog||!field||!status)return;
  let data=null,prepared=null,controller=null,origin=null;
  const limit=25*1024*1024;
  const track=()=>{try{window.eceTrack?.("share_link","pdf-kutuphanesi");}catch{}};
  const fileTrack=()=>{try{window.eceTrack?.("pdf_share_file","pdf-kutuphanesi");}catch{}};
  function clearFile(){
    controller?.abort();controller=null;prepared=null;
    fileButton.disabled=false;fileButton.textContent="PDF dosyası olarak paylaş";
  }
  function openShare(raw,label,file,trigger){
    let url;try{url=new URL(raw,location.href);}catch{return;}
    if(url.origin!==location.origin||!/^https?:$/.test(url.protocol))return;
    clearFile();
    const isPDF=/\.pdf$/i.test(url.pathname);
    data={url:url.href,title:label||"ECE VIP Akademi",file:isPDF?(file||decodeURIComponent(url.pathname.split("/").pop())):null};
    origin=trigger||document.activeElement;
    title.textContent=isPDF?"PDF paylaş":"Kütüphaneyi paylaş";
    name.textContent=data.title;field.value=data.url;status.textContent="";
    wa.href="https://wa.me/?text="+encodeURIComponent(data.title+"\n"+data.url);
    native.hidden=typeof navigator.share!=="function";
    fileButton.hidden=!data.file||typeof navigator.share!=="function"||typeof navigator.canShare!=="function"||typeof File!=="function";
    download.hidden=!data.file;
    if(data.file){download.href=data.url;download.download=data.file;}else{download.removeAttribute("href");download.removeAttribute("download");}
    if(typeof dialog.showModal==="function"){if(!dialog.open)dialog.showModal();}else dialog.setAttribute("open","");
    close.focus();
  }
  function closeShare(){if(typeof dialog.close==="function"&&dialog.open)dialog.close();else{dialog.removeAttribute("open");clearFile();origin?.focus();}}
  close.addEventListener("click",closeShare);
  dialog.addEventListener("click",e=>{if(e.target===dialog)closeShare();});
  dialog.addEventListener("close",()=>{clearFile();if(origin?.isConnected)origin.focus();});
  document.addEventListener("click",e=>{
    if(!(e.target instanceof Element))return;
    const button=e.target.closest("[data-share-url],#eceShareLibrary,#libDialogShare");
    if(!button)return;
    if(button.id==="eceShareLibrary"){
      openShare(location.origin+"/?utm_source=ece_site&utm_medium=referral&utm_campaign=paylasim&utm_content=library#pdf-kutuphanesi","ECE VIP Akademi – Ücretsiz PDF Kütüphanesi",null,button);
    }else if(button.id==="libDialogShare"){
      const preview=$("libDialog"),url=$("libDialogLink")?.href,label=$("libDialogTitle")?.textContent;
      if(!url)return;
      if(preview?.open)preview.close();
      const matching=Array.from(document.querySelectorAll("[data-share-url]")).find(b=>b.dataset.shareUrl===url);
      openShare(url,label,matching?.dataset.shareFile,matching||button);
    }else openShare(button.dataset.shareUrl,button.dataset.shareTitle,button.dataset.shareFile,button);
  });
  wa.addEventListener("click",track);
  native.addEventListener("click",async()=>{
    if(!data)return;
    try{await navigator.share({title:data.title,url:data.url});track();}
    catch(e){if(e.name!=="AbortError")status.textContent="Telefonun paylaşım menüsü açılamadı. WhatsApp bağlantısını veya kopyalama seçeneğini kullanabilirsiniz.";}
  });
  field.addEventListener("click",()=>{field.select();field.setSelectionRange(0,field.value.length);});
  copy.addEventListener("click",async()=>{
    if(!data)return;
    try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(data.url);status.textContent="Bağlantı kopyalandı.";track();return;}}catch{}
    field.focus();field.select();field.setSelectionRange(0,field.value.length);
    try{if(document.execCommand("copy")){status.textContent="Bağlantı kopyalandı.";track();return;}}catch{}
    status.textContent="Bağlantı seçildi. Basılı tutup Kopyala seçeneğini kullanabilirsiniz.";
  });
  fileButton.addEventListener("click",async()=>{
    if(!data?.file)return;
    if(prepared){
      try{await navigator.share({files:[prepared]});fileTrack();status.textContent="PDF paylaşım menüsüne aktarıldı.";}
      catch(e){if(e.name!=="AbortError")status.textContent="Dosya paylaşımı desteklenmedi. PDF'yi indirip telefonunuzun Dosyalar uygulamasından paylaşabilirsiniz.";}
      return;
    }
    const target=data;
    const request=new AbortController();controller=request;
    fileButton.disabled=true;status.textContent="PDF hazırlanıyor…";
    try{
      const response=await fetch(target.url,{signal:request.signal});
      if(!response.ok)throw Error("HTTP "+response.status);
      const length=Number(response.headers.get("content-length"));
      if(length>limit){await response.body?.cancel();throw Error("large");}
      let blob;
      if(response.body?.getReader){
        const reader=response.body.getReader(),parts=[];let size=0;
        while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>limit){await reader.cancel();throw Error("large");}parts.push(value);}
        blob=new Blob(parts,{type:"application/pdf"});
      }else{blob=await response.blob();}
      if(blob.size>limit)throw Error("large");
      const signature=await blob.slice(0,5).text();if(signature!=="%PDF-")throw Error("not pdf");
      const file=new File([blob],target.file,{type:"application/pdf"});
      if(request.signal.aborted||data!==target)return;
      if(!navigator.canShare({files:[file]}))throw Error("unsupported");
      prepared=file;fileButton.textContent="Hazır — PDF dosyasını şimdi paylaş";
      status.textContent="PDF hazır. Dosyayı paylaşmak için düğmeye tekrar dokunun.";
    }catch(e){
      if(request.signal.aborted||data!==target)return;
      status.textContent=e.message==="large"?"PDF 25 MB sınırını aşıyor. Bağlantıyı paylaşın veya indirip Dosyalar uygulamasından gönderin.":"PDF dosyası bu tarayıcıda paylaşıma hazırlanamadı. Bağlantıyı paylaşabilir veya dosyayı indirebilirsiniz.";
    }finally{if(data===target&&!request.signal.aborted){fileButton.disabled=false;controller=null;}}
  });
})();
