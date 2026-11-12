// Genera las piezas SVG del README con la estética de vklf.es.
// Uso: node build/build.mjs   (edita los datos de abajo y vuelve a ejecutarlo)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'assets');
mkdirSync(out, { recursive: true });
const b64 = (f) => readFileSync(join(here, 'src', f)).toString('base64');

/* ------------------------------ DATOS ------------------------------ */
const about = [
  'Hola, soy Jesús. Desde que descubrí la ciberseguridad, mi curiosidad por entender «cómo funcionan las cosas» se convirtió en mi profesión. Me apasiona analizar la tecnología desde dentro para construir entornos más seguros.',
  'Compagino mis estudios de Administración de Sistemas Informáticos en Red con la práctica constante en laboratorios de pentesting. Ya conseguí la certificación eJPTv2 y mi enfoque sigue siendo puramente práctico: la mejor forma de aprender es rompiendo, arreglando y, sobre todo, compartiendo.',
  'Enseñar para aprender: uso vklf.es como cuaderno de campo, donde redacto writeups detallados de mis laboratorios. Además, soy profesor de ciberseguridad en LionxSecurity y cibercooperante del INCIBE.',
];
const skills = [
  ['Hacking & Seguridad', ['Criptografía', 'Reconocimiento', 'Enumeración', 'OSINT', 'Burp Suite', 'Metasploit', 'CTF', 'Nmap', 'John the Ripper', 'Gobuster', 'ffuf', 'Hydra', 'Escalada de privilegios', 'Wireshark', 'Hashcat']],
  ['Sistemas & Redes', ['Linux', 'Windows', 'Windows Server', 'Linux Server', 'Active Directory', 'SSH', 'TCP/IP', 'VLAN', 'Firewalls', 'VPN', 'RAID']],
  ['Desarrollo & Datos', ['Python', 'PHP', 'Laravel', 'Transact-SQL', 'Bases de datos']],
  ['Inteligencia Artificial', ['Ollama', 'Modelos locales', 'Prompt Engineering', 'Gemini', 'Claude']],
];
const path = [
  ['2026 — hoy', 'Profesor de ciberseguridad', 'LionxSecurity'],
  ['2026 — hoy', 'Cibercooperante', 'INCIBE · Instituto Nacional de Ciberseguridad'],
  ['2024 — 2026', 'CFGS Administración de Sistemas Informáticos en Red', 'IES Zaidín Vergeles'],
  ['2025', 'Prácticas de desarrollo web · PHP y Laravel', 'Close, Agencia de Marketing Online'],
  ['2024', 'Prácticas de soporte técnico en Malta', 'Random Consulting'],
  ['2022 — 2024', 'CFGM Sistemas Microinformáticos y Redes', 'IES Francisco Ayala'],
];
const writeups = [
  { id: 'dancing', title: 'Dancing', os: 'Windows', desc: ['Dancing es una máquina', 'Windows de nivel muy…'] },
  { id: 'fawn', title: 'Fawn', os: 'Linux', desc: ['Fawn es una máquina', 'Linux de nivel muy…'] },
  { id: 'meow', title: 'Meow', os: 'Linux', desc: ['Meow es una máquina', 'Linux de nivel muy…'] },
];
const links = [['web', 'vklf.es'], ['linkedin', 'LinkedIn'], ['htb', 'Hack The Box'], ['correo', 'contacto@vklf.es']];

/* ----------------------------- UTILIDADES ----------------------------- */
const W = 840;
const BG = '#05070b';
const MONO = `'Courier New',Consolas,'Liberation Mono',monospace`;
const SANS = `'InterV',Inter,'Segoe UI',system-ui,-apple-system,Helvetica,Arial,sans-serif`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const font = `@font-face{font-family:'InterV';src:url(data:font/woff2;base64,${b64('inter.woff2')}) format('woff2');font-weight:100 900}`;
const grid = (id = 'g') => `<pattern id="${id}" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#d70000" stroke-opacity=".16" stroke-width="1"/></pattern>`;
const svg = (w, h, label, body, { defs = '', withFont = true } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><defs><style>${withFont ? font : ''}.s{font-family:${SANS}}.m{font-family:${MONO}}</style>${defs}</defs>${body}</svg>\n`;
const save = (name, content) => { writeFileSync(join(out, name), content); console.log(name.padEnd(22), (content.length / 1024).toFixed(1) + ' KB'); };
// Texto monoespaciado con ancho forzado: se ve igual con cualquier fuente monoespaciada.
const monoW = (t, size, ls = 0) => t.length * (size * 0.6 + ls);
const mono = (x, y, t, size, fill, { ls = 0, anchor = 'start', weight = 400, extra = '' } = {}) =>
  `<text x="${x}" y="${y}" class="m" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" textLength="${monoW(t, size, ls).toFixed(1)}" lengthAdjust="spacing" ${extra}>${esc(t)}</text>`;
const wrap = (text, max) => { const lines = []; let cur = ''; for (const w of text.split(' ')) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); } if (cur) lines.push(cur); return lines; };

