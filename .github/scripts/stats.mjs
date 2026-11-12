// Genera assets/stats.svg con la paleta de vklf.es a partir de la API GraphQL de GitHub.
// Uso: GITHUB_TOKEN=... node .github/scripts/stats.mjs [usuario] [salida]
import { writeFileSync } from 'node:fs';

const login = process.argv[2] || 'VKLF-OFFICIAL';
const out = process.argv[3] || 'assets/stats.svg';
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('Falta GITHUB_TOKEN');

const query = `query($login:String!){
  user(login:$login){
    createdAt
    followers{totalCount}
    repositories(ownerAffiliations:OWNER,isFork:false,privacy:PUBLIC,first:100){
      totalCount
      nodes{ stargazerCount languages(first:10,orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name } } } }
    }
    contributionsCollection{
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      restrictedContributionsCount
      contributionCalendar{ totalContributions }
    }
  }
}`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'vklf-readme-stats' },
  body: JSON.stringify({ query, variables: { login } }),
});
const json = await res.json();
if (json.errors || !json.data?.user) throw new Error(JSON.stringify(json.errors || json));
const u = json.data.user;
const c = u.contributionsCollection;

const stars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);

// Commits públicos firmados por la cuenta (la búsqueda no depende del calendario de contribuciones).
const sr = await fetch(`https://api.github.com/search/commits?q=author:${encodeURIComponent(login)}&per_page=1`, {
  headers: { Authorization: `bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'vklf-readme-stats' },
});
const commits = sr.ok ? (await sr.json()).total_count : 0;
const langBytes = {};
for (const r of u.repositories.nodes)
  for (const e of r.languages.edges) langBytes[e.node.name] = (langBytes[e.node.name] || 0) + e.size;
const total = Object.values(langBytes).reduce((a, b) => a + b, 0) || 1;
const langs = Object.entries(langBytes).sort((a, b) => b[1] - a[1]).slice(0, 6)
  .map(([name, size]) => ({ name, pct: (size / total) * 100 }));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = (n) => (n >= 1900 && n <= 2100 ? String(n) : n.toLocaleString('es-ES'));
const shades = ['#d70000', '#ff4d4d', '#b03a1f', '#8a1f1f', '#c80101', '#9a8a8a'];

const stats = [
  ['Commits públicos', commits],
  ['Repositorios públicos', u.repositories.totalCount],
  ['Estrellas recibidas', stars],
  ['Lenguajes distintos', Object.keys(langBytes).length],
  ['En GitHub desde', new Date(u.createdAt).getFullYear()],
];
if (c.contributionCalendar.totalContributions > 0)
  stats.splice(1, 0, ['Contribuciones (último año)', c.contributionCalendar.totalContributions]);

const statRows = stats.map(([k, v], i) => {
  const y = 92 + i * 30;
  return `<g>
    <text x="28" y="${y}" class="m s"><tspan fill="#d70000">&gt;</tspan> ${esc(k)}</text>
    <text x="520" y="${y}" class="m v" text-anchor="end">${fmt(v)}</text>
    <line x1="28" y1="${y + 11}" x2="520" y2="${y + 11}" stroke="#2a0d0d" stroke-width="1"/></g>`;
}).join('\n');

// Barra apilada + leyenda
let x = 0;
const barW = 384;
const bar = langs.map((l, i) => {
  const w = Math.max((l.pct / 100) * barW, 2);
  const seg = `<rect x="${(586 + x).toFixed(1)}" y="78" width="${w.toFixed(1)}" height="10" fill="${shades[i % shades.length]}"/>`;
  x += w;
  return seg;
}).join('');
const legend = langs.map((l, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  const lx = 586 + col * 196, ly = 124 + row * 34;
  return `<circle cx="${lx + 6}" cy="${ly - 5}" r="6" fill="${shades[i % shades.length]}"/>
    <text x="${lx + 20}" y="${ly}" class="m s">${esc(l.name)} <tspan fill="#9a8a8a">${l.pct.toFixed(1)}%</tspan></text>`;
}).join('\n');

const updated = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Madrid' });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="290" viewBox="0 0 1000 290" role="img" aria-label="Estadísticas de GitHub de ${esc(login)}: ${stats.map(([k, v]) => `${k} ${v}`).join(', ')}. Lenguajes: ${langs.map((l) => `${l.name} ${l.pct.toFixed(1)}%`).join(', ')}.">
  <defs><style>
    .m{font-family:'Courier New',Consolas,'Liberation Mono',monospace}
    .h{font-size:13px;fill:#d70000;letter-spacing:2px}
    .s{font-size:15px;fill:#e8e8e8}
    .v{font-size:17px;font-weight:700;fill:#ff4d4d}
    .f{font-size:12px;fill:#9a8a8a}
  </style>
  <clipPath id="bar"><rect x="586" y="78" width="${barW}" height="10" rx="5"/></clipPath></defs>
  <rect x="1" y="1" width="548" height="288" rx="10" fill="#0d0606" stroke="#2a0d0d" stroke-width="2"/>
  <rect x="561" y="1" width="438" height="288" rx="10" fill="#0d0606" stroke="#2a0d0d" stroke-width="2"/>
  <text x="28" y="40" class="m h">// ESTADÍSTICAS</text>
  <text x="586" y="40" class="m h">// LENGUAJES</text>
${statRows}
  <rect x="586" y="78" width="${barW}" height="10" rx="5" fill="#140808"/>
  <g clip-path="url(#bar)">${bar}</g>
${legend}
  <text x="970" y="270" class="m f" text-anchor="end">actualizado ${updated}</text>
</svg>
`;
writeFileSync(out, svg);
console.log(`OK ${out}`, stats, langs);
