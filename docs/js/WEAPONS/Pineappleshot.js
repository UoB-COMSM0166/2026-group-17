
class Pineappleshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'pineapple', name: 'Pineappleshot',
      description: 'Explosive pineapple.',
      damage: 6, 
      speed: 4, 
      blastRadius: 5, 
      ammo: 3, 
      rarity: 'rare',
      shotRadius: 4, 
      explosionRadius: 20,
    });
  }
  drawProjectile(cx, cy, r) {
    push();
    translate(cx, cy);
    rotate(frameCount * 12);
    noStroke();
    fill(180, 180, 180);
    for (let i = 0; i < 4; i++) {
      push();
      rotate(i * 90);
      triangle(0, 0, r*0.4, -r*0.4, r, 0);
      triangle(0, 0, r*0.4,  r*0.4, r, 0);
      pop();
    }
    fill(60);
    ellipse(0, 0, r*0.4, r*0.4);
    pop();
  }

  drawExplosion(explosion) {
    this.drawStyledExplosion(explosion, {
      coreColor: color(255, 245, 190, 230),
      ringColor: color(220, 255, 130, 200),
      ringWeight: 3,
      coreScale: 0.18,
      ringScale: 0.74,
      glowInner: 'rgba(255,255,220,0.88)',
      glowMid: 'rgba(230,255,120,0.30)',
      glowOuter: 'rgba(140,180,0,0)',
      accent: 'shards',
      accentColor: color(245, 255, 200, 180)
    });
  }
}