/* ------------------------------- HERO ------------------------------- */
{
  const H = 360, typed = 'Ethical Hacker // eJPTv2 Certified // CTF Player';
  const tw = monoW(typed, 14, 0.6), pw = tw + 62, px = (W - pw) / 2, tx = px + 36;
  const defs = `${grid()}
    <clipPath id="top"><path d="M0 12a12 12 0 0 1 12-12h${W - 24}a12 12 0 0 1 12 12v${H - 12}H0z"/></clipPath>
    <radialGradient id="halo"><stop offset="0" stop-color="#d70000" stop-opacity=".55"/><stop offset=".6" stop-color="#d70000" stop-opacity=".12"/><stop offset="1" stop-color="#d70000" stop-opacity="0"/></radialGradient>
    <filter id="glow" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="9" result="b"/><feFlood flood-color="#d70000" flood-opacity=".75"/><feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <clipPath id="logo"><circle cx="${W / 2}" cy="132" r="46"/></clipPath>
    <clipPath id="mini"><circle cx="40" cy="24" r="14"/></clipPath>
    <clipPath id="type"><rect x="${tx}" y="300" height="30" width="0"><animate attributeName="width" dur="2.6s" begin=".5s" calcMode="discrete" keyTimes="${Array.from({ length: typed.length + 1 }, (_, i) => (i / typed.length).toFixed(4)).join(';')}" values="${Array.from({ length: typed.length + 1 }, (_, i) => (i * (tw / typed.length) + (i ? 1 : 0)).toFixed(1)).join(';')}" fill="freeze"/></rect></clipPath>`;
  const logo = `data:image/webp;base64,${b64('logo.webp')}`;
  const body = `<g clip-path="url(#top)">
    <rect width="${W}" height="${H}" fill="${BG}"/><rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect width="${W}" height="48" fill="#020304"/><rect y="47" width="${W}" height="1.5" fill="#d70000" opacity=".8"/>
    <circle cx="40" cy="24" r="15" fill="none" stroke="#d70000" stroke-opacity=".7"/>
    <image href="${logo}" x="26" y="10" width="28" height="28" clip-path="url(#mini)"/>
    ${mono(66, 29, 'VKLF', 15, '#e6edf3', { ls: 5 })}
    ${mono(W - 28, 28, '> INICIO   > WRITEUPS   > CONTACTO', 10.5, '#ff4d4d', { ls: 1, anchor: 'end' })}
    <circle cx="${W / 2}" cy="132" r="78" fill="url(#halo)"><animate attributeName="r" values="74;84;74" dur="3.6s" repeatCount="indefinite"/></circle>
    <circle cx="${W / 2}" cy="132" r="48" fill="#0b0c10" stroke="#d70000" stroke-width="1.5"/>
    <image href="${logo}" x="${W / 2 - 46}" y="86" width="92" height="92" clip-path="url(#logo)"/>
    <text x="${W / 2}" y="238" text-anchor="middle" class="s" font-size="50" font-weight="900" letter-spacing="2" fill="#fff" filter="url(#glow)">Jesús Yeste // VKLF</text>
    <text x="${W / 2}" y="272" text-anchor="middle" class="s" font-size="18.5" letter-spacing=".4" fill="#e9d2d2">Writeups de CTF y pentesting, explicados paso a paso.</text>
    <rect x="${px}" y="298" width="${pw}" height="34" rx="17" fill="#00ff99" fill-opacity=".05" stroke="#00ff99" stroke-opacity=".28"/>
    ${mono(px + 18, 320, '$', 14, '#ff4d4d')}
    <g clip-path="url(#type)">${mono(tx, 320, typed, 14, '#8ef0b0', { ls: 0.6 })}</g>
    <rect x="${tx}" y="307" width="9" height="17" fill="#8ef0b0">
      <animate attributeName="x" dur="2.6s" begin=".5s" calcMode="discrete" keyTimes="${Array.from({ length: typed.length + 1 }, (_, i) => (i / typed.length).toFixed(4)).join(';')}" values="${Array.from({ length: typed.length + 1 }, (_, i) => (tx + i * (tw / typed.length) + 2).toFixed(1)).join(';')}" fill="freeze"/>
      <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;.5;.5;1" dur="1s" repeatCount="indefinite"/>
    </rect></g>`;
  save('hero.svg', svg(W, H, 'Jesús Yeste // VKLF — Writeups de CTF y pentesting, explicados paso a paso. Ethical Hacker // eJPTv2 Certified // CTF Player', body, { defs }));
}

