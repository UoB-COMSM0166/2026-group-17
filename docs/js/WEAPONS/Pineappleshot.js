class Pineappleshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'pineapple',
      name: 'Pineappleshot',
      description: "Releases a cloud of toxic purple gas on impact.\nEnvelops enemies in a lingering, harmful haze.",
      damage: 6,
      speed: 6,
      blastRadius: 5,
      ammo: 3,
      rarity: 'rare',
      shotRadius: 4,
      explosionRadius: 20,
    });
  }

  drawProjectile(cx, cy, r) {
    if (typeof pineappleImg !== "undefined" && pineappleImg) {
      push();
      imageMode(CENTER);
      const scale = Math.min((r * 2.8) / pineappleImg.width, (r * 2.8) / pineappleImg.height);
      image(pineappleImg, cx, cy, pineappleImg.width * scale, pineappleImg.height * scale);
      pop();
      return;
    }

    push();
    translate(cx, cy);
    rotate(frameCount * 12);
    noStroke();
    fill(180, 180, 180);
    for (let i = 0; i < 4; i++) {
      push();
      rotate(i * 90);
      triangle(0, 0, r * 0.4, -r * 0.4, r, 0);
      triangle(0, 0, r * 0.4, r * 0.4, r, 0);
      pop();
    }
    fill(60);
    ellipse(0, 0, r * 0.4, r * 0.4);
    pop();
  }

  drawIcon(cx, cy, r) {
    this.drawProjectile(cx, cy, r);
  }

  onImpact(match, impactEvent, shot) {
    match.spawnWeaponExplosion(impactEvent.pos, "pineapple", shot, this);
    match.spawnPoisonCloud(impactEvent.pos);
  }
}