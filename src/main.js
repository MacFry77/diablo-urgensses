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
  const standard = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.78, flatShading: true, ...extra });
  const navy = standard(0x153c59);
  const navyDark = standard(0x0d2537);
  const skin = standard(0xc98f68, { roughness: 0.86 });
  const white = standard(0xe6e8e3, { roughness: 0.88 });
  const glove = standard(0x35a8b7, { roughness: 0.65 });
  const black = standard(0x172025, { roughness: 0.7 });
  const hair = standard(0x3a251d, { roughness: 0.92 });
  const steel = standard(0xa9bac0, { metalness: 0.5, roughness: 0.36 });
  const cyan = standard(0x45e2dc, { emissive: 0x0b6966, emissiveIntensity: 1.5 });

  function mesh(geometry, material, parent = medic) {
    const item = new THREE.Mesh(geometry, material);
    item.castShadow = true;
    item.receiveShadow = true;
    parent.add(item);
    return item;
  }

  function roundedBox(width, height, depth, radius = 0.08) {
    const halfW = width / 2;
    const halfH = height / 2;
    const shape = new THREE.Shape();
    shape.moveTo(-halfW + radius, -halfH);
    shape.lineTo(halfW - radius, -halfH);
    shape.quadraticCurveTo(halfW, -halfH, halfW, -halfH + radius);
    shape.lineTo(halfW, halfH - radius);
    shape.quadraticCurveTo(halfW, halfH, halfW - radius, halfH);
    shape.lineTo(-halfW + radius, halfH);
    shape.quadraticCurveTo(-halfW, halfH, -halfW, halfH - radius);
    shape.lineTo(-halfW, -halfH + radius);
    shape.quadraticCurveTo(-halfW, -halfH, -halfW + radius, -halfH);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: Math.max(0.02, depth - 0.05),
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      curveSegments: 5,
    });
    geometry.center();
    return geometry;
  }

  const hips = mesh(new THREE.CapsuleGeometry(0.2, 0.32, 6, 12), navyDark);
  hips.rotation.z = Math.PI / 2;
  hips.scale.z = 0.84;
  hips.position.y = 0.94;

  const torso = mesh(new THREE.CylinderGeometry(0.4, 0.34, 0.86, 14), navy);
  torso.scale.z = 0.68;
  torso.position.y = 1.43;

  // Blouse courte ouverte : deux pans avant, dos blanc uni et manches courtes.
  const coatBack = mesh(roundedBox(0.86, 0.82, 0.11, 0.12), white);
  coatBack.position.set(0, 1.43, -0.25);
  const coatLeft = mesh(roundedBox(0.31, 0.81, 0.1, 0.08), white);
  coatLeft.position.set(-0.27, 1.43, 0.25);
  const coatRight = mesh(roundedBox(0.31, 0.81, 0.1, 0.08), white);
  coatRight.position.set(0.27, 1.43, 0.25);
  const coatLeftSide = mesh(roundedBox(0.11, 0.75, 0.43, 0.05), white);
  coatLeftSide.position.set(-0.45, 1.45, 0);
  const coatRightSide = mesh(roundedBox(0.11, 0.75, 0.43, 0.05), white);
  coatRightSide.position.set(0.45, 1.45, 0);
  const coatShoulders = mesh(new THREE.CapsuleGeometry(0.23, 0.52, 6, 14), white);
  coatShoulders.rotation.z = Math.PI / 2;
  coatShoulders.scale.z = 0.82;
  coatShoulders.position.set(0, 1.75, 0);

  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  leftLeg.position.set(-0.21, 0.91, 0);
  rightLeg.position.set(0.21, 0.91, 0);
  medic.add(leftLeg, rightLeg);
  for (const leg of [leftLeg, rightLeg]) {
    const scrubLeg = mesh(new THREE.CapsuleGeometry(0.14, 0.48, 6, 12), navy, leg);
    scrubLeg.position.y = -0.35;
    const shoe = mesh(new THREE.CapsuleGeometry(0.13, 0.2, 5, 10), black, leg);
    shoe.rotation.x = Math.PI / 2;
    shoe.position.set(0, -0.78, 0.08);
  }

  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  leftArm.position.set(-0.52, 1.72, 0);
  rightArm.position.set(0.52, 1.72, 0);
  medic.add(leftArm, rightArm);
  for (const arm of [leftArm, rightArm]) {
    const sleeve = mesh(new THREE.CapsuleGeometry(0.15, 0.08, 5, 12), white, arm);
    sleeve.position.y = -0.12;
    const forearm = mesh(new THREE.CapsuleGeometry(0.095, 0.28, 5, 11), skin, arm);
    forearm.position.y = -0.48;
    const hand = mesh(new THREE.SphereGeometry(0.13, 12, 9), glove, arm);
    hand.scale.set(0.9, 1.15, 0.85);
    hand.position.y = -0.76;
  }
  leftArm.rotation.z = -0.08;
  rightArm.rotation.z = 0.08;

  const neck = mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.22, 12), skin);
  neck.position.y = 1.99;
  const head = mesh(new THREE.SphereGeometry(0.31, 16, 12), skin);
  head.scale.set(0.88, 1.08, 0.92);
  head.position.y = 2.25;
  const hairCap = mesh(new THREE.SphereGeometry(0.3, 14, 7, 0, Math.PI * 2, 0, Math.PI * 0.55), hair);
  hairCap.scale.set(0.9, 0.72, 0.95);
  hairCap.position.set(0, 2.36, -0.015);
  const nose = mesh(new THREE.ConeGeometry(0.04, 0.11, 8), skin);
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 2.25, 0.3);

  const stethoscopeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.17, 1.93, 0.28),
    new THREE.Vector3(-0.22, 1.76, 0.31),
    new THREE.Vector3(0, 1.64, 0.32),
    new THREE.Vector3(0.22, 1.76, 0.31),
    new THREE.Vector3(0.17, 1.93, 0.28),
  ]);
  mesh(new THREE.TubeGeometry(stethoscopeCurve, 18, 0.018, 5, false), black);
  const chestPiece = mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.035, 10), steel);
  chestPiece.rotation.x = Math.PI / 2;
  chestPiece.position.set(0.2, 1.7, 0.34);

  // Brancard-bouclier fixé à l'avant-bras gauche.
  const shield = new THREE.Group();
  shield.position.set(-0.04, -0.55, 0.24);
  shield.rotation.set(-0.12, 0, 0.05);
  leftArm.add(shield);
  const shieldPlate = mesh(new THREE.CapsuleGeometry(0.29, 0.62, 4, 8), white, shield);
  shieldPlate.scale.set(0.72, 1, 0.18);
  shieldPlate.rotation.z = Math.PI / 2;
  const shieldRail = mesh(new THREE.TorusGeometry(0.34, 0.035, 6, 12), steel, shield);
  shieldRail.scale.set(0.76, 1.32, 1);
  shieldRail.rotation.x = Math.PI / 2;

  // Outil de précision thérapeutique, volontairement lumineux et non réaliste.
  const tool = new THREE.Group();
  tool.position.set(0, -0.83, 0.02);
  rightArm.add(tool);
  const handle = mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.3, 7), white, tool);
  handle.position.y = -0.08;
  const blade = mesh(new THREE.ConeGeometry(0.07, 0.28, 5), cyan, tool);
  blade.position.y = -0.36;
  blade.rotation.z = Math.PI;

  medic.userData = { leftLeg, rightLeg, leftArm, rightArm, torso, shield, tool };
  return medic;
}

