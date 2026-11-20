// A conference-style ID badge hanging from a lanyard. Drag it; it swings back.
// Idea from React Bits "Lanyard"; rebuilt here with a badge drawn in code.
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

const BLUE = '#2a4bff';
const LIME = '#b7de57';
const INK = '#0d0f14';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Draws the badge faces onto canvases once the photo and fonts are ready.
function useBadgeTextures(photoUrl) {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    let alive = true;
    const img = new Image();
    img.src = photoUrl;
    Promise.all([img.decode().catch(() => null), document.fonts?.ready]).then(() => {
      if (!alive) return;
      const W = 640, H = 900;
      const front = document.createElement('canvas');
      front.width = W; front.height = H;
      const c = front.getContext('2d');
      c.fillStyle = LIME; c.fillRect(0, 0, W, H);
      // header band
      c.fillStyle = INK; c.fillRect(0, 0, W, 150);
      c.fillStyle = LIME; c.font = '600 34px "Geist Mono", monospace';
      c.fillText('CLOUD · DEVOPS · SECURITY', 48, 70);
      c.fillStyle = '#ffffff'; c.font = '400 26px "Geist Mono", monospace';
      c.fillText('MUMBAI, INDIA', 48, 112);
      // slot hole
      c.fillStyle = LIME; roundRect(c, W / 2 - 60, 22, 120, 22, 11); c.fill();
      // photo
      if (img.complete && img.naturalWidth) {
        c.save(); c.beginPath(); c.arc(W / 2, 360, 150, 0, Math.PI * 2); c.clip();
        c.drawImage(img, W / 2 - 150, 210, 300, 300); c.restore();
        c.lineWidth = 8; c.strokeStyle = INK; c.beginPath(); c.arc(W / 2, 360, 154, 0, Math.PI * 2); c.stroke();
      }
      c.fillStyle = INK; c.textAlign = 'center';
      c.font = '800 76px "Bricolage Grotesque", sans-serif';
      c.fillText('Abhishek', W / 2, 610);
      c.fillText('Tiwari', W / 2, 686);
      c.font = '500 30px "Geist", sans-serif';
      c.fillText('Cloud & edge systems security', W / 2, 742);
      // footer
      c.fillStyle = INK; c.fillRect(0, 790, W, 110);
      c.fillStyle = LIME; c.font = '500 28px "Geist Mono", monospace';
      c.fillText('abhishek572003.github.io', W / 2, 856);

      const back = document.createElement('canvas');
      back.width = W; back.height = H;
      const b = back.getContext('2d');
      b.fillStyle = BLUE; b.fillRect(0, 0, W, H);
      b.fillStyle = LIME; b.textAlign = 'center';
      b.font = '800 120px "Bricolage Grotesque", sans-serif';
      b.fillText('AT', W / 2, 420);
      b.fillStyle = '#ffffff'; b.font = '500 30px "Geist Mono", monospace';
      b.fillText('MUMBAI → ?', W / 2, 500);
      b.font = '400 24px "Geist Mono", monospace';
      b.fillText('if found, email', W / 2, 760);
      b.fillText('abhishekst5703@gmail.com', W / 2, 800);

      const band = document.createElement('canvas');
      band.width = 1024; band.height = 64;
      const d = band.getContext('2d');
      d.fillStyle = INK; d.fillRect(0, 0, 1024, 64);
      d.fillStyle = LIME; d.font = '600 30px "Geist Mono", monospace'; d.textBaseline = 'middle';
      d.fillText('ABHISHEK TIWARI  ✳  CLOUD · DEVOPS · SECURITY  ✳', 16, 34);

      const mk = (cv) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
      const bandTex = mk(band); bandTex.wrapS = bandTex.wrapT = THREE.RepeatWrapping;
      setTex({ front: mk(front), back: mk(back), band: bandTex });
    });
    return () => { alive = false; };
  }, [photoUrl]);
  return tex;
}

function Band({ tex, onSettled }) {
  const frames = useRef(0);
  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const seg = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 };
  const { width, height } = useThree((s) => s.size);
  const [curve] = useState(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]));
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    if (!hovered) return;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (frames.current < 90 && ++frames.current === 90) onSettled?.();
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current) {
      [j1, j2].forEach((r) => {
        if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation());
        const k = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
        r.current.lerped.lerp(r.current.translation(), Math.min(1, delta * (10 + k * 40)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';

  return (
    <>
      <group position={[0, 4.2, 0]}>
        <RigidBody ref={fixed} {...seg} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...seg}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...seg}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...seg}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...seg} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => { e.target.releasePointerCapture(e.pointerId); drag(false); }}
            onPointerDown={(e) => { e.target.setPointerCapture(e.pointerId); drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation()))); }}
          >
            <mesh>
              <boxGeometry args={[1.6, 2.25, 0.02]} />
              <meshStandardMaterial color={LIME} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0, 0.011]}>
              <planeGeometry args={[1.6, 2.25]} />
              <meshBasicMaterial map={tex.front} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[1.6, 2.25]} />
              <meshBasicMaterial map={tex.back} toneMapped={false} />
            </mesh>
            <mesh position={[0, 1.22, 0]}>
              <boxGeometry args={[0.28, 0.16, 0.06]} />
              <meshStandardMaterial color="#c9ccd2" metalness={0.9} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial toneMapped={false} color="white" depthTest={false} resolution={[width, height]} useMap map={tex.band} repeat={[-3, 1]} lineWidth={1} />
      </mesh>
    </>
  );
}

export default function Lanyard({ photo, onReady }) {
  const tex = useBadgeTextures(photo);
  
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }} gl={{ alpha: true, antialias: true }} dpr={[1, 2]} style={{ background: 'transparent' }}>
      <ambientLight intensity={1.1} />
      {tex && (
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band tex={tex} onSettled={onReady} />
        </Physics>
      )}
      <Environment blur={0.75}>
        <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
        <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
      </Environment>
    </Canvas>
  );
}
