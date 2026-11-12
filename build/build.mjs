// Genera las piezas SVG animadas del README de perfil (identidad VKLF: rojo, negro y logo).
// Uso: node build/build.mjs   (edita los datos de abajo y vuelve a ejecutarlo)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'assets');
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (f.endsWith('.svg') && f !== 'stats.svg') unlinkSync(join(out, f));
const b64 = (f) => readFileSync(join(here, 'src', f)).toString('base64');

/* ------------------------------ DATOS ------------------------------ */
const titles = { 'sobre-mi': 'SOBRE MÍ', certificacion: 'CERTIFICACIÓN', arsenal: 'ARSENAL', trayectoria: 'EXPERIENCIA Y FORMACIÓN', github: 'GITHUB', contacto: 'CONTACTO' };
const experience = [
  ['09/2026 — HOY', 'Profesor de ciberseguridad', 'LionxSecurity', 'ACTUAL'],
  ['09/2026 — HOY', 'Cibercooperante', 'INCIBE · Instituto Nacional de Ciberseguridad', 'ACTUAL'],
  ['05/2025', 'Prácticas de desarrollo web', 'Close · PHP y Laravel', 'PRÁCTICAS'],
  ['04/2024 — 07/2024', 'Prácticas de soporte técnico', 'Random Consulting · Malta', 'PRÁCTICAS'],
];
const education = [
  ['2024 — 2026', 'CFGS ASIR', 'IES Zaidín Vergeles'],
  ['HACKING ÉTICO', 'Introducción al Hacking', 'LionxSecurity'],
  ['2022 — 2024', 'CFGM SMR', 'IES Francisco Ayala'],
];

