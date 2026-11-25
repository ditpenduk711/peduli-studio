// ---------- kantor 3D: alat bantu, ruang, perabot ----------
const T=window.THREE,host=$("#scene");
const still=matchMedia("(prefers-reduced-motion:reduce)").matches;
const mc={},gc={},block=[],lampsN=[],glows=[];
const M=(c,o={})=>{const k=c+JSON.stringify(o);if(mc[k])return mc[k];const m=new T.MeshStandardMaterial(Object.assign({color:c,roughness:.72},o));m.color.convertSRGBToLinear();m.emissive.convertSRGBToLinear();return mc[k]=m};
function rgeo(w,h,d,r){r=Math.min(r,w/2.05,h/2.05,d/2.05);const k=[w,h,d,r].map(v=>v.toFixed(3)).join();if(gc[k])return gc[k];const n=r>.09?7:3,g=new T.BoxGeometry(1,1,1,n,n,n),p=g.attributes.position,q=g.attributes.normal,v=new T.Vector3(),e=.5/n,b=[w/2-r,h/2-r,d/2-r],A=["x","y","z"];for(let a=0;a<p.count;a++){v.fromBufferAttribute(p,a);const sg=A.map(c=>Math.sign(v[c]));A.forEach((c,m)=>v[c]-=sg[m]*e);v.normalize();p.setXYZ(a,b[0]*sg[0]+v.x*r,b[1]*sg[1]+v.y*r,b[2]*sg[2]+v.z*r);q.setXYZ(a,v.x,v.y,v.z)}return gc[k]=g}
function put(p,g,m,x=0,y=0,z=0,ry=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.rotation.y=ry;o.castShadow=o.receiveShadow=true;p.add(o);return o}
const B=(p,w,h,d,c,x,y,z,r=.05,o)=>put(p,rgeo(w,h,d,r),c.isMaterial?c:M(c,o),x,y,z);
const BX=(p,w,h,d,c,x,y,z,o)=>{const k="b"+w+h+d;return put(p,gc[k]||(gc[k]=new T.BoxGeometry(w,h,d)),c.isMaterial?c:M(c,o),x,y,z)};
const CY=(p,a,b,h,c,x,y,z,o)=>{const k="c"+a+b+h;return put(p,gc[k]||(gc[k]=new T.CylinderGeometry(a,b,h,24)),M(c,o),x,y,z)};
const SP=(p,r,c,x,y,z,o)=>{const k="s"+r;return put(p,gc[k]||(gc[k]=new T.SphereGeometry(r,20,14)),M(c,o),x,y,z)};
const GR=(p,x=0,y=0,z=0,ry=0)=>{const g=new T.Group();g.position.set(x,y,z);g.rotation.y=ry;p.add(g);return g};
const GL=(c,i=1)=>M(c,{emissive:c,emissiveIntensity:i});
function tex(w,h,f,rx,ry){const e=document.createElement("canvas");e.width=w;e.height=h;f(e.getContext("2d"),w,h);const t=new T.CanvasTexture(e);t.encoding=T.sRGBEncoding;t.anisotropy=4;if(rx){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rx,ry)}return t}
const TM=(t,o={})=>new T.MeshStandardMaterial(Object.assign({map:t,roughness:.75},o));
const plane=(p,w,h,m,x,y,z,ry=0,rx=0)=>{const o=put(p,new T.PlaneGeometry(w,h),m,x,y,z,ry);o.rotation.x=rx;o.castShadow=false;return o};
const blk=(x,z,w,d)=>block.push([x-w/2,x+w/2,z-d/2,z+d/2]);
let sd=5;const rn=()=>(sd=sd*16807%2147483647)/2147483647;
// tekstur
const woodT=tex(1024,512,(c,w,h)=>{for(let r=0;r<8;r++){let x=-(r*137%256);while(x<w){const L=200+((r*7+x)%3)*40,q=rn();c.fillStyle=`hsl(${27+q*6},${42+q*10}%,${50+q*11}%)`;c.fillRect(x,r*64,L,64);c.strokeStyle="rgba(96,56,24,.12)";c.lineWidth=2;for(let n=0;n<5;n++){const y=r*64+8+n*12+rn()*5;c.beginPath();c.moveTo(x+4,y);c.bezierCurveTo(x+L*.3,y+rn()*7-3,x+L*.7,y+rn()*7-3,x+L-4,y);c.stroke()}c.strokeStyle="rgba(70,38,14,.5)";c.lineWidth=2.5;c.strokeRect(x,r*64,L,64);c.fillStyle="rgba(255,255,255,.08)";c.fillRect(x,r*64+2,L,3);x+=L}}},4,5);
const plas=(a,s=14)=>tex(256,256,(c,w,h)=>{c.fillStyle=a;c.fillRect(0,0,w,h);for(let i=0;i<1500;i++){c.fillStyle=rn()>.5?"rgba(255,255,255,.05)":"rgba(20,50,50,.035)";c.fillRect(rn()*w,rn()*h,s*rn()+2,3)}},5,1.4);
const brick=tex(512,256,(c,w,h)=>{c.fillStyle="#d9cdbd";c.fillRect(0,0,w,h);for(let r=0;r<8;r++)for(let i=-1;i<9;i++){const q=rn();c.fillStyle=`hsl(${14+q*8},${38+q*12}%,${52+q*10}%)`;c.fillRect(i*64+(r%2)*32+2,r*32+2,60,28);c.fillStyle="rgba(255,255,255,.09)";c.fillRect(i*64+(r%2)*32+2,r*32+2,60,4)}},4,1.6);
const rugT=(a,b,d)=>tex(512,384,(c,w,h)=>{c.fillStyle=a;c.fillRect(0,0,w,h);c.strokeStyle=b;c.lineWidth=14;c.strokeRect(20,20,w-40,h-40);c.lineWidth=4;c.strokeRect(42,42,w-84,h-84);c.fillStyle=d;for(let i=0;i<7;i++)for(let j=0;j<5;j++){c.save();c.translate(88+i*56,82+j*55);c.rotate(Math.PI/4);c.fillRect(-11,-11,22,22);c.fillStyle=a;c.fillRect(-4,-4,8,8);c.fillStyle=d;c.restore()}for(let i=0;i<6000;i++){c.fillStyle="rgba(255,255,255,.045)";c.fillRect(rn()*w,rn()*h,1,3)}});
const winT=(wall,n)=>tex(128,256,(c,w,h)=>{c.fillStyle=n?"#000":wall;c.fillRect(0,0,w,h);for(let i=0;i<5;i++)for(let j=0;j<12;j++){c.fillStyle=n?(rn()>.45?"#ffd58a":"#000"):(rn()>.5?"#a9cfe0":"#8fbcd2");c.fillRect(8+i*24,8+j*21,15,13)}});
let R,sc,cam,sun,hemi,fill,sky={d:new T.Color("#d9ebe6").convertSRGBToLinear(),n:new T.Color("#33456e").convertSRGBToLinear()};
const W=13,D=9,WH=4.3;
function shell(){
 const base=GR(sc);B(base,28,.6,20,"#f4efe6",0,-.31,.2,.18);B(base,28.4,.34,20.4,"#31474d",0,-.76,.2,.12);
 const gd=plane(sc,220,220,new T.ShadowMaterial({opacity:.16}),0,-.94,0,0,-Math.PI/2);gd.receiveShadow=true;
 const fl=plane(sc,W*2,D*2,TM(woodT,{roughness:.5}),0,.015,0,0,-Math.PI/2);fl.receiveShadow=true;fl.userData.floor=1;
 // dinding belakang (bata) dan kiri (plester + panel kayu)
 const wb=TM(brick),wp=TM(plas("#f3efe6")),teal=TM(plas("#2c8f8c"));
 const seg=(x0,x1,m)=>BX(sc,x1-x0,WH,.34,m,(x0+x1)/2,WH/2,-D-.17);
 const winN=[[-11.4,-8.6],[-6.6,-3.8]];let px=-W-.34;for(const q of winN){seg(px,q[0],wb);BX(sc,q[1]-q[0],1.05,.34,wb,(q[0]+q[1])/2,.52,-D-.17);BX(sc,q[1]-q[0],.75,.34,wb,(q[0]+q[1])/2,WH-.37,-D-.17);wind((q[0]+q[1])/2,-D-.17,q[1]-q[0],0);px=q[1]}seg(px,7.4,wb);seg(7.4,W,teal);
 const segW=(z0,z1,m)=>BX(sc,.34,WH,z1-z0,m,-W-.17,WH/2,(z0+z1)/2);let pz=-D;for(const q of[[-7.2,-4.2],[2.6,5.6]]){segW(pz,q[0],wp);BX(sc,.34,1.05,q[1]-q[0],wp,-W-.17,.52,(q[0]+q[1])/2);BX(sc,.34,.75,q[1]-q[0],wp,-W-.17,WH-.37,(q[0]+q[1])/2);wind(-W-.17,(q[0]+q[1])/2,q[1]-q[0],1);pz=q[1]}segW(pz,D,wp);
 // lis, plint, cornice
 B(sc,W*2+.7,.22,.5,"#31474d",0,WH+.1,-D-.17,.06);B(sc,.5,.22,D*2+.5,"#31474d",-W-.17,WH+.1,.1,.06);
 BX(sc,W*2,.24,.07,"#fbf8f1",0,.12,-D+.03);BX(sc,.07,.24,D*2,"#fbf8f1",-W+.03,.12,0);BX(sc,W*2,.09,.1,"#fbf8f1",0,WH-.12,-D+.03);BX(sc,.1,.09,D*2,"#fbf8f1",-W+.03,WH-.12,0);
 // panel kayu bilah di dinding kiri
 for(let i=0;i<34;i++)BX(sc,.09,1.15,.14,i%2?"#b07b4a":"#a06d3f",-W+.06,.8,-D+.35+i*.53);BX(sc,.13,.1,D*2-.2,"#8a5a30",-W+.07,1.43,0);
 // pagar kaca rendah depan & kanan
 const gm=M("#cfeaf0",{transparent:true,opacity:.22,roughness:.08});
 for(const x of[-9.8,-5.4,5.4,9.8]){const g=put(sc,new T.BoxGeometry(4.2,.8,.06),gm,x,.5,D+.02);g.castShadow=false;B(sc,4.3,.07,.12,"#31474d",x,.92,D+.02,.03)}
 for(const z of[-5.6,0,5.6]){const g=put(sc,new T.BoxGeometry(.06,.8,5.2),gm,W+.02,.5,z);g.castShadow=false;B(sc,.12,.07,5.3,"#31474d",W+.02,.92,z,.03)}
 for(const p of[[-W,D],[-7.6,D],[-3.2,D],[3.2,D],[7.6,D],[W,D],[W,-2.8],[W,2.8],[W,-8.4]])B(sc,.16,1.02,.16,"#31474d",p[0],.5,p[1],.04);
 // papan nama PEDULI (huruf menyala di panel bilah)
 for(let i=0;i<22;i++)BX(sc,.16,2.3,.08,i%2?"#24444b":"#2d525a",-3.4+i*.2,2.55,-D+.05);
 const st=tex(1024,360,(c,w,h)=>{c.clearRect(0,0,w,h);c.textAlign="center";c.font='800 250px "Bricolage Grotesque",Arial,sans-serif';c.shadowColor="#5fe9dc";c.shadowBlur=38;c.fillStyle="#f4fffd";c.fillText("PEDULI",w/2,225);c.shadowBlur=0;c.font='700 54px Figtree,Arial,sans-serif';c.fillStyle="#f9c65a";c.fillText("DIVISI VIDEO",w/2,320)});
 const sg=plane(sc,4.2,1.48,new T.MeshBasicMaterial({map:st,transparent:true,toneMapped:false}),-1.3,2.62,-D+.14);sg.receiveShadow=false;
 // jam dinding
 const ck=GR(sc,6.55,3.25,-D+.04);const cf=put(ck,new T.CylinderGeometry(.48,.48,.1,36),M("#fbf8f1"));cf.rotation.x=Math.PI/2;const rim=put(ck,new T.TorusGeometry(.48,.06,10,40),M("#31474d"),0,0,.04);for(let i=0;i<12;i++){const a=i*Math.PI/6;BX(ck,.03,i%3?.06:.11,.02,"#31474d",Math.sin(a)*.38,Math.cos(a)*.38,.07).rotation.z=-a}
 ck.h=GR(ck,0,0,.08);BX(ck.h,.05,.24,.02,"#17323a",0,.1,0);ck.m=GR(ck,0,0,.1);BX(ck.m,.035,.36,.02,"#e8604c",0,.16,0);shell.ck=ck;
 B(sc,3.4,.06,1.2,"#31474d",0,.02,8.2,.02);plane(sc,3.1,1,TM(tex(256,84,(c,w,h)=>{c.fillStyle="#0f7c80";c.fillRect(0,0,w,h);c.fillStyle="#fff";c.font="800 36px Figtree,Arial";c.textAlign="center";c.fillText("SELAMAT DATANG",w/2,55,230)})),0,.06,8.2,0,-Math.PI/2);
}
function wind(x,z,w,side){const g=GR(sc,x,0,z,side?Math.PI/2:0),y=2.3,h=2.5;const gl=put(g,new T.BoxGeometry(w,h,.04),M("#bfe9f5",{transparent:true,opacity:.28,roughness:.05}),0,y,0);gl.castShadow=false;plane(g,w,h,wind.m||(wind.m=new T.MeshBasicMaterial({map:tex(256,200,(c,w,h)=>{const q=c.createLinearGradient(0,0,0,h);q.addColorStop(0,"#8fd0ee");q.addColorStop(1,"#e4f6fb");c.fillStyle=q;c.fillRect(0,0,w,h);c.fillStyle="#fff";for(const e of[[60,70,34],[92,62,26],[180,104,30],[208,112,22]]){c.beginPath();c.arc(e[0],e[1],e[2]*.6,0,7);c.fill()}c.fillStyle="#8fce9a";c.beginPath();c.arc(60,250,90,0,7);c.arc(200,260,105,0,7);c.fill()})})),0,y,-.16);
 for(const s of[-1,0,1])B(g,.11,h,.42,"#31474d",s*(w/2-.05),y,0,.02);for(const yy of[y-h/2+.05,y+h/2-.05,y+.45])B(g,w,.09,.42,"#31474d",0,yy,0,.02);B(g,w+.3,.1,.62,"#fbf8f1",0,y-h/2-.03,.12,.03);
 // tirai gulung + tanaman ambang
 B(g,w-.2,.5,.05,"#f4d9a6",0,y+h/2-.3,.14,.02);const cy=CY(g,.06,.06,.3,"#f4d9a6",0,0,0);cy.visible=false;
 for(const s of[-.7,.75]){CY(g,.15,.11,.24,"#c4693f",s*w/3,y-h/2+.13,.25);for(let i=0;i<5;i++)SP(g,.11,i%2?"#4ba66a":"#2f8a57",s*w/3+Math.sin(i*1.3)*.12,y-h/2+.34+i%2*.07,.25+Math.cos(i*1.3)*.1)}}
