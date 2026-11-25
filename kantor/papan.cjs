// Data papan lokal. Dipakai server.cjs dan bisa dijalankan langsung:
//   node kantor/papan.cjs list jobs
//   node kantor/papan.cjs add chat '{"from":"riset","text":"..."}'
//   node kantor/papan.cjs update jobs <id> '{"stage":"naskah"}'
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const F = path.join(__dirname, 'data', 'papan.json');
const OK = ['jobs', 'chat'];
function read() {
  if (!fs.existsSync(F)) return { jobs: {}, chat: {} };
  return JSON.parse(fs.readFileSync(F, 'utf8')); // berkas rusak: gagal, jangan ditimpa
}
function write(fn) {
  fs.mkdirSync(path.dirname(F), { recursive: true });
  const L = F + '.lock'; let h;
  for (let i = 0; ; i++) {
    try { h = fs.openSync(L, 'wx'); break; } catch (e) {
      try { if (Date.now() - fs.statSync(L).mtimeMs > 5000) fs.unlinkSync(L); } catch {}
      if (i > 200) throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 15);
    }
  }
  try { const d = read(), r = fn(d); fs.writeFileSync(F + '.tmp', JSON.stringify(d, null, 1)); fs.renameSync(F + '.tmp', F); return r; }
  finally { fs.closeSync(h); try { fs.unlinkSync(L); } catch {} }
}
function check(c, d) { if (!OK.includes(c)) throw Error('koleksi tidak dikenal'); if (!d || typeof d !== 'object' || Array.isArray(d)) throw Error('data harus objek'); }
function add(c, d) { check(c, d); const id = crypto.randomBytes(8).toString('hex'); write((x) => { x[c][id] = c === 'chat' ? { job: '', to: '', at: Date.now(), ...d } : { createdAt: Date.now(), ...d }; }); return id; }
function update(c, id, d) { check(c, d); write((x) => { if (!Object.hasOwn(x[c], id)) throw Error('dokumen tidak ditemukan'); Object.assign(x[c][id], d); }); }
module.exports = { F, read, add, update };
if (require.main === module) {
  const [, , op, c, a, b] = process.argv;
  if (op === 'list' && OK.includes(c)) console.log(JSON.stringify(Object.fromEntries(Object.entries(read()[c]).filter(([, v]) => !v.arsip)), null, 1));
  else if (op === 'add') console.log(add(c, JSON.parse(a)));
  else if (op === 'update') {
    const v = JSON.parse(b);
    if (c === 'jobs' && (v.review_naskah || v.review_storyboard || v.review_hasil)) { console.error('Keputusan hanya boleh dibuat pengguna di kantor'); process.exit(1); }
    if (c === 'jobs' && v.stage === 'animasi') { const e = require('./hasil.cjs').gerbangSb(a); if (e.length) { console.error('ANIMASI DITOLAK\n- ' + e.join('\n- ')); process.exit(1); } }
    if (c === 'jobs' && v.stage === 'editing') { const e = require('./hasil.cjs').gerbang(a); if (e.length) { console.error('RENDER DITOLAK\n- ' + e.join('\n- ')); process.exit(1); } }
    update(c, a, JSON.parse(b)); console.log('ok'); }
  else { console.error('Pakai: list|add|update jobs|chat ...'); process.exit(1); }
}
