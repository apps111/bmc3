import * as THREE from 'three';

export class ProceduralTextureGenerator {
  // Mario-style golden [?] Question Block face texture
  public static createQuestionBlockTexture(): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Golden gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, '#FFAE19');
    grad.addColorStop(0.5, '#FF8A00');
    grad.addColorStop(1, '#D95C00');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Darker inner border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#933500';
    ctx.strokeRect(7, 7, size - 14, size - 14);

    // Bevel highlights
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#FFEAA7';
    ctx.beginPath();
    ctx.moveTo(14, 14);
    ctx.lineTo(size - 14, 14);
    ctx.moveTo(14, 14);
    ctx.lineTo(14, size - 14);
    ctx.stroke();

    // 4 Corner Rivets / Studs
    const rivets = [
      [24, 24],
      [size - 24, 24],
      [24, size - 24],
      [size - 24, size - 24]
    ];
    rivets.forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#6E2700';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rx - 2, ry - 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#FFF275';
      ctx.fill();
    });

    // Embossed Question Mark "?"
    ctx.fillStyle = '#401800';
    ctx.font = 'bold 150px "Arial Black", Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', size / 2 + 5, size / 2 + 8);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('?', size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  // Hit / inactive question block texture (brown brick style)
  public static createInactiveBlockTexture(): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#785038';
    ctx.fillRect(0, 0, size, size);

    ctx.lineWidth = 8;
    ctx.strokeStyle = '#4A3020';
    ctx.strokeRect(4, 4, size - 8, size - 8);

    // Checkered subtle pattern
    ctx.fillStyle = '#62412E';
    for (let y = 16; y < size - 16; y += 32) {
      for (let x = 16; x < size - 16; x += 32) {
        if ((x + y) % 64 === 0) {
          ctx.fillRect(x, y, 32, 32);
        }
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  // Golden Coin Texture with 'Rp'
  public static createCoinTexture(): THREE.CanvasTexture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Radial gold background
    const rad = ctx.createRadialGradient(size / 2 - 20, size / 2 - 20, 10, size / 2, size / 2, size / 2);
    rad.addColorStop(0, '#FFF5A5');
    rad.addColorStop(0.4, '#FBBF24');
    rad.addColorStop(0.85, '#D97706');
    rad.addColorStop(1, '#92400E');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 10, 0, Math.PI * 2);
    ctx.fill();

    // Inner rim
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#FEF08A';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - 24, 0, Math.PI * 2);
    ctx.stroke();

    // Center Rp typography
    ctx.fillStyle = '#78350F';
    ctx.font = '900 100px "Arial Black", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Rp', size / 2 + 3, size / 2 + 4);

    ctx.fillStyle = '#FFF';
    ctx.fillText('Rp', size / 2, size / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  // Realistic Lush Grass Texture with soft noise and grass tufts
  public static createGrassTexture(): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base emerald green
    ctx.fillStyle = '#34782A';
    ctx.fillRect(0, 0, size, size);

    // Random soft blade noise
    for (let i = 0; i < 18000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const bladeLen = 2 + Math.random() * 4;
      const shade = Math.random();

      if (shade > 0.65) {
        ctx.fillStyle = '#489A38';
      } else if (shade > 0.3) {
        ctx.fillStyle = '#2D6B23';
      } else {
        ctx.fillStyle = '#1F5017';
      }
      ctx.fillRect(x, y, 1.5, bladeLen);
    }

    // Small daisy / buttercup flowers
    for (let f = 0; f < 35; f++) {
      const fx = Math.random() * size;
      const fy = Math.random() * size;
      ctx.fillStyle = Math.random() > 0.4 ? '#FDE047' : '#FFFFFF';
      ctx.beginPath();
      ctx.arc(fx, fy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  // Cobblestone Pathway Texture
  public static createCobblestoneTexture(): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#737373';
    ctx.fillRect(0, 0, size, size);

    // Stone blocks grid with randomized shades
    const cols = 8;
    const rows = 16;
    const cellW = size / cols;
    const cellH = size / rows;

    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (cellW / 2);
      for (let c = -1; c < cols + 1; c++) {
        const x = c * cellW + offset + 2;
        const y = r * cellH + 2;
        const w = cellW - 4;
        const h = cellH - 4;

        const val = 120 + Math.floor(Math.random() * 50);
        ctx.fillStyle = `rgb(${val}, ${val - 4}, ${val - 8})`;
        ctx.fillRect(x, y, w, h);

        // Highlight top-left
        ctx.strokeStyle = `rgb(${val + 35}, ${val + 35}, ${val + 30})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 20);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  // Checkpoint Banner Texture
  public static createStationSignTexture(num: number, title: string, color: string): THREE.CanvasTexture {
    const w = 512;
    const h = 256;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Border and background
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(0, 0, w, h);

    // Accent header
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, 24);
    ctx.fillRect(0, h - 16, w, 16);

    // Badge circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(80, h / 2, 48, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${num}`, 80, h / 2);

    // Text label
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 22px sans-serif';
    ctx.fillText('BLOK BMC KELAS XI', 150, h / 2 - 24);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(title, 150, h / 2 + 16);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }
}