const player = createMedic();
player.position.set(0, 0, 4.8);
scene.add(player);

function createPatient() {
  const patient = new THREE.Group();
  const gown = new THREE.MeshStandardMaterial({ color: 0x6a3847, roughness: 0.9 });
  const infectedSkin = new THREE.MeshStandardMaterial({ color: 0x91a76a, roughness: 0.9 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 0.8, 5, 10), gown);
  body.position.y = 1.08;
  body.castShadow = true;
  patient.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), infectedSkin);
  head.position.y = 1.93;
  head.castShadow = true;
  patient.add(head);

  const aura = new THREE.Mesh(
    new THREE.RingGeometry(0.58, 0.75, 28),
    new THREE.MeshBasicMaterial({ color: 0xc82d49, transparent: true, opacity: 0.5, side: THREE.DoubleSide }),
  );
  aura.rotation.x = -Math.PI / 2;
  aura.position.y = 0.03;
  patient.add(aura);
  patient.userData = { body, head, aura, crisis: 100, state: 'altered', phase: Math.random() * 10 };
  return patient;
}

const patient = createPatient();
patient.position.set(4.2, 0, 0.5);
scene.add(patient);

const patientStatus = document.querySelector('#patient-status');
const crisisFill = document.querySelector('#crisis-fill');
const crisisLabel = document.querySelector('#crisis-label');
const objectiveText = document.querySelector('.objective');
const stabilizeButton = document.querySelector('#stabilize');
const effects = [];
let stabilizeCooldown = 0;

