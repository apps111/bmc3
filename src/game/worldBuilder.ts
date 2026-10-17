import * as THREE from 'three';
import { BMC_BLOCKS, LEVEL_CONFIGS } from '../data/bmcData';
import { BMCBlockKey } from '../types/game';
import { ProceduralTextureGenerator } from './proceduralTextures';

export interface WorldCoin {
  mesh: THREE.Mesh;
  initialY: number;
  isCollected: boolean;
  value: number;
}

export interface WorldQuestionBlock {
  group: THREE.Group;
  cubeMesh: THREE.Mesh;
  blockKey: BMCBlockKey;
  questionIndex: number;
  isActivated: boolean;
  initialY: number;
  bumpTime: number;
}

export interface WorldSpringboard {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  bouncePower: number;
}

export interface WorldObstacle {
  group: THREE.Group;
  initialPos: THREE.Vector3;
  patrolRange: number;
  speed: number;
  isDefeated: boolean;
  flattenProgress: number;
  direction: number;
  radius: number;
  name: string;
}

export interface WorldMovingPlatform {
  mesh: THREE.Mesh;
  basePos: THREE.Vector3;
  axis: 'x' | 'y' | 'z';
  amplitude: number;
  speed: number;
  phase: number;
  min: THREE.Vector3;
  max: THREE.Vector3;
  w: number;
  h: number;
  d: number;
  deltaMove: THREE.Vector3;
}

export interface WorldRotatingHazard {
  group: THREE.Group;
  centerPos: THREE.Vector3;
  armMesh: THREE.Mesh;
  length: number;
  speed: number;
  angle: number;
}

export interface WorldRollingBoulder {
  mesh: THREE.Mesh;
  baseZ: number;
  minX: number;
  maxX: number;
  speed: number;
  direction: number;
  radius: number;
}

export interface WorldSpikeHazard {
  group: THREE.Group;
  min: THREE.Vector3;
  max: THREE.Vector3;
  baseY: number;
  timeOffset: number;
}

export interface WorldMissionGate {
  group: THREE.Group;
  blockKey: BMCBlockKey;
  questionIndex: number;
  position: THREE.Vector3;
  radius: number;
  isTriggered: boolean;
  beaconRing: THREE.Mesh;
  glowMesh: THREE.Mesh;
  bannerMesh: THREE.Mesh;
}

export interface PlatformBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
}

export class WorldBuilder {
  public scene: THREE.Scene;
  public platforms: PlatformBox[] = [];
  public movingPlatforms: WorldMovingPlatform[] = [];
  public rotatingHazards: WorldRotatingHazard[] = [];
  public rollingBoulders: WorldRollingBoulder[] = [];
  public spikeHazards: WorldSpikeHazard[] = [];
  public missionGates: WorldMissionGate[] = [];
  public coins: WorldCoin[] = [];
  public questionBlocks: WorldQuestionBlock[] = [];
  public springboards: WorldSpringboard[] = [];
  public obstacles: WorldObstacle[] = [];
  public finishPosition: THREE.Vector3 = new THREE.Vector3(0, 0, -82);

