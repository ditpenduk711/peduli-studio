# Sintesis sendiri (numpy), tanpa sampel/unduhan. Jalankan: python buat_audio.py
import numpy as np, wave, json, subprocess, re, os
H=os.path.dirname(os.path.abspath(__file__)); SR=44100; rng=np.random.default_rng(912)
T=lambda d:np.arange(int(d*SR))/SR
def halus(x,a=.002,r=.02):
    x=x.copy(); n=int(a*SR); m=int(r*SR); x[:n]*=np.linspace(0,1,n); x[-m:]*=np.linspace(1,0,m); return x
def hz(m): return 440*2**((m-69)/12)
def pizz(m,d=.7):
    t=T(d); f=hz(m)
    y=sum(np.sin(2*np.pi*f*k*t)*abs(np.sin(np.pi*k*.21))/k**1.1*np.exp(-t*(6+2.2*k)) for k in range(1,13) if f*k<12000)
    n=rng.normal(size=len(t))*np.exp(-t*220)*.12
    return halus(y+n)
def mar(m,d=1.1):
    t=T(d); f=hz(m)
    return halus(np.sin(2*np.pi*f*t)*np.exp(-t*5)+.3*np.sin(2*np.pi*f*3.93*t)*np.exp(-t*16)+.1*np.sin(2*np.pi*f*9.2*t)*np.exp(-t*45),.003)
def bas(m,d=.8):
    t=T(d); f=hz(m)
    return halus(sum(np.sin(2*np.pi*f*k*t)*a*np.exp(-t*(2.5+1.5*k)) for k,a in ((1,1),(2,.5),(3,.22),(4,.1))),.006,.08)
def pad(m,d):
    t=T(d); f=hz(m); return halus(sum(np.sin(2*np.pi*f*c*t)+.2*np.sin(4*np.pi*f*c*t) for c in (.998,1.002)),.35,.6)
def kocok():
    t=T(.07); return halus(np.diff(rng.normal(size=len(t)),prepend=0)*np.exp(-t*70))
def add(b,t,y,g,p=0):
    i=int(round(t*SR)); n=min(len(y),len(b)-i)
    if n>0:
        b[i:i+n,0]+=y[:n]*g*np.cos((p+1)*np.pi/4)*1.41; b[i:i+n,1]+=y[:n]*g*np.sin((p+1)*np.pi/4)*1.41
def ruang(b,w,d=.9):
    t=T(d); ir=rng.normal(size=(len(t),2))*np.exp(-t*7)[:,None]
    k=np.ones(9)/9
    for c in (0,1): ir[:,c]=np.convolve(ir[:,c],k,'same')
    ir/=np.sqrt((ir**2).sum(0)); N=len(b)+len(ir)
    return b+w*np.fft.irfft(np.fft.rfft(b,N,axis=0)*np.fft.rfft(ir,N,axis=0),N,axis=0)[:len(b)]
# ---- musik: 96 BPM, birama 2,5 dtk
B=.625; BAR=2.5; EKOR=1.5
CH={'C':(48,[60,64,67]),'Am':(45,[60,64,69]),'Dm':(50,[62,65,69]),'G':(43,[59,62,67]),'F':(41,[60,65,69]),
    'Em':(40,[59,64,67]),'E':(40,[59,64,68]),'Ddim':(50,[62,65,68])}
