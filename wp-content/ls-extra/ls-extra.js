/* 採用サイトの追加演出（LS-Dev-JP/saiyou）
 * 1. 歩く 2 人と流れる背景（固定帯のあるページ）
 * 2. 交差して流れる帯（トップ・会社紹介・採用情報）
 * 動きを減らす設定の端末では止まる。 */
var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^/]*$/, '');
(function () {
  /* フッター上の固定帯「挑戦を楽しむ、新しい仲間へ」の右側で、男女 2 人が歩き、背景（雲・山・町・飛行機・鳥）が流れる */
  /* ---- 背景の絵（線画、高さ 140 を基準に描く。横につなげて流す） ---- */
  var L = 'stroke-linecap="round" stroke-linejoin="round"';
  function uri(w, body) {
    return 'url("data:image/svg+xml,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="140" viewBox="0 0 ' + w + ' 140">' + body + '</svg>') + '")';
  }
  var MOUNT = uri(640, '<path d="M0 124 L60 92 L110 108 L190 58 L250 96 L310 74 L390 112 L440 96 L520 66 L590 104 L640 124" fill="#fff" stroke="#d5d8df" stroke-width="1.5" ' + L + '/>' +
    '<path d="M178 66 L190 58 L203 67 M508 74 L520 66 L533 75" fill="none" stroke="#d5d8df" stroke-width="1.5" ' + L + '/>');
  var CLOUD = uri(900, ['M110 34 a9 9 0 0 1 14 -10 a13 13 0 0 1 24 2 a9 9 0 0 1 4 16 h-38 a8 8 0 0 1 -4 -8 z',
    'M520 46 a8 8 0 0 1 12 -8 a11 11 0 0 1 21 2 a8 8 0 0 1 3 14 h-32 a7 7 0 0 1 -4 -8 z',
    'M760 26 a7 7 0 0 1 11 -7 a10 10 0 0 1 18 1 a7 7 0 0 1 3 12 h-28 a6 6 0 0 1 -4 -6 z'].map(function (d) {
      return '<path d="' + d + '" fill="#fff" stroke="#dfe2e8" stroke-width="1.5" ' + L + '/>';
    }).join(''));
  var g = 'fill="#fff" stroke="#9aa1ad" stroke-width="1.5" ' + L;
  var TOWN = uri(720,
    /* 家1 */ '<rect x="40" y="92" width="44" height="32" ' + g + '/><path d="M34 92 L62 70 L90 92 Z" ' + g + '/><rect x="56" y="106" width="10" height="18" ' + g + '/><rect x="70" y="99" width="8" height="8" ' + g + '/>' +
    /* 木 */ '<path d="M150 124 V104" ' + g + '/><circle cx="150" cy="94" r="12" ' + g + '/>' +
    /* 家2 */ '<rect x="274" y="64" width="7" height="14" ' + g + '/><rect x="230" y="84" width="56" height="40" ' + g + '/><path d="M224 84 L258 62 L292 84 Z" ' + g + '/><rect x="240" y="94" width="10" height="10" ' + g + '/><rect x="266" y="94" width="10" height="10" ' + g + '/><rect x="252" y="108" width="11" height="16" ' + g + '/>' +
    /* 針葉樹 */ '<path d="M350 124 V112" ' + g + '/><path d="M338 112 L350 82 L362 112 Z" ' + g + '/>' +
    /* ビル */ '<rect x="430" y="58" width="40" height="66" ' + g + '/>' +
    [64, 78, 92, 106].map(function (y) { return '<rect x="438" y="' + y + '" width="8" height="7" ' + g + '/><rect x="454" y="' + y + '" width="8" height="7" ' + g + '/>'; }).join('') +
    /* 小さい家 */ '<rect x="540" y="100" width="36" height="24" ' + g + '/><path d="M536 100 H580" ' + g + '/><rect x="550" y="108" width="8" height="8" ' + g + '/>' +
    /* 木 */ '<path d="M640 124 V108" ' + g + '/><circle cx="640" cy="99" r="10" ' + g + '/>');
  var GROUND = uri(80, '<path d="M0 124 H80" stroke="#8f96a3" stroke-width="1.5"/><path d="M18 130 H27 M57 134 H61" stroke="#c6cad3" stroke-width="1.5" ' + L + '/>');

  var css = [
    /* B: 右の余白に「窓」を作り、その中で 2 人が歩き景色が流れる */
    '.lsw-scene{--k:1;position:absolute;bottom:0;left:calc(50% + 215px);width:min(480px,calc(50% - 215px));height:calc(140px*var(--k));pointer-events:none;z-index:2}',
    '.lsw-bg{position:absolute;inset:0;overflow:hidden;-webkit-mask-image:linear-gradient(to right,transparent,#000 70px,#000 calc(100% - 50px),transparent);mask-image:linear-gradient(to right,transparent,#000 70px,#000 calc(100% - 50px),transparent)}',
    '.lsw-l{position:absolute;inset:0;background-repeat:repeat-x;background-size:auto 100%;animation:lswScroll linear infinite}',
    '@keyframes lswScroll{from{background-position-x:0}to{background-position-x:var(--w)}}',
    '.lsw-cloud{background-image:' + CLOUD + ';--w:calc(-900px*var(--k));animation-duration:120s}',
    '.lsw-mount{background-image:' + MOUNT + ';--w:calc(-640px*var(--k));animation-duration:48s}',
    '.lsw-town{background-image:' + TOWN + ';--w:calc(-720px*var(--k));animation-duration:15s}',
    '.lsw-ground{background-image:' + GROUND + ';--w:calc(-80px*var(--k));animation-duration:.8s}',
    '.lsw-fly{position:absolute;left:100%;animation:lswFly linear infinite}',
    '.lsw-plane{top:calc(10px*var(--k));width:calc(64px*var(--k));animation-duration:26s;animation-name:lswPlane}',
    '.lsw-birds{top:calc(30px*var(--k));width:calc(54px*var(--k));animation-duration:19s;animation-delay:-6s}',
    '@keyframes lswFly{from{left:100%}to{left:-90px}}',
    '@keyframes lswPlane{0%{left:100%}45%{left:-110px}100%{left:-110px}}',
    '.lsw-scene img.lsw-walk{max-width:none;position:absolute;left:calc(46px*var(--k));bottom:calc(16px*var(--k));height:calc(110px*var(--k));width:auto;z-index:3}',
    '@media (max-width:1100px) and (min-width:768px){.lsw-scene{--k:.78;left:calc(50% + 205px);width:calc(50% - 205px)}}',
    '@media (max-width:767px){',
    ' .lsw-scene{--k:.46;bottom:100%;left:auto;right:0;width:210px}',
    ' .lsw-scene img.lsw-walk{left:auto;right:12px}',
    ' .lsw-bg{background:#fff;-webkit-mask-image:linear-gradient(to right,transparent,#000 50px);mask-image:linear-gradient(to right,transparent,#000 50px)}',
    '}',
    '@media (prefers-reduced-motion:reduce){.lsw-l,.lsw-fly{animation:none}}',
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var band = [].slice.call(document.querySelectorAll('.e-con')).filter(function (e) {
    return getComputedStyle(e).position === 'fixed' && e.textContent.indexOf('挑戦を楽しむ') >= 0;
  })[0];
  if (!band) return;

  var flap = '<animate attributeName="d" dur="0.6s" repeatCount="indefinite" values="M0 6 Q5 0 10 6 Q15 0 20 6;M0 3 Q5 8 10 6 Q15 8 20 3;M0 6 Q5 0 10 6 Q15 0 20 6"/>';
  var scene = document.createElement('div'); scene.className = 'lsw-scene'; scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML =
    '<div class="lsw-bg">' +
    '<div class="lsw-l lsw-cloud"></div><div class="lsw-l lsw-mount"></div><div class="lsw-l lsw-town"></div><div class="lsw-l lsw-ground"></div>' +
    /* 飛行機（左向き）と飛行機雲 */
    '<svg class="lsw-fly lsw-plane" viewBox="0 0 64 20"><path d="M40 10 H62" stroke="#d5d8df" stroke-width="1.5" stroke-dasharray="3 3"/>' +
    '<path d="M4 10 Q6 7 12 7 H34 L38 3 H41 L39 8 Q41 10 39 12 L41 15 H38 L34 13 H12 Q6 13 4 10 Z" fill="#fff" stroke="#8f96a3" stroke-width="1.3" stroke-linejoin="round"/>' +
    '<path d="M18 10 L24 17 H27 L25 10" fill="#fff" stroke="#8f96a3" stroke-width="1.3" stroke-linejoin="round"/></svg>' +
    /* 鳥 3 羽 */
    '<svg class="lsw-fly lsw-birds" viewBox="0 0 60 30" fill="none" stroke="#7d8492" stroke-width="1.6" stroke-linecap="round">' +
    '<path d="M0 6 Q5 0 10 6 Q15 0 20 6">' + flap + '</path>' +
    '<g transform="translate(24 12) scale(.8)"><path d="M0 6 Q5 0 10 6 Q15 0 20 6">' + flap.replace('0.6s', '0.5s') + '</path></g>' +
    '<g transform="translate(40 2) scale(.65)"><path d="M0 6 Q5 0 10 6 Q15 0 20 6">' + flap.replace('0.6s', '0.7s') + '</path></g></svg>' +
    '</div>' +
    '<img class="lsw-walk" src="' + BASE + 'walk-pair.gif" alt="">';
  band.appendChild(scene);

})();

