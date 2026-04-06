
class Pineappleshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'pineapple', name: 'Pineappleshot',
      description: 'Explosive pineapple.',
      damage: 6, 
      speed: 4, 
      blastRadius: 5, 
      ammo: 3, 
      rarity: 'rare',
      shotRadius: 4, 
      explosionRadius: 20,
    });
    this.used = false;
  }
  drawProjectile(cx, cy, r) {
    push();
    translate(cx, cy);
    rotate(frameCount * 12);
    noStroke();
    fill(180, 180, 180);
    for (let i = 0; i < 4; i++) {
      push();
      rotate(i * 90);
      triangle(0, 0, r*0.4, -r*0.4, r, 0);
      triangle(0, 0, r*0.4,  r*0.4, r, 0);
      pop();
    }
    fill(60);
    ellipse(0, 0, r*0.4, r*0.4);
    pop();
  }
}
