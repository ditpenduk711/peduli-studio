// Mesin langkah: menentukan langkah berikutnya dari BUKTI berkas dan keputusan pengguna, bukan dari pengakuan AI.
//   node kantor/langkah.cjs          semua pekerjaan aktif
//   node kantor/langkah.cjs <id>     langkah berikutnya untuk satu pekerjaan (papan ikut diperbarui)
const fs = require('fs'), path = require('path');
const P = require('./papan.cjs'), H = require('./hasil.cjs');
const isi = (id, f) => { try { return fs.readFileSync(path.join(__dirname, '..', 'jobs', id, f), 'utf8'); } catch { return ''; } };
const json = (id, f) => { try { return JSON.parse(isi(id, f)); } catch { return null; } };
const setuju = (j, k, s) => !!(j[k] && j[k].keputusan === 'setuju' && j[k].sidik === s);
const ya = (ok, kurang) => ok ? '' : kurang;
// [id, tahap papan, pegawai, nama untuk pengguna, skill, tugas, cek => '' bila beres, selain itu yang kurang, jenis persetujuan]
const L = [
  ['arahan', 'riset', 'bima', 'Memahami permintaan', 'peduli-tim', 'Tulis 00-arahan.md: penonton, satu hasil setelah menonton, larangan dan selera pengguna kata demi kata.', (c) => ya(c.t('00-arahan.md').length > 80, '00-arahan.md belum ada atau terlalu pendek')],
  ['riset', 'riset', 'riset', 'Riset fakta', 'riset-video (edukasi-kependudukan bila topiknya kependudukan)', 'Tulis 01-fakta.md dengan tautan sumber tiap fakta.', (c) => ya(/https?:\/\//.test(c.t('01-fakta.md')), '01-fakta.md belum ada atau belum bersumber')],
  ['gaya', 'naskah', 'visual', 'Usulan gaya', 'komposisi-video, lemo-opuscar', 'Tulis gaya.json: [{"id":"3d-pahat|stickman|voxel-chibi|lemo:<folder>","alasan":"..."}], tepat 3 gaya berbeda, pilihan terbaik di urutan pertama. Alasan menyebut isi cerita ini.', (c) => c.j.style !== 'lain' && c.j.style !== 'tim' && c.j.style ? '' : ya(H.gaya(c.id).length === 3, 'gaya.json harus berisi 3 gaya berbeda dengan alasan')],
  ['judul', 'naskah', 'kemasan', 'Pilihan judul', 'judul-video', 'Tulis 01b-judul.md (tabel | No | Judul | Alasan |, minimal 3), jalankan cek-judul.cjs, isi title job dengan yang terbaik.', (c) => H.judul(c.id).length < 3 ? '01b-judul.md belum berisi 3 pilihan' : ya(c.j.title, 'title job masih kosong')],
  ['narasi', 'naskah', 'naskah', 'Menulis narasi', 'naskah-video', 'Tulis 02-naskah.md (tabel | nomor | tokoh | ucapan | teks layar | emosi | gambar | fakta |), jalankan cek-naskah.cjs.', (c) => ya(c.n && c.n.baris.length, '02-naskah.md belum ada atau tidak memakai tabel')],
  ['periksa', 'naskah', 'qc', 'Memeriksa narasi', 'peduli-qc', 'Pemeriksa selain penulisnya menulis qc/naskah.json: {"sidik":"<node kantor/hasil.cjs sidik id>","putusan":"LOLOS|TOLAK","temuan":["..."]}. TOLAK: kembali ke penulis.', (c) => { const q = json(c.id, 'qc/naskah.json'); return !q ? 'qc/naskah.json belum ada' : q.sidik !== (c.n || {}).sidik ? 'narasi berubah, periksa lagi' : ya(q.putusan === 'LOLOS', 'putusan ' + q.putusan + ': perbaiki narasi'); }],
  ['setuju1', 'setuju', 'anda', 'Anda menyetujui judul, narasi, dan gaya', '', '', (c) => ya(c.n && setuju(c.j, 'review_naskah', c.n.sidik) && c.j.review_naskah.judul === c.j.title, 'belum disetujui'), 'naskah'],
  ['gambar', 'visual', 'visual', 'Gambar tiap adegan', 'komposisi-video, latar-video, dan satu skill gaya', 'Buat satu gambar gaya akhir untuk tiap baris narasi di gambar/sb-*.png, sesuai field style.', (c) => ya(c.n && c.f.filter((x) => /^gambar\/sb-/.test(x.path)).length >= c.n.baris.length, 'gambar adegan belum lengkap')],
  ['suara', 'audio', 'audio', 'Merekam suara', 'audio-video', 'Rekam satu voice over tiap baris di audio/vo-*, jalankan cek-suara.cjs.', (c) => ya(c.n && c.f.filter((x) => /^audio\/vo-/.test(x.path) && x.jenis === 'audio').length >= c.n.baris.length, 'voice over belum lengkap')],
  ['storyboard', 'audio', 'bima', 'Menyusun storyboard', 'peduli-tim', 'Tulis storyboard.json. Pemeriksa memastikan ucapan, gambar, dan suara cocok.', (c) => { const s = H.storyboard(c.id); return s ? s.kurang.join('; ') : 'storyboard.json belum ada'; }],
  ['setuju2', 'storyboard', 'anda', 'Anda menyetujui storyboard', '', '', (c) => ya(setuju(c.j, 'review_storyboard', (H.storyboard(c.id) || {}).sidik), 'belum disetujui'), 'storyboard'],
  ['animasi', 'animasi', 'animasi', 'Animasi dan editing', 'gerak-video, latar-video, editing-video, skill gaya', 'Animasikan sesuai storyboard. Simpan minimal 2 gambar uji tiap adegan di qc/. Periksa subtitle dengan cek-subtitle.cjs.', (c) => ya(c.n && c.f.filter((x) => /^qc\//.test(x.path) && x.jenis === 'image').length >= c.n.baris.length * 2, 'gambar uji di qc/ belum 2 tiap adegan')],
  ['prarender', 'qc', 'qc', 'QC sebelum render', 'peduli-qc', 'Pemeriksa selain pembuatnya menulis qc/pra-render.json; semua nilai minimal 9 dengan bukti.', (c) => H.gerbang(c.id).join('; ')],
  ['render', 'editing', 'editing', 'Render video', 'editing-video', 'Render satu proses, simpan MP4 di folder job.', (c) => ya(c.film && c.film.ubah >= c.pra, 'video belum dirender setelah QC')],
  ['qcakhir', 'qc', 'qc', 'QC video jadi', 'peduli-qc', 'Periksa berkas jadi (ffprobe, 1 gambar tiap detik, potongan), tulis 04-qc.md diakhiri PUTUSAN: LOLOS atau PUTUSAN: TOLAK.', (c) => { const q = c.f.find((x) => x.path === '04-qc.md'); return !q || !c.film || q.ubah < c.film.ubah ? '04-qc.md belum memeriksa video ini' : ya(/PUTUSAN:\s*LOLOS/i.test(c.t('04-qc.md')), 'video belum lolos QC: perbaiki lalu render ulang'); }],
  ['setuju3', 'qc', 'anda', 'Anda menyetujui video', '', '', (c) => ya(c.film && c.j.review_hasil && c.j.review_hasil.keputusan === 'setuju' && c.j.review_hasil.at >= c.film.ubah, 'belum disetujui'), 'hasil'],
  ['kemasan', 'kemasan', 'kemasan', 'Siap unggah', 'kemasan-video', 'Tulis 05-kemasan.md (judul, caption, hashtag) dan sampul/. Jangan mengunggah.', (c) => ya(c.t('05-kemasan.md') && c.f.some((x) => /^sampul\//.test(x.path)), '05-kemasan.md atau sampul belum ada')]
];
function konteks(id) {
  const j = P.read().jobs[id]; if (!j) throw Error('job tidak dikenal');
  const f = H.daftar(id), film = f.filter((x) => x.jenis === 'video').sort((a, b) => b.ubah - a.ubah)[0];
  let pra = Infinity; try { pra = fs.statSync(path.join(__dirname, '..', 'jobs', id, 'qc', 'pra-render.json')).mtimeMs; } catch {}
  return { id, j, f, film, pra: Math.floor(pra), n: H.narasi(id), t: (x) => isi(id, x) };
}
function periksa(id) {
  const c = konteks(id); let buka = true;
  return L.map((x) => { const kurang = buka ? x[6](c) : 'menunggu langkah sebelumnya', beres = !kurang; const s = beres ? 'beres' : buka ? 'sekarang' : 'nanti'; if (kurang) buka = false; return { id: x[0], tahap: x[1], oleh: x[2], nama: x[3], skill: x[4], tugas: x[5], minta: x[7] || '', status: s, kurang }; });
}
const ubahGaya = (id) => { try { return fs.statSync(path.join(__dirname, '..', 'jobs', id, 'gaya.json')).mtimeMs; } catch { return 0; } };
// revisi yang masih berlaku untuk versi yang sekarang
function revisi(c, m) {
  const r = c.j['review_' + m]; if (!r || r.keputusan !== 'revisi') return null;
  const s = m === 'naskah' ? (c.n || {}).sidik : m === 'storyboard' ? (H.storyboard(c.id) || {}).sidik : null;
  if (m === 'naskah') return c.f.some((x) => ['02-naskah.md', '01b-judul.md'].includes(x.path) && x.ubah > r.at) || ubahGaya(c.id) > r.at ? null : r;
  return m === 'hasil' ? (c.film && r.at >= c.film.ubah ? r : null) : r.sidik === s ? r : null;
}
function jalan(id) {
  const c = konteks(id), l = periksa(id), now = Date.now(), k = l.find((x) => x.status === 'sekarang');
  if (c.j.arsip) return 'DIHAPUS PENGGUNA: jangan dikerjakan.';
  const jejak = Array.isArray(c.j.jejak) ? c.j.jejak.slice(-60) : [], beres = new Set(l.filter((x) => x.status === 'beres').map((x) => x.id)), dulu = new Set(c.j.beres || []);
  for (const x of l) if (beres.has(x.id) && !dulu.has(x.id)) jejak.push({ at: now, oleh: x.oleh, isi: x.nama + ': beres' });
  for (const x of l) if (dulu.has(x.id) && !beres.has(x.id)) jejak.push({ at: now, oleh: x.oleh, isi: x.nama + ': diulang' });
  const u = { jejak, beres: [...beres], denyut: now, mulai: false };
  if (!k) { P.update('jobs', id, { ...u, status: 'selesai', stage: 'kemasan', activity: '', crew: null }); return 'SELESAI: semua langkah beres. Laporkan ke pengguna; jangan mengunggah.'; }
  const no = l.indexOf(k) + 1 + '/' + l.length;
  if (k.minta) {
    const r = revisi(c, k.minta);
    if (r) { P.update('jobs', id, { ...u, status: 'jalan', stage: k.tahap === 'setuju' ? 'naskah' : k.tahap, activity: 'Mengerjakan revisi Anda' }); return `REVISI ${no} ${k.nama}\nCatatan pengguna: ${r.catatan}\nCatat di jobs/PELAJARAN.md, perbaiki bagian itu saja, ulangi pemeriksaannya, lalu jalankan perintah ini lagi.`; }
    if (c.j.status !== 'menunggu' || c.j.stage !== k.tahap) P.add('chat', { from: 'bima', job: id, text: { naskah: 'Judul, narasi, dan gaya siap dibaca. Setujui atau minta revisi.', storyboard: 'Storyboard siap diputar. Setujui atau minta revisi.', hasil: 'Video siap ditonton. Setujui atau minta revisi.' }[k.minta] });
    P.update('jobs', id, { ...u, status: 'menunggu', stage: k.tahap, activity: '', crew: null, note: '' });
    return `BERHENTI ${no} ${k.nama}\nTombol setuju dan revisi sudah tampil di kantor. Beri tahu pengguna, lalu jalankan: node kantor/hasil.cjs jaga`;
  }
  P.update('jobs', id, { ...u, status: 'jalan', stage: k.tahap, activity: k.nama, note: '' });
  return `LANGKAH ${no} ${k.nama} (pelaksana: ${k.oleh})\nBuka skill: ${k.skill}\nTugas di jobs/${id}/: ${k.tugas}\nBelum lolos karena: ${k.kurang}\nSetelah selesai jalankan lagi: node kantor/langkah.cjs ${id}`;
}
module.exports = { periksa, jalan };
if (require.main === module) {
  const id = process.argv[2];
  try {
    if (id) console.log(jalan(id));
    else {
      const a = Object.entries(P.read().jobs).filter(([, j]) => !j.arsip && (j.status === 'jalan' || j.status === 'menunggu' || j.status === 'antre' && j.mulai));
      console.log(a.length ? a.map(([i, j]) => `${i} [${j.status}] ${j.title || String(j.brief).slice(0, 50)}`).join('\n') + '\nJalankan: node kantor/langkah.cjs <id>' : 'Tidak ada pekerjaan aktif.');
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
