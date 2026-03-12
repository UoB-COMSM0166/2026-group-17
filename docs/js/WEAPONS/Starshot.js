
class Starshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'star', name: 'Starshot',
      description: 'Freezes on impact.',
      damage: 5,
      speed: 5, 
      blastRadius: 7, 
      ammo: 4, 
      rarity: 'rare',
      shotRadius: 5, 
      explosionRadius: 80,
    });
  }
  drawProjectile(cx, cy, r) {
    push();
    noStroke();
    const g = drawingContext.createRadialGradient(
      cx - r*0.3, cy - r*0.3, r*0.05, cx, cy, r);
    g.addColorStop(0,   '#eef8ff');
    g.addColorStop(0.5, '#5599cc');
    g.addColorStop(1,   '#112244');
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r, r);
    stroke(200, 240, 255, 180);
    strokeWeight(r*0.1);
    for (let a = 0; a < 6; a++) {
      const ax = cx + cos(a * 60) * r * 0.85;
      const ay = cy + sin(a * 60) * r * 0.85;
      line(cx, cy, ax, ay);
    }
    pop();
  }
}