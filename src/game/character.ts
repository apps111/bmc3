import * as THREE from 'three';

export interface CharacterAnimationState {
  isMoving: boolean;
  isGrounded: boolean;
  isSprinting: boolean;
  speed: number;
  verticalVelocity: number;
}

export class CharacterController {
  public group: THREE.Group;
  
  // Body parts for procedural skeletal animation
  private headGroup: THREE.Group;
  private torsoMesh: THREE.Mesh;
  private backpackMesh: THREE.Mesh;
  private leftArmGroup: THREE.Group;
  private rightArmGroup: THREE.Group;
  private leftLegGroup: THREE.Group;
  private rightLegGroup: THREE.Group;

  // Animation cycle phase
  private walkCycle: number = 0;
  private squashStretch: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  private targetScale: THREE.Vector3 = new THREE.Vector3(1, 1, 1);

  constructor() {
    this.group = new THREE.Group();

    // Materials with PBR variation
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xF5CBA7,
      roughness: 0.6,
      metalness: 0.05
    });

    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x2C1810,
      roughness: 0.85,
      metalness: 0.0
    });

    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1E3A8A, // Deep Navy Blue SMK
      roughness: 0.5,
      metalness: 0.1
    });

    const blazerMat = new THREE.MeshStandardMaterial({
      color: 0x1D4ED8, // SMK Blue Blazer
      roughness: 0.45,
      metalness: 0.1
    });

    const shirtMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC, // Crisp White Shirt
      roughness: 0.5,
      metalness: 0.0
    });

    const tieMat = new THREE.MeshStandardMaterial({
      color: 0xDC2626, // Bright Red Tie / Dasi
      roughness: 0.4,
      metalness: 0.2
    });

    const pantsMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Charcoal Grey Pants
      roughness: 0.6,
      metalness: 0.0
    });

    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x0F172A, // Black/White Sneakers
      roughness: 0.35,
      metalness: 0.2
    });

    const backpackMat = new THREE.MeshStandardMaterial({
      color: 0xF59E0B, // Energetic Amber Backpack
      roughness: 0.55,
      metalness: 0.15
    });

    // 1. Torso & Upper Body
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.72, 16);
    this.torsoMesh = new THREE.Mesh(torsoGeo, blazerMat);
    this.torsoMesh.position.y = 0.95;
    this.torsoMesh.castShadow = true;
    this.torsoMesh.receiveShadow = true;
    this.group.add(this.torsoMesh);

    // Shirt collar and tie
    const collarGeo = new THREE.BoxGeometry(0.24, 0.22, 0.1);
    const collarMesh = new THREE.Mesh(collarGeo, shirtMat);
    collarMesh.position.set(0, 0.26, 0.26);
    this.torsoMesh.add(collarMesh);

    const tieGeo = new THREE.ConeGeometry(0.08, 0.35, 4);
    const tieMesh = new THREE.Mesh(tieGeo, tieMat);
    tieMesh.position.set(0, 0.1, 0.32);
    tieMesh.rotation.x = Math.PI;
    this.torsoMesh.add(tieMesh);

    // Backpack (Tas Inovasi Siswa)
    const backpackGeo = new THREE.BoxGeometry(0.44, 0.52, 0.24);
    this.backpackMesh = new THREE.Mesh(backpackGeo, backpackMat);
    this.backpackMesh.position.set(0, 0.02, -0.26);
    this.backpackMesh.castShadow = true;
    this.torsoMesh.add(this.backpackMesh);

    // Pocket accent on backpack
    const pocketGeo = new THREE.BoxGeometry(0.32, 0.22, 0.08);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.4 });
    const pocket = new THREE.Mesh(pocketGeo, pocketMat);
    pocket.position.set(0, -0.1, -0.15);
    this.backpackMesh.add(pocket);

    // 2. Head Group
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 1.55;

    // Head base
    const headGeo = new THREE.SphereGeometry(0.3, 20, 20);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    this.headGroup.add(headMesh);

    // Hair / Cap
    const capGeo = new THREE.SphereGeometry(0.32, 18, 14, 0, Math.PI * 2, 0, Math.PI * 0.52);
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.y = 0.06;
    this.headGroup.add(capMesh);

    // Cap Visor (Topi Siswa / Entrepreneur Cap)
    const visorGeo = new THREE.CylinderGeometry(0.34, 0.36, 0.05, 16, 1, false, -Math.PI * 0.3, Math.PI * 0.6);
    const visorMesh = new THREE.Mesh(visorGeo, capMat);
    visorMesh.position.set(0, 0.04, 0.16);
    visorMesh.rotation.x = 0.2;
    this.headGroup.add(visorMesh);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x1E293B });

    const leftEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    leftEye.position.set(-0.11, 0.02, 0.27);
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), pupilMat);
    leftPupil.position.set(0, 0, 0.035);
    leftEye.add(leftPupil);
    this.headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    rightEye.position.set(0.11, 0.02, 0.27);
    const rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), pupilMat);
    rightPupil.position.set(0, 0, 0.035);
    rightEye.add(rightPupil);
    this.headGroup.add(rightEye);

    // Cheerful smile
    const smileGeo = new THREE.TorusGeometry(0.07, 0.015, 8, 12, Math.PI * 0.8);
    const smileMat = new THREE.MeshBasicMaterial({ color: 0xB91C1C });
    const smileMesh = new THREE.Mesh(smileGeo, smileMat);
    smileMesh.position.set(0, -0.12, 0.28);
    smileMesh.rotation.x = Math.PI * 0.6;
    smileMesh.rotation.z = Math.PI;
    this.headGroup.add(smileMesh);

    this.group.add(this.headGroup);

    // 3. Arms & Hands
    const armGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.46, 10);
    const handGeo = new THREE.SphereGeometry(0.09, 12, 12);

    // Left Arm
    this.leftArmGroup = new THREE.Group();
    this.leftArmGroup.position.set(-0.4, 1.25, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, blazerMat);
    leftArmMesh.position.y = -0.22;
    leftArmMesh.castShadow = true;
    const leftHand = new THREE.Mesh(handGeo, skinMat);
    leftHand.position.y = -0.46;
    this.leftArmGroup.add(leftArmMesh);
    this.leftArmGroup.add(leftHand);
    this.group.add(this.leftArmGroup);

    // Right Arm
    this.rightArmGroup = new THREE.Group();
    this.rightArmGroup.position.set(0.4, 1.25, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, blazerMat);
    rightArmMesh.position.y = -0.22;
    rightArmMesh.castShadow = true;
    const rightHand = new THREE.Mesh(handGeo, skinMat);
    rightHand.position.y = -0.46;
    this.rightArmGroup.add(rightArmMesh);
    this.rightArmGroup.add(rightHand);
    this.group.add(this.rightArmGroup);

    // 4. Legs & Shoes
    const legGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.55, 10);
    const shoeGeo = new THREE.BoxGeometry(0.18, 0.12, 0.32);

    // Left Leg
    this.leftLegGroup = new THREE.Group();
    this.leftLegGroup.position.set(-0.18, 0.62, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.26;
    leftLegMesh.castShadow = true;
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.54, 0.06);
    leftShoe.castShadow = true;
    this.leftLegGroup.add(leftLegMesh);
    this.leftLegGroup.add(leftShoe);
    this.group.add(this.leftLegGroup);

    // Right Leg
    this.rightLegGroup = new THREE.Group();
    this.rightLegGroup.position.set(0.18, 0.62, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.26;
    rightLegMesh.castShadow = true;
    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.54, 0.06);
    rightShoe.castShadow = true;
    this.rightLegGroup.add(rightLegMesh);
    this.rightLegGroup.add(rightShoe);
    this.group.add(this.rightLegGroup);

    // Grounding contact shadow plane beneath the student
    const shadowGeo = new THREE.PlaneGeometry(0.9, 0.9);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 64;
    shadowCanvas.height = 64;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(32, 32, 4, 32, 32, 30);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 64, 64);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.02;
    this.group.add(contactShadow);
  }

  // Update procedural kinematics based on delta time and state
  public update(delta: number, state: CharacterAnimationState) {
    const dt = Math.min(delta, 0.05);

    if (state.isGrounded) {
      if (state.isMoving) {
        // Dynamic walk/run cycle speed
        const cycleSpeed = state.isSprinting ? 18 : 11;
        this.walkCycle += dt * cycleSpeed;

        const legSwing = Math.sin(this.walkCycle) * (state.isSprinting ? 0.9 : 0.65);
        const armSwing = Math.cos(this.walkCycle) * (state.isSprinting ? 0.85 : 0.6);

        // Legs swing opposite
        this.leftLegGroup.rotation.x = legSwing;
        this.rightLegGroup.rotation.x = -legSwing;

        // Arms swing opposite to legs
        this.leftArmGroup.rotation.x = -armSwing;
        this.rightArmGroup.rotation.x = armSwing;

        // Subtle torso bobbing and twist
        this.torsoMesh.position.y = 0.95 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.06;
        this.headGroup.position.y = 1.55 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.06;
        this.torsoMesh.rotation.y = -armSwing * 0.15;

        // Normal scaling
        this.targetScale.set(1, 1, 1);
      } else {
        // Idle breathing motion
        this.walkCycle += dt * 2.5;
        const breath = Math.sin(this.walkCycle) * 0.02;

        this.torsoMesh.position.y = 0.95 + breath;
        this.headGroup.position.y = 1.55 + breath * 1.5;

        // Arms slightly relaxed by side
        this.leftLegGroup.rotation.x = THREE.MathUtils.damp(this.leftLegGroup.rotation.x, 0, 10, dt);
        this.rightLegGroup.rotation.x = THREE.MathUtils.damp(this.rightLegGroup.rotation.x, 0, 10, dt);
        this.leftArmGroup.rotation.x = THREE.MathUtils.damp(this.leftArmGroup.rotation.x, 0.1, 10, dt);
        this.rightArmGroup.rotation.x = THREE.MathUtils.damp(this.rightArmGroup.rotation.x, -0.1, 10, dt);
        this.torsoMesh.rotation.y = THREE.MathUtils.damp(this.torsoMesh.rotation.y, 0, 10, dt);

        this.targetScale.set(1, 1, 1);
      }
    } else {
      // In the air (Jumping / Falling)
      // Mario leap posture: one leg bent back, one forward, hands in the air!
      this.leftLegGroup.rotation.x = THREE.MathUtils.damp(this.leftLegGroup.rotation.x, -0.5, 12, dt);
      this.rightLegGroup.rotation.x = THREE.MathUtils.damp(this.rightLegGroup.rotation.x, 0.7, 12, dt);
      this.leftArmGroup.rotation.x = THREE.MathUtils.damp(this.leftArmGroup.rotation.x, -2.4, 12, dt);
      this.rightArmGroup.rotation.x = THREE.MathUtils.damp(this.rightArmGroup.rotation.x, -2.1, 12, dt);

      // Squash and stretch in air based on vertical velocity
      if (state.verticalVelocity > 0) {
        // Rising: stretch
        this.targetScale.set(0.85, 1.25, 0.85);
      } else {
        // Falling: prepare to squash
        this.targetScale.set(1.1, 0.9, 1.1);
      }
    }

    // Exponential damping on scale for squash & stretch
    this.squashStretch.x = THREE.MathUtils.damp(this.squashStretch.x, this.targetScale.x, 15, dt);
    this.squashStretch.y = THREE.MathUtils.damp(this.squashStretch.y, this.targetScale.y, 15, dt);
    this.squashStretch.z = THREE.MathUtils.damp(this.squashStretch.z, this.targetScale.z, 15, dt);
    this.group.scale.copy(this.squashStretch);
  }

  // Trigger brief landing squash impact
  public triggerLandingSquash() {
    this.squashStretch.set(1.3, 0.65, 1.3);
  }

  // Trigger jump launch stretch
  public triggerJumpStretch() {
    this.squashStretch.set(0.75, 1.4, 0.75);
  }
}
