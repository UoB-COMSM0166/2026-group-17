class Shibashot extends AbstractWeapon {
  constructor() {
    super({
      id: 'shiba',
      name: 'Shibashot',
      description: "Detonates on contact, launching enemies upward.\nSends targets flying with a forceful blast.",
      damage: 6,
      speed: 6,
      blastRadius: 6,
      ammo: 5,
      rarity: 'rare',
      shotRadius: 6,
      explosionRadius: 75,
    });
  }

  drawProjectile(cx, cy, r) {
    if (typeof shibaImg !== "undefined" && shibaImg) {
      push();
      imageMode(CENTER);
      image(shibaImg, cx, cy, 68, 68);
      pop();
      return;
    }
    push();
    noStroke();
    const g = drawingContext.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
    g.addColorStop(0, 'rgba(255,255,180,0.95)');
    g.addColorStop(0.25, 'rgba(255,160,0,0.7)');
    g.addColorStop(0.6, 'rgba(220,60,0,0.35)');
    g.addColorStop(1, 'rgba(100,0,0,0)');
    drawingContext.fillStyle = g;
    ellipse(cx, cy, r * 2, r * 2);
    fill(255, 240, 80);
    ellipse(cx, cy, r * 0.6, r * 0.6);
    pop();
  }

  drawIcon(cx, cy, r) {
    this.drawProjectile(cx, cy, r);
  }

  drawExplosion(explosion) {
    return; // shiba 不画 AbstractWeapon 默认黄圈
  }

  onImpact(match, impactEvent, shot) {
    match.spawnWeaponExplosion(impactEvent.pos, "shiba", shot, this);
    match.spawnShibaImpact(impactEvent.pos);
  }
}