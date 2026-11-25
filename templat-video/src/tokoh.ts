import * as THREE from 'three';
import {cap, ell, mesh, off, SDF, smax, smin, V} from './pahat';
export const col = (c: string) => new THREE.Color(c);
let sd = 11; export const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
export const tex = (w: number, h: number, f: (c: CanvasRenderingContext2D) => void, rx = 1, ry = 1) => {
  const e = document.createElement('canvas'); e.width = w; e.height = h; f(e.getContext('2d')!);
  const t = new THREE.CanvasTexture(e); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; return t;
};
export const clay = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) => new THREE.MeshPhysicalMaterial({color: col(c), roughness: 0.66, sheen: 0.15, sheenRoughness: 0.6, sheenColor: col('#ffd9b8'), side: THREE.DoubleSide, ...o});
export const gloss = (c: string, o: THREE.MeshPhysicalMaterialParameters = {}) => new THREE.MeshPhysicalMaterial({color: col(c), roughness: 0.2, clearcoat: 0.7, clearcoatRoughness: 0.15, side: THREE.DoubleSide, ...o});
export const neg = (f: SDF): SDF => (x, y, z) => -f(x, y, z);
const add = (p: THREE.Object3D, g: THREE.BufferGeometry, m: THREE.Material, q: V = [0, 0, 0]) => { const o = new THREE.Mesh(g, m); o.position.set(...q); o.castShadow = o.receiveShadow = true; p.add(o); return o; };
const shared: Record<string, THREE.BufferGeometry> = {};
const once = (k: string, f: () => THREE.BufferGeometry) => shared[k] || (shared[k] = f());
export type Look = {skin: string; hair: string; top: string; topMap?: THREE.Texture; bottom: string; head: 'kuncir' | 'peci' | 'sanggul'; skirt: boolean; brow?: string; mustache?: boolean; collar?: string; acc?: string; scale?: number};
export type Mouth = 'senyum' | 'buka' | 'o' | 'datar' | 'sedih';
export type Char = ReturnType<typeof makeChar>;
const eyeTex = (iris: string) => tex(512, 512, (c) => { c.fillStyle = '#fffdf8'; c.fillRect(0, 0, 512, 512); const q = c.createRadialGradient(256, 290, 10, 256, 256, 150); q.addColorStop(0, '#b5733f'); q.addColorStop(0.7, iris); q.addColorStop(1, '#200e07'); c.fillStyle = q; c.beginPath(); c.arc(256, 256, 146, 0, 7); c.fill(); c.fillStyle = '#0b0504'; c.beginPath(); c.arc(256, 256, 84, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(204, 190, 40, 0, 7); c.fill(); c.globalAlpha = 0.85; c.beginPath(); c.arc(312, 318, 19, 0, 7); c.fill(); });
export function makeChar(L: Look) {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body); g.scale.setScalar(L.scale || 1);
  const skin = clay(L.skin, {sheenColor: col('#ff8a5c'), sheen: 0.25}), hair = clay(L.hair, {roughness: 0.55, sheen: 0.4, sheenColor: col('#7a5a48')}), top = clay(L.top, {roughness: 0.85}), bottom = clay(L.bottom, {roughness: 0.85}), shoe = gloss('#2a2430');
  if (L.topMap) { top.map = L.topMap; top.color.set('#ffffff'); }
  // badan bawah
  if (L.skirt) add(body, once('rok', () => mesh(smin(0.12, cap([0, 0.36, 0], [0, 0.78, 0], 0.4, 0.31), ell([0, 0.27, 0], [0.45, 0.09, 0.41])), [-0.65, 0, -0.6], [0.65, 1.2, 0.6], 60)), bottom);
  else for (const s of [-1, 1]) add(body, once('celana' + s, () => mesh(smin(0.12, cap([s * 0.17, 0.12, 0], [s * 0.15, 0.72, 0], 0.17, 0.22), ell([0, 0.76, 0], [0.34, 0.2, 0.27])), [-0.55, -0.15, -0.45], [0.55, 1.1, 0.45], 50)), bottom);
  if (L.skirt) for (const s of [-1, 1]) add(body, new THREE.CylinderGeometry(0.09, 0.085, 0.3, 24), L.acc ? clay('#fbf8f2') : skin, [s * 0.18, 0.2, 0.02]);
  for (const s of [-1, 1]) add(body, once('sepatu', () => mesh(smin(0.08, ell([0, 0, 0.06], [0.14, 0.1, 0.22]), ell([0, 0.04, -0.05], [0.12, 0.1, 0.12])), [-0.3, -0.2, -0.3], [0.3, 0.25, 0.4], 34)), shoe, [s * 0.18, 0.06, 0.08]);
  const torso = new THREE.Group(); torso.position.y = 0.7; body.add(torso);
  const tg = once('torso', () => { const m = mesh(smin(0.18, ell([0, 0.12, 0], [0.4, 0.32, 0.31]), ell([0, 0.42, 0], [0.36, 0.28, 0.27]), ell([-0.3, 0.5, 0], [0.15, 0.13, 0.15]), ell([0.3, 0.5, 0], [0.15, 0.13, 0.15])), [-0.6, -0.35, -0.5], [0.6, 0.85, 0.5], 60); const p = m.attributes.position, u: number[] = []; for (let i = 0; i < p.count; i++) u.push(p.getX(i) * 1.6, p.getY(i) * 1.6); m.setAttribute('uv', new THREE.Float32BufferAttribute(u, 2)); return m; });
  add(torso, tg, top);
  if (L.collar) for (const s of [-1, 1]) { const c = add(torso, once('kerah', () => mesh(ell([0, 0, 0], [0.16, 0.05, 0.1]), [-0.2, -0.1, -0.15], [0.2, 0.1, 0.15], 24)), clay(L.collar), [s * 0.12, 0.62, 0.2]); c.rotation.set(0.7, s * 0.4, s * -0.5); }
  if (L.acc) { const t = add(torso, once('dasi', () => mesh(smin(0.03, ell([0, 0, 0], [0.06, 0.05, 0.05]), cap([0, -0.04, 0], [0, -0.3, 0.02], 0.05, 0.085)), [-0.15, -0.45, -0.12], [0.15, 0.1, 0.15], 34)), clay(L.acc), [0, 0.54, 0.27]); t.rotation.x = -0.1; }
  for (let i = 0; i < 3; i++) if (!L.acc) add(torso, new THREE.SphereGeometry(0.028, 14, 10), gloss('#fff3d8'), [0, 0.42 - i * 0.17, 0.268 + i * 0.022]);
  // kepala
  const head = new THREE.Group(); head.position.set(0, 0.72, 0.02); torso.add(head);
  const HY = 0.5, hi = new THREE.Group(); hi.position.y = HY; head.add(hi);
  const skull: SDF = smin(0.2, ell([0, 0.06, 0], [0.58, 0.58, 0.54]), ell([-0.27, -0.2, 0.14], [0.31, 0.27, 0.34]), ell([0.27, -0.2, 0.14], [0.31, 0.27, 0.34]), ell([0, -0.32, 0.12], [0.3, 0.2, 0.3]));
  add(hi, once('kepala', () => mesh(smin(0.06, skull, smax(0.04, ell([-0.59, -0.04, -0.02], [0.12, 0.16, 0.08]), neg(ell([-0.66, -0.04, 0.07], [0.06, 0.09, 0.06]))), smax(0.04, ell([0.59, -0.04, -0.02], [0.12, 0.16, 0.08]), neg(ell([0.66, -0.04, 0.07], [0.06, 0.09, 0.06]))), ell([0, -0.13, 0.56], [0.075, 0.06, 0.075]), cap([0, -0.4, -0.03], [0, -0.62, -0.03], 0.17)), [-0.85, -0.85, -0.65], [0.85, 0.75, 0.75], 108)), skin);
  for (const s of [-1, 1]) { const b = new THREE.Mesh(new THREE.CircleGeometry(0.11, 30), new THREE.MeshBasicMaterial({map: tex(64, 64, (c) => { const q = c.createRadialGradient(32, 32, 2, 32, 32, 32); q.addColorStop(0, 'rgba(235,80,70,.5)'); q.addColorStop(1, 'rgba(235,80,70,0)'); c.fillStyle = q; c.fillRect(0, 0, 64, 64); }), transparent: true, depthWrite: false})); b.position.set(s * 0.36, -0.17, 0.5); b.rotation.set(0.12, s * 0.62, 0); hi.add(b); }
  const eyes: {m: THREE.Mesh; t: THREE.Texture; lid: THREE.Mesh; s: number}[] = [], brows: THREE.Mesh[] = [];
  for (const s of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(s * 0.225, 0.02, 0.425); e.rotation.set(-0.02, s * 0.3, 0); hi.add(e);
    const eg = new THREE.SphereGeometry(0.16, 44, 32), p = eg.attributes.position, u = eg.attributes.uv; for (let i = 0; i < p.count; i++) u.setXY(i, p.getX(i) / 0.32 + 0.5, p.getY(i) / 0.32 + 0.5);
    const t = eyeTex('#4c2614'); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; const m = add(e, eg, new THREE.MeshPhysicalMaterial({map: t, roughness: 0.14, clearcoat: 1})); m.scale.set(1, 1.2, 0.6);
    const lid = add(e, new THREE.SphereGeometry(0.172, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.5), skin); lid.scale.set(1.0, 1.2, 0.66);
    const lash = add(e, new THREE.TorusGeometry(0.165, 0.016, 8, 30, Math.PI), clay('#1a100c')); lash.scale.set(1, 1.2, 0.2); lash.position.z = 0.035; lash.visible = L.head !== 'peci';
    eyes.push({m, t, lid, s});
    const b = add(hi, once('alis' + s, () => mesh(smin(0.03, cap([s * -0.11, 0, 0.02], [s * 0.02, 0.035, 0.03], 0.028, 0.034), cap([s * 0.02, 0.035, 0.03], [s * 0.14, -0.015, -0.03], 0.034, 0.014)), [-0.2, -0.1, -0.1], [0.2, 0.12, 0.1], 40)), clay(L.brow || L.hair), [s * 0.235, 0.31, 0.5]); brows.push(b);
  }
  // mulut: bentuk yang ditukar
  const mz = 0.515, mouths: Record<Mouth, THREE.Object3D> = {} as never, dark = clay('#57141f', {roughness: 0.5}), tong = clay('#e57079');
  const tube = (pts: V[]) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((q) => new THREE.Vector3(...q))), 24, 0.019, 10);
  mouths.senyum = add(hi, tube([[-0.13, -0.28, mz - 0.03], [-0.06, -0.325, mz], [0.06, -0.325, mz], [0.13, -0.28, mz - 0.03]]), dark);
  mouths.datar = add(hi, tube([[-0.08, -0.305, mz], [0, -0.305, mz + 0.01], [0.08, -0.305, mz]]), dark);
  mouths.sedih = add(hi, tube([[-0.1, -0.335, mz - 0.01], [0, -0.295, mz + 0.012], [0.1, -0.335, mz - 0.01]]), dark);
  const mk = (rx: number, ry: number) => { const q = new THREE.Group(); hi.add(q); q.position.set(0, -0.315, mz - 0.005); const a = add(q, new THREE.SphereGeometry(1, 30, 20), dark); a.scale.set(rx, ry, 0.045); const b = add(q, new THREE.SphereGeometry(1, 24, 16), tong, [0, -ry * 0.48, 0.012]); b.scale.set(rx * 0.68, ry * 0.42, 0.04); return q; };
  mouths.buka = mk(0.125, 0.085); mouths.o = mk(0.06, 0.07);
  // rambut / penutup
  if (L.head === 'kuncir' || L.head === 'sanggul') {
    const sh = smax(0.06, off(smin(0.1, ell([0, 0.08, -0.03], [0.61, 0.61, 0.56])), 0.02), neg(smin(0.12, ell([0, -0.22, 0.6], [0.56, 0.52, 0.42]), ell([0.03, 0.06, 0.66], [0.4, 0.3, 0.3]))));
    const fr: SDF[] = [sh]; for (const [x, y, a] of [[-0.34, 0.36, -1], [-0.1, 0.43, -1], [0.16, 0.43, 1], [0.36, 0.34, 1]]) fr.push(cap([x * 0.5, 0.56, 0.36], [x + a * 0.05, y - 0.07, 0.47], 0.12, 0.05));
    fr.push(cap([-0.52, 0.2, 0.24], [-0.5, -0.3, 0.24], 0.1, 0.04), cap([0.52, 0.2, 0.24], [0.5, -0.3, 0.24], 0.1, 0.04));
    const f = smin(0.11, ...fr);
    add(hi, once('rb', () => mesh(smax(0.03, f, (x, y, z) => -(y + 0.42)), [-0.85, -0.55, -0.8], [0.85, 0.85, 0.8], 96)), hair);
    if (L.head === 'kuncir') { const k = new THREE.Group(); k.position.set(0.4, 0.5, -0.22); k.rotation.set(0.25, 0.5, 0.35); k.scale.setScalar(1.25); hi.add(k); add(k, once('kuncir', () => mesh(smin(0.1, ell([0, 0, 0], [0.16, 0.16, 0.14]), cap([0, 0, -0.04], [0.1, -0.42, -0.24], 0.17, 0.15), cap([0.1, -0.42, -0.24], [0.2, -0.78, -0.12], 0.15, 0.03)), [-0.35, -0.95, -0.55], [0.45, 0.3, 0.3], 60)), hair); const pt = add(k, new THREE.TorusGeometry(0.15, 0.045, 12, 30), gloss('#ffd23f')); pt.rotation.x = 1.1; (g as unknown as {kun: THREE.Group}).kun = k; }
    else { add(hi, once('sanggul', () => mesh(smin(0.06, ell([0, 0, 0], [0.3, 0.26, 0.24]), ell([0, 0.04, -0.1], [0.2, 0.3, 0.2])), [-0.4, -0.4, -0.4], [0.4, 0.4, 0.4], 50)), hair, [0, 0.6, -0.34]); for (let i = 0; i < 5; i++) add(hi, new THREE.SphereGeometry(0.06, 16, 12), gloss('#ff6f91'), [0.3 + Math.cos(i * 1.26) * 0.075, 0.6 + Math.sin(i * 1.26) * 0.075, -0.12]); add(hi, new THREE.SphereGeometry(0.045, 16, 12), gloss('#ffd23f'), [0.3, 0.6, -0.09]); for (const s of [-1, 1]) add(hi, new THREE.SphereGeometry(0.05, 16, 12), gloss('#ffd23f'), [s * 0.62, -0.24, 0.02]); }
  }
  if (L.head === 'peci') {
    add(hi, once('rbp', () => mesh(smax(0.05, off(ell([0, 0.06, -0.02], [0.59, 0.59, 0.55]), 0.025), smax(0.05, neg(ell([0, -0.16, 0.52], [0.62, 0.62, 0.5])), (x, y) => -(y + 0.2))), [-0.8, -0.35, -0.75], [0.8, 0.8, 0.75], 80)), clay('#2a1d18'));
    add(hi, once('peci', () => mesh(smax(0.05, (x, y, z) => Math.hypot(x / 0.6, z / 0.57) * 0.58 - 0.58 + (y - 0.25) * 0.1, smax(0.04, (x, y) => y - 0.8, (x, y) => 0.36 - y)), [-0.75, 0.2, -0.75], [0.75, 0.95, 0.75], 70)), clay('#17181f', {roughness: 0.8, sheen: 0.8, sheenColor: col('#5c6480')}));
  }
  if (L.mustache) add(hi, once('kms', () => mesh(smin(0.04, cap([0.02, 0, 0.02], [0.17, -0.02, -0.05], 0.04, 0.018), cap([-0.02, 0, 0.02], [-0.17, -0.02, -0.05], 0.04, 0.018)), [-0.25, -0.1, -0.15], [0.25, 0.1, 0.1], 40)), clay('#2a1d18'), [0, -0.23, 0.555]);
  // lengan IK
  const U = 0.34, FA = 0.32, arms = [-1, 1].map((s) => {
    const up = add(torso, once('lup', () => { const m = mesh(cap([0, 0, 0], [0, U, 0], 0.135, 0.12), [-0.2, -0.2, -0.2], [0.2, U + 0.2, 0.2], 34); return m; }), top), fo = new THREE.Group(); torso.add(fo);
    add(fo, once('lfo', () => mesh(cap([0, 0, 0], [0, FA * 0.55, 0], 0.122, 0.115), [-0.2, -0.2, -0.2], [0.2, FA, 0.2], 34)), top); add(fo, once('lfs', () => mesh(cap([0, FA * 0.4, 0], [0, FA, 0], 0.085, 0.075), [-0.15, 0, -0.15], [0.15, FA + 0.15, 0.15], 30)), skin);
    add(fo, once('tgn' + s, () => { const f: SDF[] = [ell([0, 0, 0], [0.095, 0.105, 0.06])]; for (let i = 0; i < 4; i++) f.push(cap([-0.066 + i * 0.044, 0.06, 0], [-0.07 + i * 0.047, 0.15 - Math.abs(i - 1.5) * 0.012, 0.02], 0.031, 0.027)); f.push(cap([-s * 0.07, -0.01, 0.02], [-s * 0.12, 0.07, 0.06], 0.034, 0.028)); return mesh(smin(0.03, ...f), [-0.2, -0.16, -0.12], [0.2, 0.23, 0.16], 46); }), skin, [0, FA + 0.07, 0]);
    return {s, up, fo};
  });
  const Y = new THREE.Vector3(0, 1, 0);
  const setArm = (i: number, t: V, roll = 0) => {
    const {s, up, fo} = arms[i], S = new THREE.Vector3(s * 0.38, 0.5, 0), T = new THREE.Vector3(...t), d = T.clone().sub(S); const L2 = Math.min(d.length(), U + FA - 0.005); d.normalize();
    const a = (U * U - FA * FA + L2 * L2) / (2 * L2), h = Math.sqrt(Math.max(0, U * U - a * a)); const pole = new THREE.Vector3(s * 0.8, -0.8, -0.35); pole.addScaledVector(d, -pole.dot(d)).normalize();
    const E = S.clone().addScaledVector(d, a).addScaledVector(pole, h), Tn = S.clone().addScaledVector(d, L2);
    up.position.copy(S); up.quaternion.setFromUnitVectors(Y, E.clone().sub(S).normalize()); fo.position.copy(E); fo.quaternion.setFromUnitVectors(Y, Tn.sub(E).normalize()); fo.rotateY(roll);
  };
  const face = (o: {mouth?: Mouth; lx?: number; ly?: number; blink?: number; brow?: number; tilt?: number}) => {
    const m = o.mouth || 'senyum'; for (const k in mouths) mouths[k as Mouth].visible = k === m;
    const b = Math.max(0, Math.min(1, o.blink || 0)); for (const e of eyes) { e.t.offset.set(-(o.lx || 0) * 0.16, -(o.ly || 0) * 0.16); e.lid.rotation.x = -1.0 + b * 1.45 + Math.max(0, -(o.ly || 0)) * 0.22; }
    brows.forEach((q, i) => { const s = i ? 1 : -1; q.position.y = (L.head === 'peci' ? 0.235 : 0.3) + (o.brow || 0) * (L.head === 'peci' ? 0.03 : 0.07); q.position.z = L.head === 'peci' ? 0.51 : 0.5; q.rotation.z = s * -(o.tilt || 0) * 0.35; });
  };
  setArm(0, [-0.5, -0.1, 0.1]); setArm(1, [0.5, -0.1, 0.1]); face({});
  return {g, body, torso, head, setArm, face};
}
export function makeCat() {
  const g = new THREE.Group(), or = clay('#e0832c', {sheen: 0.9, sheenColor: col('#ffcf96')}), w = clay('#fff3df');
  add(g, mesh(smin(0.12, ell([0, 0.26, -0.08], [0.25, 0.27, 0.28]), ell([0, 0.12, 0.02], [0.28, 0.14, 0.3])), [-0.45, -0.1, -0.5], [0.45, 0.65, 0.45], 54), or);
  const tail = add(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0, 0.1, -0.3], [0.3, 0.1, -0.42], [0.5, 0.3, -0.35], [0.42, 0.55, -0.3]].map((q) => new THREE.Vector3(...(q as V)))), 30, 0.06, 12), or); void tail;
  for (const s of [-1, 1]) add(g, mesh(ell([0, 0, 0], [0.09, 0.07, 0.12]), [-0.15, -0.15, -0.15], [0.15, 0.15, 0.15], 22), w, [s * 0.13, 0.04, 0.26]);
  const h = new THREE.Group(); h.position.set(0, 0.62, 0.05); g.add(h);
  add(h, mesh(smin(0.1, ell([0, 0, 0], [0.34, 0.28, 0.28]), cap([-0.2, 0.15, 0], [-0.26, 0.35, 0], 0.1, 0.03), cap([0.2, 0.15, 0], [0.26, 0.35, 0], 0.1, 0.03)), [-0.5, -0.4, -0.4], [0.5, 0.5, 0.4], 64), or);
  add(h, mesh(smin(0.05, ell([-0.07, -0.09, 0.25], [0.1, 0.08, 0.07]), ell([0.07, -0.09, 0.25], [0.1, 0.08, 0.07])), [-0.25, -0.25, 0.1], [0.25, 0.05, 0.4], 34), w);
  add(h, new THREE.SphereGeometry(0.036, 16, 12), gloss('#e2777b'), [0, -0.04, 0.325]);
  const pu: THREE.Mesh[] = []; for (const s of [-1, 1]) { const e = add(h, new THREE.SphereGeometry(0.075, 24, 18), gloss('#b9d84c'), [s * 0.14, 0.06, 0.225]); e.scale.set(1, 1.1, 0.6); const p = add(h, new THREE.SphereGeometry(0.045, 18, 14), gloss('#100a06'), [s * 0.14, 0.06, 0.256]); p.scale.set(0.8, 1.15, 0.55); pu.push(p); const k = new THREE.Mesh(new THREE.SphereGeometry(0.015, 10, 8), new THREE.MeshBasicMaterial({color: '#fff'})); k.position.set(s * 0.14 - 0.02, 0.095, 0.285); h.add(k); }
  return {g, h, pu};
}