/* ----------------------------- UTILIDADES ----------------------------- */
const W = 840, RED = '#d70000', RED2 = '#ff4d4d', PANEL = '#0d0606', LINE = '#2a0d0d';
const MONO = `'Courier New',Consolas,'Liberation Mono',monospace`;
const SANS = `'InterV',Inter,'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const font = `@font-face{font-family:'InterV';src:url(data:font/woff2;base64,${b64('inter.woff2')}) format('woff2');font-weight:100 900}`;
const logo = `data:image/webp;base64,${b64('logo.webp')}`;
const svg = (w, h, label, body, { defs = '', withFont = true } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><defs><style>${withFont ? font : ''}.s{font-family:${SANS}}.m{font-family:${MONO}}</style>${defs}</defs>${body}</svg>\n`;
const save = (n, c) => { writeFileSync(join(out, n), c); console.log(n.padEnd(26), (c.length / 1024).toFixed(1) + ' KB'); };
const monoW = (t, size, ls = 0) => t.length * (size * 0.6 + ls);
const mono = (x, y, t, size, fill, { ls = 0, anchor = 'start', weight = 400, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" class="m" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" textLength="${monoW(t, size, ls).toFixed(1)}" lengthAdjust="spacing" ${extra}>${esc(t)}</text>`;
const sans = (x, y, t, size, fill, { weight = 400, anchor = 'start', ls = 0, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" class="s" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(t)}</text>`;
// Barrido de brillo que cruza un panel cada pocos segundos.
const shineDefs = (id, w, h, rx = 12) => `<clipPath id="${id}c"><rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${rx}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${RED2}" stop-opacity="0"/><stop offset=".5" stop-color="${RED2}" stop-opacity=".09"/><stop offset="1" stop-color="${RED2}" stop-opacity="0"/></linearGradient>`;
const shine = (id, w, h, dur = 5, begin = 0) => `<g clip-path="url(#${id}c)"><rect x="-140" y="0" width="110" height="${h}" fill="url(#${id}g)"><animate attributeName="x" values="-140;${w + 30};${w + 30}" keyTimes="0;.3;1" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></rect></g>`;
const panel = (w, h, rx = 12) => `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="${rx}" fill="${PANEL}" stroke="${LINE}" stroke-width="2"/>`;

/* ------------------------------ CABECERA ------------------------------ */
{
  const H = 320, cx = W / 2, cy = 96;
  const traces = ['M0 58H118L150 90H292L322 104H366', 'M0 150H78L108 120H236L262 132', 'M0 226H150L184 192H270', 'M60 0V34L92 66', 'M250 0V46'];
  const trace = (d, i, flip) => `<g ${flip ? `transform="translate(${W} 0) scale(-1 1)"` : ''}><path d="${d}" fill="none" stroke="${RED}" stroke-opacity=".28" stroke-width="1.4"/><path d="${d}" fill="none" stroke="${RED2}" stroke-width="2" stroke-linecap="round" stroke-dasharray="46 700"><animate attributeName="stroke-dashoffset" values="746;0" dur="${3.2 + i * 0.7}s" begin="${(i * 0.45 + (flip ? 0.9 : 0)).toFixed(2)}s" repeatCount="indefinite"/></path></g>`;
  const nodes = [[366, 104], [262, 132], [270, 192], [92, 66], [250, 46]];
  const node = ([x, y], i, flip) => `<circle cx="${flip ? W - x : x}" cy="${y}" r="3.2" fill="${RED2}"><animate attributeName="opacity" values=".25;1;.25" dur="2.4s" begin="${(i * 0.3).toFixed(1)}s" repeatCount="indefinite"/></circle>`;
  const name = 'JESÚS YESTE';
  const nameAttrs = `x="${cx}" y="216" text-anchor="middle" class="s" font-size="54" font-weight="900" letter-spacing="7"`;
  const gk = '0;.84;.845;.86;.865;.93;.935;.95;1';
  const defs = `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050203"/><stop offset=".7" stop-color="#0d0304"/><stop offset="1" stop-color="#1c0406"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="${RED}" stop-opacity=".6"/><stop offset=".55" stop-color="${RED}" stop-opacity=".14"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
    <linearGradient id="wv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5c0000"/><stop offset=".5" stop-color="${RED}"/><stop offset="1" stop-color="#5c0000"/></linearGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${RED2}" stop-opacity="0"/><stop offset=".5" stop-color="${RED2}" stop-opacity=".09"/><stop offset="1" stop-color="${RED2}" stop-opacity="0"/></linearGradient>
    <filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="9" result="b"/><feFlood flood-color="${RED}" flood-opacity=".8"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="card"><rect width="${W}" height="${H}" rx="16"/></clipPath><clipPath id="lg"><circle cx="${cx}" cy="${cy}" r="50"/></clipPath>
    <clipPath id="s1"><rect x="0" y="176" width="${W}" height="14"/></clipPath><clipPath id="s2"><rect x="0" y="198" width="${W}" height="10"/></clipPath>`;
  const body = `<g clip-path="url(#card)"><rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${traces.map((d, i) => trace(d, i, false) + trace(d, i, true)).join('')}${nodes.map((n, i) => node(n, i, false) + node(n, i, true)).join('')}
    <rect x="0" y="-80" width="${W}" height="80" fill="url(#scan)"><animate attributeName="y" values="-80;${H}" dur="5s" repeatCount="indefinite"/></rect>
    <circle cx="${cx}" cy="${cy}" r="96" fill="url(#halo)"><animate attributeName="r" values="88;104;88" dur="3s" repeatCount="indefinite"/></circle>
    <circle cx="${cx}" cy="${cy}" r="66" fill="none" stroke="${RED2}" stroke-width="1.6" stroke-dasharray="4 10 30 10" opacity=".85"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="14s" repeatCount="indefinite"/></circle>
    <circle cx="${cx}" cy="${cy}" r="58" fill="none" stroke="${RED}" stroke-width="1.2" stroke-dasharray="60 18 6 18" opacity=".8"><animateTransform attributeName="transform" type="rotate" from="360 ${cx} ${cy}" to="0 ${cx} ${cy}" dur="9s" repeatCount="indefinite"/></circle>
    <circle cx="${cx}" cy="${cy}" r="51" fill="#0b0c10"/><image href="${logo}" x="${cx - 50}" y="${cy - 50}" width="100" height="100" clip-path="url(#lg)"/>
    <text ${nameAttrs} fill="${RED2}" opacity="0">${name}<animate attributeName="opacity" values="0;0;.9;.9;0;0;.8;0;0" keyTimes="${gk}" dur="5s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;0 0;-7 2;6 -1;0 0;0 0;5 1;0 0;0 0" keyTimes="${gk}" dur="5s" repeatCount="indefinite"/></text>
    <text ${nameAttrs} fill="#fff" filter="url(#glow)">${name}</text>
    <g clip-path="url(#s1)"><rect x="0" y="176" width="${W}" height="14" fill="#0a0304" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.84;.845;.865;1" dur="5s" repeatCount="indefinite"/></rect><text ${nameAttrs} fill="#fff" opacity="0">${name}<animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.84;.845;.865;1" dur="5s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="14 0;14 0" dur="5s" repeatCount="indefinite"/></text></g>
    <g clip-path="url(#s2)"><rect x="0" y="198" width="${W}" height="10" fill="#0a0304" opacity="0"><animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.93;.935;.95;1" dur="5s" repeatCount="indefinite"/></rect><text ${nameAttrs} fill="#fff" opacity="0">${name}<animate attributeName="opacity" values="0;0;1;0;0" keyTimes="0;.93;.935;.95;1" dur="5s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="-12 0;-12 0" dur="5s" repeatCount="indefinite"/></text></g>
    ${mono(cx, 252, '// VKLF //', 19, RED2, { ls: 9, anchor: 'middle', weight: 700 })}
    <path fill="url(#wv)" opacity=".45"><animate attributeName="d" dur="7s" repeatCount="indefinite" values="M0 292C140 268 280 312 420 290S700 270 840 296V320H0Z;M0 298C140 312 280 272 420 294S700 310 840 286V320H0Z;M0 292C140 268 280 312 420 290S700 270 840 296V320H0Z"/></path>
    <path fill="url(#wv)"><animate attributeName="d" dur="5s" repeatCount="indefinite" values="M0 306C160 292 300 318 440 304S720 296 840 308V320H0Z;M0 302C160 316 300 294 440 308S720 314 840 300V320H0Z;M0 306C160 292 300 318 440 304S720 296 840 308V320H0Z"/></path></g>`;
  save('cabecera.svg', svg(W, H, 'Jesús Yeste // VKLF', body, { defs }));
}

/* --------------------------- LOGO EN ÓRBITA --------------------------- */
{
  const S = 300, c = S / 2;
  const defs = `<radialGradient id="h"><stop offset="0" stop-color="${RED}" stop-opacity=".5"/><stop offset=".6" stop-color="${RED}" stop-opacity=".12"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient><clipPath id="l"><circle cx="${c}" cy="${c}" r="84"/></clipPath>`;
  const rot = (dur, dir = 1) => `<animateTransform attributeName="transform" type="rotate" from="${dir > 0 ? 0 : 360} ${c} ${c}" to="${dir > 0 ? 360 : 0} ${c} ${c}" dur="${dur}s" repeatCount="indefinite"/>`;
  const body = `<circle cx="${c}" cy="${c}" r="140" fill="url(#h)"><animate attributeName="r" values="128;148;128" dur="3s" repeatCount="indefinite"/></circle>
    <g>${rot(16)}<circle cx="${c}" cy="${c}" r="124" fill="none" stroke="${RED}" stroke-width="1.5" stroke-dasharray="3 12 44 12" opacity=".8"/><circle cx="${c + 124}" cy="${c}" r="5" fill="${RED2}"/><circle cx="${c - 124}" cy="${c}" r="3" fill="${RED2}"/></g>
    <g>${rot(10, -1)}<circle cx="${c}" cy="${c}" r="106" fill="none" stroke="${RED2}" stroke-width="2" stroke-dasharray="80 26 8 26" opacity=".9"/><circle cx="${c}" cy="${c - 106}" r="4" fill="#fff"/></g>
    <g>${rot(22)}<circle cx="${c}" cy="${c}" r="94" fill="none" stroke="${RED}" stroke-width="1" stroke-dasharray="2 6" opacity=".7"/></g>
    <circle cx="${c}" cy="${c}" r="86" fill="#0b0c10" stroke="${RED}" stroke-width="2"/><image href="${logo}" x="${c - 84}" y="${c - 84}" width="168" height="168" clip-path="url(#l)"/>`;
  save('logo-orbita.svg', svg(S, S, 'Logo de VKLF', body, { defs, withFont: false }));
}

/* -------------------------- TÍTULOS DE SECCIÓN -------------------------- */
for (const [id, t] of Object.entries(titles)) {
  const H = 44, text = `// ${t}`, tw = monoW(text, 18, 4), x1 = 18 + tw + 18;
  const body = `<rect x="0" y="11" width="5" height="22" fill="${RED}"><animate attributeName="opacity" values="1;.35;1" dur="1.6s" repeatCount="indefinite"/></rect>
    ${mono(18, 29, text, 18, RED2, { ls: 4, weight: 700 })}
    <line x1="${x1}" y1="23" x2="${W}" y2="23" stroke="${RED}" stroke-opacity=".35" stroke-width="1.5"/>
    <rect x="${x1}" y="21.5" width="70" height="3" rx="1.5" fill="${RED2}"><animate attributeName="x" values="${x1};${W - 70};${x1}" dur="6s" repeatCount="indefinite"/></rect>`;
  save(`titulo-${id}.svg`, svg(W, H, t, body, { withFont: false }));
}

/* ---------------------------- CERTIFICACIÓN ---------------------------- */
{
  const H = 150, hx = 92, hy = 75;
  const hex = (r) => Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 2; return `${(hx + r * Math.cos(a)).toFixed(1)},${(hy + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
  const defs = `${shineDefs('p', W, H)}<linearGradient id="hx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${RED2}"/><stop offset="1" stop-color="#8a0000"/></linearGradient>`;
  const body = `${panel(W, H)}<rect x="1" y="1" width="6" height="${H - 2}" rx="3" fill="${RED}"/>
    <polygon points="${hex(58)}" fill="none" stroke="${RED2}" stroke-width="1.5"><animate attributeName="opacity" values=".15;.9;.15" dur="2.4s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="rotate" from="0 ${hx} ${hy}" to="360 ${hx} ${hy}" dur="24s" repeatCount="indefinite"/></polygon>
    <polygon points="${hex(46)}" fill="url(#hx)"/>
    ${sans(hx, hy + 2, 'eJPT', 22, '#fff', { weight: 900, anchor: 'middle' })}${sans(hx, hy + 21, 'v2', 14, '#1a0000', { weight: 800, anchor: 'middle' })}
    ${mono(176, 46, 'CERTIFICACIÓN VERIFICADA', 11.5, '#9a8a8a', { ls: 2.4 })}
    ${sans(176, 80, 'eLearnSecurity Junior Penetration Tester', 23, '#fff', { weight: 800 })}
    ${sans(176, 108, 'INE Security · Emitida 08/2026 · Válida hasta 08/2029', 14.5, '#b9a9a9')}
    <rect x="${W - 168}" y="96" width="140" height="34" rx="8" fill="none" stroke="${RED}"><animate attributeName="stroke-opacity" values="1;.35;1" dur="2s" repeatCount="indefinite"/></rect>
    ${mono(W - 98, 118, 'VERIFICAR →', 12, RED2, { ls: 1.2, anchor: 'middle', weight: 700 })}${shine('p', W, H, 4.5)}`;
  save('certificacion.svg', svg(W, H, 'Certificación eJPTv2 — eLearnSecurity Junior Penetration Tester, INE Security. Emitida 08/2026, válida hasta 08/2029. Pulsa para verificar.', body, { defs }));
}

/* ------------------------------ EXPERIENCIA ------------------------------ */
{
  const row = 66, top = 84, H = top + experience.length * row - 14;
  let t = panel(W, H) + mono(30, 40, 'EXPERIENCIA', 12.5, RED2, { ls: 3, weight: 700 }) + '<line x1="30" y1="54" x2="' + (W - 30) + '" y2="54" stroke="' + LINE + '"/>';
  t += '<line x1="46" y1="' + (top - 6) + '" x2="46" y2="' + (top + (experience.length - 1) * row - 6) + '" stroke="' + LINE + '" stroke-width="2"/>';
  experience.forEach(([d, r, o, tag], i) => {
    const y = top + i * row, live = d.includes('HOY');
    if (live) t += '<circle cx="46" cy="' + (y - 6) + '" r="6" fill="none" stroke="' + RED2 + '" stroke-width="1.5"><animate attributeName="r" values="6;15" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="1.8s" repeatCount="indefinite"/></circle><circle cx="46" cy="' + (y - 6) + '" r="6" fill="' + RED + '"/>';
    else t += '<circle cx="46" cy="' + (y - 6) + '" r="5.5" fill="' + PANEL + '" stroke="' + RED + '" stroke-width="2"/>';
    t += mono(72, y - 1, d, 12, RED2, { ls: 0.8 });
    t += sans(250, y, r, 17.5, '#fff', { weight: 700 }) + sans(250, y + 22, o, 14, '#b9a9a9');
    const tw = monoW(tag, 10.5, 1.2) + 20, tx = W - 30 - tw;
    t += '<rect x="' + tx.toFixed(1) + '" y="' + (y - 17) + '" width="' + tw.toFixed(1) + '" height="24" rx="5" fill="' + (live ? RED : 'none') + '" stroke="' + (live ? RED : '#5c1a1a') + '"/>' + mono(tx + 10, y - 1, tag, 10.5, live ? '#fff' : RED2, { ls: 1.2, weight: live ? 700 : 400 });
    if (i) t += '<line x1="72" y1="' + (y - 30) + '" x2="' + (W - 30) + '" y2="' + (y - 30) + '" stroke="' + LINE + '" stroke-opacity=".7"/>';
  });
  t += shine('a', W, H, 7);
  save('experiencia.svg', svg(W, H, 'Experiencia: ' + experience.map((e) => e.slice(0, 3).join(' · ')).join('; ') + '.', t, { defs: shineDefs('a', W, H) }));
}

/* ------------------------------- FORMACIÓN ------------------------------- */
{
  const H = 176, gap = 14, cw = (W - 60 - gap * (education.length - 1)) / education.length;
  let t = panel(W, H) + mono(30, 40, 'FORMACIÓN', 12.5, RED2, { ls: 3, weight: 700 }) + '<line x1="30" y1="54" x2="' + (W - 30) + '" y2="54" stroke="' + LINE + '"/>';
  education.forEach(([d, r, o], i) => {
    const x = 30 + i * (cw + gap);
    t += '<rect x="' + x.toFixed(1) + '" y="70" width="' + cw.toFixed(1) + '" height="86" rx="8" fill="#140808" stroke="' + LINE + '"/><rect x="' + x.toFixed(1) + '" y="70" width="3" height="86" rx="1.5" fill="' + RED + '"/>';
    t += mono(x + 18, 94, d, 11, RED2, { ls: 1 }) + sans(x + 18, 120, r, 17.5, '#fff', { weight: 700 }) + sans(x + 18, 142, o, 13.5, '#b9a9a9');
  });
  t += shine('b', W, H, 7, 2);
  save('formacion.svg', svg(W, H, 'Formación: ' + education.map((e) => e.join(' · ')).join('; ') + '.', t, { defs: shineDefs('b', W, H) }));
}

/* ----------------------------------- PIE ----------------------------------- */
{
  const H = 150;
  const defs = `<linearGradient id="wv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5c0000"/><stop offset=".5" stop-color="${RED}"/><stop offset="1" stop-color="#5c0000"/></linearGradient><clipPath id="c"><rect width="${W}" height="${H}" rx="16"/></clipPath><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050203"/><stop offset="1" stop-color="#1c0406"/></linearGradient>`;
  const body = `<g clip-path="url(#c)"><rect width="${W}" height="${H}" fill="url(#bg)"/>
    ${sans(W / 2, 56, '«La seguridad no es un producto, sino un proceso.»', 21, '#fff', { weight: 600, anchor: 'middle' })}
    ${mono(W / 2, 84, '— BRUCE SCHNEIER', 11.5, RED2, { ls: 2.5, anchor: 'middle' })}
    <path fill="url(#wv)" opacity=".45"><animate attributeName="d" dur="7s" repeatCount="indefinite" values="M0 122C140 100 280 140 420 120S700 102 840 126V150H0Z;M0 128C140 142 280 104 420 124S700 140 840 116V150H0Z;M0 122C140 100 280 140 420 120S700 102 840 126V150H0Z"/></path>
    <path fill="url(#wv)"><animate attributeName="d" dur="5s" repeatCount="indefinite" values="M0 136C160 122 300 148 440 134S720 126 840 138V150H0Z;M0 132C160 146 300 124 440 138S720 144 840 130V150H0Z;M0 136C160 122 300 148 440 134S720 126 840 138V150H0Z"/></path></g>`;
  save('pie.svg', svg(W, H, '«La seguridad no es un producto, sino un proceso.» — Bruce Schneier', body, { defs }));
}
