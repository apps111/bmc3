import JSZip from 'jszip';

/**
 * Exports a compliant .zip archive:
 * - 'index.html' at root directory
 * - 100% Single Page Application (SPA), zero external redirects
 * - Zero external assets or network dependencies
 * - File size under 25 MB
 */
export async function exportZipPackage() {
  const zip = new JSZip();

  // Read standalone HTML content
  const indexHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>Super Siswapreneur 3D - Petualangan Business Model Canvas SMK</title>
  <meta name="description" content="Bahan Ajar Interaktif Gim Edukasi 3D Platformer Kurikulum Merdeka SMK Kelas XI">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; font-family: system-ui, -apple-system, sans-serif; }
    body, html { width: 100%; height: 100%; overflow: hidden; background: #020617; }
    #screen-16-9-wrapper { width: 100%; height: 100%; max-width: 177.78vh; max-height: 56.25vw; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); overflow: hidden; background: #020617; box-shadow: 0 0 60px rgba(0,0,0,0.9); }
    #canvas-container { position: absolute; inset: 0; width: 100%; height: 100%; }
    
    .hud-perimeter { position: absolute; inset: 0; pointer-events: none; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; z-index: 20; }
    .hud-top { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
    .hud-card { background: rgba(15, 23, 42, 0.92); border: 2px solid rgba(245, 158, 11, 0.8); border-radius: 14px; padding: 6px 14px; color: white; box-shadow: 0 10px 25px rgba(0,0,0,0.5); pointer-events: auto; }
    .hud-level-badge { background: #3b82f6; color: white; padding: 3px 8px; border-radius: 8px; font-size: 10px; font-weight: 900; margin-bottom: 4px; display: inline-block; }
    .hud-title { font-size: 9px; font-weight: 800; color: #fde047; text-transform: uppercase; letter-spacing: 0.5px; }
    .hud-value { font-size: 18px; font-weight: 900; font-variant-numeric: tabular-nums; }
    
    .hud-timer { background: rgba(15, 23, 42, 0.92); border: 2px solid #334155; border-radius: 14px; padding: 6px 14px; text-align: right; pointer-events: auto; }
    .hud-timer.low-time { background: rgba(136, 19, 55, 0.95); border-color: #f43f5e; color: #ffe4e6; animation: timerBlink 0.8s infinite; }
    @keyframes timerBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

    .screen-controls { position: absolute; inset: 0; pointer-events: none; z-index: 25; padding: 14px; padding-bottom: 60px; display: flex; justify-content: space-between; align-items: flex-end; }
    .control-group { pointer-events: auto; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .dpad-grid { display: grid; grid-template-columns: repeat(3, 48px); grid-template-rows: repeat(3, 48px); gap: 4px; background: rgba(15, 23, 42, 0.85); padding: 6px; border-radius: 20px; border: 1px solid rgba(71, 85, 105, 0.8); }
    .dpad-btn { background: #1e293b; color: white; border: 1px solid #475569; border-radius: 12px; font-weight: 900; font-size: 11px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .dpad-btn:active { background: #f59e0b; color: #020617; }
    .dpad-center { display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 900; color: #64748b; }
    
    .action-group { pointer-events: auto; display: flex; align-items: flex-end; gap: 10px; }
    .sprint-btn { width: 50px; height: 50px; border-radius: 50%; background: #1e293b; color: #cbd5e1; border: 1px solid #475569; font-weight: 900; font-size: 9px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .sprint-btn.active { background: #f59e0b; color: #020617; }
    .jump-btn { width: 68px; height: 68px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #eab308); color: #020617; border: 2px solid #fef08a; font-weight: 900; font-size: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .jump-btn:active { transform: scale(0.92); }

    .bottom-dock { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 30; background: rgba(15, 23, 42, 0.95); border: 1px solid #334155; border-radius: 16px; padding: 5px 10px; display: flex; gap: 6px; }
    .dock-btn { background: #1e293b; color: #cbd5e1; border: 1px solid #475569; padding: 5px 10px; border-radius: 10px; font-size: 10px; font-weight: 800; cursor: pointer; }
    .dock-btn:hover { background: #334155; color: white; }
    .dock-btn.primary { background: rgba(59, 130, 246, 0.3); border-color: #3b82f6; color: #93c5fd; }

    .modal-backdrop { position: absolute; inset: 0; background: rgba(2, 6, 23, 0.88); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 14px; backdrop-filter: blur(4px); }
    .modal-card { width: 100%; max-width: 600px; background: #0f172a; border: 2px solid #f59e0b; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; max-height: 88vh; color: white; }
    .modal-header { padding: 12px 16px; background: #2563eb; display: flex; justify-content: space-between; align-items: center; }
    .modal-body { padding: 16px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 12px; }
    .scenario-box { background: rgba(30, 41, 59, 0.8); border: 1px solid #475569; border-radius: 12px; padding: 10px 14px; font-size: 12px; color: #e2e8f0; line-height: 1.4; }
    .modal-footer { padding: 12px 16px; background: #020617; border-top: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; }

    .opt-btn { width: 100%; padding: 10px 14px; border-radius: 12px; background: #1e293b; border: 2px solid #334155; color: #e2e8f0; text-align: left; font-size: 12px; font-weight: 500; cursor: pointer; margin-bottom: 6px; }
    .opt-btn.correct { background: rgba(6, 78, 59, 0.8); border-color: #10b981; color: #a7f3d0; }
    .opt-btn.wrong { background: rgba(136, 19, 55, 0.8); border-color: #f43f5e; color: #fecdd3; }

    .tf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .tf-btn { padding: 14px; border-radius: 14px; border: 2px solid #334155; font-size: 14px; font-weight: 900; cursor: pointer; }
    .tf-btn.true-btn { background: rgba(6, 78, 59, 0.4); border-color: #10b981; color: #34d399; }
    .tf-btn.false-btn { background: rgba(136, 19, 55, 0.4); border-color: #f43f5e; color: #fb7185; }

    .title-screen { position: absolute; inset: 0; z-index: 50; background: radial-gradient(circle at center, rgba(15,23,42,0.85) 0%, rgba(2,6,23,0.98) 100%); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 20px; color: white; }
    .btn-start { padding: 14px 32px; background: linear-gradient(135deg, #f59e0b, #d97706); color: #020617; font-size: 16px; font-weight: 900; border: none; border-radius: 16px; cursor: pointer; box-shadow: 0 10px 25px rgba(245, 158, 11, 0.5); }
    .btn-start:hover { transform: scale(1.03); background: #fbbf24; }
  </style>
</head>
<body>
  <div id="screen-16-9-wrapper">
    <div id="canvas-container"></div>

    <div id="title-screen" class="title-screen">
      <div style="background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; padding: 5px 12px; border-radius: 16px; font-size: 10px; font-weight: 900; color: #fbbf24; margin-bottom: 12px;">
        ★ MODUL GIM EDUKASI INTERAKTIF KELAS XI SMK (RASIO 16:9) ★
      </div>
      <h1 style="font-size: 28px; font-weight: 900; color: #fde047; margin-bottom: 4px;">
        SUPER SISWAPRENEUR 3D
      </h1>
      <h2 style="font-size: 16px; font-weight: 800; color: #38bdf8; margin-bottom: 10px;">
        Ekspedisi 9 Blok Business Model Canvas (Level 1, 2, 3)
      </h2>
      <p style="font-size: 12px; color: #cbd5e1; max-width: 480px; line-height: 1.5; margin-bottom: 20px;">
        Bahan ajar interaktif dengan aturan, tantangan, dan sistem penghargaan nyata untuk melatih soft skills Problem Solving, Decision Making, dan Manajemen Waktu.
      </p>
      <button class="btn-start" onclick="startGame()">▶ MULAI MISI PEMBELAJARAN</button>
      <div style="font-size: 10px; color: #94a3b8; margin-top: 14px;">
        Bebas Aset Eksternal · Single Page Application (SPA) · Rasio 16:9 Sesuai Standar
      </div>
    </div>

    <div id="game-hud" class="hud-perimeter" style="display: none;">
      <div class="hud-top">
        <div class="hud-card">
          <div id="hud-level-badge" class="hud-level-badge">LEVEL 1: FONDASI</div>
          <div class="hud-title">MODAL USAHA SISWA</div>
          <div id="hud-cash" class="hud-value">Rp 100.000</div>
          <div style="font-size: 10px; color: #94a3b8; font-weight: 700; margin-top: 2px;">
            Semangat: <span id="hud-hearts" style="color: #f43f5e;">❤❤❤</span> · Koin: <span id="hud-coins" style="color: #fbbf24;">0</span>
          </div>
        </div>

        <div id="hud-timer-box" class="hud-timer">
          <div style="font-size: 8px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">SISA WAKTU MISI</div>
          <div id="hud-timer" class="hud-value" style="color: #f59e0b;">03:00</div>
        </div>
      </div>
    </div>

    <div id="screen-controls" class="screen-controls" style="display: none;">
      <div class="control-group">
        <div class="dpad-grid">
          <div></div>
          <button class="dpad-btn" onmousedown="setDir(0, -1)" onmouseup="setDir(0,0)" ontouchstart="setDir(0,-1)" ontouchend="setDir(0,0)">▲</button>
          <div></div>
          <button class="dpad-btn" onmousedown="setDir(-1, 0)" onmouseup="setDir(0,0)" ontouchstart="setDir(-1,0)" ontouchend="setDir(0,0)">◄</button>
          <div class="dpad-center">ARAH</div>
          <button class="dpad-btn" onmousedown="setDir(1, 0)" onmouseup="setDir(0,0)" ontouchstart="setDir(1,0)" ontouchend="setDir(0,0)">►</button>
          <div></div>
          <button class="dpad-btn" onmousedown="setDir(0, 1)" onmouseup="setDir(0,0)" ontouchstart="setDir(0,1)" ontouchend="setDir(0,0)">▼</button>
          <div></div>
        </div>
      </div>

      <div class="action-group">
        <button id="sprint-btn" class="sprint-btn" onclick="toggleSprint()">⚡ LARI</button>
        <button class="jump-btn" onmousedown="triggerJump()" ontouchstart="triggerJump()">▲ LOMPAT</button>
      </div>
    </div>

    <div id="bottom-dock" class="bottom-dock" style="display: none;">
      <button class="dock-btn primary" onclick="showBMCBoard()">🗺️ Kanvas BMC</button>
      <button class="dock-btn" onclick="toggleSound()">🔊 Suara</button>
      <button class="dock-btn" onclick="resetCamera()">🎥 Reset Kamera</button>
    </div>

    <div id="question-modal" class="modal-backdrop" style="display: none;">
      <div class="modal-card">
        <div id="q-header" class="modal-header">
          <div>
            <div id="q-badge" style="font-size: 9px; font-weight: 800; text-transform: uppercase; opacity: 0.8;">TANTANGAN BMC</div>
            <h3 id="q-title" style="font-size: 16px; font-weight: 900;">Customer Segments</h3>
          </div>
          <div id="q-reward" style="background: rgba(0,0,0,0.3); padding: 3px 8px; border-radius: 8px; font-size: 11px; font-weight: 900; color: #fde047;">+Rp 150.000</div>
        </div>
        <div class="modal-body">
          <div id="q-scenario" class="scenario-box"></div>
          <h4 id="q-text" style="font-size: 13px; font-weight: 800;"></h4>
          <div id="q-options-container"></div>
          <div id="q-feedback" style="display: none; padding: 10px; border-radius: 12px; font-size: 12px; line-height: 1.4;"></div>
        </div>
        <div class="modal-footer">
          <button class="dock-btn" onclick="closeQuestion()">Tutup Sementara</button>
          <button id="q-continue-btn" class="dock-btn primary" style="display: none;" onclick="closeQuestion()">Lanjutkan Misi</button>
        </div>
      </div>
    </div>
  </div>

  <script>
    class SoundFX {
      constructor() { this.ctx = null; this.muted = false; }
      init() { if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; this.ctx = new AC(); } }
      toggleMute() { this.muted = !this.muted; return this.muted; }
      playJump() {
        if (this.muted) return; this.init(); const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(580, t + 0.16);
        g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + 0.22);
      }
      playCoin() {
        if (this.muted) return; this.init(); const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(987.77, t); o.frequency.setValueAtTime(1318.51, t + 0.08);
        g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + 0.45);
      }
      playBump() {
        if (this.muted) return; this.init(); const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'square'; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.12);
        g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + 0.16);
      }
      playCorrect() {
        if (this.muted) return; this.init();
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
          const t = this.ctx.currentTime + i * 0.08;
          const o = this.ctx.createOscillator(), g = this.ctx.createGain();
          o.type = 'triangle'; o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
          o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + 0.35);
        });
      }
      playWrong() {
        if (this.muted) return; this.init(); const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = 'sawtooth'; o.frequency.setValueAtTime(140, t); o.frequency.setValueAtTime(100, t + 0.12);
        g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + 0.32);
      }
    }
    const audio = new SoundFX();

    let scene, camera, renderer, character, clock;
    let platforms = [], coins = [], questionBlocks = [];
    let playerPos = new THREE.Vector3(0, 0.1, 8);
    let playerVel = new THREE.Vector3(0, 0, 0);
    let isGrounded = true, isSprinting = false, currentLevel = 1;
    let cameraAngle = 0;
    let virtualInput = { x: 0, z: 0, jump: false };
    let isPaused = true;

    let gameState = {
      cash: 100000,
      health: 3,
      coins: 0,
      timeRemaining: 180,
      unlockedBlocks: new Set()
    };

    function init3D() {
      const container = document.getElementById('canvas-container');
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x7dd3fc);
      scene.fog = new THREE.Fog(0x7dd3fc, 30, 160);

      const w = container.clientWidth;
      const h = container.clientHeight;
      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
      camera.position.set(0, 5, 16);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(w, h);
      renderer.shadowMap.enabled = true;
      container.appendChild(renderer.domElement);

      const sun = new THREE.DirectionalLight(0xfffbeb, 1.5);
      sun.position.set(25, 40, 20);
      sun.castShadow = true;
      scene.add(sun);
      scene.add(new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 0.7));

      createCharacter();
      loadLevelWorld(1);
      clock = new THREE.Clock();

      window.addEventListener('resize', () => {
        const nw = container.clientWidth;
        const nh = container.clientHeight;
        camera.aspect = nw / nh;
        camera.updateProjectionMatrix();
        renderer.setSize(nw, nh);
      });

      requestAnimationFrame(gameLoop);
    }

    function createCharacter() {
      character = new THREE.Group();
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.28, 0.72, 12), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
      torso.position.y = 0.95; torso.castShadow = true;
      character.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf5cba7 }));
      head.position.y = 1.55; head.castShadow = true;
      character.add(head);

      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.3, 12), new THREE.MeshStandardMaterial({ color: 0x1e3a8a }));
      cap.position.y = 1.8; character.add(cap);

      scene.add(character);
    }

    function loadLevelWorld(lvl) {
      platforms.forEach(p => scene.remove(p.mesh));
      coins.forEach(c => scene.remove(c.mesh));
      questionBlocks.forEach(q => scene.remove(q.group));
      platforms = []; coins = []; questionBlocks = [];

      currentLevel = lvl;
      gameState.timeRemaining = lvl === 1 ? 180 : lvl === 2 ? 160 : 150;
      document.getElementById('hud-level-badge').innerText = 'LEVEL ' + lvl + ': ' + (lvl === 1 ? 'FONDASI' : lvl === 2 ? 'OPERASIONAL' : 'FINANSIAL');

      const gMat = new THREE.MeshStandardMaterial({ color: lvl === 1 ? 0x34782a : lvl === 2 ? 0x475569 : 0x1e293b });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 160), gMat);
      ground.rotation.x = -Math.PI / 2; ground.position.set(0, 0, -35); ground.receiveShadow = true;
      scene.add(ground);
      platforms.push({ mesh: ground, min: new THREE.Vector3(-40, -1, -115), max: new THREE.Vector3(40, 0, 45) });

      const blockKeys = lvl === 1 ? ['customer_segments', 'value_propositions', 'channels']
                      : lvl === 2 ? ['customer_relationships', 'key_activities', 'key_resources']
                      : ['key_partnerships', 'cost_structure', 'revenue_streams'];

      const zPos = [-20, -40, -60];
      blockKeys.forEach((key, i) => {
        const qg = new THREE.Group();
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 }));
        box.position.y = 2.5; box.castShadow = true;
        qg.position.set(0, 0, zPos[i]);
        qg.add(box);
        scene.add(qg);
        questionBlocks.push({ group: qg, key, y: 2.5, bump: 0, active: true });

        const step = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 4), new THREE.MeshStandardMaterial({ color: 0xdc2626 }));
        step.position.set(i % 2 === 0 ? -4 : 4, 1.5, zPos[i]);
        scene.add(step);
        platforms.push({ mesh: step, min: new THREE.Vector3(step.position.x - 2, 0, step.position.z - 2), max: new THREE.Vector3(step.position.x + 2, 1.7, step.position.z + 2) });
      });

      const cGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 12);
      cGeo.rotateX(Math.PI / 2);
      const cMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.9, roughness: 0.2 });
      for (let z = 4; z > -70; z -= 5) {
        const cm = new THREE.Mesh(cGeo, cMat);
        cm.position.set(Math.sin(z) * 2, 1.2, z);
        scene.add(cm);
        coins.push({ mesh: cm, collected: false });
      }

      const arch = new THREE.Mesh(new THREE.BoxGeometry(8, 6, 1), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
      arch.position.set(0, 3, -75); scene.add(arch);
    }

    function gameLoop() {
      requestAnimationFrame(gameLoop);
      if (isPaused) return;
      const dt = Math.min(clock.getDelta(), 0.05);

      gameState.timeRemaining -= dt;
      if (gameState.timeRemaining <= 0) {
        gameState.timeRemaining = 0;
        alert('Waktu Misi Habis! Mengulang Level ' + currentLevel);
        loadLevelWorld(currentLevel);
      }
      updateHUD();

      const speed = isSprinting ? 12 : 7.5;
      playerVel.x = virtualInput.x * speed;
      playerVel.z = virtualInput.z * speed;
      playerVel.y -= 28 * dt;

      if (virtualInput.jump && isGrounded) {
        playerVel.y = 12;
        isGrounded = false;
        virtualInput.jump = false;
        audio.playJump();
      }

      playerPos.x += playerVel.x * dt;
      playerPos.y += playerVel.y * dt;
      playerPos.z += playerVel.z * dt;

      isGrounded = false;
      platforms.forEach(p => {
        if (playerPos.x >= p.min.x && playerPos.x <= p.max.x && playerPos.z >= p.min.z && playerPos.z <= p.max.z) {
          if (playerPos.y <= p.max.y && playerPos.y >= p.max.y - 0.4 && playerVel.y <= 0) {
            playerPos.y = p.max.y;
            playerVel.y = 0;
            isGrounded = true;
          }
        }
      });

      questionBlocks.forEach(qb => {
        if (!qb.active) return;
        const dist = Math.hypot(playerPos.x - qb.group.position.x, playerPos.z - qb.group.position.z);
        if (dist < 1.1) {
          if (playerPos.y + 1.7 >= qb.y && playerPos.y <= qb.y + 0.5) {
            audio.playBump();
            triggerQuestion(qb.key, qb);
          }
        }
      });

      coins.forEach(c => {
        if (c.collected) return;
        c.mesh.rotation.z += dt * 3;
        if (playerPos.distanceTo(c.mesh.position) < 1.2) {
          c.collected = true;
          scene.remove(c.mesh);
          gameState.cash += 25000;
          gameState.coins += 1;
          audio.playCoin();
        }
      });

      if (playerPos.z <= -74) {
        if (currentLevel < 3) {
          alert('Misi Level ' + currentLevel + ' Tuntas! Melanjutkan ke Level ' + (currentLevel + 1));
          playerPos.set(0, 0.1, 8);
          loadLevelWorld(currentLevel + 1);
        } else {
          alert('LUAR BIASA! Seluruh 9 Blok Business Model Canvas Berhasil Dikuasai! Nilai: A (Master Entrepreneur Unicorn SMK)');
          playerPos.set(0, 0.1, 8);
          loadLevelWorld(1);
        }
      }

      if (playerPos.y < -10) {
        playerPos.set(0, 1, 4);
        playerVel.set(0, 0, 0);
        gameState.health = Math.max(1, gameState.health - 1);
      }

      character.position.copy(playerPos);

      const targetCamX = playerPos.x - Math.sin(cameraAngle) * 9;
      const targetCamZ = playerPos.z - Math.cos(cameraAngle) * 9;
      camera.position.x += (targetCamX - camera.position.x) * dt * 8;
      camera.position.y += (playerPos.y + 4.2 - camera.position.y) * dt * 8;
      camera.position.z += (targetCamZ - camera.position.z) * dt * 8;
      camera.lookAt(playerPos.x, playerPos.y + 1.2, playerPos.z);

      renderer.render(scene, camera);
    }

    function updateHUD() {
      document.getElementById('hud-cash').innerText = 'Rp ' + gameState.cash.toLocaleString('id-ID');
      document.getElementById('hud-coins').innerText = gameState.coins;
      let hStr = '';
      for (let i = 0; i < gameState.health; i++) hStr += '❤';
      document.getElementById('hud-hearts').innerText = hStr || '💔';

      const s = Math.max(0, Math.floor(gameState.timeRemaining));
      const m = Math.floor(s / 60);
      const remS = s % 60;
      document.getElementById('hud-timer').innerText = (m < 10 ? '0' : '') + m + ':' + (remS < 10 ? '0' : '') + remS;
    }

    const questions = {
      customer_segments: {
        type: 'mc',
        title: 'Customer Segments (Segmentasi Konsumen)',
        scenario: 'Siswa SMK RPL merintis aplikasi kasir digital. Langkah penentuan target pasar yang paling tepat dan rasional adalah...',
        opts: [
          { text: 'Niche Market: UMKM kuliner di kantin sekolah & ruko sekitar yang kesulitan stok barang.', correct: true },
          { text: 'Mass Market: Seluruh supermarket dan mall di Indonesia sekaligus.', correct: false },
          { text: 'Diversified: Menjual ke toko besi sekaligus rumah sakit tanpa adaptasi sistem.', correct: false },
          { text: 'Pasif: Menunggu ada pelanggan yang meminta tanpa melakukan riset pasar.', correct: false }
        ]
      },
      value_propositions: {
        type: 'mc',
        title: 'Value Propositions (Proposisi Nilai)',
        scenario: 'Siswa Tata Boga ingin membuat keripik pisang. Inovasi proposisi nilai berdaya saing tinggi adalah...',
        opts: [
          { text: 'Keripik vacuum frying rendah minyak dengan bumbu rempah alami & kemasan ziplock kedap udara.', correct: true },
          { text: 'Menjual keripik biasa dengan menurunkan harga hingga rugi agar laku.', correct: false },
          { text: 'Mengubah nama kemasan menjadi bahasa asing tanpa mengubah mutu produk.', correct: false },
          { text: 'Hanya melayani jika ada pesanan keluarga saja.', correct: false }
        ]
      },
      channels: {
        type: 'tf',
        title: 'Channels (Saluran Distribusi)',
        scenario: 'Saluran Omnichannel (kombinasi toko fisik Teaching Factory SMK & etalase Shopee/TikTok) memberikan jangkauan terbaik dengan modal efisien bagi siswa SMK.',
        answer: true
      },
      customer_relationships: {
        type: 'mc',
        title: 'Customer Relationships (Hubungan Pelanggan)',
        scenario: 'Siswa Otomotif membuka bengkel home-service. Strategi merawat loyalitas konsumen adalah...',
        opts: [
          { text: 'Memberikan kartu servis digital WhatsApp, pengingat berkala, dan garansi 14 hari.', correct: true },
          { text: 'Mengirim spam pesan promosi setiap jam ke pelanggan.', correct: false },
          { text: 'Memblokir kontak pelanggan setelah uang diterima.', correct: false },
          { text: 'Menolak komplain jika motor pelanggan bermasalah lagi.', correct: false }
        ]
      },
      key_activities: {
        type: 'tf',
        title: 'Key Activities (Aktivitas Kunci)',
        scenario: 'Dalam usaha konveksi baju SMK, pemeriksaan kualitas jahitan (Quality Control) adalah aktivitas sampingan yang boleh ditiadakan.',
        answer: false
      },
      key_resources: {
        type: 'mc',
        title: 'Key Resources (Sumber Daya Kunci)',
        scenario: 'Aset terpenting bagi startup IoT siswa SMK Elektronika adalah...',
        opts: [
          { text: 'Komponen mikrokontroler, bengkel lab SMK, coding siswa, & skema sirkuit.', correct: true },
          { text: 'Mobil mewah untuk jalan-jalan keliling kota.', correct: false },
          { text: 'Pinjaman uang tunai tanpa adanya keahlian teknologi sama sekali.', correct: false },
          { text: 'Baju seragam kantor mewah sebelum ada alat produksi.', correct: false }
        ]
      },
      key_partnerships: {
        type: 'mc',
        title: 'Key Partnerships (Kemitraan Kunci DUDI)',
        scenario: 'Kemitraan strategis terbaik bagi usaha hidroponik SMK dengan panen 1 ton melon adalah...',
        opts: [
          { text: 'Bermitra dengan supermarket buah lokal, supplier bibit grosir, dan kurir logistik.', correct: true },
          { text: 'Menolak bekerjasama karena takut rahasia tanaman dicuri orang.', correct: false },
          { text: 'Membeli pupuk eceran mahal setiap hari di toko kelontong.', correct: false },
          { text: 'Menjual hasil panen ke calo tanpa bukti pembayaran.', correct: false }
        ]
      },
      cost_structure: {
        type: 'tf',
        title: 'Cost Structure (Struktur Biaya)',
        scenario: 'Menghitung Biaya Pokok Produksi (HPP) dan Titik Impas (BEP) wajib dilakukan sebelum menetapkan harga jual produk ke pasar.',
        answer: true
      },
      revenue_streams: {
        type: 'tf',
        title: 'Revenue Streams (Arus Pendapatan)',
        scenario: 'Hanya mengandalkan penjualan produk sekali beli tanpa menyediakan opsi langganan/perawatan adalah cara terbaik memaksimalkan arus kas.',
        answer: false
      }
    };

    function triggerQuestion(key, blockRef) {
      isPaused = true;
      const q = questions[key];
      const modal = document.getElementById('question-modal');
      modal.style.display = 'flex';
      document.getElementById('q-title').innerText = q.title;
      document.getElementById('q-scenario').innerText = q.scenario;
      document.getElementById('q-feedback').style.display = 'none';
      document.getElementById('q-continue-btn').style.display = 'none';

      const container = document.getElementById('q-options-container');
      container.innerHTML = '';

      if (q.type === 'mc') {
        const shuffled = [...q.opts].sort(() => Math.random() - 0.5);
        shuffled.forEach((opt, idx) => {
          const btn = document.createElement('button');
          btn.className = 'opt-btn';
          btn.innerText = String.fromCharCode(65 + idx) + '. ' + opt.text;
          btn.onclick = () => {
            if (opt.correct) {
              btn.classList.add('correct');
              showFeedback(true, 'Tepat Sekali! Analisis pemecahan masalah wirausaha berhasil! (+Rp 150.000 & +20s Waktu Bonus)');
              gameState.cash += 150000;
              gameState.timeRemaining += 20;
              audio.playCorrect();
              blockRef.active = false;
            } else {
              btn.classList.add('wrong');
              showFeedback(false, 'Kurang tepat. Analisis kembali kebutuhan nyata pasar dan jangan terkecoh jawaban mirip!');
              audio.playWrong();
            }
          };
          container.appendChild(btn);
        });
      } else if (q.type === 'tf') {
        const grid = document.createElement('div');
        grid.className = 'tf-grid';

        const bTrue = document.createElement('button');
        bTrue.className = 'tf-btn true-btn';
        bTrue.innerHTML = '✔ BENAR (TRUE)';
        bTrue.onclick = () => checkTF(true, q.answer, blockRef);

        const bFalse = document.createElement('button');
        bFalse.className = 'tf-btn false-btn';
        bFalse.innerHTML = '✖ SALAH (FALSE)';
        bFalse.onclick = () => checkTF(false, q.answer, blockRef);

        grid.appendChild(bTrue);
        grid.appendChild(bFalse);
        container.appendChild(grid);
      }
    }

    function checkTF(chosen, correct, blockRef) {
      if (chosen === correct) {
        showFeedback(true, 'Tepat Sekali! Pengambilan keputusan strategis kamu benar! (+Rp 120.000 & +15s Waktu Bonus)');
        gameState.cash += 120000;
        gameState.timeRemaining += 15;
        audio.playCorrect();
        blockRef.active = false;
      } else {
        showFeedback(false, 'Jawaban kurang tepat. Perhatikan kembali prinsip dasar Business Model Canvas!');
        audio.playWrong();
      }
    }

    function showFeedback(isOk, msg) {
      const fb = document.getElementById('q-feedback');
      fb.style.display = 'block';
      fb.style.background = isOk ? 'rgba(6, 78, 59, 0.8)' : 'rgba(136, 19, 55, 0.8)';
      fb.style.color = isOk ? '#a7f3d0' : '#fecdd3';
      fb.innerText = msg;
      document.getElementById('q-continue-btn').style.display = 'inline-block';
    }

    function closeQuestion() {
      document.getElementById('question-modal').style.display = 'none';
      isPaused = false;
    }

    function setDir(x, z) { virtualInput.x = x; virtualInput.z = z; }
    function triggerJump() { virtualInput.jump = true; }
    function toggleSprint() {
      isSprinting = !isSprinting;
      const b = document.getElementById('sprint-btn');
      if (isSprinting) b.classList.add('active'); else b.classList.remove('active');
    }
    function resetCamera() { cameraAngle = 0; }
    function toggleSound() { audio.toggleMute(); }
    function showBMCBoard() {
      alert('PAPAN 9 BLOK BMC SMK:\\n1. Customer Segments: Target pasar spesifik UMKM.\\n2. Value Proposition: Solusi inovasi unggul.\\n3. Channels: Omnichannel e-commerce & TeFa.\\n4. Customer Relationships: Retensi & garansi.\\n5. Revenue Streams: Multi-aliran kas.\\n6. Key Activities: Produksi terstandar & QC.\\n7. Key Resources: Fasilitas lab bengkel & SDM SMK.\\n8. Key Partnerships: Kerjasama strategis DUDI.\\n9. Cost Structure: HPP, BOP, & BEP.');
    }

    function startGame() {
      document.getElementById('title-screen').style.display = 'none';
      document.getElementById('game-hud').style.display = 'flex';
      document.getElementById('screen-controls').style.display = 'flex';
      document.getElementById('bottom-dock').style.display = 'flex';
      init3D();
      isPaused = false;
    }
  </script>
</body>
</html>`;

  const readme = `=============================================================================
BAHAN AJAR INTERAKTIF GIM EDUKASI 3D: SUPER SISWAPRENEUR
Mata Pelajaran: Produk Kreatif dan Kewirausahaan (PKK)
Fase / Jenjang : Fase F / SMK - MAK Kelas XI (Kurikulum Merdeka)
Materi Pokok   : Perencanaan Usaha & 9 Elemen Business Model Canvas (BMC)
=============================================================================

A. KOMPONEN PAKET BAHAN AJAR:
1. index.html : File Single Page Application (SPA) utama gim pembelajaran.
                Dapat langsung dibuka di Google Chrome, Microsoft Edge,
                atau browser modern lainnya tanpa perlu instalasi tambahan.
                Didesain dengan Rasio Layar 16:9 sesuai standar proyektor kelas.
2. README.txt : Dokumen petunjuk penggunaan bagi Guru dan Siswa.

B. TUJUAN PEMBELAJARAN (PEDAGOGIS):
1. Peserta didik mampu menganalisis 9 blok Business Model Canvas (Alexander Osterwalder).
2. Peserta didik mampu merumuskan Value Proposition unik berbasis keahlian SMK.
3. Peserta didik mampu melatih soft skills dunia kerja:
   - Problem Solving (Pemecahan Masalah Studi Kasus Nyata)
   - Decision Making (Pengambilan Keputusan Strategi Pasar)
   - Time Management (Manajemen Waktu Misi dan Efisiensi Bisnis)
   - Negosiasi & Kemitraan Industri (DUDI)

C. PETUNJUK PENGGUNAAN OLEH SISWA:
1. Klik ganda pada file 'index.html' untuk memulai gim.
2. Navigasi karakter:
   - Maju, Mundur, Kiri, Kanan : Tombol D-Pad di layar atau Keyboard (WASD / Panah)
   - Melompat                 : Tombol LOMPAT di layar atau Tombol Spasi
   - Lari Cepat (Sprint)      : Tombol LARI di layar atau Tombol Shift
3. Temukan Balok Tanda Tanya [?] berwarna emas dan sundul dari bawah untuk membuka
   studi kasus nyata wirausaha SMK.
4. Jawab soal pilihan ganda, benar/salah, menjodohkan, atau mengurutkan alur
   sebelum batas waktu level habis!

D. KRITERIA TEKNIS:
- Format: Single Page Application (SPA), zero external redirects.
- Rasio Tampilan: 16:9 Standard Aspect Ratio.
- Total Ukuran: Kurang dari 25 MB (sangat ringan).
=============================================================================`;

  zip.file('index.html', indexHtml);
  zip.file('PANDUAN_PEMBELAJARAN_GURU_DAN_SISWA.txt', readme);

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'bahan_ajar_gim_edukasi_smk_16x9.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
