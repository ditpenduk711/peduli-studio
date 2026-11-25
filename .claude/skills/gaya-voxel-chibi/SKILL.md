---
name: gaya-voxel-chibi
description: Membuat video 3D voxel chibi dengan Remotion dan three.js. Pakai untuk tokoh kepala kotak, kota voxel, makhluk raksasa.
---

# Voxel chibi
Mesin: pustaka/chibi3d (tokoh halus) dan templat-video. Untuk gaya kotak, buat dari kotak bersudut membulat dengan teknik di bawah.

## Identitas
- Tinggi tokoh sekitar 2,4 unit, kepala sekitar 1 unit, wajah dari tekstur kanvas.
- Tiap tokoh punya siluet, satu warna utama, satu aksesori unik. Uji: masih dikenali saat dihitamkan.
- Ekspresi mengikuti emosi kalimat. Warga bervariasi rambut, baju, dan tinggi.

## Panggung
- Tiga lapis: depan, tokoh, latar. Tutup cakrawala dengan bangunan, pohon, atau bukit.
- Jalan berakhir sebelum bangunan penanda. Trotoar setinggi 0,35, jadi pejalan kaki y=0.35.
- Pisahkan lajur pejalan kaki dari benda jalan.

## Kamera (fov 31)
- Close-up: jarak 4,4-4,8, kamera y+1,9, target y+1,55. Lebar empat tokoh: jarak 12-13.
- Tidak ada tokoh di antara kamera dan target. Kamera sampai ke pembicara sebelum kalimat mulai.

## Cahaya
- Satu matahari, hemisfer, dan satu pengisi dari arah kamera. Malam tetap butuh pengisi wajah.
- Lampu titik berbayang: shadow-bias={-0.003} shadow-normalBias={0.05}.
- Emissive maksimum 2,5 dekat kamera; bloom ambang 0,9 kekuatan 0,55.

## Render
--gl=angle --timeout=300000. Untuk 720p pakai komposisi 1280x720, bukan --scale=0.6667 (lebar jadi ganjil).

## Tokoh dan latar mengikuti naskah
- Pakai ulang tekniknya saja (rangka, cahaya, material, cara bergerak). Jangan memakai tokoh atau ruangan dari kantor PEDULI atau video lain, kecuali brief memintanya atau videonya satu serial.
- Dari naskah, susun dulu daftar: tokoh (usia, peran, daerah, pakaian, sifat, emosi tiap adegan), tempat dan waktu, properti yang disebut, dan tindakan. Setiap butir harus punya baris naskah asalnya.
- Buat tokoh, latar, dan properti baru dari daftar itu. Pakaian dan bangunan daerah diperiksa ke sumber, bukan ditebak.
- Gambar contoh untuk persetujuan: tiap tokoh utama dari depan, samping, dan dekat, ditambah satu gambar tiap latar.
- QC mencocokkan setiap adegan dengan daftar itu.

## Bentuk yang lolos
- Kepala: sudut membulat jelas (radius 22-28% lebar), pipi lebih lebar dari dahi. Bukan kotak polos.
- Rambut: massa kulit kepala, poni bertumpuk, samping, dan belakang SALING menyambung; ujung meruncing. Papan persegi yang menggantung ditolak.
- Tanpa jilbab (ATURAN-KUNCI); ragamkan potongan rambut.
- Kacamata mengikuti muka dan gagang menuju telinga. Aksesori harus punya titik tempel.
- Tangan saling bertemu dengan benda yang dipegang; bayi ditopang di kepala dan badan.
- Tubuh punya garis gerak; dua tangan simetris terkepal sebagai pose bawaan ditolak.
- Render badan abu-abu polos dulu: siluet, proporsi, sambungan. Baru warna dan tekstur.
## Periksa tiap tokoh
Depan, tiga perempat, samping, belakang, dekat, dan 3 ekspresi. Cari celah, tembus, dan bagian melayang dari tiap sudut sebelum masuk adegan. Terapkan komposisi-video dan gerak-video.

Wajib: peduli-tim/ATURAN-KUNCI.md dan latar-video.
