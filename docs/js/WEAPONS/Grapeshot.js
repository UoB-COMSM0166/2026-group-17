
class Grapeshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'grapeshot', name: 'Grapeshot',
      description: "Breaks apart mid-air while linked by chains.\nTriggers multiple chained explosions on impact.",
      damage: 8,
      speed: 5,
      blastRadius: 10,
      ammo: 4,
      rarity: 'rare',
      shotRadius: 9, 
      explosionRadius: 120,
    });
    this.used = false;
  }

 beforeProjectileStep(projectile, context) {
  const state = projectile.state;
  if (state.split === undefined) {
    state.split = false;
    state.spread = 0;
  }

  if (!state.split && (projectile.age > 0.38 || projectile.velocity.y > 40)) {
    state.split = true;
  }

  if (state.split) {
    state.spread = min(18, state.spread + context.dt * 42);
  }
 }

 drawProjectileInstance(projectile) {
  const state = projectile.state;
  if (!state.split) {
    this.drawProjectile(projectile.position.x, projectile.position.y, projectile.radius);
    return;
  }

  push();
  noStroke();
  const spread = state.spread ?? 0;
  const offsets = [
    createVector(-spread, spread * 0.25),
    createVector(spread, spread * 0.25),
    createVector(0, -spread * 0.55),
    createVector(-spread * 0.25, spread * 0.8)
  ];

  for (const offset of offsets) {
    const px = projectile.position.x + offset.x;
    const py = projectile.position.y + offset.y;
    fill(70);
    circle(px, py, projectile.radius * 0.55);
    fill(255, 140, 40, 180);
    circle(px, py - projectile.radius * 0.45, 2);
  }

  stroke(210, 160, 60, 120);
  strokeWeight(1.2);
  for (const offset of offsets) {
    line(projectile.position.x, projectile.position.y, projectile.position.x + offset.x, projectile.position.y + offset.y);
  }
  pop();
 }

 createExplosionsFromImpact(impactPosition, projectile) {
  const spread = max(14, projectile.state.spread ?? 12);
  const directions = [
    createVector(-1, 0.15),
    createVector(1, 0.15),
    createVector(0.2, -0.85),
    createVector(-0.35, 0.8)
  ];

  // Only the center blast modifies terrain.
  // The smaller side bursts are visual-only so terrain settling stays stable.
  const visuals = directions.map((dir, index) => {
    const offset = dir.copy().setMag(spread * (0.8 + index * 0.08));
    return {
      position: impactPosition.copy().add(offset),
      maxRadius: 36,
      affectsTerrain: false
    };
  });

  return [
    {
      position: impactPosition.copy(),
      maxRadius: 60,
      affectsTerrain: true
    },
    ...visuals
  ];
 }

 drawProjectile(cx, cy, r) {
  push();
  noStroke();
  
  // define offsets for the 4 small projectiles in the grapeshot
  const offsets = [
    { x: -0.3, y: 0.2 }, { x: 0.3, y: 0.2 },
    { x: 0,   y: -0.3 }, { x: -0.1, y: 0.5 }
  ];

  // draw each small projectile with a metallic gradient
  offsets.forEach(off => {
    const px = cx + off.x * r;
    const py = cy + off.y * r;
    const pr = r * 0.6; 

    
    const g = drawingContext.createRadialGradient(
      px - pr * 0.3, py - pr * 0.3, pr * 0.1, 
      px, py, pr
    );
    g.addColorStop(0,   '#8e9399'); 
    g.addColorStop(0.5, '#2c2e30');
    g.addColorStop(1,   '#0a0b0c');
    drawingContext.fillStyle = g;
    ellipse(px, py, pr * 1.1, pr * 1.1);
  });

  // draw the binding structure 
  noFill();
  stroke(200, 160, 40, 150); 
  strokeWeight(1.5);
  ellipse(cx, cy, r * 1.4, r * 0.4); 

  // draw a small fuse spark (enhances weapon feel)
  noStroke();
  fill(255, 100, 0);
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'orange';
  ellipse(cx, cy - r * 0.8, 3, 3);
  
 pop();
}

 drawIcon(cx, cy, r) {
  // Use the PNG only for UI icons so the in-flight projectile keeps its JS shape.
  if (typeof grapeImg !== "undefined" && grapeImg) {
    push();
    imageMode(CENTER);
    image(grapeImg, cx, cy, 52, 52);
    pop();
    return;
  }

  this.drawProjectile(cx, cy, r);
 }

 drawExplosion(explosion) {
  this.drawStyledExplosion(explosion, {
    coreColor: color(255, 230, 150, 235),
    ringColor: color(255, 175, 70, 210),
    ringWeight: 5,
    coreScale: 0.38,
    ringScale: 0.98,
    glowInner: 'rgba(255,240,180,0.95)',
    glowMid: 'rgba(255,155,60,0.44)',
    glowOuter: 'rgba(120,50,0,0)',
    accent: 'embers',
    accentColor: color(255, 215, 120, 180)
  });
 }
  
}
