// Genera las piezas SVG del README de perfil con la identidad de VKLF.
// Uso: node build/build.mjs   (edita los datos de abajo y vuelve a ejecutarlo)
import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'assets');
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (f.endsWith('.svg')) unlinkSync(join(out, f));
const b64 = (f) => readFileSync(join(here, 'src', f)).toString('base64');

/* ------------------------------ DATOS ------------------------------ */
const name = 'Jesús Yeste Ramírez';
const role = 'Pentester junior · Seguridad ofensiva';
const typed = 'eJPTv2 // Profesor en LionxSecurity // Cibercooperante INCIBE';
const about = 'Me interesa entender cómo se rompen los sistemas para saber protegerlos. Practico en laboratorios de pentesting, documento cada máquina paso a paso en vklf.es y enseño lo que aprendo como profesor de ciberseguridad.';
const facts = [
  { id: 'certificacion', label: 'CERTIFICACIÓN', big: 'eJPTv2', sub: 'INE Security · 2026', cta: 'VERIFICAR →' },
  { id: 'docencia', label: 'DOCENCIA', big: 'LionxSecurity', sub: 'Profesor de ciberseguridad' },
  { id: 'divulgacion', label: 'DIVULGACIÓN', big: 'INCIBE', sub: 'Cibercooperante' },
];
const writeups = [
  { id: 'dancing', title: 'Dancing', os: 'WINDOWS', vector: 'SMB con acceso anónimo a recursos compartidos' },
  { id: 'fawn', title: 'Fawn', os: 'LINUX', vector: 'FTP con autenticación anónima' },
  { id: 'meow', title: 'Meow', os: 'LINUX', vector: 'Telnet con root sin contraseña' },
];
const stack = [
  ['OFENSIVA', 'Nmap · Burp Suite · Metasploit · ffuf · Gobuster · Hydra · Hashcat · John the Ripper · Wireshark'],
  ['SISTEMAS', 'Linux · Windows Server · Active Directory · TCP/IP · VLAN · Firewalls · VPN'],
  ['CÓDIGO', 'Python · Bash · PHP · Laravel · Transact-SQL'],
];
const links = [['web', 'vklf.es'], ['linkedin', 'LinkedIn'], ['htb', 'Hack The Box'], ['correo', 'contacto@vklf.es']];

/* ----------------------------- UTILIDADES ----------------------------- */
const W = 840, X = 48, BG = '#05070b', RED = '#d70000', RED2 = '#ff4d4d', LINE = '#2a0d0d';
const MONO = `'Courier New',Consolas,'Liberation Mono',monospace`;
const SANS = `'InterV',Inter,'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const font = `@font-face{font-family:'InterV';src:url(data:font/woff2;base64,${b64('inter.woff2')}) format('woff2');font-weight:100 900}`;
const svg = (w, h, label, body, { defs = '', withFont = true } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><defs><style>${withFont ? font : ''}.s{font-family:${SANS}}.m{font-family:${MONO}}</style>${defs}</defs>${body}</svg>\n`;
const save = (n, c) => { writeFileSync(join(out, n), c); console.log(n.padEnd(24), (c.length / 1024).toFixed(1) + ' KB'); };
const monoW = (t, size, ls = 0) => t.length * (size * 0.6 + ls);
const mono = (x, y, t, size, fill, { ls = 0, anchor = 'start', weight = 400 } = {}) =>
  `<text x="${x}" y="${y}" class="m" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" textLength="${monoW(t, size, ls).toFixed(1)}" lengthAdjust="spacing">${esc(t)}</text>`;
