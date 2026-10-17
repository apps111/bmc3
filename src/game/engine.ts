import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { sounds } from '../audio/soundEffects';
import { BMCBlockKey, PlayerStats } from '../types/game';
import { LEVEL_CONFIGS } from '../data/bmcData';
import { CharacterAnimationState, CharacterController } from './character';
import { WorldBuilder } from './worldBuilder';

const _tempVec3 = new THREE.Vector3();
const _moveDir = new THREE.Vector3();
const _camForward = new THREE.Vector3();
const _camRight = new THREE.Vector3();
const _playerBox = new THREE.Box3();
const _platformBox = new THREE.Box3();

export interface GameEngineCallbacks {
  onQuestionTrigger: (blockKey: BMCBlockKey, questionIndex: number) => void;
  onStatsUpdate: (stats: PlayerStats) => void;
  onLevelComplete: (completedLevel: 1 | 2 | 3, nextLevel: 2 | 3 | null) => void;
  onVictory: (finalStats: PlayerStats) => void;
  onGameOver: (reason: 'health' | 'timeout') => void;
}

export class GameEngine {
  private container: HTMLElement;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private clock: THREE.Clock = new THREE.Clock();
  private resizeObserver: ResizeObserver | null = null;

  public world!: WorldBuilder;
  public character!: CharacterController;

  private playerPos: THREE.Vector3 = new THREE.Vector3(0, 0.5, 6);
  private playerVel: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private isGrounded: boolean = true;
  private coyoteTimer: number = 0;
  private jumpBufferTimer: number = 0;
  private invulnerableTimer: number = 0;
  private cameraAngle: number = 0;
  private cameraPitch: number = 0.28;
  private cameraShake: number = 0;
  private lastSafeCheckpoint: THREE.Vector3 = new THREE.Vector3(0, 1.2, 4);

  private keys: Record<string, boolean> = {};
  public virtualInput = {
    moveX: 0,
    moveZ: 0,
    jump: false,
    sprint: false
  };

  public stats: PlayerStats = {
    cash: 100000,
    health: 3,
    maxHealth: 3,
    currentLevel: 1,
    unlockedBlocks: new Set<BMCBlockKey>(),
    coinsCollected: 0,
    timeRemaining: LEVEL_CONFIGS[1].timeLimit,
    totalTimeElapsed: 0,
    currentStreak: 0,
    grade: 'Pemula',
    correctAnswersCount: 0,
    totalAnswerAttempts: 0,
    softSkills: {
      problemSolving: 80,
      timeManagement: 85,
      decisionMaking: 80,
      entrepreneurialMindset: 85
    }
  };

