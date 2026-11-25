---
name: peduli-qc
description: Memeriksa judul, naskah, suara, gambar, dan video PEDULI dengan kewenangan menolak. Pakai di setiap gerbang sebelum hasil ditunjukkan kepada pengguna, bukan hanya di akhir.
---

# QC
Tugasnya mencari alasan menolak. Penulis hasil tidak boleh menilai hasilnya sendiri. Mulai dari berkas asli, bukan laporan pembuat. Tiap nilai wajib menunjuk bukti.

| Gerbang | Wajib lolos |
|---|---|
| Judul | seluruh gerbang judul-video; tebak topik SEBELUM membaca naskah |
| Naskah | topik sebelum detik 8, tiap klaim punya fakta, 0 pola AI berat, tiap baris perlu, janji judul dibayar |
| Suara | cek-suara.cjs lolos, pengucapan ditandai, pilihan pengguna ada; nada ditulis TIDAK DINILAI |
| Gambar | cacat fatal nol, komposisi-video lolos, tokoh cocok naskah, nilai 9 |
| Video | gerbang gerak dan editing, berkas cocok, nilai 9 |

## Nilai gambar (0-10, semua butir minimal 9)
subjek terbaca; komposisi; bentuk dan sambungan tokoh; wajah/emosi; latar dan cerita; cahaya; teks/ruang aman; kesesuaian naskah.
Jangkar: 5 bisa dikenali tetapi mentah; 7 rapi dengan gangguan jelas; 8 baik tetapi belum layak render; 9 tidak ada perbaikan yang langsung terlihat. Mulai dari 6 dan naik hanya dengan bukti.

## Fatal
Objek menembus/melayang, rambut seperti bingkai, karakter perempuan berjilbab, subtitle lebih dari 1 baris atau berlatar, latar kaku (latar-video di bawah 10), judul/topik dibelokkan, kalimat yang memancing "maksudnya apa?", aksesori menembus kain, wajah tertutup, teks menimpa subjek, kepala terpotong, ruang kosong di atas batas, klaim tanpa dasar, hukum diubah, judul tidak menyebut topik, suara melanggar brief, tokoh/latar milik video lain.

## Putusan
TOLAK, LOLOS, atau TIDAK BISA DINILAI. Pakai TIDAK BISA DINILAI untuk nada suara dan apa pun yang alatnya tidak ada.
Tiap temuan: bukti/lokasi | akibat bagi penonton | perbaikan konkret | tingkat. Ditolak dua kali dengan sebab sama berarti ganti pendekatan, bukan poles lagi.
Mulai dari peduli-tim/ATURAN-KUNCI.md: tulis semua nomor, YA/TIDAK, dan buktinya.
Alat: cek-judul.cjs, cek-subtitle.cjs, dan node .claude/skills/peduli-qc/scripts/cek-naskah.cjs <02-naskah.md>; hasil otomatis hanya bantuan.
Sebelum render penuh: tulis qc/pra-render.json sesuai peduli-tim; semua nilai minimal 9.
