# ECE VIP — Kayıt analitiği
Cloudflare Web Analytics korunur. GA4, yalnızca gerçek ölçüm kimliği girildiğinde ve ziyaretçi isteğe bağlı analiz izni verdiğinde çalışır.
## Etkinleştirme
1. https://analytics.google.com/ üzerinden ECE VIP için GA4 mülkü ve web veri akışı açın.
2. Veri akışında gelişmiş ölçümü kapatın (özellikle otomatik dış bağlantı, form, arama ve dosya olayları; WhatsApp URL'sinde kişisel bilgiler bulunabilir). Google Signals, reklam kişiselleştirme ve kullanıcı tarafından sağlanan veri toplama kapalı kalmalı. GA4 veri gizleme / URL parametreleri ayarlarını kontrol edin.
3. index.html içindeki ece-ga4-id meta etiketinin content değerine G- ile başlayan ölçüm kimliğini yazın. API anahtarı veya parola gerekmez.
4. Gizlilik/çerez açıklamasını kurumun gerçek veri işleme koşullarına göre doğrulayın. Yayınlamadan önce gerçek cihaz ve tarayıcı testleri yapın.
5. GA4 Realtime / DebugView ile kabul ve ret senaryolarını, WhatsApp, telefon, PDF, test, form ve paylaşım olaylarını test edin. Ret durumunda GA4 etiketi ilk yüklemede hiç yüklenmemelidir. Gerçek kişisel bilgi yerine test verisi kullanın.
6. Admin > Events bölümünde whatsapp_click, phone_click ve contact_form_whatsapp olaylarını istenirse key event olarak işaretleyin. Bu olaylar iletişim niyetidir, tamamlanmış kayıt değildir. GA4 içinde ece_section olay kapsamlı özel boyutunu tanımlayın.
## Olaylar
whatsapp_click, phone_click, appointment_cta, contact_form_start, contact_form_whatsapp (geçerli form sonrası WhatsApp açma girişimi), pdf_preview, pdf_download (tıklama), library_open, quiz_start, quiz_complete, program_match, program_details, math_lab_open (ana sayfadan giriş), share_link (paylaşım/kopyalama), section_view.
Yalnızca sabit olay ve bölüm adları gönderilir. Form alanları, test cevabı, arama metni, WhatsApp mesajı gönderilmez. GA4 otomatik ölçüm kapalı olmalıdır.
## Kampanya bağlantıları
Instagram bio: https://ecevipmatematik-dotcom.github.io/?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=bio
Instagram hikâye PDF: https://ecevipmatematik-dotcom.github.io/?utm_source=instagram&utm_medium=social&utm_campaign=kamp_pdf&utm_content=story#pdf-kutuphanesi
WhatsApp deneme: https://ecevipmatematik-dotcom.github.io/?utm_source=whatsapp&utm_medium=referral&utm_campaign=deneme#sinav-takvimi
## Kayıt hunisi
GA4: oturumlar -> iletişim CTA -> geçerli form veya WhatsApp/telefon tıklaması. Gerçek WhatsApp mesajı, telefon görüşmesi, randevu ve kesin kayıt kurumun kendi sayımıyla ayrıca izlenmelidir. Kayıt dönüşümü = aynı dönem/kaynak için kesin kayıt sayısı / uygun ziyaret veya oturum sayısı. Olay sayısı tekil kişi sayısı değildir; oturum ve kullanıcı bazında ayrı raporlanır. Onay vermeyen ziyaretçiler GA4 kapsamı dışında kalır. Cloudflare ve GA4 sayıları birebir eşleşmez.
