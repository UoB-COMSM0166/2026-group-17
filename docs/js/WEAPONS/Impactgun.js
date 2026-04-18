class ImpactGun extends AbstractWeapon {
  constructor() {
    super({
      id: 'impact', name: 'Impact Gun',
      description: 'Instant hit. No arc.',
      damage: 10, 
      speed: 10, 
      blastRadius: 2,
      ammo: 3, 
      rarity: 'legendary',
      shotRadius: 3,
      explosionRadius: 150,
    });
    this.used = false;
  }

  drawIcon(x, y, size){
   if(!impactgunImg) return;

   push();
   imageMode(CENTER);
   image(impactgunImg, x, y, 60, 60);
   pop();
  }

  drawProjectile(cx, cy, r) {
    push();
    noStroke();
    const g = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r*2.2);
    g.addColorStop(0,   'rgba(0,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(0,140,255,0.4)');
    g.addColorStop(1,   'rgba(0,80,255,0)');
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r*2.2, r*2.2);
    fill(255);
    ellipse(cx, cy, r*0.5, r*0.5);
    pop();
  }

  drawExplosion(explosion){
    const x = explosion.position.x;
    const y = explosion.position.y;
    const r = explosion.radius;
    const progress = explosion.progress;

    push();
    //Lighting spikes
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'cyan';
    //main shock ring
    const shock = sin(progress * PI);
  
    noFill();
    stroke(0, 220, 255, 220);
    strokeWeight(4);
    circle(x, y, r * (1 + shock * 0.8));
    //secondary ring
    stroke(0, 120, 255, 120);
    strokeWeight(6);
    circle(x, y, r * 1.2);
    //Core effect
    noStroke();
    fill(225, 255, 255, 220);
    circle(x, y, r * 0.4);
    //Outline glow
    fill(0, 180, 255, 80);
    circle(x, y, r * 1.5);

    pop();
  }

  onImpact(match, impactEvent, shot){    
    const pos = impactEvent?.position || impactEvent?.pos;
    if(!pos) return;

    match.spawnWeaponExplosion(pos, "impact", shot, this, {
      maxRadius: 130, 
      duration: 350,
    });
  }
}
