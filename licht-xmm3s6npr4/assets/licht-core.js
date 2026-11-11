/* Licht POC ortak yardımcıları.
   Demo temanın render edilmiş sayfasının üzerine, ikas editöründe (İçerik modu)
   yapılabilecek değişiklikleri uygular: metin, görsel, ürün listesi, bölüm sırası/gizleme, bölüm rengi. */
(function () {
  const D = window.LICHT;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const fmt = n => '₺ ' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = p => (p.old ? Math.round((p.old - p.price) / p.old * 100) : 0);

  // "Her renk bir *şehir*" → mevcut <em> sınıfını koruyarak yaz
  function rich(el, txt) {
    if (!el) return;
    const em = el.querySelector('em');
    const cls = em ? em.className : '';
    el.innerHTML = txt.replace(/\*(.+?)\*/g, `<em class="${cls}">$1</em>`);
  }
  function txt(el, t) { if (el) el.textContent = t; }
  function img(el, src, alt) {
    if (!el || !src) return;
    el.removeAttribute('srcset'); el.removeAttribute('sizes');
    el.setAttribute('loading', 'eager');
    el.src = src;
    if (alt != null) el.alt = alt;
    const pic = el.closest('picture');
    if (pic) $$('source', pic).forEach(s => s.remove());
  }
  // Tekrarlanan öğeleri (kart vb.) ilk örneği şablon alarak yeniden üret
  function fill(items, list, fn) {
    if (!items.length) return [];
    const tpl = items[0].cloneNode(true);
    const parent = items[0].parentNode;
    const anchor = items[items.length - 1].nextSibling;
    items.forEach(i => i.remove());
    return list.map((d, i) => {
      const n = tpl.cloneNode(true);
      parent.insertBefore(n, anchor);
      fn(n, d, i);
      return n;
    });
  }
  // Metin düğümlerinde birebir eşleşeni değiştir
  function replaceText(root, map) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) {
      const t = n.textContent.trim();
      if (map[t] != null) n.textContent = n.textContent.replace(t, map[t]);
    }
  }
  // Bölümün tema bileşen sarmalayıcısı (stil kapsamı bu div'de: .cc_<id>)
  function wrapOf(el) {
    let w = el;
    while (w.parentElement && w.parentElement !== document.body && /(^|\s)cc_/.test(w.parentElement.className || '')) w = w.parentElement;
    return w;
  }
  function hideSection(el) { if (el) wrapOf(el).remove(); }
  // Bölüm sırası (editörde sürükle-bırak): a bölümünü b'den sonraya taşı
  function moveAfter(a, b) { if (a && b) wrapOf(b).after(wrapOf(a)); }
  function ready() { const b = document.getElementById('licht-boot'); if (b) b.remove(); }

  // POC gezinme çubuğu (canlı sitede olmaz): tema [Obsidyen | Ozy] + sayfa [Ana sayfa | Ürün sayfası]
  const PAGES = {
    obsidyen: { home: 'licht-obsidyen.html', pdp: 'licht-obsidyen-urun.html' },
    ozy: { home: 'licht-ozy.html', pdp: 'licht-ozy-urun.html' },
  };
  const SW_CSS = `
  .lsw, .lsw * { box-sizing: border-box; margin: 0; font-family: Manrope, -apple-system, system-ui, 'Segoe UI', Roboto, Arial, sans-serif; letter-spacing: normal; text-transform: none; line-height: 1; }
  .lsw { position: fixed; z-index: 2147483000; left: 16px; bottom: 16px; display: flex; align-items: center; gap: 6px; padding: 5px;
    border-radius: 999px; background: #294B32; box-shadow: 0 8px 24px rgba(0,0,0,.22); font-size: 13px; font-weight: 600; }
  .lsw-tag { padding: 0 4px 0 10px; color: #FFA2CB; font-size: 11px; font-weight: 700; letter-spacing: .08em; }
  .lsw-seg { display: flex; padding: 3px; border-radius: 999px; background: rgba(255,255,255,.1); }
  .lsw-seg a { display: flex; align-items: baseline; gap: 6px; padding: 9px 14px; border-radius: 999px; color: #FFE3EE; text-decoration: none; white-space: nowrap; transition: background-color .15s, color .15s; }
  .lsw-seg a:hover { background: rgba(255,255,255,.14); }
  .lsw-seg a[aria-current] { background: #FFE3EE; color: #294B32; cursor: default; }
  .lsw-sub { font-size: 10.5px; font-weight: 500; opacity: .65; }
  .lsw-short { display: none; }
  @media (max-width: 650px) {
    .lsw { left: 50%; bottom: 10px; transform: translateX(-50%); gap: 4px; padding: 4px; font-size: 12px; max-width: calc(100% - 16px); }
    .lsw-tag, .lsw-sub, .lsw-long { display: none; }
    .lsw-short { display: inline; }
    .lsw-seg a { padding: 8px 11px; }
  }`;
  function switcher(theme, isPdp) {
    if (!document.getElementById('lsw-css')) document.head.insertAdjacentHTML('beforeend', `<style id="lsw-css">${SW_CSS}</style>`);
    const page = isPdp ? 'pdp' : 'home';
    const link = (href, on, html, label) => `<a href="${href}"${on ? ' aria-current="page"' : ''} aria-label="${label}">${html}</a>`;
    document.body.insertAdjacentHTML('beforeend', `
      <nav class="lsw" aria-label="POC gezinme">
        <span class="lsw-tag">POC</span>
        <div class="lsw-seg" role="group" aria-label="Tema">
          ${link(PAGES.obsidyen[page], theme === 'obsidyen', 'Obsidyen<span class="lsw-sub">₺25.999</span>', 'Obsidyen teması')}
          ${link(PAGES.ozy[page], theme === 'ozy', 'Ozy<span class="lsw-sub">ücretsiz</span>', 'Ozy teması')}
        </div>
        <div class="lsw-seg" role="group" aria-label="Sayfa">
          ${link(PAGES[theme].home, !isPdp, 'Ana sayfa', 'Ana sayfa')}
          ${link(PAGES[theme].pdp, isPdp, '<span class="lsw-long">Ürün sayfası</span><span class="lsw-short">Ürün</span>', 'Ürün sayfası')}
        </div>
      </nav>`);
    // Seçili olana tıklamak sayfayı yeniden yüklemesin
    document.querySelectorAll('.lsw a[aria-current]').forEach(a => a.addEventListener('click', e => e.preventDefault()));
  }

  window.LC = { D, P: D.p, X: D.x, $, $$, fmt, pct, rich, txt, img, fill, replaceText, hideSection, moveAfter, wrapOf, ready, switcher };
})();