function updatePatientStatus() {
  const { crisis, state } = patient.userData;
  crisisFill.style.width = `${Math.max(0, crisis)}%`;
  if (state === 'altered') crisisLabel.textContent = `Crise ${Math.max(0, crisis)} %`;
  if (state === 'healed') {
    patientStatus.classList.add('healed');
    patientStatus.querySelector('p').textContent = 'Patient stabilisé';
    crisisLabel.textContent = 'Évacuation en cours';
  }
  if (state === 'gone') patientStatus.classList.add('gone');
}

function healingPulse(origin) {
  const pulse = new THREE.Mesh(
    new THREE.RingGeometry(0.25, 0.38, 32),
    new THREE.MeshBasicMaterial({ color: 0x70f1d0, transparent: true, opacity: 0.95, side: THREE.DoubleSide }),
  );
  pulse.rotation.x = -Math.PI / 2;
  pulse.position.copy(origin).setY(0.08);
  scene.add(pulse);
  effects.push({ mesh: pulse, age: 0 });
}

function stabilize() {
  if (stabilizeCooldown > 0 || patient.userData.state !== 'altered') return;
  const distance = player.position.distanceTo(patient.position);
  if (distance > 3.1) {
    objectiveText.innerHTML = '<span>Hors de portée</span>Approchez-vous du patient';
    return;
  }

  stabilizeCooldown = 0.65;
  stabilizeButton.classList.add('cooldown');
  player.rotation.y = Math.atan2(patient.position.x - player.position.x, patient.position.z - player.position.z);
  patient.userData.crisis -= 34;
  healingPulse(patient.position);

  if (patient.userData.crisis <= 0) {
    patient.userData.crisis = 0;
    patient.userData.state = 'healed';
    patient.userData.body.material.color.setHex(0x6b9ba1);
    patient.userData.head.material.color.setHex(0xc99573);
    patient.userData.aura.material.color.setHex(0x56e6bc);
    objectiveText.innerHTML = '<span>Patient stabilisé</span>Accompagnez son évacuation';
  } else {
    objectiveText.innerHTML = '<span>Stabilisation</span>Continuez le protocole de soin';
  }
  updatePatientStatus();
}

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
window.addEventListener('keydown', (event) => {
  keys.add(event.key.toLowerCase());
  if (event.key === '1' && !event.repeat) stabilize();
});
window.addEventListener('keyup', (event) => keys.delete(event.key.toLowerCase()));
stabilizeButton.addEventListener('click', stabilize);

const clock = new THREE.Clock();
const velocity = new THREE.Vector3();
const move = new THREE.Vector3();
const screenUp = camera.getWorldDirection(new THREE.Vector3()).setY(0).normalize();
const screenRight = new THREE.Vector3().crossVectors(screenUp, camera.up).normalize();
const speed = 4.2;