/* -------------------------- BOTONES DEL HERO -------------------------- */
{
  const mk = (name, label, filled, right) => {
    const bw = 150, bh = 46, x = right ? 10 : W / 2 - bw - 10;
    const defs = `${grid()}<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="${BG}" stop-opacity="0"/><stop offset="1" stop-color="#000"/></linearGradient>`;
    const body = `<rect width="${W / 2}" height="120" fill="${BG}"/><rect width="${W / 2}" height="120" fill="url(#g)"/><rect width="${W / 2}" height="120" fill="url(#f)"/>
      <rect x="${x}" y="12" width="${bw}" height="${bh}" rx="8" fill="${filled ? '#d70000' : '#05070b'}" stroke="#d70000" stroke-width="1.2"/>
      ${mono(x + bw / 2, 40, label, 13, filled ? '#ffffff' : '#ff4d4d', { ls: 1.2, anchor: 'middle', weight: filled ? 700 : 400 })}`;
    save(name, svg(W / 2, 120, label, body, { defs, withFont: false }));
  };
  mk('btn-writeups.svg', 'WRITEUPS', true, false);
  mk('btn-contacto.svg', 'CONTACTO', false, true);
}

/* ------------------------------ SOBRE MÍ ------------------------------ */
{
  const X = 48, lh = 25; let y = 56; let t = '';
  t += mono(X, y, '// SOBRE MÍ', 24, '#ff3333', { ls: 4 }); y += 46;
  t += `<text x="${X}" y="${y}" class="s" font-size="27" font-weight="900" letter-spacing="1.2" fill="#fff">Hacking <tspan fill="#d70000">Ético</tspan></text>`; y += 34;
  t += `<text x="${X}" y="${y}" class="s" font-size="15" fill="#ff3333">Ethical Hacker  |  eJPTv2  |  Pentesting y Ciberseguridad  |  Administración de Sistemas</text>`; y += 38;
  for (const p of about) { for (const l of wrap(p, 95)) { t += `<text x="${X}" y="${y}" class="s" font-size="15.5" fill="#e6edf3">${esc(l)}</text>`; y += lh; } y += 14; }
  const H = y + 6;
  save('sobre-mi.svg', svg(W, H, 'Sobre mí. ' + about.join(' '), `<rect width="${W}" height="${H}" fill="#000"/>${t}`));
}

/* ---------------------------- CERTIFICACIÓN ---------------------------- */
{
  const H = 128, X = 48, cw = W - 96;
  const body = `<rect width="${W}" height="${H}" fill="#000"/>
    <rect x="${X}" y="10" width="${cw}" height="96" rx="10" fill="#0d0606" stroke="#2a0d0d" stroke-width="1.2"/>
    <rect x="${X}" y="10" width="4" height="96" rx="2" fill="#d70000"/>
    <rect x="${X + 24}" y="34" width="92" height="48" rx="6" fill="#d70000"/>
    <text x="${X + 70}" y="65" text-anchor="middle" class="s" font-size="19" font-weight="900" fill="#fff">eJPTv2</text>
    <text x="${X + 136}" y="52" class="s" font-size="17" font-weight="700" fill="#fff">eLearnSecurity Junior Penetration Tester</text>
    ${mono(X + 136, 77, 'INE SECURITY · EMITIDA 08/2026 · VÁLIDA HASTA 08/2029', 11.5, '#9a9a9a', { ls: 0.8 })}
    <rect x="${X + cw - 132}" y="41" width="110" height="34" rx="8" fill="none" stroke="#d70000"/>
    ${mono(X + cw - 77, 63, 'VERIFICAR →', 11.5, '#ff4d4d', { ls: 1, anchor: 'middle' })}`;
  save('certificacion.svg', svg(W, H, 'Certificación eJPTv2 — eLearnSecurity Junior Penetration Tester, INE Security. Emitida en 08/2026. Pulsa para verificarla.', body));
}