def hum(): return rng.uniform(.0,.010)
def bagian(nama,nb,kord):
    b=np.zeros((int((nb*BAR+EKOR)*SR),2))
    if nama=='ringan':
        mel=[[(0,72),(.75,76),(1.5,79),(2.5,76)],[(0,76),(1,72),(1.5,69),(3,71)],[(.5,74),(1,77),(1.75,81),(3,77)],[(0,79),(.5,78),(1,79),(2,74),(3.5,71)]]
    elif nama=='curiga':
        mel=[[(0,69),(.5,70),(1,69),(3,64)],[(1.5,68),(2,71),(3.5,68)],[(0,74),(.5,73),(1,72),(1.5,71)],[(2,68),(2.5,71),(3,76)]]
    else:
        mel=[[(0,76),(1.5,74),(2,72)],[(0,74),(1.5,71),(2,67)],[(0,69),(1,72),(2,76),(3,74)],[(0,72),(1.5,69),(2.5,72)],[(.5,74),(1,79),(2.5,77),(3,74)]]
        mel+=[[(0,76),(1.5,72),(2,69)]]+mel[1:4]+[mel[4]]
    for i in range(nb):
        s=i*BAR; ba,ak=CH[kord[i%len(kord)]]
        if i==nb-1 and nama=='hangat':
            add(b,s,bas(48,1.6),.5)
            for j,m in enumerate((60,64,67,72,84)): add(b,s+j*.06,mar(m),.3,(j-2)*.2); add(b,s+j*.06,pizz(m),.25)
            continue
        if nama=='ringan':
            for k,m in ((0,ba),(2,ba+7 if i%2 else ba)): add(b,s+k*B,bas(m,.55),.5)
            for k in (.5,1.5,2.5,3.5):
                for j,m in enumerate(ak): add(b,s+k*B+hum()+j*.006,pizz(m),.2,-.35)
            for k,m in mel[i%4]:
                if i>0: add(b,s+k*B+hum(),mar(m),.36*rng.uniform(.8,1.1),.3)
            if i%4==3: add(b,s+3*B,pizz(79),.25,.2); add(b,s+3.25*B,pizz(83),.22,.3)
            if i>=2:
                for k in range(8): add(b,s+k*B/2,kocok(),.035 if k%2 else .018,.5)
        elif nama=='curiga':
            for k in (0,1.5,3): add(b,s+k*B,bas(ba,.4),.55)
            for k in (0,1,2,3): add(b,s+k*B+hum(),pizz(ak[k%3]-12,.4),.3,-.4)
            for k,m in ([(0,69),(.5,70),(1,69)] if i==4 else mel[i%4]): add(b,s+k*B+hum(),pizz(m,.5),.42*rng.uniform(.75,1.1),.25); add(b,s+k*B,mar(m-12,.5),.14,.4)
            if i==nb-1:
                for k in range(6): add(b,s+(2.5+k*.25)*B,mar(64+k,.4),.14+.03*k,.3)
        else:
            for m in ak: add(b,s,pad(m,BAR+.5),.035)
            for k in (0,2.5): add(b,s+k*B,bas(ba,1.1),.48)
            ar=ak+[ak[0]+12]
            for k,j in enumerate((0,1,2,3,2,1,2,1)): add(b,s+k*B/2+hum(),pizz(ar[j],.9),.22,-.3+.07*k)
            for k,m in mel[i]: add(b,s+k*B+hum(),mar(m),.36*rng.uniform(.85,1.1),.3)
    b=ruang(b,.16)
    if nama=='hangat': b=b[:25*SR]; n=int(.8*SR)   # tepat 60 dtk
    else: n=int(EKOR*SR)
    b[-n:]*=(np.cos(np.linspace(0,np.pi,n))[:,None]+1)/2
    return b
st=[('musik-1-ringan',0,bagian('ringan',8,['C','Am','Dm','G'])),('musik-2-curiga',20,bagian('curiga',6,['Am','E','Ddim','E','Am','E'])),
    ('musik-3-hangat',35,bagian('hangat',10,['C','Em','F','F','G','Am','Em','F','G','C']))]
# samakan RMS bagian (curiga 1,5 dB lebih pelan)
st=[(n,o,np.tanh(x/np.sqrt((x**2).mean())*(.84 if 'curiga' in n else 1)*.168)/1.4) for n,o,x in st]
mix=np.zeros((60*SR,2))
for n,o,x in st:
    k=min(len(x),60*SR-o*SR); mix[o*SR:o*SR+k]+=x[:k]
g=10**(-4/20)/max(abs(mix).max(),max(abs(x).max() for _,_,x in st))
out=[(n,x*g,'musik',o) for n,o,x in st]+[('musik-utuh-60',mix*g,'musik',0)]
# ---- efek
def fx(d): return np.zeros((int(d*SR),2))
def noise(d,lo,hi):
    n=int(d*SR); X=np.fft.rfft(rng.normal(size=n)); f=np.fft.rfftfreq(n,1/SR); X*=1/(1+(lo/np.maximum(f,1))**4)/(1+(f/hi)**4)
    y=np.fft.irfft(X,n); return y/y.std()
def nada(f,d,a=8):
    t=T(d); return halus((np.sin(2*np.pi*f*t)+.25*np.sin(4*np.pi*f*t)+.08*np.sin(6*np.pi*f*t))*np.exp(-t*a),.004)
E={}
b=fx(.55); add(b,0,nada(1319,.12,4),.6); add(b,.12,nada(1760,.38),.7); E['bip-berhasil']=b
b=fx(.65)
for t0,f,d in ((0,233,.18),(.22,185,.34)):
    add(b,t0,halus(np.tanh(2.5*np.sin(2*np.pi*f*T(d))),.004,.05),.6)
E['bip-gagal']=b
def langkah(v=1):
    t=T(.22); y=np.sin(2*np.pi*(70*t+(1-np.exp(-t*40))))*np.exp(-t*32)+.35*noise(.22,200,1400)*np.exp(-t*45)
    k=int(.07*SR); y[k:]+=.22*noise(.22,500,2500)[:len(y)-k]*np.exp(-t*50)[:len(y)-k]; return halus(y,.002)*v
