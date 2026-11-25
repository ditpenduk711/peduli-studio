---
name: gaya-3d-pahat
description: Membuat tokoh 3D chibi yang dipahat halus (SDF), berakting, dengan latar detail dan cahaya lembut di Remotion dan three.js. Pakai untuk gaya 3D yang bagus, tokoh chibi halus, atau tokoh berwajah ekspresif.
---

# 3D chibi pahat
Mesin: pustaka/chibi3d (pahat.ts membuat mesh halus dari SDF; tokoh.ts berisi makeChar, makeCat, clay, gloss, tex). Salin ke video/src tiap job. Contoh siap render: templat-video.

## Tokoh
makeChar({skin, hair, top, bottom, head: kuncir|peci|sanggul, skirt, ...}) lalu setArm(0|1, [x,y,z]) (target tangan, IK) dan face({mouth, lx, ly, blink, brow, tilt}).
- Tiap video tokoh baru: ubah siluet penutup kepala, pakaian, warna, skala. Tambah penutup kepala baru lewat SDF; tiap bentuk baru dilihat dari depan, tiga perempat, samping.
- Tanpa jilbab (ATURAN-KUNCI). Alis tokoh berpenutup kepala diturunkan. Rambut punya poni dan ikatan yang terlihat dari depan.
- Tangan memegang TEPI benda; benda ditaruh lewat torso.localToWorld.

## Cahaya dan akhir
Satu matahari hangat berbayang lembut (VSM), dua cahaya tepi (biru dan oranye), hemisfer, lingkungan 0,3, ACES, GTAO, MSAA 4. Malam: matahari biru redup dan satu lampu hangat.

## Adegan 9:16
Kamera fov 27, jarak 12-14 untuk tiga tokoh, 8-10 untuk satu. Tokoh di belakang dinaikkan di bangku supaya wajah terlihat. Tidak ada susunan diam lebih dari 3,5 detik: ganti bidikan, aksi, atau reaksi.
Semua gerak fungsi dari t. Render --gl=angle --concurrency=1 --timeout=240000. Uji 40 frame sebelum memperkirakan waktu.

## Lolos bila
Gambar tiap adegan dilihat; tidak ada tembus, wajah tertutup, atau tokoh terpotong; emosi terbaca pada 200 px; subtitle 1 baris tanpa latar; latar-video lolos.

Wajib: peduli-tim/ATURAN-KUNCI.md dan latar-video.
