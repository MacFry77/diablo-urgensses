import * as THREE from 'three';

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x071217);
scene.fog = new THREE.FogExp2(0x071217, 0.027);

const camera = new THREE.OrthographicCamera(-12, 12, 8, -8, 0.1, 120);
camera.position.set(16, 18, 16);
camera.lookAt(0, 0, 0);

scene.add(new THREE.HemisphereLight(0x9fd6df, 0x172124, 1.8));
const keyLight = new THREE.DirectionalLight(0xfff4d6, 3.1);
keyLight.position.set(5, 14, 8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
keyLight.shadow.camera.left = -18;
keyLight.shadow.camera.right = 18;
keyLight.shadow.camera.top = 18;
keyLight.shadow.camera.bottom = -18;
scene.add(keyLight);

const materials = {
  floor: new THREE.MeshStandardMaterial({ color: 0x78938f, roughness: 0.88 }),
  tile: new THREE.MeshStandardMaterial({ color: 0x91aaa5, roughness: 0.82 }),
  wall: new THREE.MeshStandardMaterial({ color: 0xc6d5cf, roughness: 0.9 }),
  wallDark: new THREE.MeshStandardMaterial({ color: 0x43605f, roughness: 0.95 }),
  red: new THREE.MeshStandardMaterial({ color: 0xb1323a, roughness: 0.7 }),
  teal: new THREE.MeshStandardMaterial({ color: 0x167e82, roughness: 0.68 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x7c8a89, metalness: 0.55, roughness: 0.38 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x9ee8ea, transparent: true, opacity: 0.35, roughness: 0.16 }),
};

const world = new THREE.Group();
scene.add(world);
const blockers = [];

function box(size, position, material, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = options.shadow !== false;
  mesh.receiveShadow = true;
  world.add(mesh);
  if (options.blocker) blockers.push(new THREE.Box2(
    new THREE.Vector2(position[0] - size[0] / 2 - 0.45, position[2] - size[2] / 2 - 0.45),
    new THREE.Vector2(position[0] + size[0] / 2 + 0.45, position[2] + size[2] / 2 + 0.45),
  ));
  return mesh;
}

const floor = box([24, 0.4, 18], [0, -0.2, 0], materials.floor, { shadow: false });
for (let x = -11.5; x < 12; x += 1) {
  for (let z = -8.5; z < 9; z += 1) {
    const tile = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.96), materials.tile);
    tile.rotation.x = -Math.PI / 2;
    tile.position.set(x, 0.015, z);
    tile.receiveShadow = true;
    world.add(tile);
  }
}

box([24, 3.4, 0.35], [0, 1.7, -9], materials.wallDark, { blocker: true });
box([0.35, 3.4, 18], [-12, 1.7, 0], materials.wallDark, { blocker: true });
box([0.35, 3.4, 18], [12, 1.7, 0], materials.wallDark, { blocker: true });
box([5.5, 2.8, 0.3], [-8.8, 1.4, 8.8], materials.wall, { blocker: true });
box([5.5, 2.8, 0.3], [8.8, 1.4, 8.8], materials.wall, { blocker: true });

// Boxes de déchocage, chariots et écrans temporaires en volumes simples.
for (const x of [-7, 0, 7]) {
  box([4.7, 0.85, 2.15], [x, 0.45, -5.8], materials.wall, { blocker: true });
  box([3.8, 0.16, 1.45], [x, 0.95, -5.8], materials.red);
  const screen = box([1.15, 0.82, 0.14], [x + 1.3, 1.85, -6.55], materials.glass);
  screen.rotation.x = -0.08;
  box([0.08, 0.8, 0.08], [x + 1.3, 1.35, -6.5], materials.metal);
}

box([3.7, 1.1, 1.1], [-8.6, 0.56, 3.2], materials.teal, { blocker: true });
box([2.8, 0.18, 0.75], [-8.6, 1.19, 3.2], materials.metal);
box([2.4, 1.45, 0.55], [8.8, 0.72, 4.8], materials.wall, { blocker: true });
box([2.1, 0.08, 0.42], [8.8, 1.49, 4.8], materials.glass);

const sign = box([5.3, 0.12, 0.7], [0, 2.85, -8.77], materials.red, { shadow: false });
sign.rotation.x = Math.PI / 2;