  private callbacks: GameEngineCallbacks;
  private isPaused: boolean = false;
  private isFinished: boolean = false;

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.initThree();
    this.setupInputs();
    this.startLoop();
  }

  private initThree() {
    this.scene = new THREE.Scene();
    const config = LEVEL_CONFIGS[1];
    this.scene.background = new THREE.Color(config.skyColor);
    this.scene.fog = new THREE.Fog(config.skyColor, 35, 170);

    const w = this.container.clientWidth || 1280;
    const h = this.container.clientHeight || 720;
    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
    this.camera.position.set(0, 5, 16);

    const isHeadless = navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent);
    this.renderer = new THREE.WebGLRenderer({ antialias: !isHeadless, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = !isHeadless;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.appendChild(this.renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const sunLight = new THREE.DirectionalLight(0xFFFBEB, 1.6);
    sunLight.position.set(25, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    this.scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x93C5FD, 0x1E293B, 0.7);
    this.scene.add(hemiLight);

    this.world = new WorldBuilder(this.scene);
    this.character = new CharacterController();
    this.character.group.position.copy(this.playerPos);
    this.scene.add(this.character.group);

    this.renderer.compile(this.scene, this.camera);

    // ResizeObserver ensures 16:9 container aspect ratio is tracked with zero lag
    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this.resizeObserver.observe(this.container);
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private setupInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (e.code === 'Space') {
        this.jumpBufferTimer = 0.15;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    this.container.addEventListener('mousedown', (e) => {
      if (e.button === 0 || e.button === 2) {
        isMouseDown = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      this.cameraAngle -= dx * 0.006;
      this.cameraPitch = THREE.MathUtils.clamp(this.cameraPitch - dy * 0.005, 0.08, 0.85);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    this.container.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  public rotateCameraBy(deltaAngle: number) {
    this.cameraAngle += deltaAngle;
  }

  public resetCamera() {
    this.cameraAngle = 0;
    this.cameraPitch = 0.28;
  }

  public pause() {
    this.isPaused = true;
  }

  public resume() {
    this.isPaused = false;
    this.clock.getDelta();
  }

  private startLoop() {
    const loop = () => {
      this.animationFrameId = requestAnimationFrame(loop);
      const rawDt = this.clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      if (!this.isPaused) {
        this.update(dt);
      }
      this.render();
    };
    loop();
  }

  private update(dt: number) {
    if (this.isFinished) return;

    this.stats.totalTimeElapsed += dt;
    this.stats.timeRemaining -= dt;

    if (this.stats.timeRemaining <= 0) {
      this.stats.timeRemaining = 0;
      this.isFinished = true;
      sounds.playWrong();
      this.callbacks.onGameOver('timeout');
      return;
    }

    // 1. Update dynamic world physics (moving platforms, rotating hazard crossbars, rolling boulders)
    this.world.updateWorldPhysics(dt, this.stats.totalTimeElapsed);

    // 2. Process player input
    let rawX = 0;
    let rawZ = 0;

    if (this.keys['KeyW'] || this.keys['ArrowUp']) rawZ -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) rawZ += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) rawX -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) rawX += 1;

    if (this.virtualInput.moveX !== 0 || this.virtualInput.moveZ !== 0) {
      rawX = this.virtualInput.moveX;
      rawZ = this.virtualInput.moveZ;
    }

    const isSprinting = Boolean(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.virtualInput.sprint);
    const speed = isSprinting ? 12.0 : 7.5;

    _camForward.set(Math.sin(this.cameraAngle), 0, Math.cos(this.cameraAngle)).normalize();
    _camRight.set(-Math.cos(this.cameraAngle), 0, Math.sin(this.cameraAngle)).normalize();

    _moveDir.set(0, 0, 0);
    _moveDir.addScaledVector(_camRight, rawX);
    _moveDir.addScaledVector(_camForward, -rawZ);

    const isMoving = _moveDir.lengthSq() > 0.01;
    if (isMoving) {
      _moveDir.normalize();
      this.playerVel.x = _moveDir.x * speed;
      this.playerVel.z = _moveDir.z * speed;

      const targetAngle = Math.atan2(_moveDir.x, _moveDir.z);
      const curRotY = this.character.group.rotation.y;
      const diff = Math.atan2(Math.sin(targetAngle - curRotY), Math.cos(targetAngle - curRotY));
      this.character.group.rotation.y += diff * Math.min(dt * 15, 1);
    } else {
      this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, 0, 15, dt);
      this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, 0, 15, dt);
    }

    // 3. Gravity and Jumping
    const gravity = -30;
    this.playerVel.y += gravity * dt;

    if (this.isGrounded) {
      this.coyoteTimer = 0.12;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }

    this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - dt);

    const wantsToJump = Boolean(this.jumpBufferTimer > 0 || this.virtualInput.jump);
    if (wantsToJump && this.coyoteTimer > 0) {
      this.playerVel.y = 12.5;
      this.isGrounded = false;
      this.coyoteTimer = 0;
      this.jumpBufferTimer = 0;
      this.virtualInput.jump = false;
      this.character.triggerJumpStretch();
      sounds.playJump();
    }

    // 4. Move player and handle platform collisions (both static & moving platforms)
    const prevPos = this.playerPos.clone();
    this.playerPos.x += this.playerVel.x * dt;
    this.playerPos.y += this.playerVel.y * dt;
    this.playerPos.z += this.playerVel.z * dt;

    this.handlePlatformCollisions(prevPos);
    this.handleMovingPlatformCollisions(prevPos);
    this.handleSpringboards();
    this.handleRotatingHazardCollisions();
    this.handleRollingBoulderCollisions();
    this.handleSpikeHazards();
    this.handleMissionGates();
    this.handleQuestionBlocks();
    this.handleCoins(dt);
    this.handleObstacles(dt);

    // Update safe checkpoint along Z progress
    if (this.playerPos.z < -66) {
      this.lastSafeCheckpoint.set(0, 2.5, -67);
    } else if (this.playerPos.z < -38) {
      this.lastSafeCheckpoint.set(0, 2.0, -39);
    } else if (this.playerPos.z < -12) {
      this.lastSafeCheckpoint.set(0, 1.2, -13);
    }

    // 5. Finish Check (finish line at z <= -78)
    if (this.playerPos.z <= -78 && !this.isFinished) {
      const currentLevelBlocks = LEVEL_CONFIGS[this.stats.currentLevel].blocks;
      const missingBlock = currentLevelBlocks.find(b => !this.stats.unlockedBlocks.has(b));
      if (missingBlock) {
        this.playerPos.z = -75;
        this.playerVel.set(0, 0, 0);
        const qIndex = (this.stats.currentLevel - 1) * 3 + currentLevelBlocks.indexOf(missingBlock);
        this.callbacks.onQuestionTrigger(missingBlock, qIndex);
      } else {
        this.handleReachFinish();
      }
    }

    // 6. Deep Chasm fall safety with checkpoint respawn and life deduction
    if (this.playerPos.y < -4.5) {
      this.playerVel.set(0, 0, 0);
      this.stats.health -= 1;
      sounds.playWrong();
      this.triggerCameraShake(0.5);
      this.callbacks.onStatsUpdate(this.stats);

      if (this.stats.health <= 0) {
        this.callbacks.onGameOver('health');
        return;
      }

      this.playerPos.copy(this.lastSafeCheckpoint);
      this.character.group.position.copy(this.playerPos);
      this.invulnerableTimer = 1.5;
    }

    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer -= dt;
      this.character.group.visible = Math.floor(this.invulnerableTimer * 10) % 2 === 0;
    } else {
      this.character.group.visible = true;
    }

    // 7. Update Character Visuals
    this.character.group.position.copy(this.playerPos);
    const animState: CharacterAnimationState = {
      isMoving,
      isGrounded: this.isGrounded,
      isSprinting,
      speed: Math.sqrt(this.playerVel.x ** 2 + this.playerVel.z ** 2),
      verticalVelocity: this.playerVel.y
    };
    this.character.update(dt, animState);

    // 8. Dynamic Camera Tracking with smooth damping & shake
    if (this.cameraShake > 0) {
      this.cameraShake = Math.max(0, this.cameraShake - dt * 2);
    }
    const shakeX = (Math.random() - 0.5) * this.cameraShake * 0.8;
    const shakeY = (Math.random() - 0.5) * this.cameraShake * 0.8;

    const camDist = 9.5;
    const camH = 3.8 + this.cameraPitch * 6.5;
    const targetCamX = this.playerPos.x - Math.sin(this.cameraAngle) * camDist + shakeX;
    const targetCamZ = this.playerPos.z - Math.cos(this.cameraAngle) * camDist;
    const targetCamY = this.playerPos.y + camH + shakeY;

    this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 10, dt);
    this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 8, dt);
    this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 10, dt);

    _tempVec3.set(this.playerPos.x, this.playerPos.y + 1.2, this.playerPos.z);
    this.camera.lookAt(_tempVec3);

    this.callbacks.onStatsUpdate(this.stats);
  }

  private triggerCameraShake(intensity: number) {
    this.cameraShake = intensity;
  }

  private handlePlatformCollisions(prevPos: THREE.Vector3) {
    const playerRadius = 0.45;
    const playerHeight = 1.7;

    _playerBox.min.set(this.playerPos.x - playerRadius, this.playerPos.y, this.playerPos.z - playerRadius);
    _playerBox.max.set(this.playerPos.x + playerRadius, this.playerPos.y + playerHeight, this.playerPos.z + playerRadius);

    this.isGrounded = false;

    for (const plat of this.world.platforms) {
      _platformBox.min.copy(plat.min);
      _platformBox.max.copy(plat.max);

      if (_playerBox.intersectsBox(_platformBox)) {
        if (prevPos.y >= plat.max.y - 0.25 && this.playerVel.y <= 0) {
          this.playerPos.y = plat.max.y;
          this.playerVel.y = 0;
          this.isGrounded = true;
          _playerBox.min.y = this.playerPos.y;
          _playerBox.max.y = this.playerPos.y + playerHeight;
        } else {
          const overlapX1 = this.playerPos.x + playerRadius - plat.min.x;
          const overlapX2 = plat.max.x - (this.playerPos.x - playerRadius);
          const overlapZ1 = this.playerPos.z + playerRadius - plat.min.z;
          const overlapZ2 = plat.max.z - (this.playerPos.z - playerRadius);

          const minOverlap = Math.min(overlapX1, overlapX2, overlapZ1, overlapZ2);

          if (minOverlap === overlapX1) this.playerPos.x = plat.min.x - playerRadius;
          else if (minOverlap === overlapX2) this.playerPos.x = plat.max.x + playerRadius;
          else if (minOverlap === overlapZ1) this.playerPos.z = plat.min.z - playerRadius;
          else if (minOverlap === overlapZ2) this.playerPos.z = plat.max.z + playerRadius;
        }
      }
    }
  }

  // Handle player riding moving elevators/platforms
  private handleMovingPlatformCollisions(prevPos: THREE.Vector3) {
    const playerRadius = 0.45;
    const playerHeight = 1.7;

    _playerBox.min.set(this.playerPos.x - playerRadius, this.playerPos.y, this.playerPos.z - playerRadius);
    _playerBox.max.set(this.playerPos.x + playerRadius, this.playerPos.y + playerHeight, this.playerPos.z + playerRadius);

    for (const mp of this.world.movingPlatforms) {
      _platformBox.min.copy(mp.min);
      _platformBox.max.copy(mp.max);

      if (_playerBox.intersectsBox(_platformBox)) {
        if (prevPos.y >= mp.max.y - 0.35 && this.playerVel.y <= 0) {
          this.playerPos.y = mp.max.y;
          this.playerVel.y = 0;
          this.isGrounded = true;

          // Seamlessly drag player with moving platform!
          this.playerPos.x += mp.deltaMove.x;
          this.playerPos.y += mp.deltaMove.y;
          this.playerPos.z += mp.deltaMove.z;

          _playerBox.min.y = this.playerPos.y;
          _playerBox.max.y = this.playerPos.y + playerHeight;
        }
      }
    }
  }

  // Rotating hazard crossbar collision
  private handleRotatingHazardCollisions() {
    if (this.invulnerableTimer > 0) return;

    for (const rh of this.world.rotatingHazards) {
      const distToCenter = Math.hypot(this.playerPos.x - rh.centerPos.x, this.playerPos.z - rh.centerPos.z);
      if (distToCenter < rh.length / 2 + 0.3 && Math.abs(this.playerPos.y - rh.centerPos.y) < 1.0) {
        // Player is within reach radius: check angle difference with the spinning crossbar
        const playerAngle = Math.atan2(this.playerPos.z - rh.centerPos.z, this.playerPos.x - rh.centerPos.x);
        const angleDiff = Math.abs(Math.atan2(Math.sin(playerAngle - rh.angle), Math.cos(playerAngle - rh.angle)));

        // If close to angle of 0 or PI (both arms of crossbar)
        if (angleDiff < 0.35 || Math.abs(angleDiff - Math.PI) < 0.35) {
          this.stats.health -= 1;
          this.invulnerableTimer = 1.8;
          sounds.playWrong();
          this.triggerCameraShake(0.5);

          // Knockback
          this.playerVel.y = 7.0;
          this.playerVel.z += 9.0;
          this.callbacks.onStatsUpdate(this.stats);

          if (this.stats.health <= 0) {
            this.callbacks.onGameOver('health');
          }
          break;
        }
      }
    }
  }

  // Rolling boulder collision
  private handleRollingBoulderCollisions() {
    if (this.invulnerableTimer > 0) return;

    for (const rb of this.world.rollingBoulders) {
      const dist = this.playerPos.distanceTo(rb.mesh.position);
      if (dist < rb.radius + 0.45) {
        this.stats.health -= 1;
        this.invulnerableTimer = 1.8;
        sounds.playWrong();
        this.triggerCameraShake(0.5);

        this.playerVel.y = 7.0;
        this.playerVel.z += 9.0;
        this.callbacks.onStatsUpdate(this.stats);

        if (this.stats.health <= 0) {
          this.callbacks.onGameOver('health');
        }
        break;
      }
    }
  }

  private handleSpikeHazards() {
    if (this.invulnerableTimer > 0) return;
    const playerRadius = 0.45;
    for (const spike of this.world.spikeHazards) {
      if (
        this.playerPos.x + playerRadius > spike.min.x &&
        this.playerPos.x - playerRadius < spike.max.x &&
        this.playerPos.z + playerRadius > spike.min.z &&
        this.playerPos.z - playerRadius < spike.max.z &&
        this.playerPos.y >= spike.baseY - 0.2 &&
        this.playerPos.y <= spike.max.y
      ) {
        this.stats.health -= 1;
        this.invulnerableTimer = 1.8;
        sounds.playWrong();
        this.triggerCameraShake(0.6);
        this.playerVel.y = 8.0;
        this.playerVel.z += 6.0;
        this.callbacks.onStatsUpdate(this.stats);

        if (this.stats.health <= 0) {
          this.callbacks.onGameOver('health');
        }
        break;
      }
    }
  }

  private handleMissionGates() {
    for (const gate of this.world.missionGates) {
      if (gate.isTriggered) continue;
      // If already unlocked in player stats, mark as triggered
      if (this.stats.unlockedBlocks.has(gate.blockKey)) {
        gate.isTriggered = true;
        continue;
      }

      const dist = Math.hypot(this.playerPos.x - gate.position.x, this.playerPos.z - gate.position.z);
      if (dist < gate.radius && Math.abs(this.playerPos.y - gate.position.y) < 2.5) {
        gate.isTriggered = true;
        sounds.playBlockBump();
        this.callbacks.onQuestionTrigger(gate.blockKey, gate.questionIndex);
        break;
      }
    }
  }

  private handleSpringboards() {
    for (const spring of this.world.springboards) {
      const dist = Math.hypot(this.playerPos.x - spring.position.x, this.playerPos.z - spring.position.z);
      if (dist < 1.3 && Math.abs(this.playerPos.y - spring.position.y) < 0.6) {
        this.playerVel.y = spring.bouncePower;
        this.isGrounded = false;
        this.character.triggerJumpStretch();
        sounds.playSpringboard();
        this.triggerCameraShake(0.2);
        break;
      }
    }
  }

  // Trigger BMC challenge both on hitting Question block or stepping into Station kiosk arena
  private handleQuestionBlocks() {
    const playerHeadY = this.playerPos.y + 1.7;

    for (const qb of this.world.questionBlocks) {
      const qPos = qb.group.position;
      const distX = Math.abs(this.playerPos.x - qPos.x);
      const distZ = Math.abs(this.playerPos.z - qPos.z);

      if (distX < 1.4 && distZ < 1.4) {
        // Mario Bump from below
        if (playerHeadY >= qPos.y - 0.8 && playerHeadY <= qPos.y + 0.1 && this.playerVel.y > 0) {
          this.playerVel.y = -2;
          qb.bumpTime = 0.25;
          sounds.playBlockBump();

          if (!qb.isActivated) {
            this.callbacks.onQuestionTrigger(qb.blockKey, qb.questionIndex);
          }
        }
        // Stepping directly onto kiosk ground ring or block
        else if (this.playerPos.y >= qPos.y - 1.2 && !qb.isActivated && distZ < 1.0 && distX < 1.0) {
          this.callbacks.onQuestionTrigger(qb.blockKey, qb.questionIndex);
        }
      }

      if (qb.bumpTime > 0) {
        qb.bumpTime -= 0.016;
        qb.group.position.y = qb.initialY + Math.sin(qb.bumpTime * Math.PI * 4) * 0.35;
      } else {
        qb.group.position.y = qb.initialY;
      }
    }
  }

  private handleCoins(dt: number) {
    for (const coin of this.world.coins) {
      if (coin.isCollected) continue;

      coin.mesh.rotation.z += dt * 3.5;
      coin.mesh.position.y = coin.initialY + Math.sin(this.stats.totalTimeElapsed * 3 + coin.mesh.position.z) * 0.15;

      const dist = this.playerPos.distanceTo(coin.mesh.position);
      if (dist < 1.35) {
        coin.isCollected = true;
        this.scene.remove(coin.mesh);
        this.stats.cash += coin.value;
        this.stats.coinsCollected += 1;
        sounds.playCoin();
        this.callbacks.onStatsUpdate(this.stats);
      }
    }
  }

  private handleObstacles(dt: number) {
    for (const obs of this.world.obstacles) {
      if (obs.isDefeated) {
        if (obs.flattenProgress < 1) {
          obs.flattenProgress += dt * 2;
          obs.group.scale.set(1.4, Math.max(0.08, 1 - obs.flattenProgress), 1.4);
          if (obs.flattenProgress >= 1) {
            this.scene.remove(obs.group);
          }
        }
        continue;
      }

      obs.group.position.x += obs.speed * obs.direction * dt;
      if (Math.abs(obs.group.position.x - obs.initialPos.x) > obs.patrolRange) {
        obs.direction *= -1;
      }

      const obsPos = obs.group.position;
      const distXZ = Math.hypot(this.playerPos.x - obsPos.x, this.playerPos.z - obsPos.z);

      if (distXZ < obs.radius + 0.45) {
        if (this.playerVel.y < -0.8 && this.playerPos.y > obsPos.y + 0.45) {
          obs.isDefeated = true;
          this.playerVel.y = 10.0;
          this.stats.cash += 50000;
          sounds.playStomp();
          this.triggerCameraShake(0.35);
          this.callbacks.onStatsUpdate(this.stats);

          // Bonus: If there's an unsolved block in this level, trigger question challenge!
          const currentLevelBlocks = LEVEL_CONFIGS[this.stats.currentLevel].blocks;
          const missingBlock = currentLevelBlocks.find(b => !this.stats.unlockedBlocks.has(b));
          if (missingBlock) {
            const qIndex = (this.stats.currentLevel - 1) * 3 + currentLevelBlocks.indexOf(missingBlock);
            this.callbacks.onQuestionTrigger(missingBlock, qIndex);
          }
        } else if (this.invulnerableTimer <= 0) {
          this.stats.health -= 1;
          this.invulnerableTimer = 1.8;
          sounds.playWrong();
          this.triggerCameraShake(0.5);
          this.playerVel.y = 6.0;
          this.playerVel.z += 8.0;

          this.callbacks.onStatsUpdate(this.stats);

          if (this.stats.health <= 0) {
            this.callbacks.onGameOver('health');
          }
        }
      }
    }
  }

  public awardCorrectAnswer(blockKey: BMCBlockKey, rewardCash: number, timeBonus: number, questionIndex: number) {
    this.stats.cash += rewardCash;
    this.stats.timeRemaining += timeBonus;
    this.stats.unlockedBlocks.add(blockKey);
    this.stats.currentStreak += 1;
    this.world.deactivateQuestionBlock(questionIndex);
    sounds.playCorrect();
    this.callbacks.onStatsUpdate(this.stats);
  }

  private handleReachFinish() {
    this.isFinished = true;
    sounds.playVictory();

    if (this.stats.currentLevel < 3) {
      const next = (this.stats.currentLevel + 1) as 2 | 3;
      this.callbacks.onLevelComplete(this.stats.currentLevel, next);
    } else {
      const blocksCount = this.stats.unlockedBlocks.size;
      let grade = 'Pemula (Wirausahawan Rintisan)';
      if (blocksCount === 9) {
        grade = 'Sempurna: Master Entrepreneur Unicorn!';
      } else if (blocksCount >= 7) {
        grade = 'Sangat Baik: Wirausahawan Berdaya Saing Tinggi';
      } else if (blocksCount >= 4) {
        grade = 'Cukup Baik: Wirausahawan Berkembang';
      }
      this.stats.grade = grade;
      this.callbacks.onVictory(this.stats);
    }
  }

  public nextLevel() {
    if (this.stats.currentLevel >= 3) return;
    const nextLvl = (this.stats.currentLevel + 1) as 2 | 3;
    this.stats.currentLevel = nextLvl;
    this.stats.timeRemaining = LEVEL_CONFIGS[nextLvl].timeLimit;
    this.playerPos.set(0, 0.5, 6);
    this.playerVel.set(0, 0, 0);
    this.isFinished = false;
    this.isPaused = false;
    this.invulnerableTimer = 0;
    this.lastSafeCheckpoint.set(0, 1.2, 4);
    this.world.loadLevel(nextLvl);
    this.character.group.position.copy(this.playerPos);
    this.callbacks.onStatsUpdate(this.stats);
  }

  public restartLevel() {
    this.stats.timeRemaining = LEVEL_CONFIGS[this.stats.currentLevel].timeLimit;
    this.stats.health = 3;
    this.playerPos.set(0, 0.5, 6);
    this.playerVel.set(0, 0, 0);
    this.isFinished = false;
    this.isPaused = false;
    this.invulnerableTimer = 0;
    this.lastSafeCheckpoint.set(0, 1.2, 4);
    this.world.loadLevel(this.stats.currentLevel);
    this.character.group.position.copy(this.playerPos);
    this.callbacks.onStatsUpdate(this.stats);
  }

  public restartEntireGame() {
    this.stats = {
      cash: 100000,
      health: 3,
      maxHealth: 3,
      currentLevel: 1,
      unlockedBlocks: new Set<BMCBlockKey>(),
      coinsCollected: 0,
      timeRemaining: LEVEL_CONFIGS[1].timeLimit,
      totalTimeElapsed: 0,
      currentStreak: 0,
      grade: 'Pemula',
      correctAnswersCount: 0,
      totalAnswerAttempts: 0,
      softSkills: {
        problemSolving: 80,
        timeManagement: 85,
        decisionMaking: 80,
        entrepreneurialMindset: 85
      }
    };
    this.playerPos.set(0, 0.5, 6);
    this.playerVel.set(0, 0, 0);
    this.isFinished = false;
    this.isPaused = false;
    this.invulnerableTimer = 0;
    this.lastSafeCheckpoint.set(0, 1.2, 4);
    this.world.loadLevel(1);
    this.character.group.position.copy(this.playerPos);
    this.callbacks.onStatsUpdate(this.stats);
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  public dispose() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    window.removeEventListener('resize', this.handleResize);
    this.renderer.dispose();
  }
}