/* -------------------------------- SKILLS -------------------------------- */
{
  const X = 48, maxX = W - 48; let y = 50; let t = '';
  t += `<text x="${X}" y="${y}" class="s" font-size="26" letter-spacing="2.8" fill="#cc0000">// Skills</text>`; y += 44;
  for (const [cat, items] of skills) {
    t += `<rect x="${X + 6}" y="${y - 11}" width="10" height="10" rx="2" fill="#d70000"/><text x="${X + 28}" y="${y}" class="s" font-size="14.5" letter-spacing="2.4" fill="#fff">${esc(cat.toUpperCase())}</text>`; y += 20;
    let x = X;
    for (const it of items) {
      const label = it.toUpperCase(), tw = monoW(label, 11.5, 1.28), cw = tw + 26;
      if (x + cw > maxX) { x = X; y += 36; }
      t += `<rect x="${x}" y="${y}" width="${cw.toFixed(1)}" height="27" rx="2" fill="none" stroke="#cc0000"/>${mono(x + 13, y + 18, label, 11.5, '#ff3333', { ls: 1.28 })}`;
      x += cw + 9;
    }
    y += 27 + 38;
  }
  const H = y - 4;
  save('skills.svg', svg(W, H, 'Skills. ' + skills.map(([c, i]) => `${c}: ${i.join(', ')}`).join('. '), `<rect width="${W}" height="${H}" fill="#000"/>${t}`));
}

/* ------------------------------ TRAYECTORIA ------------------------------ */
{
  const X = 48; let y = 46; let t = '';
  t += `<text x="${X}" y="${y}" class="s" font-size="26" letter-spacing="2.8" fill="#cc0000">// Trayectoria</text>`; y += 46;
  const y0 = y - 6;
  for (const [date, title, org] of path) {
    t += `<circle cx="${X + 6}" cy="${y - 5}" r="4.5" fill="#000" stroke="#d70000" stroke-width="1.6"/>`;
    t += mono(X + 28, y, date.toUpperCase(), 12, '#ff4d4d', { ls: 1 });
    t += `<text x="${X + 160}" y="${y}" class="s" font-size="15.5" font-weight="600" fill="#fff">${esc(title)}</text>`;
    t += `<text x="${X + 160}" y="${y + 21}" class="s" font-size="13.5" fill="#9a9a9a">${esc(org)}</text>`;
    y += 56;
  }
  const H = y - 4;
  const line = `<line x1="${X + 6}" y1="${y0}" x2="${X + 6}" y2="${y - 62}" stroke="#2a0d0d" stroke-width="1.5"/>`;
  save('trayectoria.svg', svg(W, H, 'Trayectoria. ' + path.map((p) => p.join(' · ')).join('. '), `<rect width="${W}" height="${H}" fill="#000"/>${line}${t}`));
}

/* ---------------------------- WRITEUPS: TÍTULO ---------------------------- */
{
  const H = 132;
  const defs = `<radialGradient id="h" cx="50%" cy="0%" r="60%"><stop offset="0" stop-color="#d70000" stop-opacity=".28"/><stop offset="1" stop-color="#d70000" stop-opacity="0"/></radialGradient><linearGradient id="u"><stop offset="0" stop-color="#d70000"/><stop offset="1" stop-color="#27c93f"/></linearGradient>`;
  const body = `<rect width="${W}" height="${H}" fill="${BG}"/><rect y="0" width="${W}" height="1" fill="#2a0d0d"/><ellipse cx="${W / 2}" cy="34" rx="90" ry="30" fill="url(#h)"/>
    <text x="${W / 2}" y="80" text-anchor="middle" class="s" font-size="33" fill="#d70000">Writeups Recientes</text>
    <rect x="${W / 2 - 22}" y="100" width="44" height="3" rx="1.5" fill="url(#u)"/>`;
  save('writeups-titulo.svg', svg(W, H, 'Writeups recientes', body, { defs }));
}

