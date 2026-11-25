---
name: gaya-stickman
description: Membuat video 2D stickman yang ekspresif dan ringan dengan Remotion. Pakai untuk komedi pendek, edukasi singkat, perbandingan, dan cerita sehari-hari.
---

# Stickman PEDULI
Pakai assets/Stickman.tsx (React SVG, hanya butuh remotion). Ciri: garis tebal, kepala krem, syal berwarna. Rancangan sendiri; jangan meniru tokoh kreator lain.
Pose: diam, jelas, tunjuk, kaget, pikir, lemas, girang. mood: biasa, senang, kaget, datar, sedih. Prop: walk, talking, flip, accent.

## Membuatnya hidup
- Ganti pose tiap 0,8-1,5 detik mengikuti kata kunci, bukan tiap kalimat.
- Antisipasi 3-4 frame, pose, lalu tahan. Tahan 10-15 frame setelah bagian lucu.
- Reaksi lebih lucu daripada aksi: potong ke tokoh lain yang diam datar.
- Syal beda warna tiap orang dan tetap sepanjang video.

## Panggung
- Satu warna latar, satu bidang lantai, 2-4 benda bergaris setebal tokoh.
- Tokoh 45-65% tinggi layar. Pada 9:16 sisakan 15% atas dan 25% bawah dari teks.
- Teks besar maksimal 5 kata. Data selalu dengan sumber kecil di layar.

## Contoh struktur untuk 30 detik (sesuaikan dengan durasi job)
0-2 masalah terlihat; 2-8 salah paham; 8-20 penjelasan dengan 2-3 gambaran; 20-27 balikan lucu; 27-30 satu ajakan.
Pose baru ditambah lewat POSES; render lembar pose sebelum dipakai.

## Tokoh dan latar mengikuti naskah
- Pakai ulang tekniknya saja (rangka, cahaya, material, cara bergerak). Jangan memakai tokoh atau ruangan dari kantor PEDULI atau video lain, kecuali brief memintanya atau videonya satu serial.
- Dari naskah, susun dulu daftar: tokoh (usia, peran, daerah, pakaian, sifat, emosi tiap adegan), tempat dan waktu, properti yang disebut, dan tindakan. Setiap butir harus punya baris naskah asalnya.
- Buat tokoh, latar, dan properti baru dari daftar itu. Pakaian dan bangunan daerah diperiksa ke sumber, bukan ditebak.
- Gambar contoh untuk persetujuan: tiap tokoh utama dari depan, samping, dan dekat, ditambah satu gambar tiap latar.
- QC mencocokkan setiap adegan dengan daftar itu.

## Kualitas stickman
- Garis berisi tekanan: 12-20 px pada 1080, tebal di badan, menipis di ujung; siku/lutut melengkung searah gerak.
- Tokoh dibedakan oleh bentuk kepala, rambut/penutup, postur, dan satu benda bermakna, bukan warna saja.
- Tiap pose memiliki garis gerak C atau S dan siluet tangan di luar badan. Pose kanan-kiri seperti cermin ditolak.
- Wajah minimal 8: biasa, senang, lega, kaget, bingung, takut, sedih, curiga. Mata dan alis terbaca pada 200 px.
- Latar sederhana bukan kosong: 3 lapis nilai warna, tekstur halus, dan 2 benda yang membantu cerita. Tebal garis latar 40-60% garis tokoh.
- Jumlah orang dalam data harus dihitung tepat dan diuji di kode; warna kelompok diberi label.
Terapkan komposisi-video dan gerak-video. Render lembar ekspresi serta 9 frame gerak sebelum adegan.
