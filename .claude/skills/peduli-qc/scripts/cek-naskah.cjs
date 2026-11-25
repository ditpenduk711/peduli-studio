// node cek-naskah.cjs 02-naskah.md   (tabel: nomor | tokoh | ucapan | ...)
const t = require('fs').readFileSync(process.argv[2], 'utf8');
const rows = [], seen = new Set();
for (const l of t.split(/\r?\n/)) { const c = l.replace(/^\s*\|/, '').split('|').map((x) => x.trim()); if (/^\d+$/.test(c[0]) && c.length >= 6 && !seen.has(c[0])) { seen.add(c[0]); rows.push(c); } }
if (!rows.length) { console.error('Tidak ada baris naskah yang terbaca'); process.exit(2); }
const W = (s) => (s.match(/[\p{L}\p{N}-]+/gu) || []).length, all = rows.map((r) => r[2]).join(' '), n = W(all), S = all.split(/[.!?]+/).filter((x) => x.trim());
const bad = [];
for (const [re, m, max] of [[/bukan (sekadar |hanya )?[^.?!]{1,50}(tapi|tetapi|melainkan)/gi, 'bukan X tapi Y', 0], [/, bukan [^.?!]{1,40}/gi, 'X, bukan Y', 0], [/tahukah (kamu|anda)/gi, 'tahukah', 0], [/\bdi era\b/gi, 'di era', 0], [/mari kita/gi, 'mari kita', 0], [/\?/g, 'tanda tanya', 3]]) { const k = (all.match(re) || []).length; if (k > max) bad.push(m + ' x' + k); }
S.filter((s) => W(s) > 20).forEach((s) => bad.push('kalimat ' + W(s) + ' kata: ' + s.trim().slice(0, 50)));
const pendek = S.filter((s) => W(s) <= 3).length; if (pendek / S.length > 0.3) bad.push('kalimat <=3 kata ' + pendek + '/' + S.length);
rows.forEach((r) => { if (/\d|\b(KTP|BPS|NIK|KK|KIA)\b/.test(r[2])) bad.push('baris ' + r[0] + ': angka/singkatan belum dieja'); });
console.log(rows.length + ' baris, ' + n + ' kata, perkiraan ' + (n / 1.75).toFixed(0) + ' detik sebelum jeda adegan');
console.log(bad.length ? 'PERLU DIPERIKSA\n- ' + bad.join('\n- ') : 'Tidak ada pola yang tertangkap (belum berarti bagus)');
process.exit(bad.length ? 1 : 0);
