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
      explosionRadius: 30,
    });
    this.used = false;
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

}
