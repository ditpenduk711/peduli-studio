---
name: editing-video
description: Menyunting tempo, potongan, transisi, subtitle, dan render akhir video Remotion. Pakai setelah audio dan adegan tersedia atau saat video terasa lambat dan membingungkan.
---

# Editing
Audio menjadi garis waktu. Potong karena ada informasi, reaksi, atau arah pandang baru.

- Detik pertama memperlihatkan masalah; tidak mulai dari hitam atau logo.
- Bidikan umumnya 1,2-3,5 detik. Yang emosional boleh ditahan bila wajah berubah.
- J-cut atau L-cut 4-10 frame untuk percakapan; potong saat bergerak untuk aksi; potong keras sebagai bawaan. Transisi hias maksimal satu jenis dan harus bermakna.
- Subtitle tepat 1 baris tanpa latar (ATURAN-KUNCI nomor 2), dipisah menurut makna, muncul dengan suaranya. Jangan membaca dua teks berbeda bersamaan; teks layar dan subtitle disatukan bila sama.
- Angka tampil saat disebut dan tinggal sampai selesai dibaca; sumber kecil tetap terbaca.

## Pemeriksaan
0. cek-subtitle.cjs lolos, lalu lihat subtitle terpanjang di gambar.
1. Tonton deret 1 gambar per detik tanpa suara: alurnya jelas?
2. Baca subtitle saja: materinya lengkap?
3. Cek frame sebelum/sesudah setiap potongan.
4. Ukur 60 frame sebelum memperkirakan render. Render satu proses.
5. ffprobe MP4 jadi: ukuran, fps, audio, durasi beda maksimal 1 frame dari rencana.
Catat hal yang tidak bisa dinilai, terutama pendengaran.
