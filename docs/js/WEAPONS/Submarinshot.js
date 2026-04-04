
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
      shotRadius: 5, 
      explosionRadius: 95,
    });
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
}