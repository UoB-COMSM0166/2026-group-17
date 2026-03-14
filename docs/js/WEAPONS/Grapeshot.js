
class Grapeshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'grapeshot', name: 'Grapeshot',
      description: 'High arc. Massive blast.',
      damage: 8,
      speed: 5,
      blastRadius: 10,
      ammo: 4,
      rarity: 'rare',
      shotRadius: 6, 
      explosionRadius: 120,
    });
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
  
}