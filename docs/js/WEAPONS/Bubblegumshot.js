class Bubblegumshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'bubblegumshot', name: 'Bubblegumshot',
      description: 'Sticky and explosive!',
      damage: 9, 
      speed: 8, 
      blastRadius: 9, 
      ammo: 3, 
      rarity: 'rare',
      shotRadius: 5, 
      explosionRadius: 110,
    });
  }
  drawProjectile(cx, cy, r) {
    push();
    translate(cx, cy);
    noStroke();
    fill(160, 160, 160);
    ellipse(0, 0, r*1.8, r*0.7);
    fill(220, 60, 40);
    triangle(-r*1.6, -r*0.35, -r*1.6, r*0.35, -r*2.5, 0);
    fill(100, 100, 100);
    triangle(r*1.1, 0, r*1.9, -r*0.9, r*1.5, 0);
    triangle(r*1.1, 0, r*1.9,  r*0.9, r*1.5, 0);
    pop();
  }

  drawExplosion(explosion) {
    this.drawStyledExplosion(explosion, {
      coreColor: color(255, 140, 210, 220),
      ringColor: color(255, 90, 170, 190),
      ringWeight: 4,
      coreScale: 0.35,
      ringScale: 0.82,
      glowInner: 'rgba(255,180,220,0.9)',
      glowMid: 'rgba(255,80,180,0.38)',
      glowOuter: 'rgba(255,80,180,0)',
      accent: 'petal',
      accentColor: color(255, 210, 230, 170)
    });
  }
}
