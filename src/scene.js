// Exploded-isometric infrastructure model: IoT → edge → Kubernetes → identity → storage.
// One path through it is misconfigured; it ignites red as the visitor scrolls.
import * as THREE from 'three';

const COLORS = {
  ground: 0x0b1114,
  plate: 0x121c20,
  plateEdge: 0x2f4048,
  grid: 0x1b282d,
  bone: 0xd9ddd0,
  steel: 0x8ea2aa,
  link: 0x3a4e56,
  packet: 0xcfd8d2,
  red: 0xff5a47,
};

// deterministic random so the model is the same on every visit
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

const LAYERS = [
  { key: 'iot', y: 0, label: 'edge devices' },
  { key: 'edge', y: 1.7, label: 'edge gateways' },
  { key: 'k8s', y: 3.4, label: 'kubernetes' },
  { key: 'iam', y: 5.1, label: 'identity' },
  { key: 'data', y: 6.8, label: 'storage' },
];

export function createScene(canvas, labelRoot, { mobile, reducedMotion }) {
  const rand = rng(7);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.setClearColor(COLORS.ground, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COLORS.ground, 16, 38);

  const camera = new THREE.PerspectiveCamera(mobile ? 42 : 30, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0xdfe8e4, 0x0b1114, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(6, 12, 8);
  scene.add(key);

  const model = new THREE.Group();
  scene.add(model);

  // plates
  const plateW = mobile ? 7 : 9.5, plateD = mobile ? 5 : 6;
  LAYERS.forEach((L) => {
    const g = new THREE.Group();
    g.position.y = L.y;
    const plate = new THREE.Mesh(
      new THREE.BoxGeometry(plateW, 0.05, plateD),
      new THREE.MeshStandardMaterial({ color: COLORS.plate, roughness: 0.95, metalness: 0, transparent: true, opacity: 0.82 })
    );
    g.add(plate);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(plate.geometry), new THREE.LineBasicMaterial({ color: COLORS.plateEdge }));
    g.add(edges);
    const grid = new THREE.GridHelper(Math.max(plateW, plateD), 16, COLORS.grid, COLORS.grid);
    grid.scale.set(plateW / Math.max(plateW, plateD), 1, plateD / Math.max(plateW, plateD));
    grid.position.y = 0.03;
    g.add(grid);
    model.add(g);
  });

  const nodeMat = new THREE.MeshStandardMaterial({ color: COLORS.bone, roughness: 0.55, metalness: 0.05, flatShading: true });
  const steelMat = new THREE.MeshStandardMaterial({ color: COLORS.steel, roughness: 0.6, metalness: 0.2, flatShading: true });
  const redMat = new THREE.MeshStandardMaterial({ color: COLORS.bone, emissive: COLORS.red, emissiveIntensity: 0, roughness: 0.5, flatShading: true });

  const nodes = { iot: [], edge: [], k8s: [], iam: [], data: [] };
  const place = (layer, mesh, x, z, lift) => {
    mesh.position.set(x, LAYERS.find((l) => l.key === layer).y + lift, z);
    model.add(mesh);
    nodes[layer].push(mesh);
    return mesh;
  };
  const spread = (n, w, d) => Array.from({ length: n }, () => [(rand() - 0.5) * w, (rand() - 0.5) * d]);

  const iotCount = mobile ? 16 : 28;
  const boxG = new THREE.BoxGeometry(0.2, 0.2, 0.2);
  spread(iotCount, plateW - 1, plateD - 1).forEach(([x, z]) => place('iot', new THREE.Mesh(boxG, steelMat), x, z, 0.13));

  const octG = new THREE.OctahedronGeometry(0.34);
  [[-3, -1.2], [-1, 1.4], [1.4, -1.5], [3.2, 1]].forEach(([x, z]) => place('edge', new THREE.Mesh(octG, nodeMat), x * (plateW / 9.5), z, 0.4));

  const podG = new THREE.CylinderGeometry(0.22, 0.22, 0.3, 6);
  [[-2.6, 0], [0.2, -0.6], [2.8, 0.6]].forEach(([cx, cz]) => {
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      place('k8s', new THREE.Mesh(podG, nodeMat), (cx + Math.cos(a) * 0.7) * (plateW / 9.5), cz + Math.sin(a) * 0.7, 0.18);
    }
  });

  const keyG = new THREE.TorusGeometry(0.22, 0.06, 8, 20);
  [[-3, 1.4], [-1, -1.2], [1, 1.2], [2.9, -1.3], [0, 0.1]].forEach(([x, z]) => {
    const m = place('iam', new THREE.Mesh(keyG, nodeMat), x * (plateW / 9.5), z, 0.12);
    m.rotation.x = Math.PI / 2;
  });

  const cylG = new THREE.CylinderGeometry(0.36, 0.36, 0.5, 20);
  [[-2.4, 0.4], [0.3, -0.9], [2.6, 0.8]].forEach(([x, z]) => place('data', new THREE.Mesh(cylG, steelMat), x * (plateW / 9.5), z, 0.28));

  // links between layers
  const nearest = (from, list) => list.reduce((b, n) => (n.position.distanceTo(from.position) < b.position.distanceTo(from.position) ? n : b), list[0]);
  const links = [];
  nodes.iot.forEach((n) => links.push([n, nearest(n, nodes.edge)]));
  nodes.edge.forEach((n, i) => { links.push([n, nodes.k8s[(i * 3) % nodes.k8s.length]]); links.push([n, nodes.k8s[(i * 3 + 5) % nodes.k8s.length]]); });
  nodes.k8s.forEach((n, i) => links.push([n, nodes.iam[i % nodes.iam.length]]));
  nodes.iam.forEach((n, i) => links.push([n, nodes.data[i % nodes.data.length]]));

  // the misconfigured path: one device → gateway → pod → over-permissive role → public bucket
  const redDevice = nearest({ position: new THREE.Vector3(2.5, 0, 1) }, nodes.iot);
  const redEdge = nearest(redDevice, nodes.edge);
  const redPod = nodes.k8s[11];
  const redRole = nodes.iam[3];
  const redBucket = nodes.data[2];
  const redPath = [redDevice, redEdge, redPod, redRole, redBucket];
  [redRole, redBucket].forEach((m) => (m.material = redMat));

  const linkPos = [];
  links.forEach(([a, b]) => linkPos.push(a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z));
  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute('position', new THREE.Float32BufferAttribute(linkPos, 3));
  model.add(new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial({ color: COLORS.link, transparent: true, opacity: 0.7 })));

  const redPos = [];
  for (let i = 0; i < redPath.length - 1; i++) {
    const a = redPath[i].position, b = redPath[i + 1].position;
    redPos.push(a.x, a.y, a.z, b.x, b.y, b.z);
  }
  const redGeo = new THREE.BufferGeometry();
  redGeo.setAttribute('position', new THREE.Float32BufferAttribute(redPos, 3));
  const redLineMat = new THREE.LineBasicMaterial({ color: COLORS.red, transparent: true, opacity: 0 });
  model.add(new THREE.LineSegments(redGeo, redLineMat));

  // packets travelling along links
  const packetCount = reducedMotion ? 0 : mobile ? 60 : 140;
  const packetGeo = new THREE.SphereGeometry(0.045, 8, 6);
  const packets = new THREE.InstancedMesh(packetGeo, new THREE.MeshBasicMaterial({ color: COLORS.packet }), Math.max(packetCount, 1));
  const redPackets = new THREE.InstancedMesh(packetGeo, new THREE.MeshBasicMaterial({ color: COLORS.red, transparent: true, opacity: 0 }), 12);
  model.add(packets, redPackets);
  const pState = Array.from({ length: packetCount }, () => ({ link: links[Math.floor(rand() * links.length)], t: rand(), v: 0.15 + rand() * 0.35 }));
  const rState = Array.from({ length: 12 }, (_, i) => ({ t: i / 12 }));
  const tmp = new THREE.Object3D();

  // labels projected from 3D
  const labels = [
    { node: redRole, text: 'iam-role/ci-deployer', sub: 'Action: "*"  Resource: "*"', red: true },
    { node: redBucket, text: 's3://tenant-uploads', sub: 'acl: public-read', red: true },
    { node: redPod, text: 'pod/agent-pr-4182', sub: 'changed by coding agent', red: true },
    { node: nodes.edge[0], text: 'edge-gw-01' },
    { node: nodes.k8s[0], text: 'ns/payments' },
  ].map((l) => {
    const el = document.createElement('div');
    el.className = 'map-label' + (l.red ? ' is-red' : '');
    el.innerHTML = `<span>${l.text}</span>${l.sub ? `<em>${l.sub}</em>` : ''}`;
    labelRoot.appendChild(el);
    return { ...l, el };
  });

  // camera path: wide isometric view → close on the misconfigured role
  const focusA = new THREE.Vector3(mobile ? 0 : -3.4, 3.4, 0);
  const focusB = redRole.position.clone().add(mobile ? new THREE.Vector3(0, -2.6, 0) : new THREE.Vector3(-3.6, 0.4, 0));
  const camA = mobile ? new THREE.Vector3(10, 11, 16) : new THREE.Vector3(12, 9.5, 14);
  const camB = redRole.position.clone().add(mobile ? new THREE.Vector3(4.5, 5, 10) : new THREE.Vector3(5.5, 4.2, 10.5));

  let progress = 0, ignite = 0, pointerX = 0, pointerY = 0, tiltX = 0, tiltY = 0;
  let running = true, visible = true, raf = 0, last = performance.now(), time = 0;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const look = new THREE.Vector3();
  const v = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(now) {
    const dt = Math.max(0, Math.min((now - last) / 1000, 0.05));
    last = now;
    if (!reducedMotion) time += dt;

    const p = ease(progress);
    camera.position.lerpVectors(camA, camB, p);
    const drift = reducedMotion ? 0 : Math.sin(time * 0.12) * 0.6 * (1 - p);
    camera.position.x += drift;
    look.lerpVectors(focusA, focusB, p);
    tiltX += (pointerX - tiltX) * 0.05;
    tiltY += (pointerY - tiltY) * 0.05;
    model.rotation.y = tiltX * 0.12 + (reducedMotion ? 0 : Math.sin(time * 0.05) * 0.05);
    model.rotation.x = tiltY * 0.04;
    camera.lookAt(look);

    redLineMat.opacity = ignite;
    redMat.emissiveIntensity = ignite * 0.9;
    redPackets.material.opacity = ignite;

    pState.forEach((s, i) => {
      s.t += s.v * dt;
      if (s.t > 1) { s.t = 0; s.link = links[(Math.random() * links.length) | 0]; }
      tmp.position.lerpVectors(s.link[0].position, s.link[1].position, s.t);
      tmp.updateMatrix();
      packets.setMatrixAt(i, tmp.matrix);
    });
    packets.instanceMatrix.needsUpdate = true;

    rState.forEach((s, i) => {
      if (!reducedMotion) s.t = (s.t + dt * 0.12) % 1;
      const seg = Math.min(Math.floor(s.t * (redPath.length - 1)), redPath.length - 2);
      const local = s.t * (redPath.length - 1) - seg;
      tmp.position.lerpVectors(redPath[seg].position, redPath[seg + 1].position, local);
      tmp.updateMatrix();
      redPackets.setMatrixAt(i, tmp.matrix);
    });
    redPackets.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);

    const w = canvas.clientWidth, h = canvas.clientHeight;
    labels.forEach((l) => {
      l.node.getWorldPosition(v);
      v.project(camera);
      const show = l.red ? ignite > 0.5 : progress < 0.35;
      l.el.style.transform = `translate(${(v.x * 0.5 + 0.5) * w}px, ${(-v.y * 0.5 + 0.5) * h}px)`;
      l.el.classList.toggle('on', show && v.z < 1);
    });

    if (running && visible) raf = requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  raf = requestAnimationFrame(frame);

  const kick = () => { if (running && visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };

  return {
    setProgress(p, ig) { progress = p; ignite = ig; if (reducedMotion) { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } },
    setPointer(x, y) { pointerX = x; pointerY = y; },
    setVisible(on) { visible = on; if (!on) { cancelAnimationFrame(raf); raf = 0; } else { raf = 0; kick(); } },
    dispose() {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      labels.forEach((l) => l.el.remove());
      renderer.dispose();
    },
  };
}