function updatePlayer(delta) {
  move.set(0, 0, 0);
  const up = keys.has('z') || keys.has('w') || keys.has('arrowup');
  const down = keys.has('s') || keys.has('arrowdown');
  const left = keys.has('q') || keys.has('a') || keys.has('arrowleft');
  const right = keys.has('d') || keys.has('arrowright');
  if (up) move.add(screenUp);
  if (down) move.sub(screenUp);
  if (left) move.sub(screenRight);
  if (right) move.add(screenRight);

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
    const stride = Math.sin(clock.elapsedTime * 8) * 0.48;
    player.userData.leftLeg.rotation.x = stride;
    player.userData.rightLeg.rotation.x = -stride;
    player.userData.leftArm.rotation.x = -stride * 0.45;
    if (stabilizeCooldown === 0) player.userData.rightArm.rotation.x = stride * 0.62;
    player.userData.torso.rotation.z = Math.sin(clock.elapsedTime * 8) * 0.025;
  } else {
    player.position.y *= 0.82;
    player.userData.leftLeg.rotation.x *= 0.76;
    player.userData.rightLeg.rotation.x *= 0.76;
    player.userData.leftArm.rotation.x *= 0.76;
    if (stabilizeCooldown === 0) player.userData.rightArm.rotation.x *= 0.76;
    player.userData.torso.rotation.z *= 0.76;
  }

  if (stabilizeCooldown > 0) {
    const treatmentMotion = Math.sin((0.65 - stabilizeCooldown) / 0.65 * Math.PI);
    player.userData.rightArm.rotation.x = -treatmentMotion * 1.1;
  }
}

function updatePatient(delta) {
  const data = patient.userData;
  data.aura.rotation.z += delta * (data.state === 'altered' ? 1.8 : 0.7);
  data.aura.material.opacity = 0.35 + Math.sin(clock.elapsedTime * 4 + data.phase) * 0.15;

  if (data.state === 'altered') {
    const towardPlayer = new THREE.Vector3().subVectors(player.position, patient.position).setY(0);
    if (towardPlayer.length() > 1.75) {
      towardPlayer.normalize();
      const nextX = patient.position.x + towardPlayer.x * delta * 1.05;
      const nextZ = patient.position.z + towardPlayer.z * delta * 1.05;
      if (!blocked(nextX, patient.position.z)) patient.position.x = nextX;
      if (!blocked(patient.position.x, nextZ)) patient.position.z = nextZ;
      patient.rotation.y = Math.atan2(towardPlayer.x, towardPlayer.z);
      patient.position.y = Math.abs(Math.sin(clock.elapsedTime * 6 + data.phase)) * 0.035;
    }
  }

  if (data.state === 'healed') {
    const exit = new THREE.Vector3(0, 0, 9.8);
    const toExit = exit.sub(patient.position).setY(0);
    if (toExit.length() < 0.35) {
      data.state = 'gone';
      patient.visible = false;
      objectiveText.innerHTML = '<span>Zone sécurisée</span>Patient évacué — mission accomplie';
      updatePatientStatus();
    } else {
      toExit.normalize();
      patient.position.addScaledVector(toExit, delta * 1.7);
      patient.rotation.y = Math.atan2(toExit.x, toExit.z);
      patient.position.y = Math.abs(Math.sin(clock.elapsedTime * 7)) * 0.03;
    }
  }
}

function updateEffects(delta) {
  for (let index = effects.length - 1; index >= 0; index -= 1) {
    const effect = effects[index];
    effect.age += delta;
    effect.mesh.scale.setScalar(1 + effect.age * 5);
    effect.mesh.material.opacity = Math.max(0, 1 - effect.age * 1.5);
    if (effect.age > 0.7) {
      scene.remove(effect.mesh);
      effect.mesh.geometry.dispose();
      effect.mesh.material.dispose();
      effects.splice(index, 1);
    }
  }
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
  updatePatient(delta);
  updateEffects(delta);
  stabilizeCooldown = Math.max(0, stabilizeCooldown - delta);
  if (stabilizeCooldown === 0) stabilizeButton.classList.remove('cooldown');
  marker.material.opacity = 0.5 + Math.sin(clock.elapsedTime * 5) * 0.25;
  renderer.render(scene, camera);
}

animate();
requestAnimationFrame(() => document.querySelector('#loading').classList.add('hidden'));