function createMedic() {
  const medic = new THREE.Group();
  const navy = new THREE.MeshStandardMaterial({ color: 0x173d4b, roughness: 0.78 });
  const skin = new THREE.MeshStandardMaterial({ color: 0xc98f68, roughness: 0.85 });
  const white = new THREE.MeshStandardMaterial({ color: 0xe9f2ec, roughness: 0.8 });
  const orange = new THREE.MeshStandardMaterial({ color: 0xef6f33, emissive: 0x401208 });

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.46, 0.85, 5, 10), navy);
  body.position.y = 1.15;
  body.castShadow = true;
  medic.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), skin);
  head.position.y = 2.08;
  head.castShadow = true;
  medic.add(head);
  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.4, 0.5), orange);
  vest.position.set(0, 1.35, 0);
  vest.castShadow = true;
  medic.add(vest);
  const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.28, 0.03), white);
  const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.09, 0.03), white);
  crossV.position.set(0, 1.38, 0.27);
  crossH.position.copy(crossV.position);
  medic.add(crossV, crossH);
  return medic;
}

const player = createMedic();
player.position.set(0, 0, 4.8);
scene.add(player);

const marker = new THREE.Mesh(
  new THREE.RingGeometry(0.28, 0.42, 24),
  new THREE.MeshBasicMaterial({ color: 0x72f0d0, transparent: true, opacity: 0.75, side: THREE.DoubleSide }),
);
marker.rotation.x = -Math.PI / 2;
marker.position.y = 0.035;
marker.visible = false;
scene.add(marker);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const target = new THREE.Vector3().copy(player.position);
const keys = new Set();
let targetActive = false;

function blocked(x, z) {
  if (x < -11.25 || x > 11.25 || z < -8.25 || z > 8.25) return true;
  return blockers.some((b) => b.containsPoint(new THREE.Vector2(x, z)));
}

function setTarget(event) {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObject(floor)[0];
  if (!hit) return;
  target.set(hit.point.x, 0, hit.point.z);
  if (blocked(target.x, target.z)) return;
  targetActive = true;
  marker.position.set(target.x, 0.035, target.z);
  marker.visible = true;
}

canvas.addEventListener('pointerdown', setTarget);
window.addEventListener('keydown', (event) => keys.add(event.key.toLowerCase()));
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));

const clock = new THREE.Clock();
const velocity = new THREE.Vector3();
const move = new THREE.Vector3();
const speed = 4.2;

function updatePlayer(delta) {
  move.set(0, 0, 0);
  if (keys.has('z') || keys.has('w') || keys.has('arrowup')) move.z -= 1;
  if (keys.has('s') || keys.has('arrowdown')) move.z += 1;
  if (keys.has('q') || keys.has('a') || keys.has('arrowleft')) move.x -= 1;
  if (keys.has('d') || keys.has('arrowright')) move.x += 1;

  if (move.lengthSq() > 0) {
    targetActive = false;
    marker.visible = false;
    move.normalize().multiplyScalar(speed);
  } else if (targetActive) {
    move.subVectors(target, player.position).setY(0);
    if (move.length() < 0.12) {
      targetActive = false;
      marker.visible = false;
      move.set(0, 0, 0);
    } else move.normalize().multiplyScalar(speed);
  }

  velocity.lerp(move, 1 - Math.exp(-delta * 12));
  const nextX = player.position.x + velocity.x * delta;
  const nextZ = player.position.z + velocity.z * delta;
  if (!blocked(nextX, player.position.z)) player.position.x = nextX;
  else velocity.x = 0;
  if (!blocked(player.position.x, nextZ)) player.position.z = nextZ;
  else velocity.z = 0;

  if (velocity.lengthSq() > 0.08) {
    player.rotation.y = Math.atan2(velocity.x, velocity.z);
    player.position.y = Math.abs(Math.sin(clock.elapsedTime * 8)) * 0.045;
  } else player.position.y *= 0.82;
}

function resize() {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width === Math.floor(width * renderer.getPixelRatio()) && canvas.height === Math.floor(height * renderer.getPixelRatio())) return;
  renderer.setSize(width, height, false);
  const aspect = width / height;
  const viewHeight = 17;
  camera.left = -viewHeight * aspect / 2;
  camera.right = viewHeight * aspect / 2;
  camera.top = viewHeight / 2;
  camera.bottom = -viewHeight / 2;
  camera.updateProjectionMatrix();
}

function animate() {
  requestAnimationFrame(animate);
  resize();
  const delta = Math.min(clock.getDelta(), 0.04);
  updatePlayer(delta);
  marker.material.opacity = 0.5 + Math.sin(clock.elapsedTime * 5) * 0.25;
  renderer.render(scene, camera);
}

animate();
requestAnimationFrame(() => document.querySelector('#loading').classList.add('hidden'));
