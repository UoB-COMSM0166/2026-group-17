
class Submarinshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'Submarin', name: 'Submarinshot',
      description: 'Curves toward enemy.',
      damage: 9, 
      speed: 7, 
      blastRadius: 8, 
      ammo: 1, 
      rarity: 'legendary',
      shotRadius: 8, 
      explosionRadius: 95,
    });
    this.used = false;
  }

beforeProjectileStep(projectile, context) {
  // Keep the base trajectory consistent with the other projectile weapons.
}

drawProjectileInstance(projectile) {
  push();
  noFill();
  stroke(220, 150, 255, 120);
  strokeWeight(2);
  const dir = projectile.velocity.copy();
  if (dir.mag() > 0) dir.normalize();
  const normal = createVector(-dir.y, dir.x).mult(6);
  line(
    projectile.position.x - dir.x * 16 - normal.x,
    projectile.position.y - dir.y * 16 - normal.y,
    projectile.position.x - normal.x * 0.2,
    projectile.position.y - normal.y * 0.2
  );
  line(
    projectile.position.x - dir.x * 16 + normal.x,
    projectile.position.y - dir.y * 16 + normal.y,
    projectile.position.x + normal.x * 0.2,
    projectile.position.y + normal.y * 0.2
  );
  pop();

  this.drawProjectile(projectile.position.x, projectile.position.y, projectile.radius);
}

drawProjectile(cx, cy, r) {
  push();
  noStroke();

  const bodyG = drawingContext.createLinearGradient(cx - r, cy, cx + r, cy);
  bodyG.addColorStop(0,   '#1a0033'); 
  bodyG.addColorStop(0.5, '#423a48ff'); 
  bodyG.addColorStop(1,   '#1a0033');
  drawingContext.fillStyle = bodyG;
  
  rect(cx - r * 0.6, cy - r * 1.5, r * 1.2, r * 2.5, r);

  // Glowing Eye
  fill(255, 200, 255);
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'magenta';
  ellipse(cx, cy - r * 1.2, r * 0.4, r * 0.4); 
  drawingContext.shadowBlur = 0;

  stroke(210, 100, 255, 220);
  strokeWeight(2);
  noFill();
  for (let a = 0; a < 3; a++) {
    const angle = frameCount * 8 + a * 120; 
    const rx = cos(angle) * r * 1.1;
    const ry = sin(angle) * r * 0.5; 
    
    arc(cx, cy + r * 0.5, rx * 2, r, angle, angle + 90);
  }

  fill(150, 0, 255, 100);
  ellipse(cx, cy + r * 1.8, r * 0.8, r * 0.8);

  pop();
}
drawExplosion(explosion) {
  const progress = explosion.progress;
  const breach = explosion.radius * (0.95 + progress * 0.75);

  push();
  translate(explosion.position.x, explosion.position.y);
  rotate(frameCount * 1.6);
  noFill();

  stroke(215, 130, 255, 150);
  strokeWeight(4);
  for (let i = 0; i < 4; i++) {
    const radius = breach * (0.32 + i * 0.18);
    arc(
      0, 0,
      radius * 1.5,
      radius * 1.5,
      frameCount * 3 + i * 65,
      frameCount * 3 + i * 65 + 210
    );
  }

  stroke(255, 215, 255, 120);
  strokeWeight(2.5);
  for (let i = 0; i < 6; i++) {
    const angle = i * 60 + frameCount * 2;
    line(0, 0, cos(angle) * breach * 0.75, sin(angle) * breach * 0.75);
  }

  noStroke();
  const glow = drawingContext.createRadialGradient(0, 0, 0, 0, 0, max(14, breach));
  glow.addColorStop(0, 'rgba(255,240,255,0.35)');
  glow.addColorStop(0.18, 'rgba(230,150,255,0.25)');
  glow.addColorStop(0.42, 'rgba(110,0,180,0.18)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  drawingContext.fillStyle = glow;
  ellipse(0, 0, breach, breach);

  fill(20, 0, 40, 220);
  ellipse(0, 0, explosion.radius * 0.28, explosion.radius * 0.28);
  fill(245, 220, 255, 160);
  ellipse(0, 0, explosion.radius * 0.1, explosion.radius * 0.1);
  pop();
}
}
