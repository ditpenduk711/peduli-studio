// Hasil kerja per job untuk kantor, dan gerbang sebelum render.
//   node kantor/hasil.cjs gerbang <id>     periksa izin render
//   node kantor/hasil.cjs tunggu <id>      menunggu keputusan pengguna di kantor
//   node kantor/hasil.cjs sidik <id>       sidik naskah untuk laporan QC
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const P = require('./papan.cjs'), ROOT = path.join(__dirname, '..', 'jobs');
const IDR = /^[0-9a-f]{16}$/, MIME = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', mp4: 'video/mp4', webm: 'video/webm', mp3: 'audio/mpeg', wav: 'audio/wav' };
const DIRS = ['', 'gambar', 'qc', 'audio', 'contoh-suara', 'sampul'], ext = (f) => path.extname(f).slice(1).toLowerCase();
const KEYS = ['judul', 'narasi', 'suara', 'gambar', 'latar', 'gerak', 'subtitle', 'komposisi'];
function dir(id) { if (!IDR.test(id)) throw Error('job tidak dikenal'); return path.join(ROOT, id); }
function daftar(id) {
  const d = dir(id), o = [];
  for (const s of DIRS) {
    const p = path.join(d, s); if (!fs.existsSync(p)) continue;
    for (const e of fs.readdirSync(p, { withFileTypes: true })) {
      if (!e.isFile()) continue; const x = ext(e.name); if (x !== 'md' && !MIME[x]) continue;
      const st = fs.statSync(path.join(p, e.name));
      o.push({ path: s ? s + '/' + e.name : e.name, jenis: x === 'md' ? 'teks' : MIME[x].split('/')[0], ubah: Math.round(st.mtimeMs), ukuran: st.size });
    }
  }
  return o.sort((a, b) => a.path.localeCompare(b.path, 'id', { numeric: true }));
}
function narasi(id) {
  const f = path.join(dir(id), '02-naskah.md'); if (!fs.existsSync(f)) return null;
  const t = fs.readFileSync(f, 'utf8'), baris = [];
  for (const l of t.split(/\r?\n/)) { const c = l.replace(/^\s*\|/, '').split('|').map((x) => x.trim()); if (/^\d+$/.test(c[0]) && c.length >= 6) baris.push({ n: c[0], tokoh: c[1], ucap: c[2].replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim(), gambar: c[5] }); }
  return { baris, sidik: crypto.createHash('sha256').update(t).digest('hex').slice(0, 16) };
}
// storyboard.json: [{"n":1,"ucap":"...","gambar":"gambar/sb-01.png","suara":"audio/vo-01.wav","detik":4.2,"gerak":"..."}]
function storyboard(id) {
  let s; try { s = JSON.parse(fs.readFileSync(path.join(dir(id), 'storyboard.json'), 'utf8')); } catch { return null; }
  if (!Array.isArray(s) || !s.length) return null;
  const ada = new Set(daftar(id).map((f) => f.path)), x = crypto.createHash('sha256').update(JSON.stringify(s)), kurang = [];
  const n = narasi(id), beda = (n ? n.baris : []).filter((b) => !s.some((a) => String(a.n) === b.n && String(a.ucap).replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim() === b.ucap)).map((b) => b.n);
  s.forEach((a, i) => { for (const k of ['gambar', 'suara']) { const f = String(a[k] || ''); if (!ada.has(f)) kurang.push('adegan ' + (a.n || i + 1) + ': ' + k + ' belum ada'); else x.update(fs.readFileSync(path.join(dir(id), f))); } });
  if (beda.length) kurang.push('narasi adegan ' + beda.join(', ') + ' tidak sama dengan yang disetujui');
  return { adegan: s, kurang, sidik: x.digest('hex').slice(0, 16) };
}
// gaya.json: [{"id":"lemo:watercolor","alasan":"..."}] tiga usulan bila pengguna menyerahkan gaya kepada tim
function gaya(id) {
  let g; try { g = JSON.parse(fs.readFileSync(path.join(dir(id), 'gaya.json'), 'utf8')); } catch { return []; }
  if (!Array.isArray(g)) return []; const ada = new Set();
  return g.filter((x) => x && /^(3d-pahat|stickman|voxel-chibi|lemo:[a-z0-9-]+)$/.test(x.id) && String(x.alasan || '').trim().length > 14 && !ada.has(x.id) && ada.add(x.id)).slice(0, 3).map((x) => ({ id: x.id, alasan: String(x.alasan).slice(0, 300) }));
}
function judul(id) {
  let t; try { t = fs.readFileSync(path.join(dir(id), '01b-judul.md'), 'utf8'); } catch { return []; }
  const o = []; for (const l of t.split(/\r?\n/)) { const c = l.replace(/\*\*|`/g, '').split('|').map((x) => x.trim()); if (/^\d+$/.test(c[1]) && c[2] && c.length > 3) o.push(c[2].replace(/^["“]|["”]$/g, '').slice(0, 90)); }
  return [...new Set(o)].slice(0, 3);
}
function gerbangSb(id) {
  const e = [], j = P.read().jobs[id] || {}, n = narasi(id), b = storyboard(id), v = j.review_naskah, w = j.review_storyboard;
  if (!n) e.push('naskah belum ada');
  else if (!v || v.keputusan !== 'setuju') e.push('judul dan narasi belum disetujui pengguna di kantor');
  else { if (v.sidik !== n.sidik) e.push('narasi berubah setelah disetujui'); if (v.judul !== j.title) e.push('judul berubah setelah disetujui'); }
  if (!b) e.push('storyboard belum ada'); else { e.push(...b.kurang); if (!w || w.keputusan !== 'setuju') e.push('storyboard belum disetujui pengguna di kantor'); else if (w.sidik !== b.sidik) e.push('storyboard berubah setelah disetujui'); }
  return e;
}
function satu(id) {
  const files = daftar(id), teks = {};
  for (const f of files) if (f.jenis === 'teks') teks[f.path] = fs.readFileSync(path.join(dir(id), f.path), 'utf8').slice(0, 60000);
  return { files, teks, narasi: narasi(id), storyboard: storyboard(id), gerbang: gerbang(id), gaya: gaya(id), judul: judul(id), langkah: require('./langkah.cjs').periksa(id) };
}
function semua() {
  const o = {};
  for (const id of Object.keys(P.read().jobs)) {
    if (!IDR.test(id)) continue;
    const f = daftar(id), n = (j) => f.filter((x) => x.jenis === j).length, g = f.filter((x) => x.jenis === 'image');
    const v = f.filter((x) => x.jenis === 'video').sort((a, b) => b.ubah - a.ubah)[0];
    o[id] = { teks: n('teks'), image: g.length, audio: n('audio'), video: n('video'), naskah: f.some((x) => x.path === '02-naskah.md'), thumb: (g.find((x) => !/lembar|cek/.test(x.path)) || g[0] || {}).path || '', film: v ? v.path : '' };
  }
  return o;
}
function kirim(q, r) {
  const m = decodeURIComponent(q.url.split('?')[0]).match(/^\/berkas\/([0-9a-f]{16})\/(.+)$/), no = () => { r.writeHead(404); r.end(); };
  if (!m || !MIME[ext(m[2])] || !daftar(m[1]).some((f) => f.path === m[2])) return no();
  const f = fs.realpathSync(path.join(dir(m[1]), m[2])); if (!f.startsWith(fs.realpathSync(ROOT) + path.sep)) return no();
  const n = fs.statSync(f).size, h = { 'content-type': MIME[ext(f)], 'accept-ranges': 'bytes', 'cross-origin-resource-policy': 'same-origin', 'x-content-type-options': 'nosniff', 'cache-control': 'no-cache' };
  let a = 0, b = n - 1, code = 200; const g = /^bytes=(\d*)-(\d*)$/.exec(q.headers.range || '');
  if (g && (g[1] || g[2])) {
    if (g[1]) { a = +g[1]; if (g[2]) b = Math.min(b, +g[2]); } else a = Math.max(0, n - +g[2]);
    if (a > b) { r.writeHead(416, { 'content-range': 'bytes */' + n }); return r.end(); }
    code = 206; h['content-range'] = `bytes ${a}-${b}/${n}`;
  }
  h['content-length'] = Math.max(0, b - a + 1); r.writeHead(code, h); if (q.method === 'HEAD' || !n) return r.end();
  const s = fs.createReadStream(f, { start: a, end: b }); s.on('error', () => r.destroy()); r.on('close', () => s.destroy()); s.pipe(r);
}
// Semua alasan render belum boleh. Daftar kosong = boleh.
function gerbang(id) {
  const e = gerbangSb(id), n = narasi(id);
  let q; try { q = JSON.parse(fs.readFileSync(path.join(dir(id), 'qc', 'pra-render.json'), 'utf8')); } catch { e.push('laporan QC sebelum render belum ada'); return e; }
  if (n && q.sidik !== n.sidik) e.push('QC memeriksa naskah versi lain');
  if (q.putusan !== 'LOLOS') e.push('putusan QC: ' + (q.putusan || 'kosong'));
  for (const k of KEYS) { const x = (q.nilai || {})[k]; if (!x || !(+x.nilai >= 9 && +x.nilai <= 10)) e.push('nilai ' + k + ' belum 9'); else if (!String(x.bukti || '').trim()) e.push('nilai ' + k + ' tanpa bukti'); }
  if (!Array.isArray(q.temuan)) e.push('daftar temuan QC tidak ada'); else if (q.temuan.some((t) => t.status !== 'selesai')) e.push('masih ada temuan QC terbuka');
  return e;
}
// Siaga: keluar begitu ada pekerjaan baru bertanda mulai, atau keputusan/pesan pengguna yang belum ditangani.
const SF = path.join(__dirname, 'data', 'siaga.json');
const siaga = () => { try { return Date.now() - fs.statSync(SF).mtimeMs < 8000; } catch { return false; } };
function jaga() {
  let t0; try { t0 = JSON.parse(fs.readFileSync(SF, 'utf8')).sampai; } catch { t0 = Date.now(); }
  const cek = () => {
    let d; try { d = P.read(); } catch { return; }
    const ev = [], now = Date.now();
    for (const [id, j] of Object.entries(d.jobs)) {
      if (j.arsip) continue;
      if (j.status === 'antre' && j.mulai) ev.push({ jenis: 'mulai', job: id });
      for (const k of ['review_naskah', 'review_storyboard', 'review_hasil']) if (j[k] && j[k].at > t0) ev.push({ jenis: k, job: id, keputusan: j[k].keputusan });
    }
    for (const m of Object.values(d.chat)) if (m.from === 'anda' && m.at > t0 && !m.job && !m.aksi) ev.push({ jenis: 'pesan', untuk: m.to });
    fs.writeFileSync(SF, JSON.stringify({ sampai: ev.length ? now : t0 }));
    if (ev.length) { fs.utimesSync(SF, new Date(0), new Date(0)); console.log(JSON.stringify(ev)); process.exit(0); }
  };
  fs.mkdirSync(path.dirname(SF), { recursive: true });
  const lama = siaga(); if (lama) { console.error('Sudah ada yang siaga'); process.exit(2); }
  cek(); setInterval(cek, 2000);
}
module.exports = { gaya, judul, gerbangSb, storyboard, siaga, daftar, satu, semua, kirim, gerbang, narasi };
if (require.main === module) {
  const [, , op, id] = process.argv;
  if (op === 'gerbang') { const e = gerbang(id); console.log(e.length ? 'RENDER DITOLAK\n- ' + e.join('\n- ') : 'BOLEH RENDER'); process.exit(e.length ? 1 : 0); }
  else if (op === 'tunggu') {
    const t0 = Date.now(), t = setInterval(() => {
      let j; try { j = P.read().jobs[id]; } catch { return; }
      if (!j || j.arsip) { console.log('job dihapus pengguna'); process.exit(1); }
      for (const k of ['review_naskah', 'review_storyboard', 'review_hasil']) if (j[k] && j[k].at > t0) { console.log(k + ': ' + JSON.stringify(j[k])); clearInterval(t); return; }
    }, 1500);
  }
  else if (op === 'jaga') jaga();
  else if (op === 'sidik') console.log((narasi(id) || {}).sidik || '');
  else { console.error('Pakai: gerbang|tunggu|sidik <id>'); process.exit(1); }
}
