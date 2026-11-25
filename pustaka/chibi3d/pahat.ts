// Memahat bentuk organik dari SDF lalu menjadikannya mesh halus (surface nets).
import * as THREE from 'three';
export type V = [number, number, number];
export type SDF = (x: number, y: number, z: number) => number;
export const ell = (c: V, r: V): SDF => (x, y, z) => {
  const a = (x - c[0]) / r[0], b = (y - c[1]) / r[1], d = (z - c[2]) / r[2];
  const k0 = Math.hypot(a, b, d), k1 = Math.hypot(a / r[0], b / r[1], d / r[2]);
  return k1 < 1e-6 ? -Math.min(...r) : (k0 * (k0 - 1)) / k1;
};
// kapsul dengan jari-jari berbeda di dua ujung
export const cap = (a: V, b: V, ra: number, rb = ra): SDF => {
  const d: V = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = d[0] ** 2 + d[1] ** 2 + d[2] ** 2 || 1;
  return (x, y, z) => {
    const h = Math.max(0, Math.min(1, ((x - a[0]) * d[0] + (y - a[1]) * d[1] + (z - a[2]) * d[2]) / l));
    return Math.hypot(x - a[0] - d[0] * h, y - a[1] - d[1] * h, z - a[2] - d[2] * h) - (ra + (rb - ra) * h);
  };
};
export const smin = (k: number, ...f: SDF[]): SDF => (x, y, z) => {
  let m = f[0](x, y, z);
  for (let i = 1; i < f.length; i++) { const b = f[i](x, y, z), h = Math.max(k - Math.abs(m - b), 0) / k; m = Math.min(m, b) - h * h * k * 0.25; }
  return m;
};
export const smax = (k: number, a: SDF, b: SDF): SDF => (x, y, z) => { const p = a(x, y, z), q = b(x, y, z), h = Math.max(k - Math.abs(p - q), 0) / k; return Math.max(p, q) + h * h * k * 0.25; };
export const off = (f: SDF, o: number): SDF => (x, y, z) => f(x, y, z) - o;
export function mesh(f: SDF, lo: V, hi: V, res: number) {
  const s = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / res;
  const n = [0, 1, 2].map((i) => Math.ceil((hi[i] - lo[i]) / s) + 1), [nx, ny, nz] = n;
  const g = new Float32Array(nx * ny * nz), id = (i: number, j: number, k: number) => i + nx * (j + ny * k);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) g[id(i, j, k)] = f(lo[0] + i * s, lo[1] + j * s, lo[2] + k * s);
  const pos: number[] = [], nor: number[] = [], vi = new Int32Array(nx * ny * nz).fill(-1), idx: number[] = [];
  const E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const c = [0, 1, 2, 3, 4, 5, 6, 7].map((q) => g[id(i + (q & 1), j + ((q >> 1) & 1), k + (q >> 2))]);
    const neg = c.filter((v) => v < 0).length; if (!neg || neg === 8) continue;
    let x = 0, y = 0, z = 0, m = 0;
    for (const [a, b] of E) if (c[a] < 0 !== c[b] < 0) { const t = c[a] / (c[a] - c[b]); x += (a & 1) + t * ((b & 1) - (a & 1)); y += ((a >> 1) & 1) + t * (((b >> 1) & 1) - ((a >> 1) & 1)); z += (a >> 2) + t * ((b >> 2) - (a >> 2)); m++; }
    const px = lo[0] + (i + x / m) * s, py = lo[1] + (j + y / m) * s, pz = lo[2] + (k + z / m) * s, e = s * 0.35;
    const gx = f(px + e, py, pz) - f(px - e, py, pz), gy = f(px, py + e, pz) - f(px, py - e, pz), gz = f(px, py, pz + e) - f(px, py, pz - e), l = Math.hypot(gx, gy, gz) || 1;
    vi[id(i, j, k)] = pos.length / 3; pos.push(px, py, pz); nor.push(gx / l, gy / l, gz / l);
  }
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => { if (Math.min(a, b, c, d) < 0) return; flip ? idx.push(a, c, b, a, d, c) : idx.push(a, b, c, a, c, d); };
  for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
    const v = g[id(i, j, k)] < 0;
    if (v !== g[id(i + 1, j, k)] < 0) quad(vi[id(i, j - 1, k - 1)], vi[id(i, j, k - 1)], vi[id(i, j, k)], vi[id(i, j - 1, k)], !v);
    if (v !== g[id(i, j + 1, k)] < 0) quad(vi[id(i - 1, j, k - 1)], vi[id(i - 1, j, k)], vi[id(i, j, k)], vi[id(i, j, k - 1)], !v);
    if (v !== g[id(i, j, k + 1)] < 0) quad(vi[id(i - 1, j - 1, k)], vi[id(i, j - 1, k)], vi[id(i, j, k)], vi[id(i - 1, j, k)], !v);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); geo.setIndex(idx);
  return geo;
}
