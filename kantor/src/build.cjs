// Gabungkan halaman kantor + adegan 3D. Jalankan: node kantor/src/build.cjs
const fs = require('fs'), d = __dirname + '/', out = d + '../kantor-peduli.html';
let h = fs.readFileSync(out, 'utf8');
const js = ['a', 'b', 'c'].map((x) => fs.readFileSync(`${d}scene-${x}.js`, 'utf8')).join('\n');
const a = h.indexOf('// ---------- kantor');
h = h.slice(0, a) + js + '\n' + fs.readFileSync(d + 'data.js', 'utf8');
if (!h.includes('three.min.js')) {
  h = h.replace('<script>\nconst A=', '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\nconst A=');
  h = h.replace(/<div class="scene">.*<\/div>/, '<div class="scene" id="scene"><div class="tools"><button id="zi" aria-label="Perbesar">+</button><button id="zo" aria-label="Perkecil">−</button><button id="ct">Tengah</button><button id="nt">Malam</button></div></div>');
  h = h.replace(/canvas\{[^}]*\}/, '.scene{height:clamp(420px,72vh,760px)}canvas{display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab}.tools{position:absolute;right:12px;bottom:12px;display:flex;gap:6px}.tools button{min-width:42px;padding:8px 12px}');
  h = h.replace('main{max-width:1180px', 'main{max-width:1440px');
  h = h.replace(/<p class="soft">Klik lantai.*<\/p>/, '<p class="soft">Geser untuk memutar, klik lantai atau tombol panah untuk berjalan. Klik pegawai atau papan di dinding untuk membukanya.</p>');
  h = h.replace('stat();if(view', 'stat();try{drawBoard()}catch(e){}if(view');
}
fs.writeFileSync(out, h);
console.log('ok', h.length);
