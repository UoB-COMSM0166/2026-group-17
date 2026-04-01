
class Shibashot extends AbstractWeapon {
  constructor() {
    super({
      id: 'shiba', name: 'Shibashot',
      description: 'Burning fuel blob.',
      damage: 6, 
      speed: 3, 
      blastRadius: 6, 
      ammo: 5, 
      rarity: 'rare',
      shotRadius: 6, 
      explosionRadius: 75,
    });
  }
  drawProjectile(cx, cy, r) {
    push();
    noStroke();
    const g = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r*2);
    g.addColorStop(0,    'rgba(255,255,180,0.95)');
    g.addColorStop(0.25, 'rgba(255,160,0,0.7)');
    g.addColorStop(0.6,  'rgba(220,60,0,0.35)');
    g.addColorStop(1,    'rgba(100,0,0,0)');
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r*2, r*2);
    fill(255, 240, 80);
    ellipse(cx, cy, r*0.6, r*0.6);
    pop();
  }

  drawExplosion(explosion) {
    this.drawStyledExplosion(explosion, {
      coreColor: color(255, 230, 120, 235),
      ringColor: color(255, 130, 30, 210),
      ringWeight: 5,
      coreScale: 0.32,
      ringScale: 0.85,
      glowInner: 'rgba(255,235,130,0.95)',
      glowMid: 'rgba(255,120,20,0.42)',
      glowOuter: 'rgba(130,20,0,0)',
      accent: 'embers',
      accentColor: color(255, 180, 60, 180)
    });
  }
}
