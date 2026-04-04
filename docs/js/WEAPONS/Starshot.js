class Starshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'star',
      name: 'Starshot',
      description: 'Star burst shot.',
      damage: 5,
      speed: 6,
      blastRadius: 7,
      ammo: 4,
      rarity: 'rare',
      shotRadius: 5,
      explosionRadius: 80,
    });
    this.used = false;
  }

  drawProjectile(cx, cy, r) {
    if (typeof starImg !== "undefined" && starImg) {
      push();
      imageMode(CENTER);
      image(starImg, cx, cy, 66, 66);
      pop();
      return;
    }

    this.#drawVectorStar(cx, cy, r);
  }

  drawIcon(cx, cy, r) {
    this.drawProjectile(cx, cy, r);
  }

  onImpact(match, impactEvent, shot) {
    match.spawnWeaponExplosion(impactEvent.pos, "star", shot, this);
  }

  #drawVectorStar(cx, cy, r) {
    push();
    translate(cx, cy);
    noStroke();
    fill(255, 220, 90);

    beginShape();
    for (let i = 0; i < 10; i++) {
      const ang = -HALF_PI + i * PI / 5;
      const rr = i % 2 === 0 ? r * 1.8 : r * 0.8;
      vertex(cos(ang) * rr, sin(ang) * rr);
    }
    endShape(CLOSE);

    fill(255, 255, 255, 160);
    circle(0, 0, r * 0.8);
    pop();
  }
}
