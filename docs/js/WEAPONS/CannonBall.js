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
    this.used = false;
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
}
