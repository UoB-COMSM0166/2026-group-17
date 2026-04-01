
class Submarinshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'Submarin', name: 'Submarinshot',
      description: 'Curves toward enemy.',
      damage: 9, 
      speed: 7, 
      blastRadius: 8, 
      ammo: 3, 
      rarity: 'legendary',
      shotRadius: 8, 
      explosionRadius: 95,
    });
  }

beforeProjectileStep(projectile, context) {
  const targetPos = projectile.target?.positionVector ?? projectile.target?.position;
  if (!targetPos) return;

  const desired = p5.Vector.sub(targetPos, projectile.position);
  if (desired.mag() < 1) return;

  desired.setMag(85 * context.dt);
  projectile.vel.add(desired);
}

drawProjectileInstance(projectile) {
  push();
  noFill();
  stroke(220, 150, 255, 120);
  strokeWeight(2);
  const dir = projectile.vel.copy();
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
  this.drawStyledExplosion(explosion, {
    coreColor: color(220, 170, 255, 230),
    ringColor: color(190, 80, 255, 210),
    ringWeight: 4,
    coreScale: 0.28,
    ringScale: 0.93,
    glowInner: 'rgba(245,220,255,0.92)',
    glowMid: 'rgba(180,70,255,0.38)',
    glowOuter: 'rgba(60,0,120,0)',
    accent: 'cross',
    accentColor: color(235, 195, 255, 180)
  });
}
}
