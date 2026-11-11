/* Licht × Ozy — içerik ve renk katmanı.
   Ozy bileşen ayarlarındaki renkleri sayfaya inline stil olarak basar; burada aynı değerleri
   editörde değiştirmişiz gibi yeniden yazıyoruz. Her blok bir bileşenin ayar paneline karşılık gelir. */
(function () {
  const { P, X, $, $$, fmt, pct, txt, ready } = window.LC;
  const PDP = 'licht-ozy-urun.html', HOME = 'licht-ozy.html';
  const isPdp = /urun/.test(location.pathname);

  const C = {
    green: '#294B32', greenDark: '#1C3524', pinkDeep: '#D45A90', pinkSoft: '#FBDDE9', pinkLight: '#FFE3EE',
    blush: '#FDF1F5', ink: '#201918', ink2: '#534B4A', muted: '#9A918E', white: '#FFFFFF', sage: '#EEF3ED', warm: '#FAF7F4',
  };

  // Tema Ayarları > Yazı tipi: Manrope (Google Fonts)
  document.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap">');

  /* ---------- yardımcılar ---------- */
  const rgbKey = v => { const m = String(v).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); return m ? `${m[1]},${m[2]},${m[3]}` : null; };
  // Bir bileşenin içindeki inline renkleri eşleme tablosuna göre değiştir (= bileşenin renk ayarlarını değiştirmek)
  function recolor(root, map) {
    if (!root) return;
    [root, ...root.querySelectorAll('[style]')].forEach(el => {
      ['color', 'background-color', 'border-color'].forEach(prop => {
        const k = rgbKey(el.style.getPropertyValue(prop));
        if (k && map[k]) el.style.setProperty(prop, map[k]);
      });
    });
  }
  const comp = id => $(`main [id="${id}"]`);
  const vwNow = () => document.documentElement.clientWidth;
  const LOGO_RATIO = 405 / 932;              // logo-yesil.png yükseklik/genişlik
  const LOGO_W = { desk: 150, mob: 120 };     // logoDesktopWidth (≤230) / logoMobileWidth (≤150)
  const header = () => $$('[id="-1"]')[0];
  const footer = () => $$('[id="-1"]')[1];
  function setImg(img, src, fit) {
    if (!img) return;
    img.removeAttribute('srcset'); img.removeAttribute('sizes'); img.removeAttribute('data-nimg');
    img.src = src; img.style.objectFit = fit || 'cover';
    unblur(img);
  }
  // Next.js görselleri yüklenene kadar blur filtresi + bulanık arka plan taşır; JS olmadığı için elle kaldır
  function unblur(img) {
    img.style.removeProperty('filter'); img.style.removeProperty('background-image');
    img.style.removeProperty('background-size'); img.style.removeProperty('background-position');
  }
  $$('img').forEach(unblur);

  /* ---------- Pop-up, çerez bandı, 3. parti kalıntıları (POC'de gerek yok) ---------- */
  $$('#ikas-popup-container').forEach(e => e.remove());
  $$('body > div').forEach(d => { const z = +getComputedStyle(d).zIndex; if (getComputedStyle(d).position === 'fixed' && z >= 2e9) d.remove(); });
  $$('body *').forEach(e => { if (/Alışveriş deneyiminizi/.test(e.textContent) && e.children.length < 6 && getComputedStyle(e).position === 'fixed') e.remove(); });
  $$('.grecaptcha-badge, #SaydirmacProductApp').forEach(e => e.remove());

  /* ================= HEADER ================= */
  const hd = header();
  // Header > Duyurular (her madde): announcementBgColor yeşil, announcementTextColor açık pembe,
  // fontSize 14 / mobileFontSize 12, isFontBold, isTextUpperCase (bant yüksekliği temanın: 55px)
  recolor(hd, { '16,48,33': C.green, '242,241,241': C.pinkLight });
  const ann = ['Bilekliklerde 3 al 2 öde', '1.500 TL ve üzeri ücretsiz kargo'];
  $$('.announcement-text', hd).forEach((a, i) => { a.textContent = ann[i % 2]; a.style.fontSize = vwNow() <= 650 ? '12px' : '14px'; a.style.fontWeight = '700'; });
  // Header > Yardımcı bar (helperBar.isShow): içi boş, kapalı
  $$('#helper-bar-main', hd).forEach(h => h.remove());
  // Header: headerBgColor beyaz, textColor + iconColor yeşil, searchWrapperBgColor beyaz
  recolor(hd, { '41,74,49': C.white, '239,237,216': C.green, '16,48,33': C.green });
  $$('.mobile-menu svg', hd).forEach(s => (s.style.color = C.green));
  // Menü linkleri
  const links = ['Yeni Gelenler', 'Takılar', 'Koleksiyonlar'];   // 2. ve 3. link açılır menülü
  $$('.nav-links ul > li > a.parent', hd).forEach((a, i) => { if (links[i]) a.firstChild ? (a.firstChild.textContent = links[i]) : (a.textContent = links[i]); });
  // Header > Logo: Licht'in yeşil şeffaf logosu (932×405). Ozy logo kutusunun oranını yüklenen
  // görselden hesaplar; eski logonun oranı (%57) yerine yeni logonunki (%43,5).
  $$('.logo-main img', hd).forEach(img => setImg(img, 'assets/img/logo-yesil.png', 'contain'));
  $$('.logo-main a > span > span', hd).forEach(s => (s.style.padding = `${LOGO_RATIO * 100}% 0px 0px`));
  $$('.logo-main a, .logo-main > span', hd).forEach(a => { a.href = HOME; });

  /* ================= FOOTER ================= */
  const ft = footer();
  if (ft) {
    recolor(ft, { '41,74,49': C.blush, '239,237,216': C.green, '255,161,203': C.ink2, '235,222,189': C.green, '250,252,246': C.ink, '0,0,0': C.green, '239,239,239': C.ink2 });
    $$('button', ft).forEach(b => { b.style.color = C.pinkLight; });
    $$('input', ft).forEach(i => (i.style.borderColor = C.green));
    $$('svg', ft).forEach(s => { if (!s.style.color) s.style.color = C.green; });
    $$('img', ft).slice(0, 1).forEach(img => setImg(img, 'assets/img/logo-yesil.png', 'contain'));
    const cols = { 'Kategoriler': ['Kolyeler', 'Bileklikler', 'Küpeler', 'Bonbon', 'Summer ’26'] };
    $$('.footer-title', ft).forEach(t => {
      const list = cols[t.textContent.trim()]; if (!list) return;
      const ul = t.closest('div').querySelector('.footer-links') || t.parentElement.parentElement.querySelector('.footer-links');
      if (ul) [...ul.querySelectorAll('li')].forEach((li, i) => { if (list[i]) txt($('a', li), list[i]); else li.remove(); });
    });
    $$('span', ft).forEach(s => { if (/abone olun/i.test(s.textContent) && s.children.length === 0) s.textContent = 'Yeni renklerden ilk sen haberdar ol'; });
    $$('button', ft).forEach(b => { if (/Licht'len/.test(b.textContent)) b.textContent = 'Abone ol'; });
    // Telif alanı (zengin metin)
    $$('*', ft).forEach(e => { if (e.children.length === 0 && /Tüm Hakları Saklıdır/.test(e.textContent)) e.textContent = '© 2026 Licht Studio · ikas altyapısıyla'; });
    $$('[style]', ft).forEach(e => { if (rgbKey(e.style.backgroundColor) === '41,74,49') e.style.backgroundColor = C.blush; });
  }

  if (!isPdp) home(); else pdp();

  /* ================= ÜRÜN LİSTESİ (Ozy ürün slider'ı) ================= */
  function productList(sec, title, keys, bg) {
    // Ürün listesi ayarları: title, bgColor, titleColor, fontSize (≤40), fontWeight
    const box = sec.firstElementChild; box.style.backgroundColor = bg;
    const h = $('.products-slider-title h5', sec);
    if (h) { h.textContent = title; Object.assign(h.style, { color: C.green, fontSize: '34px', fontWeight: '600' }); }
    // arrowBgColor beyaz, arrowsColor yeşil
    $$('.slick-arrow', sec).forEach(a => { a.style.backgroundColor = C.white; const s = $('svg', a); if (s) s.style.color = C.green; });
    // Kartlar: kategoriye bağlı ürün listesi
    const track = $('.slick-track', sec);
    const slides = $$('.slick-slide', track);
    const tpl = slides.find(s => !s.classList.contains('slick-cloned')) || slides[0];
    const w = parseFloat(tpl.style.width) || 225;
    slides.forEach(s => s.remove());
    keys.forEach((k, i) => {
      const p = P[k], s = tpl.cloneNode(true);
      s.className = 'slick-slide' + (i < 6 ? ' slick-active' : ''); s.removeAttribute('aria-hidden'); s.removeAttribute('inert');
      $$('a', s).forEach(a => (a.href = PDP));
      setImg($('img.products-slider-image', s), p.img, 'cover');
      // etiket (ikas ürün etiketi)
      const tag = $('.flex.flex-wrap.gap-2.mb-1 span', s);
      const t = (p.tags || []).find(x => /Küpe Hediyeli|3 al 2 öde|%40 indirim/i.test(x));
      // modelTagColor yeşil, modelTagBgColor açık pembe
      if (tag) { if (t) { tag.textContent = t; Object.assign(tag.style, { color: C.green, backgroundColor: C.pinkSoft }); } else tag.remove(); }
      // productNameColor, productNameFontSize (≤20), productNameFontWeight
      const name = $('.product-name', s); if (name) { name.textContent = p.n; Object.assign(name.style, { color: C.ink, fontSize: '15px', fontWeight: '500' }); }
      const pm = $('.discount-price-main', s);
      if (pm) {
        const badge = $('.discount-percent', pm);
        const spans = $$('.discount-price > span', pm);
        if (p.old) {
          // discountRatioBg / discountRatioColor, discountPriceBorderRadius (≤50)
          badge.textContent = '%' + pct(p); Object.assign(badge.style, { backgroundColor: C.pinkSoft, color: C.green, borderRadius: '50px' });
          if (spans[0]) { spans[0].textContent = fmt(p.old); spans[0].style.color = C.muted; }
          if (spans[1]) { spans[1].textContent = fmt(p.price); spans[1].style.color = C.green; }
        } else {
          badge && badge.remove(); if (spans[0]) spans[0].remove();
          if (spans[1]) { spans[1].textContent = fmt(p.price); spans[1].style.color = C.green; }
        }
      }
      // addBasketButtonBorderColor / TextColor / BgColor, buttonBorderRadius (≤100)
      $$('button.stock', s).forEach(b => { b.textContent = 'Sepete ekle'; Object.assign(b.style, { borderColor: C.green, color: C.green, backgroundColor: C.white, borderRadius: '99px' }); });
      // Diğer Özelleştirmeler > "Sepete Ekle Butonu Konumu": ÜST → ALT.
      // Tema ALT'ta aynı .add-to-cart-overlay'i bilgi alanının sonuna "mt-2" ile basıyor (Ozy JS'inden okundu).
      // (Kartta ikinci bir .add-to-cart-overlay daha var: görselin üzerindeki gizli hover butonu; ona dokunulmuyor.)
      const ov = $('.product-list-item-info > .add-to-cart-overlay', s);
      if (ov) { ov.classList.add('mt-2'); ov.parentElement.appendChild(ov); }
      track.appendChild(s);
    });
    track.style.transform = 'translate3d(0px, 0px, 0px)';
    track.style.width = (w * keys.length) + 'px';
  }

  /* ================= KATEGORİ GÖRSELLERİ ================= */
  function categoryImages(sec, items, ratioPct) {
    sec.firstElementChild.style.backgroundColor = C.white;
    const track = $('.slick-track', sec);
    const slides = $$('.slick-slide', track);
    const tpl = slides[0]; slides.forEach(s => s.remove());
    items.forEach(([title, img]) => {
      const s = tpl.cloneNode(true); s.style.width = (100 / items.length) + '%';
      $$('a', s).forEach(a => (a.href = '#'));
      setImg($('img', s), img, 'cover');
      // Öğe ayarı > imageAspectRatio (seçenekler: 1:1, 2:3, 4:3, 3:4, 16:9, 16:5, 1:1.5, 4:5)
      if (ratioPct) { const sizer = $('.category-image-banner-main > span > span', s); if (sizer) sizer.style.padding = `${ratioPct}% 0px 0px`; }
      // textColor beyaz; titleFontWeight (bileşen) 700
      const t = $('.category-image-banner-title .title', s); if (t) { t.textContent = title; Object.assign(t.style, { color: C.white, fontWeight: '700' }); }
      // buttonText, buttonBgColor beyaz, buttonColor yeşil, buttonBorderRadius, buttonPadding (11–30)
      const b = $('.category-image-banner-title .link', s); if (b) { b.textContent = 'Keşfet'; Object.assign(b.style, { backgroundColor: C.white, color: C.green, borderRadius: '50px', padding: '13px' }); }
      track.appendChild(s);
    });
    track.style.width = '100%'; track.style.transform = 'translate3d(0px, 0px, 0px)';
  }

  /* ================= ANA SAYFA ================= */
  function home() {
    const main = $('main');
    // KAYAN YAZI: backgroundColor açık pembe, color yeşil, fontSize 15 (10–30).
    // Ozy tek bir "text" alanını tekrarlar; metin: "El yapımı ✦ Gana boncukları ✦ … ✦"
    const mq = comp('0');
    const mc = $('.marquee-container', mq);
    if (mc) { mc.style.backgroundColor = C.pinkSoft; mc.style.color = C.green; }
    const marqueeText = 'El yapımı ✦ Gana boncukları ✦ Doğal taşlar ✦ Tatlı su incileri ✦ Altın detaylar ✦';
    $$('.marquee-textcontainer > a', mq).forEach(a => { a.textContent = marqueeText; });
    $$('.marquee-textcontainer', mq).forEach(t => { t.style.fontSize = '15px'; });

    // SLIDER: tek görsel (yazısı görsele işlenmiş hero)
    const sl = comp('2');
    // Her slaytta masaüstü ve mobil görsel var; görünmeyen mobil görseldir
    $$('.desktop-image-slider img', sl).forEach(img => setImg(img, 'assets/img/hero-ozy.webp', 'cover'));
    $$('.mobile-image-slider img', sl).forEach(img => setImg(img, 'assets/img/hero-ozy-m.webp', 'cover'));
    // Slider > sliderMobileHeight = 12 (1–20): mobil yükseklik 120vw, dikey mobil görsel 1080×1296
    document.head.insertAdjacentHTML('beforeend', '<style>@media (max-width:650px){.home-slider-main .slider-grid-main.slider-custom-height-71{grid-template-rows:repeat(10,12vw)!important}}</style>');
    $$('.slick-arrow, .slick-dots', sl).forEach(e => e.remove());

    // ZENGİN METİN (sayaç uygulaması yerine marka cümlesi)
    const rt = comp('1');
    const rtc = $('.rich-text-content', rt);
    if (rtc) rtc.innerHTML = `
      <h2 style="text-align:center;font-size:40px;font-weight:600;color:${C.ink};margin:0">Licht, <span style="color:${C.pinkDeep}">ışık</span> demek</h2>
      <p style="text-align:center;font-size:17px;line-height:1.6;color:${C.ink2};max-width:680px;margin:16px auto 0">Almanca’da ışık anlamına gelen Licht’te her parça atölyemizde tek tek elde diziliyor. Gana boncukları, doğal taşlar ve tatlı su incileri; güneşte daha da parlayan renkler için bir araya geliyor.</p>`;
    rt.style.padding = '48px 0 24px';

    // KATEGORİ GÖRSELLERİ (3'lü)
    const cat = comp('6');
    categoryImages(cat, [['Kolyeler', X['cat-kolye']], ['Bileklikler', X['cat-bileklik']], ['Küpeler', X['cat-kupe']]]);
    // İkinci kategori görseli bileşeni (2'li): Bonbon / Hediye kutusu
    const cat2 = cat.cloneNode(true); cat2.id = '6b';
    categoryImages(cat2, [['Bonbon serisi', X['bonbon-pembe']], ['Licht hediye kutusu', X['hediye-kutu']]], 56.25); // 16:9

    // ÜRÜN LİSTELERİ
    productList(comp('3'), 'Bu yaz yeni', ['marea', 'azzurro', 'smyrna', 'gana-red', 'red-muse', 'thalassa', 'helenistik', 'olive', 'jade-gold', 'lapis-gold', 'onyx-gold', 'navy-coin'], C.white);
    productList(comp('4'), 'Çok sevilenler', ['havana', 'santorini', 'porto', 'istanbul', 'milano', 'prag', 'bodrum', 'unique', 'marrakech', 'sevilla', 'paros', 'accra'], C.blush);

    // ÖZELLİKLER (güven şeridi)
    const fe = comp('5');
    fe.firstElementChild.style.backgroundColor = C.white;
    const ftx = ['1.500 TL üzeri ücretsiz kargo', '14 gün iade ve değişim', 'Kredi kartına taksit'];
    // ikonlar Licht'in kendi yüklediği görseller
    const icons = ['6709a5f2-9d38-446c-ab14-01e34e7a9e4f', '852fb49d-4118-47a1-89e5-ca44d7a0d5d6', '064dbbaa-c374-45d2-9e4c-c830fcef0e23'];
    $$('.feature img', fe).forEach((img, i) => { if (icons[i]) setImg(img, `https://cdn.myikas.com/images/theme-images/${icons[i]}/image_180.webp`, 'contain'); });
    // features[i].text, features[i].textColor yeşil
    $$('.feature', fe).forEach((f, i) => { const sp = [...f.children].filter(c => c.tagName === 'SPAN' && !c.querySelector('img')).pop(); if (sp) { sp.textContent = ftx[i]; sp.style.color = C.green; } });

    // BÜLTEN: image / mobileImage (Ozy kutu oranını görselden alır), bgColor, showOverlayBg kapalı,
    // titleColor yeşil + titleFontSize 32 + titleFontWeight 600, subTextColor pembe; buton tema ana rengiyle yeşil
    const nl = comp('7');
    const sm = $('.subscribe-main', nl); sm.style.backgroundColor = C.blush;
    $$('.subscribe-bg', nl).forEach(e => (e.style.display = 'none'));
    const nimgs = $$('img.blog-detail-image', nl);
    setImg(nimgs[0], 'assets/img/bulten-ozy.webp', 'cover'); setImg(nimgs[1], 'assets/img/bulten-ozy-m.webp', 'cover');
    const sizers = $$('.subscribe-main .relative > div > span > span', nl);
    if (sizers[0]) sizers[0].style.padding = `${1100 / 2880 * 100}% 0px 0px`;   // bulten-ozy.webp 2880×1100
    if (sizers[1]) sizers[1].style.padding = '100% 0px 0px';                      // bulten-ozy-m.webp 1080×1080
    const h3 = $('h3', nl); h3.textContent = 'Yeni renkler ilk sana'; Object.assign(h3.style, { color: C.green, fontSize: '32px', fontWeight: '600' });
    const st = $('.subtext', nl); st.textContent = 'Yeni seriler, drop’lar ve kampanyalardan ilk sen haberdar ol.'; st.style.color = C.pinkDeep;
    $$('.google-captcha', nl).forEach(g => (g.style.color = C.ink2));
    $$('button', nl).forEach(b => (b.textContent = 'Abone ol'));
    $$('*', nl).forEach(e => { if (e.children.length === 0 && /okudum/.test(e.textContent)) { e.textContent = 'KVKK aydınlatma metnini okudum, onaylıyorum.'; e.style.color = C.ink2; e.style.backgroundColor = 'transparent'; } });
    $$('font', nl).forEach(f => { f.style.backgroundColor = 'transparent'; f.removeAttribute('color'); });

    // BÖLÜM SIRASI (editörde sürükle-bırak)
    const order = [comp('0'), comp('2'), cat, comp('3'), comp('1'), comp('4'), cat2, comp('5'), comp('7')];
    order.forEach(el => main.appendChild(el));
  }

  /* ================= ÜRÜN SAYFASI ================= */
  function pdp() {
    const pd = comp('0');
    // + Açıklama sekmesi başlık/ikon rengi (descriptionTitleIconColor): lila → yeşil
    recolor(pd, { '30,18,82': C.green, '51,33,123': C.green, '193,47,36': C.pinkDeep, '0,0,0': C.green, '21,27,28': C.ink, '239,16,62': C.pinkDeep, '31,31,31': C.ink2, '178,167,237': C.green });
    // productNameColor, productNameFontSize (≤30), productFontWeight
    const name = $('h1.product-name', pd); if (name) Object.assign(name.style, { color: C.ink, fontSize: '30px', fontWeight: '600' });
    // discountRatioBg / Color, discountPriceBorderRadius; productPriceColor, priceFontSize (≤30)
    const pm = $('.product-detail-page-detail-price-box', pd);
    const badge = $('.discount-percent', pm); if (badge) Object.assign(badge.style, { backgroundColor: C.pinkSoft, color: C.green, borderRadius: '50px' });
    const sp = $$('.discount-price > span', pm);
    if (sp[1]) Object.assign(sp[1].style, { color: C.green, fontSize: '24px' });
    // shippingInfoDescription (zengin metin): yazı boyutu 15
    $$('.unreset p', pd).forEach(p => { p.style.fontSize = '15px'; });
    // offerTitleColor yeşil, offerTitleFontSize 20 (≤36), offerTitleFontWeight 600
    const ot = $('.add-button-offer-title', pd); if (ot) Object.assign(ot.style, { color: C.green, fontSize: '20px', fontWeight: '600' });
    const od = $('.add-button-offer-description', pd); if (od) od.textContent = 'Kolyeyle birlikte %50 indirimli; setini şimdi tamamla.';
    // Hemen Al butonu (buyNowButton* renkleri)
    const bn = $('.buy-now-button', pd); if (bn) Object.assign(bn.style, { backgroundColor: C.pinkSoft, color: C.green });
    // Kaydırma okları
    $$('.slick-arrow svg', pd).forEach(s => (s.style.color = C.green));

    // ÜRÜN LİSTESİ: "Son İncelenenler" yerine "Bunlar da yakışır"
    const pl = comp('2');
    if (pl && $('.slick-track', pl)) productList(pl, 'Bunlar da yakışır', ['havana-b', 'santorini', 'porto', 'istanbul', 'bodrum', 'milano', 'shell', 'cherry'], C.white);
    if (pl) {
      // Başlık (bileşen başlığı) ve "markayı göster" kapalı
      $$('*', pl).forEach(e => { if (e.children.length === 0 && /Son İncelenenler/i.test(e.textContent)) { e.textContent = 'Bunlar da yakışır'; Object.assign(e.style, { color: C.green, fontSize: '34px', fontWeight: '600' }); } });
      $$('*', pl).forEach(e => { if (e.children.length === 0 && e.textContent.trim() === 'Licht Studio') e.remove(); });
    }
  }

  /* ================= DUYARLI YERLEŞİM (Ozy'nin slick/swiper JS'inin yerine) =================
     Canlı lichtstudio.co'dan ölçülen kurallar:
     - duyuru ve hero: slayt = ekran genişliği
     - ürün listeleri: >768px itemCount kadar kart (Licht'te 6; POC'de 5 seçildi), 651–768px 3, ≤650px 2
     - kategori görselleri (3'lü): >768px 3, 651–768px 2, ≤650px 1 */
  const vw = () => document.documentElement.clientWidth;
  const sliders = [];
  function registerSlider(root, perView, opts = {}) {
    const list = $('.slick-list', root), track = $('.slick-track', root);
    if (!list || !track) return;
    $$('.slick-slide.slick-cloned', track).forEach(s => s.remove());
    if (opts.single) $$('.slick-slide', track).slice(1).forEach(s => s.remove());
    track.style.transform = 'none';
    if (!opts.single) list.classList.add('licht-scroll');
    const prev = $('.slick-prev', root), next = $('.slick-next', root);
    const step = dir => list.scrollBy({ left: dir * list.clientWidth, behavior: 'smooth' });
    if (prev) prev.onclick = () => step(-1);
    if (next) next.onclick = () => step(1);
    sliders.push({ root, list, track, perView, opts });
  }
  function layoutSliders() {
    sliders.forEach(({ list, track, perView, opts }) => {
      const W = list.clientWidth || list.parentElement.clientWidth;
      const n = perView(vw());
      const slides = $$('.slick-slide', track);
      const sw = W / n;
      slides.forEach(s => (s.style.width = sw + 'px'));
      track.style.width = (sw * slides.length) + 'px';
      if (opts.square) $$('.product-detail-page-slider', opts.squareRoot || list).forEach(e => (e.style.height = sw + 'px'));
    });
    // PDP galeri: dış kutu yüksekliği de ana görsele eşit (temanın JS'i bunu piksel olarak yazıyordu)
    $$('style').forEach(st => { if (/\.product-detail-page-slider \{ height:\d+px \}/.test(st.textContent)) st.remove(); });
  }
  // Duyuru bandı (swiper): tekrarlanan slaytları at, ekran genişliğinde dönsün
  function announcements() {
    const sw = $('#announcements-main .swiper'); if (!sw) return;
    const wrap = $('.swiper-wrapper', sw);
    $$('.swiper-slide-duplicate', wrap).forEach(s => s.remove());
    const slides = $$('.swiper-slide', wrap);
    sw.classList.add('licht-swiper'); sw.style.overflow = 'hidden';
    let i = 0;
    const place = () => { const W = sw.clientWidth; slides.forEach(s => (s.style.width = W + 'px')); wrap.style.transform = `translate3d(${-i * W}px,0,0)`; };
    place(); window.addEventListener('resize', place);
    if (slides.length > 1) setInterval(() => { i = (i + 1) % slides.length; place(); }, 4000);
  }
  // Header: Ozy, Üst Menü > "Mobil Hamburger Menüye Geçiş Kırılımı (px)" altında mobil düzene geçer
  // (editörde aralık 1100–1700; en düşük değer 1100 seçildi). Sınıflar canlı siteden alındı.
  const HAMBURGER_BP = 1100;
  function headerMode() {
    const hd = header(); if (!hd) return;
    const logo = $('.logo.center, .logo.center-logo-mobile', hd);
    const nav = $('.nav-links:not(.header-icons-main)', hd);
    const icons = $('.header-icons-main', hd);
    const lm = logo && $('.logo-main', logo);
    if (!logo) return;
    if (!logo.dataset.desk) { logo.dataset.desk = logo.className; logo.dataset.deskStyle = logo.getAttribute('style') || '';
      if (nav) { nav.dataset.desk = nav.className; nav.dataset.deskStyle = nav.getAttribute('style') || ''; }
      if (icons) icons.dataset.desk = icons.className; }
    const mobile = vw() < HAMBURGER_BP;
    logo.className = mobile ? 'logo relative absolute center-logo-mobile' : logo.dataset.desk;
    logo.setAttribute('style', mobile ? '' : logo.dataset.deskStyle);
    if (nav) { nav.className = mobile ? 'nav-links ' : nav.dataset.desk; nav.setAttribute('style', mobile ? '' : nav.dataset.deskStyle); }
    if (icons) icons.className = mobile ? 'header-icons-main !flex-1 center-icons' : icons.dataset.desk;
    const sticky = $('.sticky-header', hd); if (sticky) sticky.style.minHeight = mobile ? '60px' : '80px';   // canlıdaki değerler
    // Header > Logo genişliği (logoDesktopWidth / logoMobileWidth); yükseklik logonun oranından
    if (lm) { const w = mobile ? LOGO_W.mob : LOGO_W.desk; lm.style.width = w + 'px'; lm.style.height = Math.round(w * LOGO_RATIO) + 'px'; }
  }
  function responsive() {
    headerMode(); window.addEventListener('resize', headerMode);
    announcements();
    if (!isPdp) {
      registerSlider(comp('2'), () => 1, { single: true });
      [comp('3'), comp('4')].forEach(s => registerSlider(s, w => (w > 768 ? 5 : w > 650 ? 3 : 2)));
      registerSlider(comp('6'), w => (w > 768 ? 3 : w > 650 ? 2 : 1));
      registerSlider($('main [id="6b"]'), w => (w > 650 ? 2 : 1));
    } else {
      const gal = $('.variant-images-large');
      if (gal) registerSlider(gal, () => 1, { square: true, squareRoot: $('.image-slider.product-detail-page-slider') ? document : gal });
      $$('.variant-images-large .slick-dots').forEach(d => d.remove());
      if (comp('2')) registerSlider(comp('2'), w => (w > 768 ? 5 : w > 650 ? 3 : 2));
    }
    layoutSliders();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(layoutSliders, 80); });
  }
  responsive();

  LC.switcher('ozy', isPdp);   // POC gezinme çubuğu (licht-core.js)
  ready();
})();
