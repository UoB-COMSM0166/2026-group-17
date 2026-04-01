class CannonBall extends AbstractWeapon {
  constructor() {
    super({
      id: 'cannon_ball',
      name: 'Cannon Ball',
      description: 'Classic iron sphere.',
      damage: 7,
      speed: 6,
      blastRadius: 5,
      ammo: 5,
      rarity: 'common',
      shotRadius: 5,
      explosionRadius: 65
    });
  }

  drawProjectile(cx, cy, r) {
    push();

    const g = drawingContext.createRadialGradient(
      cx - r * 0.3,
      cy - r * 0.35,
      r * 0.05,
      cx,
      cy,
      r
    );

    g.addColorStop(0, '#aaaaaa');
    g.addColorStop(0.45, '#2a2a2a');
    g.addColorStop(1, '#080808');

    drawingContext.fillStyle = g;

    noStroke();
    ellipse(cx, cy, r, r);

    pop();
  }

  drawExplosion(explosion) {
    this.drawStyledExplosion(explosion, {
      coreColor: color(255, 210, 120, 230),
      ringColor: color(255, 145, 60, 220),
      ringWeight: 4,
      coreScale: 0.3,
      ringScale: 0.86,
      glowInner: 'rgba(255,240,170,0.92)',
      glowMid: 'rgba(255,150,50,0.36)',
      glowOuter: 'rgba(255,90,0,0)',
      accent: 'spark',
      accentColor: color(255, 225, 140, 190)
    });
  }
}
