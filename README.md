# PEDULI Studio

Tim video AI untuk Claude Code: satu ketua (Ivo), delapan agent, skill berbahasa Indonesia, kantor 3D di localhost, suara, musik, dan templat video 3D.

> Status: masih dilatih. Judul, narasi, dan gerak perlu penilaian manusia sebelum tayang.

## Isi
| Bagian | Lokasi |
|---|---|
| 8 agent (Dito, Agung, Ricky, Mandala, Ilham, Uly, Deniza, Gina) | .claude/agents |
| 15 skill buatan sendiri | .claude/skills |
| Kantor 3D, papan progres, chat | kantor |
| Tokoh 3D chibi pahat | pustaka/chibi3d |
| Templat Remotion siap render | templat-video |
| Suara Gemini TTS dan Edge TTS, alat ukur | .claude/skills/audio-video/scripts |
| Contoh suara, musik, 10 efek | contoh |
| Latihan judul dan narasi, pelajaran | latihan, jobs/PELAJARAN.md |

## Pasang
Perlu: Node 20+, Python 3.11+, Git, ffmpeg, dan Claude Code dengan akun Anda.

Windows:
```powershell
powershell -ExecutionPolicy Bypass -File pasang.ps1
```
macOS/Linux:
```sh
sh pasang.sh
```
Skrip ini mengunduh paket npm/pip, skill dari anthropics/skills dan obra/superpowers, dan panduan Lemo-Opuscar dari sumber aslinya. Baca isinya sebelum menjalankan. Ingin semua skill referensi (puluhan)? Pakai `-Lengkap` (Windows) atau `lengkap` (sh). Daftar dan cara manual: [SKILL-PIHAK-KETIGA.md](SKILL-PIHAK-KETIGA.md).

## Pakai
1. Buka kantor: klik dua kali `Buka-Kantor.cmd` (Windows) atau `node kantor/server.cjs`, lalu http://localhost:4310.
2. Tekan "Buat video baru" dan isi brief.
3. Buka folder ini di Claude Code, ketik: `kerjakan antrean kantor PEDULI`.

Chat kantor dibalas AI bila perintah `claude` tersedia dan sudah masuk; bila tidak, balasannya otomatis. Kantor memuat three.js dan font dari internet.

## Suara
Gemini TTS (mendukung bahasa Indonesia dan tanda seperti [chuckles]): buat kunci di https://aistudio.google.com/apikey, simpan satu baris di berkas `.kunci-gemini.txt` dalam folder home Anda, atau variabel GEMINI_API_KEY. Jangan taruh kunci di folder ini.
```sh
node .claude/skills/audio-video/scripts/suara-gemini.cjs latihan/celengan2.json coba.wav Sulafat
```
Tingkat gratis dibatasi per hari dan teksnya dapat dipakai Google memperbaiki produk. Bila kuota habis, coba `GEMINI_TTS_MODEL=gemini-3.8-flash-lite-tts`. Cadangan: `suara-edge.py`. Contoh di folder contoh/suara dibuat dengan AI.

## Uji video
```sh
cd templat-video
npm run uji
npm run render
```

## Lisensi pihak ketiga
Tidak disertakan; mengikuti sumbernya: Remotion (perusahaan tertentu memerlukan lisensi), three.js (MIT), Lemo-Opuscar (panduan CC BY-NC 4.0, kode MIT), anthropics/skills, obra/superpowers, font Google. Kode repo ini belum diberi lisensi oleh pemiliknya.

## Tidak disertakan
Kunci API, data papan, naskah dan video produksi, rekaman atau klon suara orang, logo, dan bahan Kementerian HAM.
