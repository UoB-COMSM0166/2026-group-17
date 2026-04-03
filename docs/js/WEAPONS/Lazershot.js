
class Lazershot extends AbstractWeapon {
  constructor() {
    super({
      id: 'lazer', name: 'Lazer shot',
      description: 'ONE shot. Apocalyptic blast.',
      damage: 10,
      speed: 6, 
      blastRadius: 10, 
      ammo: 1, 
      rarity: 'legendary',
      shotRadius: 10, 
      explosionRadius: 160,
    });
    this.used = false;
  }

 drawProjectileInstance(projectile) {
  push();
  const dir = projectile.vel.copy();
  if (dir.mag() > 0) dir.normalize();
  const tail = dir.mult(34);
  stroke(120, 255, 255, 180);
  strokeWeight(6);
  line(
    projectile.position.x,
    projectile.position.y,
    projectile.position.x - tail.x,
    projectile.position.y - tail.y
  );
  stroke(255, 255, 255, 220);
  strokeWeight(2);
  line(
    projectile.position.x,
    projectile.position.y,
    projectile.position.x - tail.x * 0.8,
    projectile.position.y - tail.y * 0.8
  );
  pop();

  this.drawProjectile(projectile.position.x, projectile.position.y, projectile.radius);
 }
 drawProjectile(cx, cy, r) {
  push();
  noStroke();
  
  const pulse = sin(frameCount * 10) * 0.1 + 0.9; 
  
  // glow effect
  const glow = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r * 4 * pulse);
  glow.addColorStop(0,   'rgba(0, 200, 255, 0.3)'); 
  glow.addColorStop(0.6, 'rgba(100, 0, 255, 0.1)');
  glow.addColorStop(1,   'rgba(0, 0, 0, 0)');
  drawingContext.fillStyle = glow;
  ellipse(cx, cy, r * 4 * pulse, r * 4 * pulse);

  // draw shape
  const bodyW = r * 1.2;
  const bodyH = r * 2.2;
  
  // body gradient
  const bg = drawingContext.createLinearGradient(cx - bodyW, cy, cx + bodyW, cy);
  bg.addColorStop(0,   '#2c3e50'); 
  bg.addColorStop(0.5, '#95a5a6'); 
  bg.addColorStop(1,   '#2c3e50');
  drawingContext.fillStyle = bg;
  
  // draw the main body with rounded edges
  rect(cx - bodyW/2, cy - bodyH/2, bodyW, bodyH, bodyW/2);

  // Core Window
  const coreR = r * 0.6 * pulse;
  const coreGlow = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, coreR);
  coreGlow.addColorStop(0,   '#ffffff'); 
  coreGlow.addColorStop(0.4, '#00fbff'); 
  coreGlow.addColorStop(1,   '#0044ff');   
  drawingContext.fillStyle = coreGlow;
  drawingContext.shadowBlur = 15 * pulse;
  drawingContext.shadowColor = '#00fbff';
  ellipse(cx, cy, coreR, coreR * 1.5); 
  drawingContext.shadowBlur = 0;

  // Tech Bands
  stroke(0, 255, 255, 150);
  strokeWeight(1.5);
  noFill();
  line(cx - bodyW/2, cy - r*0.5, cx + bodyW/2, cy - r*0.5); 
  line(cx - bodyW/2, cy + r*0.5, cx + bodyW/2, cy + r*0.5); 

  // Fins
  fill('#2c3e50');
  noStroke();
  // left fin
  triangle(cx - bodyW/2, cy + r*0.4, cx - bodyW, cy + r*1.1, cx - bodyW/2, cy + r*0.8);
  // right fin
  triangle(cx + bodyW/2, cy + r*0.4, cx + bodyW, cy + r*1.1, cx + bodyW/2, cy + r*0.8);

 pop();
}

 drawExplosion(explosion) {
  const progress = explosion.progress;
  const slash = explosion.radius * (1.4 + progress * 1.9);
  const sideSlash = explosion.radius * (0.55 + progress * 0.65);

  push();
  translate(explosion.position.x, explosion.position.y);
  rotate(35);
  blendMode(ADD);
  noFill();

  stroke(60, 220, 255, 110);
  strokeWeight(12 - progress * 4);
  line(-slash, 0, slash, 0);

  stroke(255, 255, 255, 220);
  strokeWeight(4.5);
  line(-slash * 0.92, 0, slash * 0.92, 0);

  stroke(150, 245, 255, 120);
  strokeWeight(3);
  line(-sideSlash, -explosion.radius * 0.22, sideSlash, -explosion.radius * 0.22);
  line(-sideSlash * 0.82, explosion.radius * 0.24, sideSlash * 0.82, explosion.radius * 0.24);

  noStroke();
  const glow = drawingContext.createRadialGradient(0, 0, 0, 0, 0, max(14, explosion.radius * 0.95));
  glow.addColorStop(0, 'rgba(255,255,255,0.82)');
  glow.addColorStop(0.14, 'rgba(120,245,255,0.55)');
  glow.addColorStop(0.4, 'rgba(0,180,255,0.12)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  drawingContext.fillStyle = glow;
  ellipse(0, 0, explosion.radius * 0.95, explosion.radius * 0.95);

  pop();
 }
}
