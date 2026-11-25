import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, Composition, continueRender, delayRender, registerRoot, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/examples/jsm/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass.js';
import {clay, makeCat, makeChar} from './tokoh';

function dunia() {
  const s = new THREE.Scene(); s.background = new THREE.Color('#f3d9b8');
  const add = (g: THREE.BufferGeometry, m: THREE.Material, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(0, y, z); o.receiveShadow = true; s.add(o); };
  add(new THREE.BoxGeometry(16, 0.3, 12), clay('#c98a5c'), -0.15); add(new THREE.BoxGeometry(16, 8, 0.3), clay('#f4dfb6'), 3.8, -2.4); add(new THREE.BoxGeometry(16, 1.3, 0.2), clay('#2e8f86'), 0.65, -2.2);
  const a = makeChar({skin: '#c98856', hair: '#2b1a14', top: '#f6b04a', bottom: '#8a4a7a', head: 'sanggul', skirt: true, brow: '#3a2418'});
  const b = makeChar({skin: '#a9683c', hair: '#2a1d18', top: '#3b6fe0', bottom: '#3a3f52', head: 'peci', skirt: false, mustache: true, scale: 1.04});
  a.g.position.x = -0.8; b.g.position.x = 0.8; a.g.rotation.y = 0.35; b.g.rotation.y = -0.35; const cat = makeCat(); cat.g.position.set(0, 0, 1.1); s.add(a.g, b.g, cat.g);
  const key = new THREE.DirectionalLight('#ffe0b5', 2.6); key.position.set(-4.2, 7.2, 6.5); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); Object.assign(key.shadow.camera, {left: -4, right: 4, top: 6, bottom: -3, near: 1, far: 22}); key.shadow.radius = 6; key.shadow.normalBias = 0.03;
  const rim = new THREE.DirectionalLight('#7fd8ff', 1.5); rim.position.set(5, 5, -1.5); s.add(key, rim, new THREE.HemisphereLight('#fff3e0', '#8a5a44', 0.55));
  return {s, a, b, cat};
}
const Contoh: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null), t = useCurrentFrame() / 24, {width: W, height: H} = useVideoConfig();
  const st = useRef<{c: EffectComposer; w: ReturnType<typeof dunia>} | null>(null), [siap, setSiap] = useState(false), [h] = useState(() => delayRender('3D', {timeoutInMilliseconds: 220000}));
  useLayoutEffect(() => {
    const r = new THREE.WebGLRenderer({preserveDrawingBuffer: true}); r.setSize(W, H); r.setPixelRatio(1); r.shadowMap.enabled = true; r.shadowMap.type = THREE.VSMShadowMap; r.toneMapping = THREE.ACESFilmicToneMapping; ref.current!.appendChild(r.domElement);
    const w = dunia(); w.s.environment = new THREE.PMREMGenerator(r).fromScene(new RoomEnvironment(r), 0.04).texture; w.s.traverse((o) => { const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial; if (m && 'envMapIntensity' in m) m.envMapIntensity = 0.3; });
    const cam = new THREE.PerspectiveCamera(27, W / H, 0.5, 60); cam.position.set(0, 2.7, 13); cam.lookAt(0, 1.7, 0);
    const c = new EffectComposer(r, new THREE.WebGLRenderTarget(W, H, {samples: 4, type: THREE.HalfFloatType})); c.setPixelRatio(1); c.setSize(W, H); c.addPass(new RenderPass(w.s, cam)); const ao = new GTAOPass(w.s, cam, W, H); ao.updateGtaoMaterial({radius: 0.35, scale: 1.2, samples: 14} as never); c.addPass(ao); c.addPass(new OutputPass());
    st.current = {c, w}; setSiap(true); continueRender(h);
  }, []);
  useLayoutEffect(() => {
    const q = st.current; if (!q) return; const {a, b, cat} = q.w, bl = (p: number) => (t % p < 0.16 ? Math.sin(((t % p) / 0.16) * Math.PI) : 0);
    a.setArm(0, [-0.3, 0.1, 0.35]); a.setArm(1, [0.5, 0.75 + Math.sin(t * 7) * 0.08, 0.25]); a.face({mouth: Math.sin(t * 12) > 0 ? 'buka' : 'senyum', lx: 0.3, brow: 0.5, blink: bl(3.1)});
    b.setArm(0, [-0.25, 0.12, 0.35]); b.setArm(1, [0.25, 0.12, 0.35]); b.head.rotation.x = Math.max(0, Math.sin(t * 4)) * 0.12; b.face({mouth: 'senyum', lx: -0.3, blink: bl(3.7)}); cat.h.rotation.y = Math.sin(t * 2) * 0.5; q.c.render();
  }, [t, siap]);
  return <AbsoluteFill><div ref={ref} /><Audio src={staticFile('suara.mp3')} /></AbsoluteFill>;
};
registerRoot(() => <Composition id="contoh" component={Contoh} durationInFrames={24 * 6} fps={24} width={720} height={1280} />);