const clouds=[];
function plant(x,z,s=1,k=0){const g=GR(sc,x,0,z);g.scale.setScalar(s);CY(g,.3,.22,.52,["#e8604c","#f3ede2","#2c8f8c"][k%3],0,.26,0);CY(g,.27,.27,.04,"#5a3d28",0,.52,0);if(k%2){for(let i=0;i<9;i++){const a=i*.7,l=put(g,gc.leaf||(gc.leaf=new T.SphereGeometry(.2,12,8)),M(i%2?"#3f9d5f":"#2d8a57",{roughness:.6}),Math.sin(a)*.34,1+i*.07,Math.cos(a)*.34);l.scale.set(.55,1.7,.22);l.rotation.set(Math.cos(a)*.7,a,-Math.sin(a)*.5)}}else{CY(g,.05,.07,.9,"#8a5a34",0,.9,0);for(let i=0;i<7;i++)SP(g,.26,i%2?"#5fb56a":"#3f9d5f",Math.sin(i)*.28,1.4+i%3*.22,Math.cos(i*1.4)*.28)}blk(x,z,.7*s,.7*s)}
function pendant(x,z,c="#f6b93b"){CY(sc,.02,.02,1.2,"#31474d",x,5.3,z).castShadow=false;const s=put(sc,gc.pd||(gc.pd=new T.ConeGeometry(.48,.42,28,1,true)),M(c,{side:T.DoubleSide}),x,4.55,z);s.castShadow=false;const m=new T.MeshStandardMaterial({color:"#fff6dd",emissive:"#ffdf9a",emissiveIntensity:.5});glows.push([m,2.4]);put(sc,gc.bl||(gc.bl=new T.SphereGeometry(.15,14,10)),m,x,4.42,z).castShadow=false;lampsN.push([x,z])}
function frame(x,y,w,h,f,side){const g=side?GR(sc,-W+.1,y,x,Math.PI/2):GR(sc,x,y,-D+.07);B(g,w+.16,h+.16,.08,"#7a5132",0,0,0,.03);plane(g,w,h,TM(tex(256,Math.round(256*h/w),f)),0,0,.05)}
function shelf(x,z,ry=0){const g=GR(sc,x,0,z,ry);B(g,2.4,2.9,.5,"#a06d3f",0,1.45,0,.04);BX(g,2.2,2.7,.1,"#7a5132",0,1.45,.22);for(let r=0;r<4;r++){BX(g,2.25,.06,.52,"#b98a5c",0,.2+r*.68,.04);let q=-1;while(q<.85){const w=.07+rn()*.08,h=.34+rn()*.18;if(rn()>.12)BX(g,w,h,.3,["#e8604c","#f6b93b","#2c8f8c","#3b6fe0","#f3ede2","#8a5bd0"][rn()*6|0],q+w/2,.23+r*.68+h/2,.12);q+=w+.015}}CY(g,.13,.1,.26,"#f3ede2",.8,3.03,0);SP(g,.2,"#3f9d5f",.8,3.28,0)}
function sofa(x,z,ry,c){const g=GR(sc,x,0,z,ry);B(g,3,.42,1.15,c,0,.36,0,.16);B(g,3,.85,.34,c,0,.75,-.48,.15);for(const s of[-1,1])B(g,.34,.7,1.15,c,s*1.4,.5,0,.15);for(const s of[-.65,.65])B(g,1.2,.2,.85,"#f9d48a",s,.6,.08,.09);B(g,.5,.42,.18,"#2c8f8c",-.9,.88,-.18,.09).rotation.z=.25;B(g,.5,.42,.18,"#f3ede2",.95,.88,-.18,.09).rotation.z=-.2;blk(x,z,ry?1.3:3.2,ry?3.2:1.3)}
