// 3. Earthworm
class Earthworm extends AbstractWeapon {
  constructor() {
    super({
      id: 'earthworm', name: 'Earthworm',
      description: 'Burrows underground before striking!',
      damage: 8,
      speed: 4,
      blastRadius: 8,
      ammo: 4, 
      rarity: 'common',
      shotRadius: 5, 
      explosionRadius: 90,
    });
  }
  drawProjectile(cx, cy, r) {
    push();
    noStroke();
    const g = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r*2.5);
    g.addColorStop(0,    'rgba(255,255,255,1)');
    g.addColorStop(0.15, 'rgba(220,100,255,0.9)');
    g.addColorStop(0.55, 'rgba(120,0,220,0.4)');
    g.addColorStop(1,    'rgba(60,0,120,0)');
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r*2.5, r*2.5);
    stroke(210, 100, 255, 200);
    strokeWeight(r*0.1);
    for (let a = 0; a < 3; a++) {
      const angle = frameCount * 4 + a * 120;
      const x2 = cx + cos(angle) * r * 1.2;
      const y2 = cy + sin(angle) * r * 1.2;
      line(cx, cy, x2, y2);
    }
    pop();
  }

  drawExplosion(explosion) {
    this.drawStyledExplosion(explosion, {
      coreColor: color(215, 120, 255, 230),
      ringColor: color(175, 80, 255, 210),
      ringWeight: 5,
      coreScale: 0.24,
      ringScale: 0.78,
      glowInner: 'rgba(245,210,255,0.9)',
      glowMid: 'rgba(170,70,255,0.38)',
      glowOuter: 'rgba(80,0,120,0)',
      accent: 'diamond',
      accentColor: color(235, 185, 255, 180)
    });
  }
}
