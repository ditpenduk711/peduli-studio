const A=[
 ["bima","Ivo","Katim Video","Membagi tugas tim, menjaga urutan kerja, dan melapor kepada Anda.","peduli-tim","#17323a",600,235],
 ["riset","Dito","Periset","Mencari data, fakta, dan sumber resmi untuk isi video.","riset-video","#3b6fe0",170,235],
 ["naskah","Agung","Penulis Naskah","Menulis narasi dan dialog.","naskah-video, judul-video","#e2477f",350,235],
 ["visual","Ricky","Desainer Visual","Merancang gaya, tokoh, latar, warna, dan gambar contoh.","komposisi-video, voxel chibi, stickman, canvas-design","#8a5bd0",850,235],
 ["audio","Mandala","Penata Suara","Membuat suara narator, musik, dan efek suara.","audio-video, systematic-debugging","#0f9d8a",1030,235],
 ["animasi","Ilham","Animator","Menggerakkan tokoh, latar, dan kamera.","gerak-video, komposisi-video, voxel chibi, stickman","#e8604c",170,470],
 ["editing","Uly","Editor Video","Menyusun potongan, tempo, dan subtitle, lalu merender video.","editing-video, gerak-video, komposisi-video","#d99a12",390,470],
 ["qc","Deniza","Quality Control","Memeriksa mutu sebelum render dan mengembalikan yang belum bagus.","peduli-qc dan semua syarat lolos","#2d8a57",810,470],
 ["kemasan","Gina","Admin Konten","Mengusulkan judul di awal. Setelah video jadi, menyiapkan sampul, caption, dan hashtag supaya Anda tinggal mengunggah.","judul-video, kemasan-video, canvas-design","#6b7a90",1030,470]
].map(a=>({id:a[0],n:a[1],r:a[2],d:a[3],s:a[4],c:a[5],x:a[6],y:a[7]}));
const ST=[["riset","Riset"],["naskah","Judul dan narasi"],["setuju","Anda setujui narasi"],["visual","Gambar"],["audio","Voice over"],["storyboard","Anda setujui storyboard"],["animasi","Animasi"],["qc","QC sebelum render"],["editing","Render"],["kemasan","Siap unggah"]];
const COL=[["antre","Antre","#6b7a90"],["jalan","Dikerjakan","#0f7c80"],["menunggu","Menunggu Anda","#f6b93b"],["selesai","Selesai","#2d8a57"]];
const $=s=>document.querySelector(s),dlg=$("#dlg"),dC=$("#dC");
let jobs=[],db=null,view=null,focusA=null;
function el(t,p={},...k){const e=document.createElement(t);for(const i in p){if(i=="on")e.onclick=p[i];else if(i=="css")e.style.cssText=p[i];else if(i in e)e[i]=p[i];else e.setAttribute(i,p[i])}e.append(...k.filter(x=>x!=null&&x!==false));return e}
const S=v=>v==null?"":String(v),si=j=>Math.max(0,ST.findIndex(s=>s[0]==j.stage)),pct=j=>j.status=="selesai"?100:Math.round(si(j)/ST.length*100);
const busy=a=>jobs.find(j=>(j.status=="jalan"||j.status=="menunggu")&&j.crew&&j.crew[a.id])||jobs.find(j=>j.status=="jalan"&&(a.id=="bima"||j.stage==a.id&&!j.crew));
function open(fn,wide){focusA=null;dlg.classList.remove("side");dlg.classList.toggle("wide",!!wide);dC.scrollTop=0;view=fn;draw();if(!dlg.open)dlg.showModal()}
function draw(){if(!view)return;dC.replaceChildren(...view().filter(Boolean))}
dlg.addEventListener("close",()=>{view=null;focusA=null});
const head=t=>el("div",{className:"row",css:"justify-content:space-between"},el("h2",{id:"dT",textContent:t}),el("button",{textContent:"Tutup",on:()=>dlg.close()}));
function vBoard(){return[head("Papan progres"),!jobs.length&&el("p",{className:"soft",textContent:db?"Belum ada pekerjaan. Tekan “Buat video baru” untuk menambah yang pertama.":"Papan tidak dapat dibuka di tampilan ini. Buka halaman ini di claude.ai dengan akun Anda."}),
 el("div",{className:"cols"},...COL.map(c=>{const l=jobs.filter(j=>j.status==c[0]);return el("div",{className:"col",css:"--k:"+c[2]},el("h3",{},el("span",{textContent:c[1]}),el("span",{textContent:l.length})),...l.map(j=>el("div",{className:"card"},el("button",{className:"plain",on:()=>hasil(j.id)},el("b",{textContent:name(j)}),el("small",{className:"soft",textContent:ST[si(j)][1]+" · "+(styleName[j.style]||"Pilihan tim")}),el("span",{className:"bar"},el("i",{css:"width:"+pct(j)+"%"}))),j.status=="antre"&&el("button",{className:"tiny",textContent:j.mulai?"Menunggu giliran, batalkan":"Mulai",on:e=>save(e.currentTarget,()=>db.doc("jobs/"+j.id).update({mulai:!j.mulai}))}),el("button",{className:"tiny",textContent:"Hapus","aria-label":"Hapus "+name(j),on:()=>hapus([j])}))))})),
 el("div",{className:"row"},el("button",{className:"main",textContent:"Buat video baru",on:()=>open(vNew)}),jobs.some(j=>j.status=="antre")&&el("button",{textContent:"Kosongkan antrean",on:e=>{const l=jobs.filter(j=>j.status=="antre"),b=e.currentTarget;if(b.sure)return hapus(l);b.sure=1;b.textContent="Hapus "+l.length+" antrean? Klik lagi"}}))].filter(Boolean)}
