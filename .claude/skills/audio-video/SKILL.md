---
name: audio-video
description: Memilih, mengarahkan, membuat, dan mengukur suara narator yang berirama dan berekspresi seperti manusia, termasuk tawa, napas, ragu, dan bisik. Pakai untuk setiap contoh suara, rekaman, atau mixing.
---

# Suara
Suara AI terdengar AI karena semua frasa punya tempo, kenyaringan, dan niat yang sama. Memberi filter tidak memperbaiki akting. Claude tidak bisa mendengar; pengguna yang memutuskan.

## Mesin menurut kebutuhan
| Kebutuhan | Pakai | Batas |
|---|---|---|
| Paling manusia | rekaman orang | perlu orangnya |
| Tawa, bisik, ragu, emosi Indonesia | mesin yang mendukung tanda: Gemini TTS atau ElevenLabs v3 | teks keluar ke layanan; akun/kunci milik pengguna; cek biaya dan izin komersial; jangan membaca atau menyalin kunci |
| Cadangan gratis | suara-edge.py, frasa per frasa | TIDAK membaca [laughs]; jangan palsukan tawa dengan teks "haha"; tidak boleh disebut seperti manusia |
Dukungan dan nama model diperiksa ulang ke dokumen resmi sebelum dipakai.

## Partitur suara (buat sebelum suara apa pun)
Tiap FRASA (bukan paragraf): niat | tenaga 1-5 | tempo | kata jatuh | gerak nada naik/turun/datar | jeda | tanda.
Tenaga berdekatan harus berubah; minimal 4 dari 5 tingkat dipakai dalam semenit. Puncak hanya satu. Bisik atau pelan ditempatkan sebelum kejutan. Tempo: santai -8..-3%, normal, antusias +4..+10%. Nada -6..+8 Hz; ikut niat, bukan acak.
- Jeda berpikir 0,35-0,7; menyela 0,05-0,12; menunggu reaksi gambar 0,6-1,0; daftar dipercepat. Jeda yang semuanya sama ditolak.
- Napas hanya setelah kalimat panjang atau sebelum pengakuan, paling banyak 1 per 8 detik.
- Tanda [laughs] menyatu dengan ucapan dari mesin yang mendukung. Jangan menempel rekaman tawa orang lain.

## Arahan ke mesin ekspresif
Tulis adegan, bukan sifat. Buruk: "suara natural, hangat, profesional". Baik: "Perempuan 28 tahun di warung, mencondong ke teman yang baru salah paham. Menahan tawa, lalu pelan karena bagian berikutnya penting. Logat Indonesia netral, tidak membaca."
Buat 3 pengambilan yang niatnya berbeda (menggoda, penasaran, peduli), pilih per paragraf. Simpan arahan dan benih bila ada.

## Tes
1. cek-suara.cjs untuk ukuran; arti "LOLOS" hanya teknis.
2. Dari penanda frasa: simpangan baku jeda minimal 0,12; tempo frasa tercepat dibanding terlambat minimal 1,25 kali. Di bawah itu hampir pasti datar; di atas itu belum tentu bagus.
3. Kirim buta: berkas 1/2/3 tanpa nama mesin, teks sama, kenyaringan sama. Tanyakan satu hal: mana yang terdengar paling seperti orang?
4. Catat jawaban pengguna di jobs/PELAJARAN.md. Suara yang sudah ditolak tidak dikirim lagi dengan ganti filter.

## Ukuran akhir
-17..-15 LUFS, puncak <= -1 dBTP, 1,65-2,8 kata/detik. Musik 14-20 dB di bawah bicara dan berlisensi. Izin klon dari pemilik untuk video itu.

## Gemini TTS (dipilih pengguna, dokumen dibaca 24 Nov 2026)
- Alat: node .claude/skills/audio-video/scripts/suara-gemini.cjs segmen.json keluar.wav <Suara>. Contoh: latihan/celengan2.json. Uji bentuk tanpa biaya: tambah --cek.
- Dokumen: teks dibaca apa adanya; arahan berkelanjutan di style (PENDEK, sama untuk baris berurutan); tanda sesaat <chuckle> <laugh> <sigh> <breath> <whispers> <gasp> <short pause> berbahasa Inggris. Alat mengubah [chuckles] menjadi <chuckle>. Arahan panjang membuat suara melenceng.
- Uji polos dulu (style kosong), lalu tambah style. KAPITAL menekan kata; elipsis untuk ragu.
- Terlalu banyak potongan membuat warna suara berubah; gabungkan frasa satu niat. Bandingkan Sulafat (Warm), Achird (Friendly), Zubenelgenubi (Casual), Callirrhoe (Easy-going).
- Teks tingkat gratis dipakai Google memperbaiki produk: jangan kirim data pribadi atau naskah rahasia. Harga dan kuota dicek ulang. Jangan membaca atau mencetak kunci.