b=fx(.24); add(b,0,langkah(),.6); E['langkah-satu']=b
b=fx(2.2)
for i in range(4): add(b,.02+i*.5+rng.uniform(0,.02),langkah(rng.uniform(.8,1)),.6,(-1)**i*.15)
E['langkah-empat']=b
d=.9; t=T(d); ph=2*np.pi*np.cumsum(170+60*t/d+12*np.interp(t,np.arange(20)*.05,rng.normal(size=20)))/SR
gr=np.maximum(0,np.sin(ph))**6; env=np.interp(t,[0,.08,.3,.5,.7,.9],[0,1,.6,.9,.5,0])
b=fx(d); add(b,0,halus((gr*noise(d,250,2800)+.25*noise(d,100,700))*env,.01,.06),.5); E['kursi-geser']=b
def tuts(v):
    t=T(.09); return halus(v*(noise(.09,1200,6000)*np.exp(-t*110)*.6+np.sin(2*np.pi*rng.uniform(170,260)*t)*np.exp(-t*70)*.5),.001)
b=fx(2); p=.02
while p<1.85:
    add(b,p,tuts(rng.uniform(.5,1)),.5,rng.uniform(-.2,.2)); p+=rng.choice([.1,.12,.14,.16,.29])*rng.uniform(.9,1.1)
E['ketik']=b
b=fx(.16); t=T(.04); c=halus(noise(.04,1500,7000)*np.exp(-t*220)+.6*np.sin(2*np.pi*2100*t)*np.exp(-t*180),.001,.01)
add(b,0,c,.6); add(b,.075,c,.35); E['klik']=b
d=.6; t=T(d); y=np.zeros(len(t))
for k,c in enumerate((400,700,1200,2000,3200)): y+=noise(d,c*.7,c*1.3)*np.exp(-((t-(.08+k*.085))/.1)**2)
x=halus(y*np.sin(np.pi*t/d)**1.5,.01,.05); E['whoosh']=np.stack([x*np.linspace(1,.5,len(x)),x*np.linspace(.5,1,len(x))],1)
b=fx(1.6); t=T(1.6)
for f,a,q in ((2093,1,3),(4186,.3,5),(5778,.22,7),(8400,.08,12)): add(b,0,halus(np.sin(2*np.pi*f*t)*np.exp(-t*q),.002,.1),a*.5)
E['ting-ide']=ruang(b,.12)
b=fx(4); t=T(.06)
for i in range(4):
    f=2600 if i%2==0 else 1900
    add(b,.01+i,halus(np.sin(2*np.pi*f*t)*np.exp(-t*130)+.4*noise(.06,1500,6000)*np.exp(-t*260),.001),.5)
E['jam-detik']=b
for n,x in E.items():
    x[-200:]*=np.linspace(1,0,200)[:,None]; out.append(('efek-'+n,x/abs(x).max()*10**(-4/20),'efek',None))
def save(n,x):
    q=np.round(x*32767).clip(-32768,32767).astype('<i2')
    with wave.open(f'{H}/{n}.wav','wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(q.tobytes())
M=[]
for n,x,j,o in out:
    save(n,x)
    r=subprocess.run(['ffmpeg','-hide_banner','-nostats','-i',f'{H}/{n}.wav','-af','ebur128=peak=sample+true','-f','null','-'],capture_output=True,text=True,check=True).stderr
    s=r[r.rindex('Summary:'):]; pk=re.findall(r'Peak:\s+(\S+) dBFS',s); I=float(re.search(r'I:\s+(\S+) LUFS',s)[1])
    e=dict(berkas=n+'.wav',jenis=j,durasi_detik=round(len(x)/SR,3),sample_rate=SR,kanal=2,lufs_integrated=I if I>-69 else None,puncak_sampel_dbfs=float(pk[0]),puncak_true_dbtp=float(pk[1]))
    if o is not None: e['mulai_detik']=o
    if j=='musik' and 'utuh' not in n: e['catatan']='akhir lagu, tanpa ekor tambahan' if 'hangat' in n else 'ekor 1,5 dtk menumpuk bagian berikutnya'
    M.append(e)
json.dump(dict(asal='Semua musik dan efek buatan sendiri: disintesis dengan Python/numpy oleh buat_audio.py; tanpa sampel, unduhan, atau rekaman pihak lain.',bpm=96,birama_detik=2.5,titik_potong='kelipatan 2,5 dtk',suara_narator='belum dibuat (naskah belum ada)',didengar=False,catatan='lufs_integrated null = terlalu pendek untuk EBU R128',berkas=M),open(H+'/manifest.json','w',encoding='utf8'),indent=1,ensure_ascii=False)
for m in M: print(m['berkas'],m['durasi_detik'],m['lufs_integrated'],m['puncak_sampel_dbfs'],m['puncak_true_dbtp'])
def baca(n):
    with wave.open(f'{H}/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()),'<i2').reshape(-1,2)/32768
m=baca('musik-utuh-60'); z=np.zeros_like(m)
for n,o,_ in st:
    x=baca(n); z[o*SR:o*SR+len(x)]+=x[:len(z)-o*SR]
print('beda maks stem vs utuh (LSB)',abs(z-m).max()*32768,'| sampel akhir',abs(m[-1]).max())
