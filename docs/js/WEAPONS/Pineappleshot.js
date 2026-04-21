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
      const scale = Math.min((r * 6) / pineappleImg.width, (r * 6) / pineappleImg.height);
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
    if (typeof pineappleImg !== "undefined" && pineappleImg) {
      push();
      imageMode(CENTER);
      const maxW = r * 2.6;
      const maxH = r * 2.6;
      const scale = Math.min(maxW / pineappleImg.width, maxH / pineappleImg.height);
      image(pineappleImg, cx, cy, pineappleImg.width * scale, pineappleImg.height * scale);
      pop();
      return;
    }
    this.drawProjectile(cx, cy, r);
  }

  onImpact(match, impactEvent, shot) {
    match.spawnWeaponExplosion(impactEvent.pos, "pineapple", shot, this);
    match.spawnPoisonCloud(impactEvent.pos);
  }
}