## Pilihan pengguna (tes buta 24 Nov 2026)
Sulafat dan Zubenelgenubi DITERIMA, Achird tidak disebut. Bawaan: Sulafat untuk cerita hangat, Zubenelgenubi untuk santai/lucu. Style "amused, relaxed storytelling", tiga potongan panjang, tempo 1,7-1,75 kata/detik diterima; jangan dipercepat demi angka. Durasi naskah dihitung 1,75 kata/detik.

Musik dan efek bebas pakai contoh ada di contoh/musik (buat_audio.py membuatnya dari nol).

## Memilih suara (field suara pada job; pilihan pengguna menang)
| Bentuk | Aturan |
|---|---|
| Narator di luar cerita ("dia", menjelaskan) | boleh perempuan atau laki-laki, apa pun tokohnya; mulut tokoh TIDAK bergerak mengikuti narator |
| Tokoh bercerita ("saya/aku") | suara harus cocok dengan jenis kelamin, umur, dan sifat tokoh itu |
| Dialog | tiap tokoh suara sendiri yang cocok; narator berbeda jelas dari semua tokoh |
| Kutipan pendek dalam narasi | narator boleh menyampaikan dengan "katanya"; kalau tokohnya terlihat bicara, pakai suara tokoh |
- Satu narator sepanjang video, sama di seluruh seri. perempuan = Sulafat, laki-laki = Zubenelgenubi (disetujui pengguna); suara lain diminta dinilai dulu.
- suara "tim": pilih menurut isi (hangat/cerita = Sulafat, santai/lucu = Zubenelgenubi). Bila hanya ada satu tokoh utama yang tampil hampir sepanjang video, utamakan suara yang selaras dengannya supaya tidak disangka tokoh itu bicara.
- Tokoh anak: jangan memakai suara dewasa yang dipaksa kecil; pakai narator.

## Musik (field musik pada job)
- Mandala membuat 2 pilihan BEDA rasa, bernama audio/musik-a.mp3 dan musik-b.mp3, tersedia saat storyboard supaya pengguna mendengar dan memilih; juga campuran 20 detik bersama voice over.
- Peta musik ikut naskah: pembuka, penjelasan, titik balik, penutup. Minimal satu perubahan berarti (alat bertambah/berkurang, kunci, atau hening) tepat di titik balik; putaran yang sama terus ditolak. Tempo mengikuti ucapan.
- Tanpa lirik. Turun otomatis saat bicara, 14-20 dB di bawah suara; naik di jeda. Awal dan akhir dibentuk, bukan terpotong.
- Sumber: lagu berlisensi yang boleh dipakai pada media sosial (simpan tautan, pembuat, lisensi di audio/LISENSI.md), atau buatan sendiri dengan sampel alat musik asli berlisensi. Bunyi sintetis gelombang polos hanya untuk contoh, tidak untuk final.
- Duka, korban, sejarah: tidak memakai musik ceria. Musik daerah dipakai hanya bila sesuai tempatnya dan bersumber.
- Rasa musik TIDAK DINILAI oleh AI; pengguna yang memutuskan.

## Dialog banyak tokoh
Sebelum merekam, tulis audio/pemeran.json: [{"tokoh":"Narator","suara":"Sulafat","umur":"...","sifat":"...","disetujui":true}, ...]. Segmen memakai field "v" (suara) dan "tokoh"; alat menolak bila satu tokoh memakai dua suara.
- Tokoh yang jenis kelaminnya sama harus beda jelas: warna, umur, tempo. Uji: tutup mata, siapa bicara? Tidak boleh dua tokoh memakai suara yang sama.
- Baru Sulafat dan Zubenelgenubi yang disetujui. Suara lain dipilih dari daftar resmi Gemini, dibuat contoh 5 detik dari kalimat aslinya, disimpan sebagai contoh-suara/<tokoh>.wav, dan disetujui pengguna di kantor sebelum dialog penuh.
- Idealnya narator + 2-3 tokoh. Empat tokoh boleh bila masing-masing punya peran; yang hanya satu kalimat disampaikan narator.
- Panggilan: tiap segmen satu permintaan. Hitung dulu terhadap kuota akun; gabungkan kalimat berurutan tokoh yang sama. Kuota kurang = berhenti dan beri tahu, jangan diam-diam mengganti mesin atau suara.
