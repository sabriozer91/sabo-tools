/* Licht × Obsidyen — içerik katmanı.
   Her blok, ikas editöründe aynı bölümün ayarlarında yapılacak değişikliği temsil eder. */
(function () {
  const { P, X, $, $$, fmt, pct, rich, txt, img, fill, replaceText, hideSection, moveAfter, ready } = window.LC;
  const PDP = 'licht-obsidyen-urun.html', HOME = 'licht-obsidyen.html';
  const sec = c => $('section.' + c);
  const isPdp = !!sec('pdp');

  /* ---------- Ürün kartı (pcard) ---------- */
  function pcard(card, p) {
    const a = $('a.pcard', card) || card;
    a.href = PDP;
    const [i1, i2] = $$('.pcard-img', card);
    img(i1, p.img, p.n);
    if (i2) { if (p.alt) img(i2, p.alt, ''); else { i2.remove(); a.classList.remove('pcard--swap'); } }
    txt($('.pcard-name', card), p.n);
    const d = $('.pcard-desc', card);
    if (d) { if (p.v) d.textContent = p.v; else d.remove(); }
    const pr = $('.pcard-price', card);
    pr.classList.toggle('is-sale', !!p.old);
    pr.innerHTML = `<span class="pcard-price-final">${fmt(p.price)}</span>` + (p.old ? `<s class="pcard-price-old">${fmt(p.old)}</s>` : '');
    $$('.pcard-badges', card).forEach(b => b.remove());
    if (p.old) {
      const fav = $('.pcard-fav', card);
      fav.insertAdjacentHTML('beforebegin', `<div class="pcard-badges"><span class="o-badge pcard-badge--sale _VxG9ikaNaK tabular">%${pct(p)}</span></div>`);
    }
  }
  function fillCards(section, keys) {
    fill($$('.pcar-card', section), keys.map(k => P[k]), pcard);
  }
  // küçük ürün satırı (lpc)
  function lpc(el, p) {
    $$('a', el).forEach(a => (a.href = PDP));
    img($('.lpc-img', el), p.img, '');
    txt($('.lpc-name', el), p.n);
    const pr = $('.lpc-price', el);
    if (pr) {
      pr.classList.toggle('is-sale', !!p.old);
      pr.innerHTML = `<span class="lpc-price-final">${fmt(p.price)}</span>` + (p.old ? `<s class="lpc-price-old">${fmt(p.old)}</s>` : '');
    }
  }

  /* ================= HEADER (her sayfa) ================= */
  // Duyuru bandı: Header > Duyurular
  const annc = ['1.500 TL ve üzeri siparişlerde ücretsiz kargo', 'Bilekliklerde 3 al 2 öde'];
  $$('.annc-item').forEach((a, i) => (a.textContent = annc[i % 2]));
  // Menü: Header > Menü öğeleri (etiketler)
  replaceText($('.hdr-nav'), { 'Yeni Gelenler': 'Summer ’26', 'Takılar': 'Takılar', 'Kombinler': 'Bonbon', 'Çok Satanlar': 'Erkek', 'Hikâyemiz': 'Hediye' });
  // Logo: (Scriptler CSS'i) yazı logo yerine görsel
  const lt = $('.hdr-logo-text');
  if (lt) lt.outerHTML = '<img class="licht-logo" src="assets/img/logo-yesil.png" alt="Licht Studio">';
  $('.hdr-logo') && ($('.hdr-logo').href = HOME);

  // Header kaydırma davranışı — temanın JS'i kaldırıldığı için demodaki mantık birebir:
  // en üstte şeffaf (hero üstünde), kaydırınca beyaz + gölge, aşağı inerken gizlenir,
  // yukarı çıkınca geri gelir; duyuru bandı kayarken header ona yapışık iner.
  (function headerScroll() {
    const fixed = $('.hdr-fixed'), bar = $('.hdr-bar');
    if (!fixed || !bar) return;
    const anncH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--annc-h')) || 36;
    const overHero = bar.classList.contains('hdr-bar--transparent');
    const HIDE_AFTER = 150;
    let lastY = window.scrollY;
    function update() {
      const y = Math.max(0, window.scrollY);
      const top = y <= 0;
      fixed.style.transform = `translateY(${Math.max(0, anncH - y)}px)`;
      bar.classList.toggle('hdr-bar--transparent', overHero && top);
      bar.classList.toggle('hdr-bar--on-light', overHero && top);
      bar.classList.toggle('hdr-bar--solid', !(overHero && top));
      bar.classList.toggle('hdr-bar--raised', !top);
      if (y > lastY && y > HIDE_AFTER) bar.classList.add('hdr-bar--hidden');
      else if (y < lastY || y <= HIDE_AFTER) bar.classList.remove('hdr-bar--hidden');
      lastY = y;
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();
  // Sepet çekmecesi metinleri
  replaceText(document.body, { 'Ücretsiz kargoya {amount} kaldı': 'Ücretsiz kargoya ₺ 1,500.00 kaldı' });

  /* ================= FOOTER (her sayfa) ================= */
  const ftr = sec('ftr');
  if (ftr) {
    ftr.style.backgroundColor = 'var(--bkf9Pptudo, #ffffff)';   // Footer > Arka plan: Marka/Açık
    ftr.style.color = 'var(--ckIysxzNu0, #ffffff)';            // Footer > Metin rengi: Marka/Derin (yeşil)
    rich($('.ftr-news-head h2', ftr), 'Yeni *renkler* ilk sana');
    txt($('.ftr-news-text', ftr), 'Yeni seriler, drop’lar ve kampanyalardan ilk sen haberdar ol. Kaydol, ilk siparişine özel indirim kazan.');
    const cols = [
      ['Yardım', ['Teslimat, Kargo, İade', 'Sipariş Takibi', 'Mesafeli Satış Sözleşmesi', 'İletişim']],
      ['Keşfet', ['Kolyeler', 'Bileklikler', 'Küpeler', 'Bonbon', 'Summer ’26']],
      ['Licht', ['Hakkımızda', 'KVKK', 'Çerez Politikası', 'Instagram']],
    ];
    $$('.ftr-col', ftr).forEach((c, i) => {
      if (!cols[i]) { c.remove(); return; }
      txt($('.ftr-col-title', c), cols[i][0]);
      fill($$('.ftr-col-list li', c), cols[i][1], (li, t) => txt($('a', li), t));
    });
    const mark = $('.ftr-mark', ftr);
    if (mark) mark.innerHTML = '<img class="licht-logo" src="assets/img/logo-yesil.png" alt="Licht Studio">';
    txt($('.ftr-copyright', ftr), '© 2026, Licht Studio.');
    replaceText(ftr, { 'Kargo ve İade': 'Teslimat ve İade' });
  }

  /* ================= GÜVEN ŞERİDİ (vstrip) ================= */
  const vs = sec('vstrip');
  if (vs) {
    const b = [['Ücretsiz kargo', '1.500 TL ve üzeri siparişlerde'], ['%100 el işçiliği', 'Her parça size özel üretilir'],
               ['Hediye paketi', 'Licht kutusuyla, hediyeye hazır'], ['Kolay iade', '14 gün iade garantisi']];
    $$('.obadge', vs).forEach((o, i) => { txt($('.obadge-title', o), b[i][0]); txt($('.obadge-desc', o), b[i][1]); });
  }

  if (!isPdp) home(); else pdp();

  /* ================= ANA SAYFA ================= */
  function home() {
    // HERO — görsel, başlık, paragraf, butonlar
    const h = sec('hero');
    img($('.hero-img', h), 'assets/img/hero-obsidyen.webp', 'Açık pembe zeminde Havana ve Santorini kolyeler');
    $('.hero-img', h).insertAdjacentHTML('beforebegin', '<source media="(max-width: 768px)" srcset="assets/img/hero-obsidyen-m.webp">'); // Hero > Mobil görsel
    rich($('.hero-heading', h), 'Her renk bir *şehir*');
    txt($('.hero-paragraph', h), 'Havana’dan Santorini’ye; Gana boncukları, doğal taşlar ve altın detaylarla elde dizilen kolyeler ve bileklikler.');
    txt($('.hero-actions .o-btn', h), 'Koleksiyonu keşfet');
    txt($('.hero-link', h), 'Bonbon serisi');

    // KATEGORİ LİSTESİ — 6 kategori, ikas kategori görselleri
    const cats = [['Kolyeler', 'cat-kolye'], ['Bileklikler', 'cat-bileklik'], ['Küpeler', 'cat-kupe'], ['Bonbon', 'cat-bonbon'], ['Erkek', 'cat-erkek'], ['Hediye', 'cat-hediye']];
    const cl = sec('catlist');
    fill($$('.catlist-item', cl), cats, (li, [n, k]) => { img($('.ocat-img', li), X[k], n); txt($('.ocat-name', li), n); });

    // ÜRÜN SLIDER — Summer '26 kategorisine bağlı
    const ps = sec('pslider');
    rich($('.pslider-title', ps), 'Bu yaz *yeni*');
    txt($('.pslider-desc', ps), 'Summer ’26 serisinden: Akdeniz mavileri, mercan kırmızısı ve barok inciler.');
    fillCards(ps, ['marea', 'azzurro', 'smyrna', 'gana-red', 'red-muse', 'thalassa', 'helenistik', 'olive', 'jade-gold', 'lapis-gold', 'onyx-gold', 'navy-coin']);

    // İKİLİ GÖRSEL
    const ip = sec('ipair');
    const pair = [['Bonbon serisi', 'bonbon-pembe'], ['Licht hediye kutusu', 'hediye-kutu']];
    $$('.ipair-card', ip).forEach((c, i) => { c.href = '#'; img($('.ipair-img', c), X[pair[i][1]], pair[i][0]); txt($('.ipair-label', c), pair[i][0]); });

    // SEKMELİ ÜRÜNLER — şehir kolyeleri / bileklikler
    const pt = sec('ptabs');
    pt.style.backgroundColor = 'var(--rByxa8MJ1Z, #ffffff)'; // Bölüm arka planı: Nötr/Yüzey
    rich($('.ptabs-title', pt), 'Çok *sevilenler*');
    const tabs = $$('.ptabs-tab', pt); txt(tabs[0], 'Şehir kolyeleri'); txt(tabs[1], 'Bileklikler');
    fillCards(pt, ['havana', 'santorini', 'porto', 'istanbul', 'milano', 'prag', 'bodrum', 'unique', 'marrakech', 'sevilla', 'paros', 'accra']);
    const dots = $$('.pcar-dot', pt); dots.slice(6).forEach(d => d.remove());

    // UGC — "Siz de parlayın": marka paylaşımları
    const ug = sec('ugc');
    rich($('.ugc-title', ug), 'Güneşte *parlayanlar*');
    const u = [['ugc-1', 'aquamarin', 'Aquamarin, plaj çantasının en hafif parçası'], ['ugc-2', 'barok-jade', 'Barok in Jade: yeşilin en tatlı hâli'],
               ['ugc-3', 'lilac', 'Lilac ile gün batımı'], ['ugc-4', 'shell', 'Shell ve kiraz kırmızısı küpe'],
               ['ugc-5', 'pearl-turq', 'Pearl Line – Turquoise'], ['ugc-6', 'istanbul', 'İstanbul: lacivertin şehri']];
    fill($$('.ugc-track > div > div', ug), u, (c, [im, k, cap]) => {
      img($('.ugcc-media', c), X[im], ''); txt($('.ugcc-author', c), '@lichtstudio'); txt($('.ugcc-caption', c), cap); lpc($('.lpc', c), P[k]);
    });

    // LOOK GRID — "Setini birlikte tamamla" (işaretli görseller)
    const lg = sec('lgrid');
    rich($('.lgrid-title', lg), 'Setini *birlikte* tamamla');
    const looks = [
      { im: 'look-shell', t: 'Kiraz *kırmızısı*', d: 'Shell kolyenin tek kırmızı boncuğunu Cherry küpeyle tekrar et; sade bir üst bile yeter.', items: [['shell', 61, 71], ['cherry', 72, 15]] },
      { im: 'look-bileklik', t: 'Üç bileklik, *iki* fiyat', d: 'Bonbon bileklikleri üst üste tak; sepette 3 al 2 öde.', items: [['spark-pink-b', 57, 58], ['edge-b', 43, 60]] },
      { im: 'look-havana', t: 'Havana, *tek başına*', d: 'Toprak tonları, yeşil detaylar ve altın ışıltı; beyaz bir gömleğe karakter katar.', items: [['havana', 50, 27]] },
    ];
    fill($$('.lgrid-list > div > div', lg), looks, (c, L) => {
      img($('.lstage-img', c), X[L.im], '');
      rich($('.lookc-title', c), L.t);
      txt($('.lookc-desc', c), L.d);
      fill($$('.lstage-spot', c), L.items, (s, [k, x, y], i) => { s.style.left = x + '%'; s.style.top = y + '%'; s.setAttribute('aria-label', P[k].n); txt($('.lstage-spot-dot', s), i + 1); });
      fill($$('.lstage-item', c), L.items, (li, [k], i) => { txt($('.lpc-marker', li), i + 1); lpc($('.lpc', li), P[k]); });
    });

    // YORUMLAR — Licht'te henüz ürün yorumu yok → bölüm kaldırıldı
    hideSection(sec('tst'));

    // METİN BLOĞU
    const tb = sec('txtb');
    rich($('.txtb-heading', tb), 'Licht, *ışık* demek');
    txt($('.txtb-paragraph', tb), 'Almanca’da ışık anlamına gelen Licht’te her parça atölyemizde tek tek elde diziliyor. Gana boncukları, doğal taşlar ve tatlı su incileri; güneşte daha da parlayan renkler için bir araya geliyor.');
    txt($('.txtb-link', tb), 'Hikâyemiz');

    // ÜÇLÜ MEDYA
    const mt = sec('mtrio');
    rich($('.mtrio-heading', mt), 'Elden *kutuya*');
    txt($('.mtrio-description p', mt), 'Dizilen her boncuktan hediye kutusuna kadar aynı özen.');
    const tr = [['trio-1', 'El işçiliği', '%100 el işçiliği; her parça siparişinle birlikte size özel üretilir.'],
                ['trio-2', 'Doğal taşlar', 'Gana boncukları, kuvars, sodalit, yeşim ve tatlı su incileri.'],
                ['trio-3', 'Özel paketleme', 'Licht kutusunda, hediye etmeye hazır. Ürün sayfasında +₺180 ile seçilir.']];
    $$('.mtrio-card', mt).forEach((c, i) => { img($('.mtrio-media', c), X[tr[i][0]], ''); txt($('.mtrio-title', c), tr[i][1]); txt($('.mtrio-text p', c), tr[i][2]); });

    // BLOG — Licht'te blog yok → bölüm kaldırıldı
    hideSection(sec('bslider'));

    // Bölüm sırası: Güneşte parlayanlar, set bölümünden sonra gelsin
    moveAfter(ug, lg);
  }

  /* ================= ÜRÜN SAYFASI (Havana) ================= */
  function pdp() {
    const p = P['havana'], b = P['havana-b'];
    const s = sec('pdp');
    // Breadcrumb
    const crumbs = ['Ana Sayfa', 'Kolye', 'Havana'];
    const items = $$('.breadcrumb__item', s);
    items.forEach((li, i) => { if (i >= crumbs.length) li.remove(); else txt($('.breadcrumb__link', li) || li.firstChild, crumbs[i]); });
    const last = $$('.breadcrumb__item', s).pop(); const sep = last && $('.breadcrumb__sep', last); if (sep) sep.remove();
    // Galeri: ürün görselleri + paketleme
    const g = [p.imgs[0], p.imgs[1], X['hediye-kutu']];
    const rows = $$('.gallery__row', s);
    img($('.gallery__img', rows[0]), g[0], 'Havana kolye');
    const pairImgs = $$('.gallery__img', rows[1]); img(pairImgs[0], g[1], 'Havana kolye model üzerinde'); img(pairImgs[1], g[2], 'Licht hediye kutusu');
    rows.slice(2).forEach(r => r.remove());
    fill($$('.gallery__slide', s), g, (sl, src) => img($('.gallery__img', sl), src, ''));
    $$('.sdots__item', s).slice(g.length).forEach(d => d.remove());
    // Başlık, kod, fiyat
    txt($('.pdp__title', s), p.n);
    $('.pdp__sku', s) && $('.pdp__sku', s).remove();
    const pr = $('.pdp__price', s);
    pr.innerHTML = `<span class="pdp__price-final is-discounted tabular _IoRD2k7jW8">${fmt(p.price)}</span><s class="pdp__price-old tabular _O2bFLETkoc">${fmt(p.old)}</s><span class="o-badge _VxG9ikaNaK tabular">%${pct(p)}</span>`;
    // Varyant yok (Havana tek seçenek) → renk seçici gizlenir
    $('.variants', s) && $('.variants', s).remove();
    // Ürün seçeneği (ikas Ürün Seçenekleri): Özel Paketleme +₺180
    const purchase = $('.pdp__purchase', s);
    purchase.insertAdjacentHTML('beforebegin', `
      <div class="popt"><fieldset class="popt__field"><legend class="popt__label _HgOlpntLhh">Hediye</legend>
        <label class="popt__check _fn67aKfLuW"><input type="checkbox"> Özel paketleme <span class="tabular">(+₺ 180.00)</span></label>
      </fieldset></div>
      <div class="offers">
        <p class="offers__title _LFQmvOWSSZ">Setini tamamla</p>
        <ul class="offers__list"><li>
          <button type="button" class="offers__row" role="checkbox" aria-checked="true">
            <span class="offers__check"><svg class="offers__check-icon" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            <span class="offers__thumb"><img class="offers__img" src="${b.img}" alt=""></span>
            <span class="offers__info"><span class="offers__name _HgOlpntLhh">${b.n}</span><span class="offers__desc _VxG9ikaNaK">Kolyeyle birlikte %50 indirimli</span></span>
            <span class="offers__price"><span class="offers__price-final is-discounted tabular _HgOlpntLhh">${fmt(1430)}</span><s class="offers__price-old tabular _VxG9ikaNaK">${fmt(2860)}</s></span>
          </button></li></ul>
        <div class="offers__total"><span class="offers__total-label _fn67aKfLuW">Avantajlı toplam</span>
          <span class="offers__total-value"><span class="tabular _tgvfrAJV92">${fmt(p.price + 1430)}</span><s class="tabular _VxG9ikaNaK" style="color:var(--jq4Z0Bq66E)">${fmt(p.old + 2860)}</s></span>
          <span class="offers__save _VxG9ikaNaK">Setle birlikte ₺ 1,430.00 avantaj</span></div>
      </div>`);
    $$('.atc__btn .tabular', s).forEach(e => (e.textContent = fmt(p.price)));
    // Güven maddeleri (Ürün detayı bölüm ayarı)
    const tl = $$('.pdp__trust li', s);
    const trust = ['1.500 TL üzeri ücretsiz kargo, 4 iş gününde kargoda', '14 gün iade garantisi (küpeler hariç)', 'Licht kutusuyla özel paketleme seçeneği'];
    tl.forEach((li, i) => { li.lastChild.textContent = trust[i]; });
    // Açılır bloklar
    const acc = [
      ['Ürün açıklaması', `<p><strong>Havana Kolye</strong></p><ul><li>Materyal: Farklı renklerde el yapımı cam boncuklar, el yapımı Gana boncukları, altın kaplama hematit taşları ve altın detaylar</li><li>Uzunluk: 38 cm + 4 cm uzatma zinciri</li><li>Üretim: El yapımı</li></ul><p>Havana, toprak tonlarını yeşil detaylar ve altın ışıltısıyla buluşturan, desenli boncuklarıyla öne çıkan özgün bir tasarım. Kahverengi ve krem tonlarındaki Gana boncukları, yeşilin farklı tonları ve sıcak renkli cam boncuklarla bir araya gelerek kolyeye güçlü, doğal ve karakterli bir görünüm kazandırıyor.</p><p>Şunlarla harika uyum sağlar: Havana Bileklik</p>`],
      ['Kargo ve iade', '<p>1.500 TL ve üzeri siparişlerde kargo ücretsiz. Her parça siparişinle birlikte üretilir ve 4 iş günü içinde kargoya verilir.</p><p>14 gün içinde iade edebilirsin. Hijyen gereği küpelerde iade kabul edilmez.</p>'],
      ['Bakım önerileri', '<p>Parfüm, krem ve suyla temasından kaçın. Kullanmadığında kutusunda, nemden uzak sakla; yumuşak ve kuru bir bezle silmen yeterli.</p>'],
    ];
    $$('.accordion', s).forEach((a, i) => { txt($('.accordion__title', a), acc[i][0]); $('.accordion__body', a).innerHTML = acc[i][1]; });

    // Benzer ürünler slider'ı
    const ps = sec('pslider');
    if (ps) { rich($('.pslider-title', ps), 'Bunlar da *yakışır*'); fillCards(ps, ['havana-b', 'santorini', 'porto', 'istanbul', 'bodrum', 'milano', 'santorini-b', 'porto-b', 'shell', 'cherry']); }
    const rv = sec('rviewed');
    if (rv) fillCards(rv, ['havana', 'santorini', 'marea', 'cherry']);
  }

  LC.switcher('obsidyen', isPdp);   // POC gezinme çubuğu (licht-core.js)
  ready();
})();
