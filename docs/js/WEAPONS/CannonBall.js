class CannonBall extends AbstractWeapon {
  constructor() {
    super({
      id: 'cannon_ball',
      name: 'Cannon Ball',
      description: 'A heavy iron sphere used as a cannon projectile. \nOn impact, it increases the score based on explosion distance from opponent cannon.',
      damage: 7,
      speed: 6,
      blastRadius: 5,
      ammo: 5,
      rarity: 'common',
      shotRadius: 5,
      explosionRadius: 65
    });
  }

  drawIcon(x, y, size){
   if(!cannonballImg) return;

   push();
   imageMode(CENTER);
   image(cannonballImg, x, y, 60, 60);
   pop();
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