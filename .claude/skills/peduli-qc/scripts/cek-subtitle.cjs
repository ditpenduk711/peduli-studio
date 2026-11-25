// node cek-subtitle.cjs berkas.(srt|json|tsx) [9:16|16:9]   json/tsx: [awal, akhir, 'teks']
const fs = require('fs'), f = process.argv[2], max = process.argv[3] === '16:9' ? 42 : 28, s = fs.readFileSync(f, 'utf8'), C = [], bad = [];
const d = (x) => { const [a, b, c] = x.replace(',', '.').split(':').map(Number); return a * 3600 + b * 60 + c; };
if (/\.srt$/i.test(f)) { for (const b of s.replace(/\r/g, '').split(/\n\n+/)) { const m = b.match(/([\d:,]+) --> ([\d:,]+)\n([\s\S]+)/); if (m) C.push([d(m[1]), d(m[2]), m[3].trim()]); } }
else { const z = s.match(/CUE[^=]*=\s*\[([\s\S]*?)\];/); for (const m of (z ? z[1] : s).matchAll(/\[\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*(['"`])((?:\\.|(?!\3)[\s\S])*)\3/g)) C.push([+m[1], +m[2], m[4]]); }
if (!C.length) { console.error('Tidak ada subtitle terbaca'); process.exit(2); }
C.forEach(([a, b, t], i) => {
  const k = 'subtitle ' + (i + 1) + ' "' + t.slice(0, 40) + '": ';
  if (/\n|\\n|<br/i.test(t)) bad.push(k + 'lebih dari 1 baris');
  if (t.length > max) bad.push(k + t.length + ' karakter (maks ' + max + ')');
  if (b - a < 0.69 || b - a > 3.01) bad.push(k + (b - a).toFixed(2) + ' detik (0,7-3)');
  if (i && a < C[i - 1][1] - 0.001) bad.push(k + 'menumpuk dengan sebelumnya');
});
if (/\.tsx$/.test(f)) {
  const r = s.split('\n').filter((l) => /cue\[2\]|cue\.text/.test(l));
  if (!r.some((l) => /nowrap/.test(l))) bad.push('whiteSpace nowrap tidak ada pada subtitle');
  if (r.some((l) => /background/i.test(l))) bad.push('subtitle memakai background');
}
console.log(C.length + ' subtitle');
console.log(bad.length ? 'TOLAK\n- ' + bad.join('\n- ') : 'Lolos mesin (tetap lihat gambarnya)');
process.exit(bad.length ? 1 : 0);
