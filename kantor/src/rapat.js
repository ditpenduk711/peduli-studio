// ---------- kegiatan bersama: rapat, ngopi, senam ----------
// Obrolan ringan di sini hiasan (hanya memakai data papan). Pembahasan sungguhan ditulis sesi Claude ke chat.
const MT=[-3.2,1.6];let act=null;
const PANTRI=[[9.7,4.2],[9.7,5.6],[9.7,7],[8.2,4.4],[8.2,7.2],[6.9,5],[6.7,7.4],[5.2,5.6],[5.4,7.5]];
const NGOBROL={
 rapat:[["bima","Yuk, kita mulai. Siapa duluan?"],["riset","Saya mulai dari sumbernya dulu, ya."],["naskah","Kalimatnya harus langsung dimengerti."],["qc","Kalau masih bikin orang tanya maksudnya apa, saya tolak."],["visual","Latarnya jangan kaku lagi."],["animasi","Nanti tokohnya saya buat lebih luwes."],["audio","Suaranya santai saja, jangan terburu-buru."],["editing","Subtitle satu baris, tanpa kotak."],["kemasan","Judulnya jangan dipaksa pakai A atau B."],["bima","Setuju. Ada yang mau ditambah?"],["naskah","Saya mau contoh narasi yang disukai."],["qc","Nilai QC saya perlu dicocokkan juga."]],
 ngopi:[["editing","Siapa yang bikin kopi? Wangi banget."],["audio","Saya. Mau satu?"],["visual","Boleh, gulanya sedikit."],["naskah","Saya teh saja."],["animasi","Pisang gorengnya masih ada?"],["kemasan","Tinggal dua. Cepat!"],["riset","Satu buat saya, ya."],["qc","Kopinya lolos. Sembilan dari sepuluh."],["bima","Habis ini balik ke meja, ya."]],
 senam:[["bima","Tangan ke atas! Satu, dua!"],["editing","Punggung saya butuh ini."],["animasi","Nah, gerak begini baru luwes."],["qc","Yang di belakang, kurang tinggi!"],["riset","Sumber pegal saya sudah ketemu."],["audio","Ikuti iramanya, ya."],["naskah","Satu kalimat: capek."]]};
function obrolanStatus(){const l=jobs.filter(j=>j.status!="selesai").slice(0,2);return l.map(j=>["bima",name(j)+(j.status=="menunggu"?" masih menunggu keputusan.":j.status=="antre"?" masih di antrean.":" sedang di tahap "+ST[si(j)][1].toLowerCase()+".")])}
function perintah(t){const s=t.toLowerCase();if(/\b(bubar|selesai rapat|rapat selesai|kembali kerja|balik kerja|balik ke meja|kembali ke meja)\b/.test(s))return{k:"bubar"};
 if(/\?\s*$/.test(s)&&!/(ayo|yuk|tolong|bisa)/.test(s))return null;
 const k=/\b(rapat|meeting|kumpul|ngumpul|diskusi|briefing)\b/.test(s)?"rapat":/\b(ngopi|kopi|istirahat|makan siang|nongkrong|pantri)\b/.test(s)?"ngopi":/\b(senam|olahraga|peregangan|stretching|joget)\b/.test(s)?"senam":"";if(!k)return null;
 const siapa=A.filter(a=>new RegExp("\\b"+a.n.toLowerCase()+"\\b").test(s)),topik=(t.match(/\b(?:bahas|membahas|tentang|soal|mengenai)\s+(.{3,})/i)||[])[1]||"";return{k,ids:siapa.length>1?siapa.map(a=>a.id):A.map(a=>a.id),topik}}
function mulaiAct(c){if(c.k=="bubar"){bubar();return}
 bubar(true);const L=ppl.filter(o=>o!==me&&c.ids.includes(o.a.id)&&!(busy(o.a)&&c.k!="rapat"));act={k:c.k,topik:c.topik,L,i:0,t:performance.now()/1000+7,end:performance.now()/1000+(c.topik?600:150),sp:null};
 const sib=A.filter(a=>c.ids.includes(a.id)&&!L.some(o=>o.a===a));
 L.forEach((o,i)=>{o.meet=true;o.at=null;o.deliver=false;o.pop=null;let x,z,r,s=false;
  if(c.k=="rapat"){const q=i/L.length*Math.PI*2+.35;x=MT[0]+Math.sin(q)*2.05;z=MT[1]+Math.cos(q)*2.05;r=q+Math.PI;s=true}
  else if(c.k=="ngopi"){[x,z]=PANTRI[i];r=Math.atan2(8-x,5.9-z)}
  else{x=-1.5+(i%3)*2;z=-3.6+Math.floor(i/3)*1.5;if(i>=6){x=-2+(i-6)*2.2;z=5.6}r=0}
  const tiba=()=>{o.g.position.set(x,0,z);o.g.rotation.y=r;o.sit=s};if(still){o.path=[];tiba()}else setTimeout(()=>{if(act&&o.meet)go(o,x,z,tiba,r)},i*260)});
 if(c.k=="rapat")kursiRapat(L.length);
 if(window.tgT&&c.k)tgT.set(MT[0],.5,MT[1]);tombolAct();return sib}
