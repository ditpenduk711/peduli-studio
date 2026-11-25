// Gabungkan halaman kantor. Jalankan: node kantor/src/build.cjs
const fs = require('fs'), r = (f) => fs.readFileSync(__dirname + '/' + f, 'utf8');
const h = r('page.html') + '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script>\n' + ['gaya.js', 'ui.js', 'hasil.js', 'scene-a.js', 'rapat.js', 'scene-b.js', 'scene-d.js', 'scene-c.js', 'data.js'].map(r).join('\n');
fs.writeFileSync(__dirname + '/../kantor-peduli.html', h); console.log('ok', h.length);
