// ---------- kantor 3D: lingkungan di luar kantor ----------
const jalan=[],lampuLuar=[];
function outside(){
 sky.d.set("#9fd0d6").convertSRGBToLinear();sky.n.set("#1c2c50").convertSRGBToLinear();
 const grass=tex(512,512,(c,w,h)=>{c.fillStyle="#5d9c5a";c.fillRect(0,0,w,h);for(let i=0;i<5200;i++){c.fillStyle=["rgba(255,255,220,.10)","rgba(40,110,70,.12)","rgba(190,215,110,.16)"][i%3];c.fillRect(rn()*w,rn()*h,2+rn()*3,4+rn()*9)}},26,26);
 const g=plane(sc,260,260,TM(grass,{roughness:1}),0,-1.02,0,0,-Math.PI/2);g.receiveShadow=true;
 const flat=(w,d,c,x,z,y=-.98,rot=0)=>{const o=plane(sc,w,d,M(c,{roughness:.95}),x,y,z,0,-Math.PI/2);o.rotation.z=rot;o.receiveShadow=true;return o};
 // pelataran, jalan setapak, jalan raya
 flat(30,22,"#b7a478",0,.4,-.985);flat(5,14,"#b7a478",0,20,-.98);
 for(let i=0;i<7;i++)B(sc,3.2,.1,.95,i%2?"#cfc09a":"#b9a679",(i%2?.15:-.15),-.94,11.6+i*1.45,.08);
 flat(220,7.4,"#3a4a50",0,27.5,-.975);flat(7.4,220,"#3a4a50",27.5,0,-.976);flat(220,1.6,"#a5a595",0,22.9,-.97);flat(1.6,220,"#a5a595",22.9,0,-.971);
 for(let i=-13;i<14;i++){if(Math.abs(i*6-27.5)>5){flat(2.6,.2,"#f4e6b0",i*6,27.5,-.96);flat(.2,2.6,"#f4e6b0",27.5,i*6,-.96)}}
 for(let i=0;i<6;i++)flat(.62,5.6,"#f3f0e6",-3+i*1.2,27.5,-.955);
 // pohon: satu cetakan untuk banyak pohon
 const pos=[];const put1=(x,z,s)=>pos.push([x,z,s]);for(let i=0;i<9;i++){put1(-17.5-rn()*3,-13+i*4+rn()*1.5,.9+rn()*.5);put1(-15+i*4.1+rn(),-13.5-rn()*3,.9+rn()*.6)}for(let i=0;i<8;i++){put1(17.6+rn()*2.6,-12+i*4+rn(),.75+rn()*.4)}for(const p of[[-12,17.6],[-8,19.6],[-15.5,19],[8,18.4],[12,16.8],[15.6,19.6],[6,20.6]])put1(p[0],p[1],.8+rn()*.4);
 for(let i=0;i<26;i++){put1(-24-rn()*26,-34+rn()*66,1.1+rn()*.9);put1(-40+rn()*66,-21-rn()*26,1.1+rn()*.9)}for(let i=0;i<14;i++){put1(34+rn()*20,-38+rn()*58,1+rn()*.7);put1(-44+rn()*64,34+rn()*18,1+rn()*.7)}
 const ok=pos.filter(p=>Math.abs(p[0]-27.5)>5.2&&Math.abs(p[1]-27.5)>5.2&&Math.abs(p[0]-22.9)>1.6&&Math.abs(p[1]-22.9)>1.6),n=ok.length,o=new T.Object3D(),tr=new T.InstancedMesh(new T.CylinderGeometry(.16,.26,1.6,9),M("#8b623f"),n),lf=new T.InstancedMesh(new T.IcosahedronGeometry(1,2),new T.MeshStandardMaterial({roughness:.95}),n*3),cs=["#4c9f68","#6bb56a","#86c061","#3d8a66","#d9b24f"];
 ok.forEach((p,i)=>{o.rotation.set(0,rn()*6,0);o.scale.setScalar(p[2]);o.position.set(p[0],-1+.75*p[2],p[1]);o.updateMatrix();tr.setMatrixAt(i,o.matrix);for(let k=0;k<3;k++){const s=p[2]*(1.2-k*.22);o.position.set(p[0]+(k?(rn()-.5)*1.1*p[2]:0),-1+(2+k*.62)*p[2],p[1]+(k?(rn()-.5)*1.1*p[2]:0));o.scale.set(s,s*.86,s);o.updateMatrix();lf.setMatrixAt(i*3+k,o.matrix);lf.setColorAt(i*3+k,new T.Color(cs[(i*7+(k==2?1:0))%(i%9==0?5:4)]).convertSRGBToLinear())}});
 tr.castShadow=lf.castShadow=lf.receiveShadow=true;sc.add(tr,lf);
 // rumah dan ruko tetangga
 const rumah=(x,z,w,h,d,c,roof,ry=0)=>{const q=GR(sc,x,-1,z,ry);B(q,w,h,d,c,0,h/2,0,.12);if(roof){for(const s of[-1,1]){const r=B(q,w*.62,.22,d+.7,roof,s*w*.27,h+.55,0,.06);r.rotation.z=-s*.48}}else{B(q,w+.3,.25,d+.3,"#f6efdf",0,h+.1,0,.06);B(q,1,.7,.8,"#b9c4c2",w*.2,h+.5,0,.06)}
  const m=M("#bfe3ee",{emissive:"#ffd27a",emissiveIntensity:0,roughness:.25});for(let f=0;f<Math.max(1,Math.floor(h/2));f++)for(let i=0;i<Math.floor(w/1.4);i++)if(!(f==0&&i==1)){BX(q,.78,.95,.08,m,-w/2+.95+i*1.4,1.25+f*1.9,d/2+.02);BX(q,.08,.95,.78,m,w/2+.02,1.25+f*1.9,-d/2+.9+i*1.2%(d-1.4))}BX(q,.9,1.7,.1,"#8a5a30",-w/2+.95+1.4,.85,d/2+.03);if(!rumah.m){rumah.m=1;glows.push([m,1.15])}};
 rumah(-27,-8,6,4.2,5,"#f2c9a1","#c65f4a",.1);rumah(-27,3,5.4,3.4,5,"#a9d3c8","#3f7f86",.05);rumah(-28,14,6.4,5.4,5,"#f4e3b5",null,.1);
 rumah(-14,-25,7,5.6,5,"#e7a08d",null);rumah(-4,-26,6,4,5,"#f6e0bd","#8a5a78");rumah(6,-25,7,7.2,5,"#9fc6d8",null);rumah(16,-26,6,4.4,5,"#f0c3c9","#b55a4d");
 rumah(37,-16,6,6.5,6,"#f1d9a6",null,-.05);rumah(37,-5,6,4.2,6,"#b8cfa6","#b8674a");rumah(38,6,6,8.4,6,"#d7c2de",null);rumah(37,17,6,4.4,6,"#f3b79b","#3f7f86");
 for(let i=0;i<9;i++){const b=-48+i*12;rumah(b,-44-rn()*6,7+rn()*3,9+rn()*9,6,["#b8d2d4","#c9d8c9","#dccfc0"][i%3],null)}
 // lampu jalan
 const bulb=M("#fff0c4",{emissive:"#ffca6b",emissiveIntensity:.1});glows.push([bulb,2.2]);for(const p of[[-16,22.8],[-6,22.8],[6,22.8],[16,22.8],[22.8,10],[22.8,0],[22.8,-10]]){CY(sc,.07,.1,3.6,"#31474d",p[0],.8,p[1]);SP(sc,.26,bulb,p[0],2.7,p[1]);const l=new T.PointLight("#ffc877",0,9,2);l.position.set(p[0],2.5,p[1]);if(lampuLuar.length<3){sc.add(l);lampuLuar.push(l)}}
 // bangku dan semak
 for(const p of[[-9.5,12.6],[9.5,12.6]]){B(sc,2.6,.14,.75,"#b07b4a",p[0],-.45,p[1],.05);for(const s of[-1,1])B(sc,.14,.5,.6,"#31474d",p[0]+s,-.75,p[1],.03)}
 for(let i=0;i<26;i++){const x=i<13?-15.5+i*2.45:15.4,z=i<13?12.1+(Math.abs(-15.5+i*2.45)<3?99:0):-10+(i-13)*1.75;if(z<50)SP(sc,.5,["#5aa66a","#77b765","#479566"][i%3],x,-.75,z).scale.y=.8}
 // kendaraan
 const mobil=(c,ax,off,v,bus)=>{const q=GR(sc),L=bus?5:3;B(q,L,bus?1.5:.8,1.5,c,0,bus?1.05:.65,0,.2);B(q,bus?4.3:1.7,.7,1.36,"#d7f0f5",bus?0:-.1,bus?1.4:1.25,0,.16);for(const s of[-1,1])for(const t of[-1,1]){const r=CY(q,.32,.32,.24,"#2b3538",s*L*.31,.32,t*.68);r.rotation.x=Math.PI/2}const hl=M("#fff3c9",{emissive:"#ffe7a3",emissiveIntensity:.2});BX(q,.06,.18,1.1,hl,L/2,.6,0);q.position.y=-.97;jalan.push({q,ax,off,v,p:rn()*90-45})};
 mobil("#e8604c","x",29.2,5.2);mobil("#f6b93b","x",29.2,4.6);mobil("#0f7c80","x",25.8,-4.4,1);mobil("#8a5bd0","z",25.8,4.2);mobil("#f4f0e6","z",29.2,-5);}
function stepOut(dt,t){for(const m of jalan){if(!still)m.p+=m.v*dt;if(m.p>64)m.p=-64;if(m.p<-64)m.p=64;if(m.ax=="x"){m.q.position.set(m.p,-.97,m.off);m.q.rotation.y=m.v>0?0:Math.PI}else{m.q.position.set(m.off,-.97,m.p);m.q.rotation.y=m.v>0?-Math.PI/2:Math.PI/2}}lampuLuar.forEach(l=>l.intensity=1.7*night)}