  private dynamicMeshes: THREE.Object3D[] = [];
  private grassMat!: THREE.MeshStandardMaterial;
  private roadMat!: THREE.MeshStandardMaterial;
  private hazardMat!: THREE.MeshStandardMaterial;
  private brickMat!: THREE.MeshStandardMaterial;
  private goldMat!: THREE.MeshStandardMaterial;
  private questionMat!: THREE.MeshStandardMaterial;
  private inactiveBlockMat!: THREE.MeshStandardMaterial;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initMaterials();
    this.loadLevel(1);
  }

  private initMaterials() {
    const grassTex = ProceduralTextureGenerator.createGrassTexture();
    this.grassMat = new THREE.MeshStandardMaterial({
      map: grassTex,
      roughness: 0.85,
      metalness: 0.05
    });

    const roadTex = ProceduralTextureGenerator.createCobblestoneTexture();
    this.roadMat = new THREE.MeshStandardMaterial({
      map: roadTex,
      roughness: 0.7,
      metalness: 0.1
    });

    this.brickMat = new THREE.MeshStandardMaterial({
      color: 0xDC2626,
      roughness: 0.75,
      metalness: 0.15
    });

    // Yellow and black warning hazard material
    const hazardCanvas = document.createElement('canvas');
    hazardCanvas.width = 128;
    hazardCanvas.height = 128;
    const hCtx = hazardCanvas.getContext('2d')!;
    hCtx.fillStyle = '#EAB308';
    hCtx.fillRect(0, 0, 128, 128);
    hCtx.fillStyle = '#0F172A';
    for (let i = -128; i < 256; i += 32) {
      hCtx.beginPath();
      hCtx.moveTo(i, 0);
      hCtx.lineTo(i + 32, 0);
      hCtx.lineTo(i + 32 + 128, 128);
      hCtx.lineTo(i + 128, 128);
      hCtx.fill();
    }
    const hazardTex = new THREE.CanvasTexture(hazardCanvas);
    hazardTex.wrapS = THREE.RepeatWrapping;
    hazardTex.wrapT = THREE.RepeatWrapping;
    hazardTex.repeat.set(4, 1);
    this.hazardMat = new THREE.MeshStandardMaterial({
      map: hazardTex,
      roughness: 0.5,
      metalness: 0.3
    });

    const coinTex = ProceduralTextureGenerator.createCoinTexture();
    this.goldMat = new THREE.MeshStandardMaterial({
      map: coinTex,
      metalness: 0.85,
      roughness: 0.25
    });

    const qTex = ProceduralTextureGenerator.createQuestionBlockTexture();
    this.questionMat = new THREE.MeshStandardMaterial({
      map: qTex,
      metalness: 0.35,
      roughness: 0.3
    });

    const inactTex = ProceduralTextureGenerator.createInactiveBlockTexture();
    this.inactiveBlockMat = new THREE.MeshStandardMaterial({
      map: inactTex,
      metalness: 0.1,
      roughness: 0.85
    });
  }

  public clearLevel() {
    this.dynamicMeshes.forEach(mesh => {
      this.scene.remove(mesh);
    });
    this.dynamicMeshes = [];
    this.platforms = [];
    this.movingPlatforms = [];
    this.rotatingHazards = [];
    this.rollingBoulders = [];
    this.spikeHazards = [];
    this.missionGates = [];
    this.coins = [];
    this.questionBlocks = [];
    this.springboards = [];
    this.obstacles = [];
  }

  public loadLevel(levelNum: 1 | 2 | 3) {
    this.clearLevel();
    const config = LEVEL_CONFIGS[levelNum];

    this.scene.background = new THREE.Color(config.skyColor);
    this.scene.fog = new THREE.Fog(config.skyColor, 35, 170);

    this.buildChallengingTerrain(levelNum);
    this.buildStartGate(levelNum);
    this.buildLevelStationsAndGates(levelNum, config.blocks);
    this.buildMovingPlatforms(levelNum);
    this.buildRotatingHazards(levelNum);
    this.buildRollingBoulders(levelNum);
    this.buildSpikeHazards(levelNum);
    this.buildSpringboards(levelNum);
    this.buildObstacles(levelNum, config.monsterSpeed);
    this.buildCoinsAndCollectibles(levelNum);
    this.buildFoliageAndScenery(levelNum);
    this.buildFinishLine(levelNum);
  }

  private registerMesh(obj: THREE.Object3D) {
    this.dynamicMeshes.push(obj);
    this.scene.add(obj);
    return obj;
  }

  private addPlatform(x: number, y: number, z: number, w: number, h: number, d: number, mat: THREE.Material): THREE.Mesh {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + h / 2, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    this.registerMesh(mesh);

    this.platforms.push({
      min: new THREE.Vector3(x - w / 2, y, z - d / 2),
      max: new THREE.Vector3(x + w / 2, y + h, z + d / 2)
    });

    return mesh;
  }

  // Build segmented terrain with real chasms, floating bridges, elevation tiers, and stepped stones
  private buildChallengingTerrain(levelNum: 1 | 2 | 3) {
    // 1. Starting Plaza (z: 12 to 0)
    this.addPlatform(0, 0, 6, 12, 1.0, 14, this.roadMat);

    // 2. Chasm Gap 1 (z: -1 to -7) -> Stepping Stones & Jump challenges
    this.addPlatform(-2.5, 0.4, -3, 2.8, 0.8, 2.2, this.brickMat);
    this.addPlatform(2.2, 0.8, -5.5, 2.8, 0.8, 2.2, this.brickMat);

    // Stepping pillar in center
    this.addPlatform(0, 0.6, -7.2, 2.4, 0.8, 1.8, this.brickMat);

    // 3. Station 1 Arena (z: -8 to -23)
    this.addPlatform(0, 0.5, -15.5, 11, 1.0, 15, this.roadMat);

    // 4. Chasm Gap 2 (z: -24 to -34) -> Narrow bridges, jump ledges & elevation
    this.addPlatform(-1.8, 0.9, -26.5, 2.4, 0.8, 3.5, this.brickMat);
    this.addPlatform(1.8, 1.3, -31.5, 2.4, 0.8, 3.5, this.brickMat);

    // 5. Station 2 Arena (z: -35 to -49)
    this.addPlatform(0, 1.5, -42, 12, 1.0, 14, this.roadMat);

    // 6. Chasm Gap 3 (z: -50 to -63) -> Stepped Platforms with Springboard
    this.addPlatform(-3.5, 2.2, -53, 3.8, 1.0, 4, this.brickMat);
    this.addPlatform(3.5, 3.0, -58.5, 3.8, 1.0, 4, this.brickMat);
    this.addPlatform(0, 2.6, -62.5, 3.2, 1.0, 3, this.brickMat);

    // 7. Station 3 Arena & Unicorn Finish Gate (z: -64 to -88)
    this.addPlatform(0, 2.2, -76, 14, 1.0, 24, this.roadMat);

    // Deep pit underneath for visual tension
    const lavaMat = new THREE.MeshStandardMaterial({
      color: levelNum === 1 ? 0x1E3A8A : levelNum === 2 ? 0x78350F : 0x4C0519,
      roughness: 0.4
    });
    const bottomPit = new THREE.Mesh(new THREE.PlaneGeometry(100, 160), lavaMat);
    bottomPit.rotation.x = -Math.PI / 2;
    bottomPit.position.set(0, -6.0, -40);
    this.registerMesh(bottomPit);

    // Mountain/Building Boundaries
    const cliffMat = new THREE.MeshStandardMaterial({
      color: levelNum === 1 ? 0x334155 : levelNum === 2 ? 0x1E293B : 0x020617,
      roughness: 0.9
    });

    for (let z = 15; z > -90; z -= 16) {
      const h = 14 + Math.random() * 5;
      const rockL = new THREE.Mesh(new THREE.ConeGeometry(14, h, 6), cliffMat);
      rockL.position.set(-18 - Math.random() * 4, h / 2 - 2, z);
      this.registerMesh(rockL);

      const rockR = new THREE.Mesh(new THREE.ConeGeometry(14, h, 6), cliffMat);
      rockR.position.set(18 + Math.random() * 4, h / 2 - 2, z);
      this.registerMesh(rockR);
    }
  }

  // Dynamic Horizontal / Vertical Moving Platforms over chasms
  private buildMovingPlatforms(levelNum: 1 | 2 | 3) {
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x0284C7,
      metalness: 0.6,
      roughness: 0.2
    });

    // Moving Platform 1 (crossing Chasm 2 at z = -29)
    const p1Geo = new THREE.BoxGeometry(4.2, 0.6, 4.0);
    const p1Mesh = new THREE.Mesh(p1Geo, platMat);
    p1Mesh.castShadow = true;
    p1Mesh.receiveShadow = true;
    this.registerMesh(p1Mesh);

    this.movingPlatforms.push({
      mesh: p1Mesh,
      basePos: new THREE.Vector3(0, 1.3, -29),
      axis: 'x',
      amplitude: 3.2,
      speed: 1.8 + levelNum * 0.4,
      phase: 0,
      min: new THREE.Vector3(),
      max: new THREE.Vector3(),
      w: 4.2,
      h: 0.6,
      d: 4.0,
      deltaMove: new THREE.Vector3()
    });

    // Moving Platform 2 (Vertical elevator between Station 2 and 3 at z = -56)
    const p2Mesh = new THREE.Mesh(p1Geo, platMat);
    p2Mesh.castShadow = true;
    p2Mesh.receiveShadow = true;
    this.registerMesh(p2Mesh);

    this.movingPlatforms.push({
      mesh: p2Mesh,
      basePos: new THREE.Vector3(0, 2.6, -56),
      axis: 'y',
      amplitude: 1.6,
      speed: 2.0 + levelNum * 0.3,
      phase: Math.PI / 2,
      min: new THREE.Vector3(),
      max: new THREE.Vector3(),
      w: 4.2,
      h: 0.6,
      d: 4.0,
      deltaMove: new THREE.Vector3()
    });

    // In Level 2 & 3: Extra high-altitude shifting platform
    if (levelNum >= 2) {
      const p3Mesh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.5, 3.6), platMat);
      p3Mesh.castShadow = true;
      p3Mesh.receiveShadow = true;
      this.registerMesh(p3Mesh);

      this.movingPlatforms.push({
        mesh: p3Mesh,
        basePos: new THREE.Vector3(2.5, 2.0, -4.5),
        axis: 'z',
        amplitude: 1.5,
        speed: 2.2,
        phase: Math.PI / 4,
        min: new THREE.Vector3(),
        max: new THREE.Vector3(),
        w: 3.6,
        h: 0.5,
        d: 3.6,
        deltaMove: new THREE.Vector3()
      });
    }
  }

  // Rotating Hazard Beams that swing across the path (requiring jump or sprint timing)
  private buildRotatingHazards(levelNum: 1 | 2 | 3) {
    const hazardPositions = [
      { x: 0, y: 1.1, z: -17, len: 6.8, speed: 1.6 + levelNum * 0.3 },
      { x: 0, y: 2.1, z: -44, len: 7.2, speed: -(1.8 + levelNum * 0.3) }
    ];

    if (levelNum >= 2) {
      hazardPositions.push({ x: 0, y: 2.8, z: -71, len: 8.0, speed: 2.2 });
    }

    hazardPositions.forEach(hp => {
      const hGroup = new THREE.Group();
      hGroup.position.set(hp.x, hp.y, hp.z);

      // Central pivot pillar
      const centerPillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 1.6, 12),
        new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 })
      );
      hGroup.add(centerPillar);

      // Rotating Crossbar
      const arm = new THREE.Mesh(
        new THREE.BoxGeometry(hp.len, 0.45, 0.45),
        this.hazardMat
      );
      arm.position.y = 0.5;
      arm.castShadow = true;
      hGroup.add(arm);

      this.registerMesh(hGroup);

      this.rotatingHazards.push({
        group: hGroup,
        centerPos: new THREE.Vector3(hp.x, hp.y, hp.z),
        armMesh: arm,
        length: hp.len,
        speed: hp.speed,
        angle: 0
      });
    });
  }

  // Rolling Boulders rolling horizontally across the walkway
  private buildRollingBoulders(levelNum: 1 | 2 | 3) {
    const boulderMat = new THREE.MeshStandardMaterial({
      color: 0x7F1D1D,
      roughness: 0.7,
      metalness: 0.3
    });

    // Boulder 1 at Station 2
    const b1Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), boulderMat);
    b1Mesh.position.set(0, 1.85, -39);
    b1Mesh.castShadow = true;
    this.registerMesh(b1Mesh);

    this.rollingBoulders.push({
      mesh: b1Mesh,
      baseZ: -39,
      minX: -4.5,
      maxX: 4.5,
      speed: 3.5 + levelNum * 0.6,
      direction: 1,
      radius: 0.85
    });

    // Boulder 2 in Level 2 & 3 at Station 3
    if (levelNum >= 2) {
      const b2Mesh = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), boulderMat);
      b2Mesh.position.set(0, 2.7, -68);
      b2Mesh.castShadow = true;
      this.registerMesh(b2Mesh);

      this.rollingBoulders.push({
        mesh: b2Mesh,
        baseZ: -68,
        minX: -4.8,
        maxX: 4.8,
        speed: 4.2,
        direction: -1,
        radius: 0.85
      });
    }
  }

  // Floor Spikes that deal damage if stepped on
  private buildSpikeHazards(levelNum: 1 | 2 | 3) {
    const spikePositions = [
      { x: 0, y: 0.5, z: -12.5, w: 3.2, d: 2.2 },
      { x: 0, y: 1.5, z: -36.5, w: 3.6, d: 2.5 }
    ];

    if (levelNum >= 2) {
      spikePositions.push({ x: 0, y: 2.2, z: -65.5, w: 4.0, d: 2.8 });
    }

    const spikeBaseMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 });
    const spikeConeMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, metalness: 0.6, roughness: 0.2 });

    spikePositions.forEach((sp, idx) => {
      const group = new THREE.Group();
      group.position.set(sp.x, sp.y, sp.z);

      const base = new THREE.Mesh(new THREE.BoxGeometry(sp.w, 0.15, sp.d), spikeBaseMat);
      base.position.y = 0.08;
      group.add(base);

      // Add row of hazard spikes
      const rows = 2;
      const cols = 4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const spike = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 6), spikeConeMat);
          const rx = (c - (cols - 1) / 2) * (sp.w / cols);
          const rz = (r - (rows - 1) / 2) * (sp.d / rows);
          spike.position.set(rx, 0.35, rz);
          group.add(spike);
        }
      }

      this.registerMesh(group);

      this.spikeHazards.push({
        group,
        min: new THREE.Vector3(sp.x - sp.w / 2, sp.y, sp.z - sp.d / 2),
        max: new THREE.Vector3(sp.x + sp.w / 2, sp.y + 0.6, sp.z + sp.d / 2),
        baseY: sp.y,
        timeOffset: idx * 1.5
      });
    });
  }

  private buildStartGate(levelNum: 1 | 2 | 3) {
    const gateGroup = new THREE.Group();
    gateGroup.position.set(0, 0, 10);

    const pillarMat = new THREE.MeshStandardMaterial({
      color: levelNum === 1 ? 0x1E3A8A : levelNum === 2 ? 0xD97706 : 0x7C3AED,
      roughness: 0.3
    });

    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 6, 16), pillarMat);
    p1.position.set(-4.5, 3, 0);
    p1.castShadow = true;
    gateGroup.add(p1);

    const p2 = p1.clone();
    p2.position.set(4.5, 3, 0);
    gateGroup.add(p2);

    const beam = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.9, 1.2), pillarMat);
    beam.position.set(0, 5.8, 0);
    beam.castShadow = true;
    gateGroup.add(beam);

    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 512;
    bannerCanvas.height = 128;
    const bCtx = bannerCanvas.getContext('2d')!;
    bCtx.fillStyle = '#1E293B';
    bCtx.fillRect(0, 0, 512, 128);
    bCtx.fillStyle = '#FFFFFF';
    bCtx.font = 'bold 36px sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText(`LEVEL ${levelNum} - SMK`, 256, 50);
    bCtx.fillStyle = '#F59E0B';
    bCtx.font = '22px sans-serif';
    bCtx.fillText(LEVEL_CONFIGS[levelNum].subtitle, 256, 92);

    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    bannerTex.colorSpace = THREE.SRGBColorSpace;
    const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 2), new THREE.MeshBasicMaterial({ map: bannerTex }));
    bannerMesh.position.set(0, 5.8, 0.65);
    gateGroup.add(bannerMesh);

    this.registerMesh(gateGroup);
  }

  // 3 Station Arenas where solving question unlocks forward milestone
  // Now includes an unavoidable Mission Checkpoint Arch on the track!
  private buildLevelStationsAndGates(levelNum: 1 | 2 | 3, blocks: BMCBlockKey[]) {
    const zPositions = [-16, -42, -70];

    blocks.forEach((key, idx) => {
      const data = BMC_BLOCKS[key];
      const z = zPositions[idx];
      const y = idx === 0 ? 1.0 : idx === 1 ? 2.0 : 2.5;

      const stationGroup = new THREE.Group();
      stationGroup.position.set(0, y, z);

      // Kiosk Monument on the side
      const monument = new THREE.Group();
      monument.position.set(idx % 2 === 0 ? -4.5 : 4.5, 0, 0);

      const baseGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.5, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.25;
      base.receiveShadow = true;
      monument.add(base);

      const colGeo = new THREE.CylinderGeometry(0.25, 0.3, 2.4, 12);
      const colMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(data.color), roughness: 0.3, metalness: 0.4 });
      const column = new THREE.Mesh(colGeo, colMat);
      column.position.y = 1.45;
      column.castShadow = true;
      monument.add(column);

      // Sign Banner
      const signTex = ProceduralTextureGenerator.createStationSignTexture(data.order, data.title, data.color);
      const signGeo = new THREE.PlaneGeometry(2.8, 1.4);
      const sign = new THREE.Mesh(signGeo, new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide }));
      sign.position.set(0, 3.1, 0);
      monument.add(sign);
      stationGroup.add(monument);

      // Mission Gate Arch across the main walkway
      const archMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.color),
        roughness: 0.3,
        metalness: 0.6
      });

      const pLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 3.8, 12), archMat);
      pLeft.position.set(-3.2, 1.9, 0);
      pLeft.castShadow = true;
      stationGroup.add(pLeft);

      const pRight = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 3.8, 12), archMat);
      pRight.position.set(3.2, 1.9, 0);
      pRight.castShadow = true;
      stationGroup.add(pRight);

      const archTop = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.6, 0.6), archMat);
      archTop.position.set(0, 3.8, 0);
      archTop.castShadow = true;
      stationGroup.add(archTop);

      // Mission Title Gate Banner
      const gateBannerCanvas = document.createElement('canvas');
      gateBannerCanvas.width = 512;
      gateBannerCanvas.height = 96;
      const gbCtx = gateBannerCanvas.getContext('2d')!;
      gbCtx.fillStyle = '#0F172A';
      gbCtx.fillRect(0, 0, 512, 96);
      gbCtx.fillStyle = data.color;
      gbCtx.font = 'bold 24px sans-serif';
      gbCtx.textAlign = 'center';
      gbCtx.fillText(`★ MISI ${data.order}: ${data.title.toUpperCase()} ★`, 256, 40);
      gbCtx.fillStyle = '#FFFFFF';
      gbCtx.font = '16px sans-serif';
      gbCtx.fillText('SENTUH GERBANG / SUNDUL [?] UNTUK MENJAWAB SOAL', 256, 74);

      const gbTex = new THREE.CanvasTexture(gateBannerCanvas);
      gbTex.colorSpace = THREE.SRGBColorSpace;
      const bannerMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.0), new THREE.MeshBasicMaterial({ map: gbTex }));
      bannerMesh.position.set(0, 4.5, 0);
      stationGroup.add(bannerMesh);

      // Glowing Beacon Ring on ground across walkway
      const ringGeo = new THREE.RingGeometry(1.6, 2.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(data.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      stationGroup.add(ring);

      // Floating Glow Field
      const glowGeo = new THREE.PlaneGeometry(4.8, 2.5);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(data.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.set(0, 1.8, 0);
      stationGroup.add(glowMesh);

      this.registerMesh(stationGroup);

      // Question Block [?] floating right at center of the track for that milestone
      const qIndex = (levelNum - 1) * 3 + idx;
      this.createQuestionBlock(0, y + 2.4, z, key, qIndex);

      this.missionGates.push({
        group: stationGroup,
        blockKey: key,
        questionIndex: qIndex,
        position: new THREE.Vector3(0, y, z),
        radius: 2.8,
        isTriggered: false,
        beaconRing: ring,
        glowMesh,
        bannerMesh
      });
    });
  }

  private createQuestionBlock(x: number, y: number, z: number, blockKey: BMCBlockKey, questionIndex: number) {
    const qGroup = new THREE.Group();
    qGroup.position.set(x, y, z);

    const geo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cube = new THREE.Mesh(geo, this.questionMat);
    cube.castShadow = true;
    cube.receiveShadow = true;
    qGroup.add(cube);

    const glowGeo = new THREE.BoxGeometry(1.3, 1.3, 1.3);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xFDE047,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    qGroup.add(glow);

    this.registerMesh(qGroup);

    this.questionBlocks.push({
      group: qGroup,
      cubeMesh: cube,
      blockKey,
      questionIndex,
      isActivated: false,
      initialY: y,
      bumpTime: 0
    });
  }

  private buildCoinsAndCollectibles(levelNum: 1 | 2 | 3) {
    const coinGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.1, 20);
    coinGeo.rotateX(Math.PI / 2);

    // Coins placed along jumping gaps, moving platforms, and high ledges
    const coinPlacements = [
      { x: -2.5, y: 1.8, z: -3 },
      { x: 0, y: 2.2, z: -4.5 },
      { x: 2.2, y: 2.0, z: -5.5 },
      { x: 0, y: 1.8, z: -10 },
      { x: 0, y: 1.8, z: -14 },
      { x: 0, y: 3.2, z: -29 },
      { x: -1.8, y: 3.5, z: -29 },
      { x: 1.8, y: 3.5, z: -29 },
      { x: -3.5, y: 3.6, z: -53 },
      { x: 0, y: 4.8, z: -56 },
      { x: 3.5, y: 4.4, z: -58.5 },
      { x: 0, y: 3.8, z: -66 },
      { x: 0, y: 3.6, z: -74 }
    ];

    coinPlacements.forEach((cp) => {
      const coinMesh = new THREE.Mesh(coinGeo, this.goldMat);
      coinMesh.position.set(cp.x, cp.y, cp.z);
      coinMesh.castShadow = true;
      this.registerMesh(coinMesh);

      this.coins.push({
        mesh: coinMesh,
        initialY: cp.y,
        isCollected: false,
        value: 25000 * levelNum
      });
    });
  }

  private buildObstacles(levelNum: 1 | 2 | 3, speed: number) {
    // Patrolling obstacles on the arenas
    const obstacleLocations = [
      { x: 0, y: 0.5, z: -10, range: 4.0, name: 'Hambatan Validasi Pasar' },
      { x: 0, y: 1.5, z: -34, range: 4.5, name: 'Biaya Tak Terduga' },
      { x: 0, y: 2.2, z: -63, range: 5.0, name: 'Kompetitor Agresif' }
    ];

    const bodyMat = new THREE.MeshStandardMaterial({
      color: levelNum === 1 ? 0x881337 : levelNum === 2 ? 0xB45309 : 0x581C87,
      roughness: 0.6
    });

    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    obstacleLocations.forEach(loc => {
      const monGroup = new THREE.Group();
      monGroup.position.set(loc.x, loc.y, loc.z);

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.8, 0.9, 14), bodyMat);
      body.position.y = 0.55;
      body.castShadow = true;
      monGroup.add(body);

      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.75, 14, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), bodyMat);
      cap.position.y = 0.95;
      cap.castShadow = true;
      monGroup.add(cap);

      const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), eyeMat);
      leftEye.position.set(-0.25, 0.8, 0.62);
      const lPupil = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), pupilMat);
      lPupil.position.set(0, 0, 0.09);
      leftEye.add(lPupil);
      monGroup.add(leftEye);

      const rightEye = leftEye.clone();
      rightEye.position.set(0.25, 0.8, 0.62);
      monGroup.add(rightEye);

      this.registerMesh(monGroup);

      this.obstacles.push({
        group: monGroup,
        initialPos: new THREE.Vector3(loc.x, loc.y, loc.z),
        patrolRange: loc.range,
        speed,
        isDefeated: false,
        flattenProgress: 0,
        direction: 1,
        radius: 0.85,
        name: loc.name
      });
    });
  }

  private buildSpringboards(levelNum: 1 | 2 | 3) {
    const padMat = new THREE.MeshStandardMaterial({ color: 0x10B981, roughness: 0.3 });

    // Springboard 1 at start of Chasm 3 (launching over to high platform)
    const pad1 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.3, 16), padMat);
    pad1.position.set(-3.5, 2.35, -53);
    pad1.castShadow = true;
    this.registerMesh(pad1);

    this.springboards.push({
      mesh: pad1,
      position: new THREE.Vector3(-3.5, 2.5, -53),
      bouncePower: 19
    });

    // In Level 2 & 3: Extra booster pad
    if (levelNum >= 2) {
      const pad2 = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, 0.3, 16), padMat);
      pad2.position.set(2.2, 1.0, -5.5);
      pad2.castShadow = true;
      this.registerMesh(pad2);

      this.springboards.push({
        mesh: pad2,
        position: new THREE.Vector3(2.2, 1.2, -5.5),
        bouncePower: 16
      });
    }
  }

  private buildFoliageAndScenery(levelNum: 1 | 2 | 3) {
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.8 });
    const foliageMat = new THREE.MeshStandardMaterial({
      color: levelNum === 1 ? 0x22C55E : levelNum === 2 ? 0xF59E0B : 0xA855F7,
      roughness: 0.7
    });

    for (let z = 15; z > -85; z -= 15) {
      this.createTree(-9 - Math.random() * 4, z, trunkMat, foliageMat);
      this.createTree(9 + Math.random() * 4, z, trunkMat, foliageMat);
    }
  }

  private createTree(x: number, z: number, trunkMat: THREE.Material, foliageMat: THREE.Material) {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(x, 0, z);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 2.5, 8), trunkMat);
    trunk.position.y = 1.25;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    for (let i = 0; i < 3; i++) {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(2.0 - i * 0.45, 1.8, 8), foliageMat);
      cone.position.y = 2.5 + i * 1.1;
      cone.castShadow = true;
      treeGroup.add(cone);
    }

    this.registerMesh(treeGroup);
  }

  private buildFinishLine(levelNum: 1 | 2 | 3) {
    const finishGroup = new THREE.Group();
    finishGroup.position.copy(this.finishPosition);

    const archMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.8, roughness: 0.2 });
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 8, 16), archMat);
    p1.position.set(-4.5, 4, 0);
    p1.castShadow = true;
    finishGroup.add(p1);

    const p2 = p1.clone();
    p2.position.set(4.5, 4, 0);
    finishGroup.add(p2);

    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 1.5), archMat);
    crossbar.position.set(0, 8, 0);
    crossbar.castShadow = true;
    finishGroup.add(crossbar);

    const finCanvas = document.createElement('canvas');
    finCanvas.width = 512;
    finCanvas.height = 128;
    const fc = finCanvas.getContext('2d')!;
    fc.fillStyle = '#1E3A8A';
    fc.fillRect(0, 0, 512, 128);
    fc.fillStyle = '#FFFFFF';
    fc.font = 'bold 30px sans-serif';
    fc.textAlign = 'center';
    fc.fillText(levelNum < 3 ? `GERBANG SELESAI LEVEL ${levelNum}` : 'SENTRA STARTUP UNICORN', 256, 52);
    fc.fillStyle = '#38BDF8';
    fc.font = '20px sans-serif';
    fc.fillText('★ KELULUSAN MISI BISNIS MODEL CANVAS ★', 256, 92);

    const bannerTex = new THREE.CanvasTexture(finCanvas);
    bannerTex.colorSpace = THREE.SRGBColorSpace;
    const banner = new THREE.Mesh(new THREE.PlaneGeometry(9, 2.2), new THREE.MeshBasicMaterial({ map: bannerTex }));
    banner.position.set(0, 8, 0.8);
    finishGroup.add(banner);

    // Victory Flagpole
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.9, roughness: 0.1 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 9, 12), poleMat);
    pole.position.set(0, 4.5, -2.5);
    pole.castShadow = true;
    finishGroup.add(pole);

    const flagMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, side: THREE.DoubleSide });
    const flagGeo = new THREE.BufferGeometry();
    const vertices = new Float32Array([0, 0, 0, 2, -0.6, 0, 0, -1.2, 0]);
    flagGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    flagGeo.computeVertexNormals();
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0, 8.5, -2.5);
    finishGroup.add(flag);

    this.registerMesh(finishGroup);
  }

  public deactivateQuestionBlock(index: number) {
    const qb = this.questionBlocks.find(b => b.questionIndex === index);
    if (qb) {
      qb.isActivated = true;
      qb.cubeMesh.material = this.inactiveBlockMat;
    }
    const gate = this.missionGates.find(g => g.questionIndex === index);
    if (gate) {
      gate.isTriggered = true;
      (gate.beaconRing.material as THREE.MeshBasicMaterial).color.setHex(0x10B981);
      (gate.glowMesh.material as THREE.MeshBasicMaterial).color.setHex(0x10B981);
    }
  }

  // Update animated moving platforms, rotating hazard beams, spike animations, and rolling boulders
  public updateWorldPhysics(dt: number, time: number) {
    // 1. Moving platforms
    for (const mp of this.movingPlatforms) {
      const prevX = mp.mesh.position.x;
      const prevY = mp.mesh.position.y;
      const prevZ = mp.mesh.position.z;

      const offset = Math.sin(time * mp.speed + mp.phase) * mp.amplitude;

      if (mp.axis === 'x') {
        mp.mesh.position.x = mp.basePos.x + offset;
      } else if (mp.axis === 'y') {
        mp.mesh.position.y = mp.basePos.y + offset;
      } else if (mp.axis === 'z') {
        mp.mesh.position.z = mp.basePos.z + offset;
      }

      mp.deltaMove.set(
        mp.mesh.position.x - prevX,
        mp.mesh.position.y - prevY,
        mp.mesh.position.z - prevZ
      );

      // Update collision bounding box
      mp.min.set(
        mp.mesh.position.x - mp.w / 2,
        mp.mesh.position.y - mp.h / 2,
        mp.mesh.position.z - mp.d / 2
      );
      mp.max.set(
        mp.mesh.position.x + mp.w / 2,
        mp.mesh.position.y + mp.h / 2,
        mp.mesh.position.z + mp.d / 2
      );
    }

    // 2. Rotating hazard beams
    for (const rh of this.rotatingHazards) {
      rh.angle += rh.speed * dt;
      rh.armMesh.rotation.y = rh.angle;
    }

    // 3. Rolling boulders
    for (const rb of this.rollingBoulders) {
      rb.mesh.position.x += rb.speed * rb.direction * dt;
      rb.mesh.rotation.z -= rb.speed * rb.direction * dt * 1.5;

      if (rb.mesh.position.x > rb.maxX) {
        rb.direction = -1;
      } else if (rb.mesh.position.x < rb.minX) {
        rb.direction = 1;
      }
    }

    // 4. Mission Gate Beacons pulsing
    for (const mg of this.missionGates) {
      if (!mg.isTriggered) {
        const pulse = 0.6 + Math.sin(time * 3 + mg.position.z) * 0.3;
        (mg.beaconRing.material as THREE.MeshBasicMaterial).opacity = pulse;
      }
    }
  }
}