let kursiG=null;
function kursiRapat(n){if(kursiG){sc.remove(kursiG);kursiG=null}if(!n)return;kursiG=GR(sc,MT[0],0,MT[1]);for(let i=0;i<n;i++){const q=i/n*Math.PI*2+.35,s=GR(kursiG,Math.sin(q)*2.05,0,Math.cos(q)*2.05,q+Math.PI),c=["#f6b93b","#2c8f8c","#e8604c","#3b6fe0"][i%4];B(s,.62,.12,.6,c,0,.48,0,.05);B(s,.62,.55,.1,c,0,.82,-.3,.04);CY(s,.05,.2,.44,"#7a5132",0,.22,0)}if(rapatLama)rapatLama.visible=false}
let rapatLama=null;
function bubar(diam){if(!act)return;const L=act.L;act=null;L.forEach((o,i)=>{o.meet=false;o.pop=null;o.next=performance.now()/1000+20;if(still){const d=DP[o.a.id];o.path=[];o.g.position.set(d[0],0,d[1]);o.sit=true}else setTimeout(()=>{if(!o.meet)seat(o)},diam?0:i*200)});kursiRapat(0);if(rapatLama)rapatLama.visible=true;tombolAct()}
// satu orang bicara pada satu waktu
function stepAct(dt,t){if(!act)return;if(t>act.end&&!antreB.length){bubar();return}
 const datang=act.L.every(o=>!o.path.length);
 if(!antreB.length&&datang&&t>act.t){const d=act.k=="rapat"?[...obrolanStatus(),...NGOBROL.rapat]:NGOBROL[act.k],l=d.filter(x=>act.L.some(o=>o.a.id==x[0]));if(l.length&&!(act.topik&&act.k=="rapat")){const x=l[act.i++%l.length];bicara(x[0],x[1],3.6)}act.t=t+4.2}
 const sp=act.sp&&act.sp.pop&&performance.now()<act.sp.pop[1]?act.sp:null;
 for(const o of act.L){if(o.path.length)continue;if(sp&&act.k!="senam"){const r=sp===o?o.g.rotation.y+Math.sin(t)*.4:Math.atan2(sp.g.position.x-o.g.position.x,sp.g.position.z-o.g.position.z);let a=r-o.g.rotation.y;a=Math.atan2(Math.sin(a),Math.cos(a));o.hd.rotation.y=Math.max(-1.1,Math.min(1.1,a));o.hd.rotation.x=sp===o?Math.sin(t*7)*.05:Math.max(0,Math.sin(t*2.2+o.ph))*.12}
  if(sp===o){o.aR.rotation.x=-1.2+Math.sin(t*5)*.35;o.aL.rotation.x=-.7+Math.sin(t*4+1)*.2}
  else if(act.k=="ngopi"){o.aR.rotation.x=Math.sin(t*.5+o.ph)>.55?-2.0:-1.0}
  if(act.k=="senam"){const p=Math.sin(t*4.2);o.aL.rotation.x=o.aR.rotation.x=-1.5-p*1.35;o.b.position.y=Math.max(0,p)*.16;o.body.rotation.z=Math.sin(t*2.1)*.12}else o.body.rotation.z=0}}
function bicara(id,teks,dtk){const o=ppl.find(p=>p.a.id==id);if(!o)return;o.pop=[S(teks),performance.now()+dtk*1000];if(act)act.sp=o;else o.say=performance.now()/1000+1.2}
// beberapa pesan sekaligus tampil bergiliran
const antreB=[];let antreT=0;
setInterval(()=>{const n=performance.now();if(!antreB.length||n<antreT)return;const m=antreB.shift(),d=Math.max(3.2,Math.min(8,S(m.text).length/17));bicara(m.from,m.text,d);antreT=n+d*1000+350},200);
function tombolAct(){const b=$("#actStop");b.hidden=!act;b.textContent=act?({rapat:"Bubarkan rapat",ngopi:"Selesai ngopi",senam:"Selesai senam"})[act.k]:""}
$("#actStop").onclick=()=>bubar();
for(const b of document.querySelectorAll("[data-act]"))b.onclick=()=>{mulaiAct({k:b.dataset.act,ids:A.map(a=>a.id),topik:""})};
