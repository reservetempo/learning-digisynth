// Verification for this site. Run it before committing a lesson:
//
//     node tools/check-links.js
//
// It checks that every internal link resolves to a file that exists, that every
// "#anchor" (all the glossary jargon links) exists as an id in its target page,
// that the stylesheet resolves, and that no page has picked up an external
// script or stylesheet — the site must keep working offline from file://.
//
// assets/_template.html is skipped: its TODO links are placeholders by design.

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const skip = new Set([path.normalize(path.join(root, 'assets', '_template.html'))]);

const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (e.name !== '.git') walk(p); }
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(root);

const idsOf = new Map();
for (const p of pages) {
  const src = fs.readFileSync(p, 'utf8');
  idsOf.set(path.normalize(p), new Set([...src.matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
}

let bad = 0, checked = 0;
const external = new Set();

for (const p of pages) {
  if (skip.has(path.normalize(p))) continue;
  const src = fs.readFileSync(p, 'utf8');
  const rel = path.relative(root, p).replace(/\\/g, '/');

  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|data:)/.test(href)) { external.add(href); continue; }
    checked++;
    const [file, anchor] = href.split('#');
    const target = file === '' ? path.normalize(p)
                               : path.normalize(path.resolve(path.dirname(p), file));
    if (!fs.existsSync(target)) { console.log(`MISSING FILE    ${rel}  ->  ${href}`); bad++; continue; }
    if (anchor && !(idsOf.get(target) || new Set()).has(anchor)) {
      console.log(`MISSING ANCHOR  ${rel}  ->  ${href}`); bad++;
    }
  }

  for (const m of src.matchAll(/<link[^>]+href="([^"]+)"/g)) {
    if (/^https?:/.test(m[1])) continue;
    if (!fs.existsSync(path.resolve(path.dirname(p), m[1]))) {
      console.log(`MISSING CSS     ${rel}  ->  ${m[1]}`); bad++;
    }
  }

  for (const m of src.matchAll(/<(script|link)[^>]*(src|href)="(https?:[^"]+)"/g)) {
    console.log(`EXTERNAL ASSET  ${rel}  ->  ${m[3]}`); bad++;
  }
}

console.log(`\n${pages.length - skip.size} pages, ${checked} internal links, ${bad} problem(s).`);
console.log(`${external.size} external links (check new ones resolve before committing):`);
for (const e of [...external].sort()) console.log('  ' + e);
process.exit(bad === 0 ? 0 : 1);
