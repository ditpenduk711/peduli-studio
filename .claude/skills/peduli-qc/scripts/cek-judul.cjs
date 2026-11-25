// node cek-judul.cjs "Judul" ["Topik wajib"]
const j = process.argv[2] || '', topik = process.argv[3], bad = [], n = (j.match(/[\p{L}\p{N}-]+/gu) || []).length;
if (n < 3 || n > 7) bad.push(n + ' kata (harus 3-7)');
if (j.length > 50) bad.push(j.length + ' karakter (maks 50)');
if (/\b(pentingnya|mengenal|upaya|ternyata|wajib tahu|dalam rangka|tidak otomatis)\b/i.test(j)) bad.push('kata terlarang');
if (/[,;]/.test(j)) bad.push('koma: judul terpotong');
if (/\batau\b/i.test(j)) bad.push(/\bHari [A-Z]/.test(j) ? 'hari peringatan tidak boleh "A atau B"' : '"A atau B": buktikan semua gerbang di judul-video');
if (topik && !j.toLowerCase().includes(topik.toLowerCase())) bad.push('topik "' + topik + '" tidak tertulis');
console.log(bad.length ? 'PERIKSA\n- ' + bad.join('\n- ') : 'Lolos mesin (belum berarti bagus)');
process.exit(bad.length ? 1 : 0);