const sans = (x, y, t, size, fill, { weight = 400, anchor = 'start', ls = 0, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" class="s" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(t)}</text>`;
const wrap = (text, max) => { const l = []; let c = ''; for (const w of text.split(' ')) { if ((c + ' ' + w).trim().length > max) { l.push(c); c = w; } else c = (c + ' ' + w).trim(); } if (c) l.push(c); return l; };
const label = (y, t) => `<rect x="${X}" y="${y - 10}" width="3" height="12" fill="${RED}"/>${mono(X + 12, y, t, 12.5, RED2, { ls: 3 })}`;
const bg = (w, h) => `<rect width="${w}" height="${h}" fill="${BG}"/>`;

/* ------------------------------ CABECERA ------------------------------ */
{
  const H = 250, cx = 132, cy = 124, tx0 = 236;
  const steps = typed.length, tw = monoW(typed, 12.5, 0.5), pw = tw + 52, ptx = tx0 + 32;
  const kt = Array.from({ length: steps + 1 }, (_, i) => (i / steps).toFixed(4)).join(';');
  const logo = `data:image/webp;base64,${b64('logo.webp')}`;
  const defs = `<pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="${RED}" stroke-opacity=".15"/></pattern>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop offset=".45" stop-color="${BG}" stop-opacity="0"/><stop offset="1" stop-color="${BG}"/></linearGradient>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${BG}" stop-opacity="0"/><stop offset="1" stop-color="${BG}" stop-opacity=".9"/></linearGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="${RED}" stop-opacity=".55"/><stop offset=".6" stop-color="${RED}" stop-opacity=".12"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="8" result="b"/><feFlood flood-color="${RED}" flood-opacity=".7"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="top"><path d="M0 12a12 12 0 0 1 12-12h${W - 24}a12 12 0 0 1 12 12v${H - 12}H0z"/></clipPath>
    <clipPath id="lg"><circle cx="${cx}" cy="${cy}" r="60"/></clipPath>
    <clipPath id="ty"><rect x="${ptx}" y="186" height="30" width="0"><animate attributeName="width" dur="3s" begin=".5s" calcMode="discrete" keyTimes="${kt}" values="${Array.from({ length: steps + 1 }, (_, i) => (i * tw / steps + (i ? 1 : 0)).toFixed(1)).join(';')}" fill="freeze"/></rect></clipPath>`;
  const body = `<g clip-path="url(#top)">${bg(W, H)}<rect width="${W}" height="${H}" fill="url(#g)"/><rect width="${W}" height="${H}" fill="url(#side)"/><rect width="${W}" height="${H}" fill="url(#fade)"/>
    <rect width="${W}" height="2" fill="${RED}"/>
    <circle cx="${cx}" cy="${cy}" r="100" fill="url(#halo)"><animate attributeName="r" values="94;106;94" dur="3.6s" repeatCount="indefinite"/></circle>
    <circle cx="${cx}" cy="${cy}" r="62" fill="#0b0c10" stroke="${RED}" stroke-width="1.5"/>
    <image href="${logo}" x="${cx - 60}" y="${cy - 60}" width="120" height="120" clip-path="url(#lg)"/>
    ${mono(tx0, 78, '// VKLF', 14, RED2, { ls: 5 })}
    ${sans(tx0 - 2, 128, name, 43, '#fff', { weight: 900, ls: 0.8, extra: 'filter="url(#glow)"' })}
    ${sans(tx0, 162, role, 17.5, '#e9d2d2', { ls: 0.3 })}
    <rect x="${tx0}" y="184" width="${pw.toFixed(1)}" height="32" rx="16" fill="#00ff99" fill-opacity=".05" stroke="#00ff99" stroke-opacity=".28"/>
    ${mono(tx0 + 15, 205, '$', 12.5, RED2)}
    <g clip-path="url(#ty)">${mono(ptx, 205, typed, 12.5, '#8ef0b0', { ls: 0.5 })}</g>
    <rect x="${ptx}" y="193" width="8" height="15" fill="#8ef0b0"><animate attributeName="x" dur="3s" begin=".5s" calcMode="discrete" keyTimes="${kt}" values="${Array.from({ length: steps + 1 }, (_, i) => (ptx + i * tw / steps + 2).toFixed(1)).join(';')}" fill="freeze"/><animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/></rect></g>`;
  save('cabecera.svg', svg(W, H, `${name} // VKLF — ${role}. ${typed}`, body, { defs }));
}

/* ------------------------------ SOBRE MÍ ------------------------------ */
{
  let y = 34, t = label(y, '// SOBRE MÍ'); y += 36;
  for (const l of wrap(about, 84)) { t += sans(X, y, l, 17, '#e6edf3'); y += 28; }
  const H = y + 6;
  save('sobre-mi.svg', svg(W, H, about, bg(W, H) + t));
}

/* -------------------------- TRES DATOS CLAVE -------------------------- */
facts.forEach((f, i) => {
  const w = W / 3, H = 132, x = i === 0 ? X : 28;
  const body = `${bg(w, H)}<rect x="${i === 0 ? X : 0}" y="14" width="${i === 0 ? w - X : i === 2 ? w - X : w}" height="1" fill="${LINE}"/>
    ${i ? `<rect x="0" y="14" width="1" height="${H - 34}" fill="${LINE}"/>` : ''}
    ${mono(x, 46, f.label, 11, '#9a8a8a', { ls: 2.2 })}
    ${sans(x, 82, f.big, 27, '#fff', { weight: 900, ls: 0.5 })}
    ${sans(x, 105, f.sub, 13.5, '#9a9a9a')}
    ${f.cta ? mono(w - 20, 46, f.cta, 10.5, RED2, { ls: 1, anchor: 'end' }) : ''}`;
  save(`dato-${f.id}.svg`, svg(w, H, `${f.label}: ${f.big} — ${f.sub}`, body));
});

/* ------------------------------- WRITEUPS ------------------------------- */
{
  const H = 58;
  save('writeups-titulo.svg', svg(W, H, 'Últimos writeups — ver todos en vklf.es', `${bg(W, H)}${label(36, '// ÚLTIMOS WRITEUPS')}${mono(W - X, 36, 'VER TODOS EN VKLF.ES →', 11, RED2, { ls: 1, anchor: 'end' })}`, { withFont: false }));
}
writeups.forEach((w, i) => {
  const H = 64, tagW = monoW(w.os, 10, 0.7) + 16, tagX = W - X - 34 - tagW;
  const defs = `<clipPath id="c"><circle cx="${X + 62}" cy="32" r="17"/></clipPath>`;
  const body = `${bg(W, H)}<rect x="${X}" y="0" width="${W - 2 * X}" height="1" fill="${LINE}"/>${i === writeups.length - 1 ? `<rect x="${X}" y="${H - 1}" width="${W - 2 * X}" height="1" fill="${LINE}"/>` : ''}
    ${mono(X + 4, 37, String(i + 1).padStart(2, '0'), 12.5, RED, { weight: 700 })}
    <circle cx="${X + 62}" cy="32" r="18.2" fill="#0d0606" stroke="${RED}" stroke-width="1.2"/>
    <image href="data:image/webp;base64,${b64(w.id + '.webp')}" x="${X + 45}" y="15" width="34" height="34" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/>
    ${sans(X + 98, 28, w.title, 16.5, '#fff', { weight: 700 })}
    ${sans(X + 98, 48, w.vector, 13.5, '#9a9a9a')}
    <rect x="${tagX.toFixed(1)}" y="22" width="${tagW.toFixed(1)}" height="20" rx="4" fill="none" stroke="#10283a"/>${mono(tagX + 8, 36, w.os, 10, '#5aa9d9', { ls: 0.7 })}
    ${mono(W - X - 4, 37, '→', 15, RED2, { anchor: 'end' })}`;
  save(`writeup-${w.id}.svg`, svg(W, H, `Writeup ${w.title} — Hack The Box, ${w.os}: ${w.vector}`, body, { defs }));
});

/* --------------------------------- STACK --------------------------------- */
{
  let y = 52, t = label(y, '// STACK'); y += 38;
  for (const [cat, items] of stack) {
    t += mono(X, y, cat, 11.5, '#9a8a8a', { ls: 2.2 });
    const rows = []; let cur = [];
    for (const it of items.split(' · ')) { if ([...cur, it].join(' · ').length > 72) { rows.push(cur.join(' · ') + ' ·'); cur = [it]; } else cur.push(it); }
    rows.push(cur.join(' · '));
    for (const l of rows) { t += sans(X + 138, y, l, 15, '#e6edf3'); y += 24; }
    y += 12;
  }
  const H = y + 14;
  save('stack.svg', svg(W, H, 'Stack. ' + stack.map(([c, i]) => `${c}: ${i}`).join('. '), bg(W, H) + t));
}

/* ---------------------------------- PIE ---------------------------------- */
links.forEach(([id, text], i) => {
  const w = W / 4, tw = monoW(text, 12, 0.3), x0 = (w - tw - 16) / 2;
  const body = `${bg(w, 62)}<rect x="${i === 0 ? X : 0}" y="0" width="${i === 0 || i === 3 ? w - X : w}" height="1" fill="${RED}" opacity=".5"/>${mono(x0, 38, '>', 12, '#27c93f', { weight: 700 })}${mono(x0 + 16, 38, text, 12, '#e6edf3', { ls: 0.3 })}`;
  save(`pie-${id}.svg`, svg(w, 62, text, body, { withFont: false }));
});
{
  const H = 44, defs = `<clipPath id="b"><path d="M0 0h${W}v${H - 12}a12 12 0 0 1-12 12H12a12 12 0 0 1-12-12z"/></clipPath>`;
  save('pie.svg', svg(W, H, '© 2026 Jesús Yeste // VKLF', `<g clip-path="url(#b)">${bg(W, H)}${mono(W / 2, 18, '© 2026 JESÚS YESTE // VKLF', 10, '#6e7681', { anchor: 'middle', ls: 1.5 })}</g>`, { defs, withFont: false }));
}
