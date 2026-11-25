import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

// Sudut derajat; 0 = lurus ke bawah, positif = ke kanan layar. [atas, bawah] per anggota badan.
export type Pose = {lean: number; head: number; aL: [number, number]; aR: [number, number]; lL: [number, number]; lR: [number, number]; dy?: number};
export const POSES: Record<string, Pose> = {
  diam: {lean: 0, head: 0, aL: [-18, -8], aR: [18, 8], lL: [-10, -4], lR: [10, 4]},
  jelas: {lean: 4, head: 6, aL: [-25, -40], aR: [75, 140], lL: [-12, -4], lR: [12, 4]},
  tunjuk: {lean: 8, head: 8, aL: [-20, -10], aR: [92, 96], lL: [-16, -6], lR: [16, 6]},
  kaget: {lean: -10, head: -14, aL: [-120, -165], aR: [120, 165], lL: [-26, -8], lR: [26, 8], dy: -26},
  pikir: {lean: 3, head: 12, aL: [-22, 62], aR: [34, 168], lL: [-9, -3], lR: [9, 3]},
  lemas: {lean: 18, head: 34, aL: [2, 4], aR: [14, 10], lL: [-12, 10], lR: [10, 24], dy: 14},
  girang: {lean: 0, head: -4, aL: [-118, -160], aR: [118, 160], lL: [-34, 24], lR: [34, -24], dy: -60},
};
export type Key = {f: number; pose: keyof typeof POSES};
export type Mood = 'biasa' | 'senang' | 'kaget' | 'datar' | 'sedih';
const mix = (a: Pose, b: Pose, k: number): Pose => {
  const m = (x: number, y: number) => x + (y - x) * k, p = (x: [number, number], y: [number, number]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  return {lean: m(a.lean, b.lean), head: m(a.head, b.head), aL: p(a.aL, b.aL), aR: p(a.aR, b.aR), lL: p(a.lL, b.lL), lR: p(a.lR, b.lR), dy: m(a.dy || 0, b.dy || 0)};
};
const pt = (x: number, y: number, deg: number, len: number): [number, number] => [x + Math.sin((deg * Math.PI) / 180) * len, y + Math.cos((deg * Math.PI) / 180) * len];

export const Stickman: React.FC<{x: number; y: number; s?: number; keys: Key[]; mood?: Mood; talking?: boolean; accent?: string; ink?: string; paper?: string; walk?: boolean; flip?: boolean}> = ({
  x, y, s = 1, keys, mood = 'biasa', talking, accent = '#ff6a3d', ink = '#1c2230', paper = '#fffdf6', walk, flip}) => {
  const f = useCurrentFrame();
  let i = 0;
  keys.forEach((k, n) => { if (f >= k.f) i = n; });
  const prev = POSES[keys[Math.max(0, i - 1)].pose], cur = POSES[keys[i].pose];
  // ganti pose cepat dengan sedikit lewat batas, agar terasa hidup
  const k = i === 0 ? 1 : interpolate(f - keys[i].f, [0, 9], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2.2))});
  const P = mix(prev, cur, k);
  if (walk) { const w = Math.sin(f * 0.35) * 32; P.lL = [w, w - 14]; P.lR = [-w, -w - 14]; P.aL = [-w, -w + 20]; P.aR = [w, w + 20]; }
  const br = Math.sin(f * 0.11) * 2.5, hip: [number, number] = [0, (P.dy || 0)];
  const neck: [number, number] = [hip[0] + Math.sin((P.lean * Math.PI) / 180) * 120, hip[1] - Math.cos((P.lean * Math.PI) / 180) * 120 + br];
  const hd: [number, number] = [neck[0] + Math.sin((P.head * Math.PI) / 180) * 62, neck[1] - Math.cos((P.head * Math.PI) / 180) * 62];
  const limb = (o: [number, number], a: [number, number], l: number) => { const m = pt(o[0], o[1], a[0], l), e = pt(m[0], m[1], a[1], l); return {d: `M${o} L${m} L${e}`, e}; };
  const sh: [number, number] = [neck[0], neck[1] + 14];
  const L = [limb(hip, P.lL, 72), limb(hip, P.lR, 72)], A = [limb(sh, P.aL, 60), limb(sh, P.aR, 60)];
  const blink = f % 96 < 4, open = talking && Math.floor(f / 4) % 2 === 0, ey = mood === 'kaget' ? 13 : 9;
  return (
    <g transform={`translate(${x} ${y - 150 * s}) scale(${flip ? -s : s} ${s})`} fill="none" stroke={ink} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx={0} cy={150} rx={Math.max(40, 84 + (P.dy || 0) * 0.6)} ry={11} fill={ink} opacity={0.13} stroke="none" />
      {L.map((l, n) => <path key={n} d={l.d} />)}
      <path d={`M${hip} L${neck}`} />
      {A.map((a, n) => <g key={n}><path d={a.d} /><circle cx={a.e[0]} cy={a.e[1]} r={10} fill={ink} stroke="none" /></g>)}
      {/* syal: ciri khas tokoh, warnanya membedakan orang */}
      <path d={`M${neck[0] - 17},${neck[1]} Q${neck[0]},${neck[1] + 15} ${neck[0] + 17},${neck[1]}`} stroke={accent} strokeWidth={20} />
      <path d={`M${neck[0] - 14},${neck[1] + 5} q-22,${14 + Math.sin(f * 0.16) * 7} -42,${6 + Math.sin(f * 0.16 + 1) * 11}`} stroke={accent} strokeWidth={14} />
      <g transform={`translate(${hd}) rotate(${P.head})`}>
        <circle r={54} fill={paper} />
        {blink ? <path d="M-23,-4 h14 M9,-4 h14" strokeWidth={7} /> : <><ellipse cx={-16} cy={-5} rx={7} ry={ey} fill={ink} stroke="none" /><ellipse cx={18} cy={-5} rx={7} ry={ey} fill={ink} stroke="none" /></>}
        {mood === 'sedih' && <path d="M-28,-22 l16,-7 M30,-22 l-16,-7" strokeWidth={6} />}
        {mood === 'kaget' && <path d="M-26,-30 h16 M10,-30 h16" strokeWidth={6} />}
        {open || mood === 'kaget' ? <ellipse cx={1} cy={23} rx={10} ry={mood === 'kaget' ? 13 : 9} fill={ink} stroke="none" />
          : <path d={mood === 'senang' ? 'M-16,17 q17,19 34,0' : mood === 'sedih' ? 'M-14,28 q15,-14 30,0' : mood === 'datar' ? 'M-13,23 h28' : 'M-11,20 q12,8 24,0'} strokeWidth={7} />}
      </g>
    </g>
  );
};