/* ---------------------------- WRITEUPS: TARJETAS ---------------------------- */
writeups.forEach((w, i) => {
  const cw = W / 3, H = 138, pl = i === 0 ? 30 : 8, pr = i === 2 ? 30 : 8, x = pl, bw = cw - pl - pr;
  const sist = w.os === 'Windows' ? ['#5aa9d9', '#10283a'] : ['#5aa9d9', '#10283a'];
  const defs = `<clipPath id="c"><circle cx="${x + 38}" cy="50" r="24"/></clipPath>`;
  const tx = x + 76;
  const t1 = monoW('HACK THE BOX', 9.5, 0.6) + 14, t2 = monoW(w.os.toUpperCase(), 9.5, 0.6) + 14;
  const body = `<rect width="${cw}" height="${H}" fill="${BG}"/>
    <rect x="${x}" y="8" width="${bw}" height="112" rx="9" fill="#0d0606" stroke="#2a0d0d" stroke-width="1.2"/>
    <circle cx="${x + 38}" cy="50" r="25.5" fill="#0d0606" stroke="#d70000" stroke-width="1.4"/>
    <image href="data:image/webp;base64,${b64(w.id + '.webp')}" x="${x + 14}" y="26" width="48" height="48" clip-path="url(#c)" preserveAspectRatio="xMidYMid slice"/>
    <rect x="${x + 9}" y="70" width="58" height="16" rx="4" fill="#1f7a3d" stroke="#000" stroke-opacity=".4"/>
    ${mono(x + 38, 81.5, 'VERY EASY', 8.6, '#fff', { ls: 0.35, anchor: 'middle', weight: 700 })}
    <text x="${tx}" y="36" class="s" font-size="15" letter-spacing=".5" fill="#ff3333">${esc(w.title.toUpperCase())}</text>
    ${mono(tx, 55, w.desc[0], 10.6, '#9a9a9a')}${mono(tx, 70, w.desc[1], 10.6, '#9a9a9a')}
    <rect x="${tx}" y="86" width="${t1.toFixed(1)}" height="19" rx="4" fill="none" stroke="#3a2a10"/>${mono(tx + 7, 99, 'HACK THE BOX', 9.5, '#d9a441', { ls: 0.6 })}
    <rect x="${(tx + t1 + 6).toFixed(1)}" y="86" width="${t2.toFixed(1)}" height="19" rx="4" fill="none" stroke="${sist[1]}"/>${mono(tx + t1 + 13, 99, w.os.toUpperCase(), 9.5, sist[0], { ls: 0.6 })}`;
  save(`writeup-${w.id}.svg`, svg(cw, H, `Writeup: ${w.title} — Hack The Box, ${w.os}, very easy`, body, { defs }));
});

/* -------------------------- WRITEUPS: VER TODOS -------------------------- */
{
  const H = 116, label = 'VER TODOS LOS WRITEUPS →', bw = monoW(label, 13.5, 1.2) + 64;
  const body = `<rect width="${W}" height="${H}" fill="${BG}"/><rect x="${(W - bw) / 2}" y="22" width="${bw}" height="46" rx="8" fill="none" stroke="#d70000"/>
    ${mono(W / 2, 50, label, 13.5, '#ff4d4d', { ls: 1.2, anchor: 'middle' })}<rect y="${H - 1}" width="${W}" height="1" fill="#d70000" opacity=".45"/>`;
  save('writeups-todos.svg', svg(W, H, 'Ver todos los writeups', body, { withFont: false }));
}

/* --------------------------------- PIE --------------------------------- */
links.forEach(([id, label]) => {
  const w = W / 4, tw = monoW(label, 12, 0.3), x0 = (w - tw - 16) / 2;
  const body = `<rect width="${w}" height="64" fill="${BG}"/>${mono(x0, 42, '>', 12, '#27c93f', { weight: 700 })}${mono(x0 + 16, 42, label, 12, '#e6edf3', { ls: 0.3 })}`;
  save(`pie-${id}.svg`, svg(w, 64, label, body, { withFont: false }));
});
{
  const H = 56;
  const defs = `<clipPath id="b"><path d="M0 0h${W}v${H - 12}a12 12 0 0 1-12 12H12a12 12 0 0 1-12-12z"/></clipPath>`;
  const body = `<g clip-path="url(#b)"><rect width="${W}" height="${H}" fill="${BG}"/>${mono(W / 2, 26, '© 2026 Jesús Yeste // VKLF', 11, '#8b949e', { anchor: 'middle', ls: 0.3 })}</g>`;
  save('pie.svg', svg(W, H, '© 2026 Jesús Yeste // VKLF', body, { defs, withFont: false }));
}
