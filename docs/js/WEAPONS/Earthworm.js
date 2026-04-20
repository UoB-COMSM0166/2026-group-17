// 3. Earthworm
class Earthworm extends AbstractWeapon {
  constructor() {
    super({
      id: 'earthworm', name: 'Earthworm',
      description: 'Burrows underground, hiding beneath the terrain. \nMoves randomly while tracking the opponent\'s cannon, then explodes on contact.',
      damage: 8,
      speed: 4,
      blastRadius: 8,
      ammo: 4, 
      rarity: 'common',
      shotRadius: 5, 
      explosionRadius: 90,
    });
    this.used = false;
  }
  
  drawIcon(x, y, size){
     if(!earthwormImg) return;

     push();
     imageMode(CENTER);
     image(earthwormImg, x, y, 60, 60);
     pop();
  }

  drawProjectile(cx, cy, r) {
    push();
    noStroke();
    const g = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r*2.5);
    g.addColorStop(0,    'rgba(255,255,255,1)');
    g.addColorStop(0.15, 'rgba(220,100,255,0.9)');
    g.addColorStop(0.55, 'rgba(120,0,220,0.4)');
    g.addColorStop(1,    'rgba(60,0,120,0)');
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r*2.5, r*2.5);
    stroke(210, 100, 255, 200);
    strokeWeight(r*0.1);
    for (let a = 0; a < 3; a++) {
      const angle = frameCount * 4 + a * 120;
      const x2 = cx + cos(angle) * r * 1.2;
      const y2 = cy + sin(angle) * r * 1.2;
      line(cx, cy, x2, y2);
    }
    pop();
  }

  drawExplosion(explosion){
    
    push();
    noStroke();

    const centerX = explosion.position.x;
    const centerY = explosion.position.y;
    const progress = explosion.progress; 
    const baseRadius = explosion.maxRadius;

    const animationProgress = progress;
    //Wave on undergrand
    const pulseStrength = sin(animationProgress * PI);

    const currentRadius = baseRadius * (0.5 + pulseStrength * 1.3);
    //Gradation for the terrain
    const gradient = drawingContext.createRadialGradient(
      centerX, centerY, 0, centerX, centerY, currentRadius
    );
    gradient.addColorStop(0, 'rgba(90, 40, 20, 0.95)');
    gradient.addColorStop(0.4, 'rgba(140, 70, 30, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    drawingContext.fillStyle = gradient;

    ellipse(centerX, centerY, currentRadius * 2, currentRadius * 1.2);
    
    stroke(120, 80, 40, 180);
    strokeWeight(2);

    for(let index = 0; index < 6; index++){
      const angle = frameCount * 0.2 + index;

      const offsetX = cos(angle) * 12 * pulseStrength;
      const offsetY = sin(angle) * 6 * pulseStrength;

      point(centerX + offsetX, centerY + offsetY);
    }
    pop();
  }

  onImpact(match, impactEvent, shot){
    const pos = impactEvent?.pos;
    if(!pos) return;

    const impactPos = pos.copy ? pos.copy() : createVector(pos.x, pos.y);
    //Worm effect
    match.spawnEarthWorm(impactPos, this);
  }
}