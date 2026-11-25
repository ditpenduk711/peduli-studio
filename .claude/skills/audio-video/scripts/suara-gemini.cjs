// node suara-gemini.cjs segmen.json keluar.wav [Suara]
// segmen: [{"style":"teasing, quick","t":"Teks [chuckles] lanjut.","j":0.35}]  j = jeda sesudah (detik)
// Kunci: variabel lingkungan GEMINI_API_KEY milik pengguna. Tidak pernah ditampilkan atau disimpan.
const fs = require('fs'), { execFileSync } = require('child_process');
const [, , inp, out, voice = 'Sulafat'] = process.argv;
const MODEL = process.env.GEMINI_TTS_MODEL || 'gemini-3.8-flash-tts', SR = 24000;
const TAG = { laughs: 'laugh', laugh: 'laugh', chuckles: 'chuckle', chuckle: 'chuckle', sighs: 'sigh', sigh: 'sigh', whispers: 'whispers', gasps: 'gasp', gasp: 'gasp', breath: 'breath', giggle: 'giggle', pause: 'short pause', 'short pause': 'short pause', 'long pause': 'long pause', phew: 'phew', hesitates: 'short pause' };
const STYLE = ['warm', 'curious', 'surprised']; // sikap: masuk ke style, bukan tanda sesaat
function siapkan(s) {
  const st = [s.style || ''];
  const t = s.t.replace(/\[([a-z ]+)\]/gi, (_, n) => {
    n = n.toLowerCase();
    if (STYLE.includes(n)) { st.push(n); return ''; }
    if (!TAG[n]) throw Error('Tanda tidak dikenal: ' + n);
    return `<${TAG[n]}>`;
  }).replace(/\s+/g, ' ').trim();
  return { t, style: st.filter(Boolean).join(', ') };
}
function kunci() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  const kf = require('path').join(require('os').homedir(), '.kunci-gemini.txt');
  if (fs.existsSync(kf)) return fs.readFileSync(kf, 'utf8').replace(/^﻿/, '').trim();
  if (process.platform !== 'win32') return '';
  return execFileSync('powershell', ['-NoProfile', '-Command', "[Environment]::GetEnvironmentVariable('GEMINI_API_KEY','User')"], { encoding: 'utf8' }).trim();
}
function pcm(b) { // ambil isi 'data' dari WAV
  if (b.toString('latin1', 0, 4) !== 'RIFF') return b;
  for (let p = 12; p + 8 <= b.length;) { const n = b.readUInt32LE(p + 4); if (b.toString('latin1', p, p + 4) === 'data') return b.subarray(p + 8, Math.min(b.length, p + 8 + n)); p += 8 + n + (n % 2); }
  throw Error('WAV tanpa data');
}
async function buat(s, key) {
  const part = { text: s.t }; if (s.style) part.speech_metadata = { style: s.style };
  for (let k = 0; ; k++) {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, { method: 'POST', signal: AbortSignal.timeout(90000), headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ role: 'user', parts: [part] }], generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { voice } } } }) });
    if (r.ok) { const d = (await r.json()).candidates?.[0]?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data; if (!d) throw Error('Tidak ada audio dalam jawaban'); return pcm(Buffer.from(d, 'base64')); }
    const m = (await r.text()).split(key).join('***').slice(0, 300);
    if ((r.status !== 429 && r.status < 500) || k >= 3) throw Error(`HTTP ${r.status}: ${m}`);
    await new Promise((x) => setTimeout(x, 8000 * (k + 1)));
  }
}
(async () => {
  const seg = JSON.parse(fs.readFileSync(inp, 'utf8')).map((s) => ({ ...siapkan(s), j: s.j ?? 0.3 }));
  if (process.argv.includes('--cek')) { console.log(JSON.stringify(seg, null, 1)); return; }
  const key = kunci();
  if (!key) { console.error('GEMINI_API_KEY belum dipasang'); process.exitCode = 3; return; }
  const A = [], M = []; let n = 0;
  for (const s of seg) { const a = await buat(s, key), z = Buffer.alloc(Math.round(SR * s.j) * 2); M.push({ t: s.t, awal: +(n / 2 / SR).toFixed(3), lama: +(a.length / 2 / SR).toFixed(3) }); A.push(a, z); n += a.length + z.length; }
  const d = Buffer.concat(A), h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + d.length, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(d.length, 40);
  fs.writeFileSync(out, Buffer.concat([h, d])); fs.writeFileSync(out.replace(/\.wav$/, '.json'), JSON.stringify({ model: MODEL, voice, M }, null, 1));
  console.log('ok', (n / 2 / SR).toFixed(2), 'detik');
})().catch((e) => { console.error(e.message); process.exitCode = 1; });
