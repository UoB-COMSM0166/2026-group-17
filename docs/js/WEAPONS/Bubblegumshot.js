class Bubblegumshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'bubblegumshot', name: 'Bubblegumshot',
      description: 'Sticky and explosive!',
      damage: 9, 
      speed: 8, 
      blastRadius: 9, 
      ammo: 3, 
      rarity: 'rare',
      shotRadius: 5, 
      explosionRadius: 110,
    });
  }
  drawProjectile(cx, cy, r) {
    push();
    translate(cx, cy);
    noStroke();
    // 弹体
    fill(160, 160, 160);
    ellipse(0, 0, r*1.8, r*0.7);
    // 弹头
    fill(220, 60, 40);
    triangle(-r*1.6, -r*0.35, -r*1.6, r*0.35, -r*2.5, 0);
    // 尾翼
    fill(100, 100, 100);
    triangle(r*1.1, 0, r*1.9, -r*0.9, r*1.5, 0);
    triangle(r*1.1, 0, r*1.9,  r*0.9, r*1.5, 0);
    pop();
  }
}