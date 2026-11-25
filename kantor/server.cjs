// Kantor PEDULI di localhost. Jalankan: node kantor/server.cjs
const http = require('http'), fs = require('fs'), path = require('path'), os = require('os');
const { spawn, spawnSync } = require('child_process');
const H = require('./hasil.cjs'), P = require('./papan.cjs'), PORT = +process.env.PORT || 4310;
const HOSTS = [`localhost:${PORT}`, `127.0.0.1:${PORT}`];
const hasClaude = () => spawnSync(process.platform === 'win32' ? 'where' : 'which', ['claude']).status === 0;

// pengganti window.claude untuk halaman lokal
function shim() {
  const subs = []; let D = null;
  const post = async (u, b) => { const r = await fetch(u, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }); const j = await r.json(); if (!r.ok) throw Error(j.error); return j; };
  const send = (s) => { let l = Object.entries(D[s.c]).map(([id, v]) => ({ id, data: () => v })); if (s.o) l.sort((a, b) => ((+a.data()[s.o] || 0) - (+b.data()[s.o] || 0)) * (s.d === 'desc' ? -1 : 1)); if (s.n) l = l.slice(0, s.n); s.f({ docs: l }); };
  const ev = new EventSource('/api/events');
  ev.onmessage = (e) => { D = JSON.parse(e.data); subs.forEach(send); };
  ev.onerror = () => { if (!D) subs.forEach((s) => s.x && s.x()); };
  const q = (c, o, d, n) => ({ orderBy: (a, b) => q(c, a, b, n), limit: (m) => q(c, o, d, m), onSnapshot: (f, x) => { const s = { c, o, d, n, f, x }; subs.push(s); if (D) send(s); }, add: (data) => post('/api/add', { c, data }) });
  const db = { collection: (c) => q(c), doc: (p) => { const [c, id] = p.split('/'); return { update: (data) => post('/api/update', { c, id, data }) }; } };
  const sample = async (prompt, o = {}) => {
    let p = prompt; const t = (o.tools || [])[0];
    if (t) p += `\nCara memanggil alat ${t.name}: tulis satu baris pertama persis seperti ALAT:{json} sesuai skema ${JSON.stringify(t.inputSchema)}, lalu balasanmu di baris berikutnya. Jangan tulis baris itu bila alat tidak diperlukan.`;
    let { text, auto } = await post('/api/reply', { prompt: p });
    const m = !auto && t && text.match(/^\s*ALAT:(\{.*\})[ \t]*\r?\n?/);
    if (m) { await t.execute(JSON.parse(m[1])); text = text.slice(m[0].length).trim() || 'Briefnya sudah masuk antrean.'; }
    return { text };
  };
  sample.limits = async () => ({ tools: true });
  window.claude = { use: async (n) => ({ db, sample })[n] || null };
}
function page() {
  const h = fs.readFileSync(path.join(__dirname, 'kantor-peduli.html'), 'utf8');
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}</style></head><body><script>(${shim})()</script>${h}</body></html>`;
}
let running = false;
function ask(prompt) {
  return new Promise((ok, no) => {
    const c = spawn('claude -p --tools "" --model haiku', { shell: true, cwd: os.tmpdir(), windowsHide: true });
    let o = '', e = '';
    const t = setTimeout(() => { if (process.platform === 'win32') spawn('taskkill', ['/PID', String(c.pid), '/T', '/F'], { windowsHide: true }); else c.kill(); no(Error('Balasan terlalu lama')); }, 90000);
    c.stdout.on('data', (b) => (o += b)); c.stderr.on('data', (b) => (e += b)); c.on('error', no); c.stdin.on('error', () => {});
    c.on('close', (k) => { clearTimeout(t); k === 0 && o.trim() ? ok(o.trim()) : no(Error(e.trim().slice(0, 200) || 'Claude gagal menjawab')); });
    c.stdin.end(prompt);
  });
}
const clients = new Set(), msg = () => `data: ${JSON.stringify(P.read())}\n\n`;
let last = 0;
setInterval(() => { try { const m = fs.existsSync(P.F) ? fs.statSync(P.F).mtimeMs : 0; if (m !== last) { const x = msg(); last = m; clients.forEach((r) => r.write(x)); } } catch {} }, 400);
setInterval(() => clients.forEach((r) => r.write(': ping\n\n')), 20000);

http.createServer(async (q, r) => {
  const json = (s, o) => { r.writeHead(s, { 'content-type': 'application/json' }); r.end(JSON.stringify(o)); };
  if (!HOSTS.includes(q.headers.host)) return json(403, { error: 'host ditolak' });
  try {
    if (q.method === 'GET' && q.url === '/') { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); return r.end(page()); }
    if (q.method === 'GET' && q.url === '/api/events') { r.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-store' }); r.write(msg()); clients.add(r); q.on('close', () => clients.delete(r)); return; }
    if (q.method === 'GET' && q.url === '/api/siaga') return json(200, { aktif: H.siaga() });
    if (q.method === 'GET' && /^\/gaya\/[a-z0-9-]+\.jpg$/.test(q.url)) { const f = path.join(__dirname, q.url); if (!fs.existsSync(f)) return json(404, {}); r.writeHead(200, { 'content-type': 'image/jpeg' }); return r.end(fs.readFileSync(f)); }
    if (q.method === 'GET' && q.url === '/api/hasil') return json(200, H.semua());
    if (q.method === 'GET' && q.url.startsWith('/api/hasil/')) return json(200, H.satu(q.url.slice(11)));
    if ((q.method === 'GET' || q.method === 'HEAD') && q.url.startsWith('/berkas/')) return H.kirim(q, r);
    if (q.method !== 'POST') return json(404, { error: 'tidak ada' });
    if (!HOSTS.map((h) => 'http://' + h).includes(q.headers.origin) || !/^application\/json/.test(q.headers['content-type'] || '')) return json(403, { error: 'asal ditolak' });
    q.setEncoding('utf8');
    let b = ''; for await (const c of q) { b += c; if (b.length > 2e5) return json(413, { error: 'terlalu besar' }); }
    const d = JSON.parse(b);
    if (q.url === '/api/add') return json(200, { id: P.add(d.c, d.data) });
    if (q.url === '/api/update') { P.update(d.c, d.id, d.data); return json(200, { ok: true }); }
    if (q.url === '/api/reply') {
      const p = String(d.prompt);
      if (!hasClaude()) return json(200, { text: '', auto: true });
      if (running) return json(429, { error: 'sedang menjawab' });
      running = true;
      try { return json(200, { text: await ask(p) }); } catch (e) { console.error('Balasan gagal:', e.message); return json(200, { text: '', auto: true }); } finally { running = false; }
    }
    json(404, { error: 'tidak ada' });
  } catch (e) { if (!r.headersSent) json(400, { error: e.message }); else r.end(); }
}).on('error', (e) => { console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} sudah dipakai. Mungkin kantornya sudah terbuka.` : e.message); process.exit(1); })
  .listen(PORT, '127.0.0.1', () => console.log(`Kantor PEDULI: http://localhost:${PORT}`));
