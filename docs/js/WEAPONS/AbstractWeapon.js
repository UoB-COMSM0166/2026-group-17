class AbstractWeapon {
  constructor(cfg) {
    if (new.target === AbstractWeapon)
      throw new Error('AbstractWeapon cannot be instantiated directly');

    this.id = cfg.id;
    this.name = cfg.name;
    this.description = cfg.description;
    this.damage = cfg.damage;
    this.speed = cfg.speed;
    this.blastRadius = cfg.blastRadius;
    this.ammo = cfg.ammo;
    this.rarity = cfg.rarity;
    this.shotRadius = cfg.shotRadius ?? 4;
    this.explosionRadius = cfg.explosionRadius ?? 60;

    this.ammoLeft = this.ammo;
    this.used = false;
  }

  resetUsage() {
    this.used = false;
    this.ammoLeft = this.ammo;
  }

  consume() {
    // one-use style compatibility
    if (this.used) return false;
    this.used = true;
    this.ammoLeft = max(0, this.ammoLeft - 1);
    return true;
  }

  resetAmmo() {
    this.resetUsage();
  }

  useAmmo() {
    return this.consume();
  }

  drawProjectile(cx, cy, r) {
    throw new Error("drawProjectile() must be implemented");
  }

  drawIcon(cx, cy, r) {
    this.drawProjectile(cx, cy, r);
  }

  beforeProjectileStep(projectile, context) {}

  drawProjectileInstance(projectile) {
    this.drawProjectile(projectile.position.x, projectile.position.y, projectile.radius);
  }

  onImpact(match, impactEvent, shot) {
    // Weapons can return one or many explosion specs from a single impact.
    const specs = this.createExplosionsFromImpact(impactEvent.pos, shot);
    for (const spec of specs) {
      match.spawnWeaponExplosion(
        spec.position ?? impactEvent.pos,
        spec.kind ?? (this.id === "ball" ? "ball" : this.id),
        shot,
        spec.weapon ?? this,
        spec
      );
    }
  }

  createExplosionsFromImpact(impactPosition, projectile) {
    return [{ position: impactPosition.copy(), weapon: this }];
  }

  drawExplosion(explosion) {
    push();
    strokeWeight(3);
    stroke('orange');
    fill('yellow');
    circle(explosion.position.x, explosion.position.y, explosion.radius);
    pop();
  }

  drawStyledExplosion(explosion, style) {
    const progress = constrain(explosion.progress, 0, 1);
    const shockRadius = explosion.radius * (0.9 + progress * 0.5);
    const coreRadius = max(8, explosion.radius * style.coreScale);
    const ringRadius = max(coreRadius, explosion.radius * style.ringScale);

    push();
    noStroke();

    const glow = drawingContext.createRadialGradient(
      explosion.position.x, explosion.position.y, 0,
      explosion.position.x, explosion.position.y, max(10, shockRadius)
    );
    glow.addColorStop(0, style.glowInner);
    glow.addColorStop(0.35, style.glowMid);
    glow.addColorStop(1, style.glowOuter);
    drawingContext.fillStyle = glow;
    ellipse(explosion.position.x, explosion.position.y, shockRadius, shockRadius);

    fill(style.coreColor);
    ellipse(explosion.position.x, explosion.position.y, coreRadius, coreRadius);

    noFill();
    stroke(style.ringColor);
    strokeWeight(style.ringWeight);
    ellipse(explosion.position.x, explosion.position.y, ringRadius, ringRadius);

    this.drawExplosionAccent(explosion, style, progress, shockRadius, coreRadius);
    pop();
  }

  drawExplosionAccent(explosion, style, progress, shockRadius, coreRadius) {
    const accentMode = style.accent;

    if (accentMode === 'spark') {
      stroke(style.accentColor);
      strokeWeight(2);
      for (let i = 0; i < 10; i++) {
        const angle = frameCount * 4 + i * 36;
        const inner = coreRadius * 0.45;
        const outer = shockRadius * (0.55 + 0.15 * sin(frameCount * 5 + i * 20));
        line(
          explosion.position.x + cos(angle) * inner,
          explosion.position.y + sin(angle) * inner,
          explosion.position.x + cos(angle) * outer,
          explosion.position.y + sin(angle) * outer
        );
      }
    } else if (accentMode === 'diamond') {
      noStroke();
      fill(style.accentColor);
      for (let i = 0; i < 3; i++) {
        const size = shockRadius * (0.25 + i * 0.08);
        push();
        translate(explosion.position.x, explosion.position.y);
        rotate(frameCount * 1.5 + i * 30);
        quad(0, -size, size, 0, 0, size, -size, 0);
        pop();
      }
    } else if (accentMode === 'petal') {
      noStroke();
      fill(style.accentColor);
      for (let i = 0; i < 6; i++) {
        const angle = i * 60 + frameCount * 2;
        const px = explosion.position.x + cos(angle) * shockRadius * 0.28;
        const py = explosion.position.y + sin(angle) * shockRadius * 0.28;
        ellipse(px, py, coreRadius * 0.55, shockRadius * 0.22);
      }
    } else if (accentMode === 'cross') {
      stroke(style.accentColor);
      strokeWeight(3);
      const size = shockRadius * (0.55 + progress * 0.15);
      line(explosion.position.x - size, explosion.position.y, explosion.position.x + size, explosion.position.y);
      line(explosion.position.x, explosion.position.y - size, explosion.position.x, explosion.position.y + size);
      line(
        explosion.position.x - size * 0.75, explosion.position.y - size * 0.75,
        explosion.position.x + size * 0.75, explosion.position.y + size * 0.75
      );
      line(
        explosion.position.x - size * 0.75, explosion.position.y + size * 0.75,
        explosion.position.x + size * 0.75, explosion.position.y - size * 0.75
      );
    } else if (accentMode === 'embers') {
      noStroke();
      fill(style.accentColor);
      for (let i = 0; i < 12; i++) {
        const angle = i * 30 + frameCount * 3;
        const distance = shockRadius * (0.25 + (i % 3) * 0.18);
        const px = explosion.position.x + cos(angle) * distance;
        const py = explosion.position.y + sin(angle) * distance;
        ellipse(px, py, 4 + (i % 3) * 2, 4 + (i % 3) * 2);
      }
    } else if (accentMode === 'shards') {
      stroke(style.accentColor);
      strokeWeight(2);
      for (let i = 0; i < 8; i++) {
        const angle = i * 45 + frameCount * 2;
        const start = shockRadius * 0.35;
        const end = shockRadius * 0.7;
        line(
          explosion.position.x + cos(angle) * start,
          explosion.position.y + sin(angle) * start,
          explosion.position.x + cos(angle + 8) * end,
          explosion.position.y + sin(angle + 8) * end
        );
      }
    }
  }
}
