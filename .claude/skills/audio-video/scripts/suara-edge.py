# python suara-edge.py segmen.json keluar.wav suara
# segmen: [{"t":"teks","r":-4,"p":2,"v":0,"j":0.35}]  r tempo %, p nada Hz, v volume %, j jeda sesudah (detik)
import asyncio, json, os, re, subprocess, sys, tempfile
import edge_tts
import numpy as np
SR = 24000
segs = json.load(open(sys.argv[1], encoding='utf8')); out, voice = sys.argv[2], sys.argv[3]
if any(re.search(r'\[[a-z ]+\]', s['t']) for s in segs):
    sys.exit('Edge tidak mendukung tanda ekspresi. Pakai mesin yang mendukung.')
async def make(s, f, sem):
    async with sem:
        for k in range(5):
            try:
                await asyncio.wait_for(edge_tts.Communicate(s['t'], voice, rate='%+d%%' % s.get('r', 0), pitch='%+dHz' % s.get('p', 0), volume='%+d%%' % s.get('v', 0)).save(f), 25)
                return
            except Exception:
                if k == 4: raise
                await asyncio.sleep(1 + k)
def load(f):
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
    h = np.where(np.abs(x) > 0.008)[0]
    x = x[max(0, h[0] - 500):h[-1] + 1400]
    x[:200] *= np.linspace(0, 1, 200); x[-200:] *= np.linspace(1, 0, 200)
    return x
async def main():
    with tempfile.TemporaryDirectory() as d:
        fs = [os.path.join(d, '%d.mp3' % i) for i in range(len(segs))]; sem = asyncio.Semaphore(3)
        await asyncio.gather(*[make(s, f, sem) for s, f in zip(segs, fs)])
        parts, n, marks = [], 0, []
        for s, f in zip(segs, fs):
            x = load(f); z = np.zeros(int(SR * s.get('j', .3)), np.float32)
            marks.append({'t': s['t'], 'awal': round(n / SR, 3), 'lama': round(len(x) / SR, 3), 'jeda': s.get('j', .3), 'kata_dtk': round(len(s['t'].split()) / (len(x) / SR), 2)})
            parts += [x, z]; n += len(x) + len(z)
        raw = os.path.join(d, 'a.f32'); np.concatenate(parts).tofile(raw)
        subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', raw, '-af', 'highpass=f=70,loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '44100', out], check=True)
    json.dump(marks, open(os.path.splitext(out)[0] + '.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    j = [m['jeda'] for m in marks[:-1]] or [0]; k = [m['kata_dtk'] for m in marks if len(m['t'].split()) > 2] or [1]
    print('simpangan jeda %.2f (min 0.12), rasio tempo %.2f (min 1.25)' % (np.std(j), max(k) / min(k)))
asyncio.run(main())