(function () {
  /* 斜めに交差する 2 本の帯（青・オレンジのパステル）に英語の言葉を逆向きに流す */
  /* ページごとの置き場所（この要素の直後に入れる）と、2 本の帯に流す言葉（英語のみ） */
  var PLACES = {
    top: { after: '004239e', where: 'MISSION と「一緒に働く仲間たち」の間',
      a: ['Be Your First Choice'],
      b: ['Be Curious', 'Be Honest', 'Be a Team Player'] },
    about: { after: 'ded6d33', where: '行動指針と PROCESS の間',
      a: ['Be Your First Choice'],
      b: ['Be Curious', 'Be Honest', 'Be a Team Player'] },
    jobs: { before: '9793890', where: '募集職種一覧の直前',
      a: ['We Are Hiring', 'Join us'],
      b: ['Be Curious', 'Be Honest', 'Be a Team Player'] }
  };
  var path = decodeURIComponent(location.pathname);
  /* トップは公開先によって「/」や「/saiyou-test/」になるので、ほかのページ名を含まないことで判定する */
  var key = path.indexOf('会社紹介') >= 0 ? 'about' : path.indexOf('採用情報') >= 0 ? 'jobs'
    : /メンバー紹介|働く環境/.test(path) ? null : 'top';
  if (!key) return;
  var P = PLACES[key];
  var anchor = document.querySelector('.elementor-element-' + (P.after || P.before));
  if (!anchor) return;

  /* 青とオレンジのパステル。文字は帯ごとに同じ系統の濃い色 */
  var BLUE_BG = 'linear-gradient(90deg,#c9d4f6,#dbe3fa 50%,#c9d4f6)', BLUE_INK = '#2f3a86';
  var ORG_BG = 'linear-gradient(90deg,#ffd3bb,#ffe4d4 50%,#ffd3bb)', ORG_INK = '#b8531f';
  var css = [
    '.lsr{position:relative;height:250px;overflow:hidden;pointer-events:none}',
    '.lsr-band{position:absolute;left:-10%;width:120%;top:50%;height:66px;display:flex;align-items:center;overflow:hidden}',
    /* 帯の内側に細い白線を上下 1 本ずつ（リボンの縁取り） */
    '.lsr-band::before,.lsr-band::after{content:"";position:absolute;left:0;right:0;height:1px;background:rgba(255,255,255,.85);z-index:1}',
    '.lsr-band::before{top:7px}.lsr-band::after{bottom:7px}',
    '.lsr-a{background:' + BLUE_BG + ';color:' + BLUE_INK + ';transform:translateY(-50%) rotate(-2.6deg);z-index:1}',
    '.lsr-b{background:' + ORG_BG + ';color:' + ORG_INK + ';transform:translateY(-50%) rotate(2.6deg);z-index:2;box-shadow:0 10px 24px -12px rgba(184,83,31,.35)}',
    '.lsr-track{display:flex;flex:none;align-items:center;white-space:nowrap;animation:lsrFlow 70s linear infinite;will-change:transform}',
    '.lsr-b .lsr-track{animation-direction:reverse;animation-duration:58s}',
    /* 大文字・字間広め。1 語おきに中抜き文字にして単調さを消す */
    '.lsr-track span{font-weight:700;font-size:24px;letter-spacing:.16em;text-transform:uppercase;padding:0 26px;line-height:1}',
    '.lsr-track span.o{color:#fff;-webkit-text-stroke:2.4px currentColor;paint-order:stroke fill}',
    '.lsr-a .lsr-track span.o{-webkit-text-stroke-color:' + BLUE_INK + '}',
    '.lsr-b .lsr-track span.o{-webkit-text-stroke-color:' + ORG_INK + '}',
    /* 区切りは小さな丸 */
    '.lsr-track i{flex:none;width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.45}',
    '@keyframes lsrFlow{from{transform:translateX(0)}to{transform:translateX(-50%)}}',
    '@media (max-width:767px){',
    ' .lsr{height:160px}',
    ' .lsr-band{height:42px}.lsr-band::before{top:5px}.lsr-band::after{bottom:5px}',
    ' .lsr-a{transform:translateY(-50%) rotate(-7deg)} .lsr-b{transform:translateY(-50%) rotate(7deg)}',
    ' .lsr-track span{font-size:15px;padding:0 15px;letter-spacing:.12em}',
    ' .lsr-track span.o{-webkit-text-stroke-width:1.8px}',
    ' .lsr-track i{width:5px;height:5px}',
    '}',
    '@media (prefers-reduced-motion:reduce){.lsr-track{animation:none}}',
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function band(cls, words) {
    /* 偶数個にそろえてから 1 語おきに中抜き（継ぎ目でも交互が崩れない） */
    var list = words.length % 2 ? words.concat(words) : words.slice();
    var unit = list.map(function (w, i) { return '<span' + (i % 2 ? ' class="o"' : '') + '>' + w + '</span><i></i>'; }).join('');
    var row = '';
    for (var i = 0; i < 6; i++) row += unit;           /* 画面幅より長くしてから */
    return '<div class="lsr-band ' + cls + '"><div class="lsr-track">' + row + row + '</div></div>'; /* 2 つ並べて -50% で継ぎ目なし */
  }
  var box = document.createElement('div'); box.className = 'lsr'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = band('lsr-a', P.a) + band('lsr-b', P.b);
  if (P.after) anchor.parentNode.insertBefore(box, anchor.nextSibling); else anchor.parentNode.insertBefore(box, anchor);

})();