function durT(s){s=+s||0;if(!s)return"durasi mengikuti naskah";const m=Math.floor(s/60),d=s%60;return[m&&m+" menit",d&&d+" detik"].filter(Boolean).join(" ")}
function name(j){const b=S(j.title)||S(j.brief).trim();return b.length>60?b.slice(0,57)+"…":b||"Tanpa brief"}
async function save(b,fn){b.disabled=true;const t=b.textContent;b.textContent="Menyimpan…";try{await fn()}catch(x){b.textContent="Gagal menyimpan, coba lagi";b.disabled=false;return false}b.textContent=t;return true}
let draf="";
function vNew(){const f=el("form"),g=(l,n)=>el("label",{},l,n);
 const b=el("textarea",{id:"f2",required:true,rows:6,maxLength:6000,placeholder:"Contoh: Jelaskan kenapa anak perlu akta kelahiran, untuk orang tua muda. Nadanya hangat, tutup dengan ajakan mengurus akta."});
 const sel=(id,o)=>el("select",{id},...o.map(x=>el("option",{value:x[0],textContent:x[1]})));
 const s=sel("f3",[["lain","Biarkan tim memilih"],...GAYA.map(g=>[g.id,g.k=="Buatan tim"?g.n:g.k+": "+g.n])]),vo=sel("f7",[["tim","Biarkan tim memilih"],["perempuan","Perempuan"],["laki-laki","Laki-laki"],["dialog","Dialog antartokoh"]]),mu=sel("f8",[["tim","Biarkan tim memilih"],["hangat","Hangat"],["ceria","Ceria"],["tegang","Tegang"],["megah","Megah"],["tanpa","Tanpa musik"]]),lihat=el("button",{type:"button",textContent:"Lihat contoh semua gaya",on:()=>{draf=b.value;open(vGaya,true)}}),r=sel("f4",[["9:16","9:16 (Reels, Shorts)"],["16:9","16:9 (YouTube)"]]),mi=el("input",{id:"f5",type:"number",min:0,step:1,value:"0",inputMode:"numeric"}),d=el("input",{id:"f6",type:"number",min:0,step:1,value:"0",inputMode:"numeric"}),dur=()=>Math.max(0,Math.round(+mi.value||0))*60+Math.max(0,Math.round(+d.value||0));
 b.value=draf;if(pilihG)s.value=pilihG;const go=el("button",{className:"main",type:"submit",textContent:"Kirim dan mulai",disabled:!db});
 f.append(g("Brief",b),el("div",{className:"two"},g("Gaya",s),g("Ukuran",r),g("Suara narator",vo),g("Musik",mu),g("Durasi (menit)",mi),g("Durasi (detik)",d)),lihat,el("p",{className:"soft",textContent:"Durasi bebas. Biarkan 0 kalau ingin panjangnya mengikuti naskah. Judul, naskah, dan caption dibuat tim."}),!db?el("p",{className:"note",textContent:"Papan belum tersambung, jadi brief belum bisa dikirim."}):"",el("div",{className:"row"},go));
 f.onsubmit=async e=>{e.preventDefault();let ref;if(await save(go,async()=>{ref=await db.collection("jobs").add({title:"",brief:b.value.trim(),style:s.value,suara:vo.value,musik:mu.value,ratio:r.value,seconds:dur(),stage:"riset",status:"antre",mulai:true,note:"",result:"",createdAt:Date.now()})})){draf="";pilihG=null;open(vBoard)}};
 return[head("Buat video baru"),f]}
$("#bBoard").onclick=()=>open(vBoard);$("#bNew").onclick=()=>open(vNew);$("#bGaya").onclick=()=>open(vGaya,true);
