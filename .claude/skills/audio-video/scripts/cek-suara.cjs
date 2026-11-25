// node cek-suara.cjs berkas jumlahKata
const { spawnSync } = require('child_process'), [, , f, k] = process.argv;
const run = (a) => { const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', f, '-af', a, '-f', 'null', '-'], { encoding: 'utf8' }); if (r.status !== 0) { console.error(r.error ? r.error.message : r.stderr.slice(-300)); process.exit(2); } return r.stderr; };
const a = run('ebur128=peak=true'), s = run('silencedetect=n=-40dB:d=0.1');
const last = (re, t) => { const m = [...t.matchAll(re)].pop(); return m ? +m[1] : NaN; };
const hms = a.match(/Duration: (\d+):(\d+):([\d.]+)/), dur = +hms[1] * 3600 + +hms[2] * 60 + +hms[3];
const I = last(/I:\s+(-?[\d.]+) LUFS/g, a), P = last(/Peak:\s+(-?[\d.]+) dBFS/g, a);
const starts = [...s.matchAll(/silence_start: (-?[\d.]+)/g)].map((m) => +m[1]), ends = [...s.matchAll(/silence_end: ([\d.]+)/g)].map((m) => +m[1]);
const G = starts.map((x, i) => [x, ends[i] ?? dur]).filter(([x, y]) => x > 0.05 && y < dur - 0.1).map(([x, y]) => y - x);
const max = G.length ? Math.max(...G) : 0, avg = G.length ? G.reduce((x, y) => x + y, 0) / G.length : 0, kps = k ? +k / dur : NaN;
const sd = G.length ? Math.sqrt(G.reduce((x, y) => x + (y - avg) ** 2, 0) / G.length) : 0;
const T = [['kenyaringan', I, I >= -17 && I <= -15], ['puncak', P, P <= -1], ['jeda terpanjang', max, max <= 0.9], ['kata/detik', kps, !k || (kps >= 1.65 && kps <= 2.8)]];
console.log('durasi', dur.toFixed(2), 'jeda', G.length, 'rata', avg.toFixed(2), 'variasi', sd.toFixed(2));
T.forEach(([n, v, ok]) => console.log(ok ? 'LOLOS' : 'GAGAL', n, Number.isNaN(v) ? '(tidak dihitung)' : v.toFixed(2)));
console.log('Nada dan kealamian TIDAK dinilai.');
process.exit(T.every((t) => t[2]) ? 0 : 1);
