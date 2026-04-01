class AbstractWeapon {
  constructor(cfg) {
    //if this class is being instantiated directly, throw an error
    //to make sure only subclasses can be instantiated
    if (new.target === AbstractWeapon)
      throw new Error('AbstractWeapon cannot be instantiated directly');
    //id of the weapon, used for identification and saving/loading
    this.id = cfg.id;
    //name of the weapon
    this.name = cfg.name;
    //description of the weapon
    this.description = cfg.description;
    //damage of the weapon
    this.damage = cfg.damage;
    //speed of the projectile
    this.speed = cfg.speed;
    //blast radius of the explosion
    this.blastRadius = cfg.blastRadius;
    //ammo count of the weapon
    this.ammo = cfg.ammo;
    //rarity of the weapon, can be 'common', 'rare', or 'legendary'
    this.rarity = cfg.rarity;
    // radius of the projectile when shot(the size of bullet)
    this.shotRadius = cfg.shotRadius ?? 4;
    // radius of the explosion when it hits
    this.explosionRadius = cfg.explosionRadius ?? 60;
    //initialize ammoLeft to ammo
    this.ammoLeft = this.ammo;
  }
  //manage ammo used in battle, reset ammo when new battle starts
  resetAmmo() {
    this.ammoLeft = this.ammo;
  }
//returns true if ammo is used successfully, false if no ammo left
  useAmmo() {
    if (this.ammoLeft <= 0) return false;
    this.ammoLeft--;
    return true;
  }
//subclasses must implement this method to draw the projectile when shot
  drawProjectile(cx, cy, r) {
    throw new Error("drawProjectile() must be implemented");
  }
//the small icon in the weapon shop can just reuse the projectile drawing
  drawIcon(cx, cy, r) {
    this.drawProjectile(cx, cy, r);
  }

  beforeProjectileStep(projectile, context) {}

  drawProjectileInstance(projectile) {
    this.drawProjectile(projectile.position.x, projectile.position.y, projectile.radius);
  }

  createExplosionsFromImpact(impactPosition, projectile) {
    return [{ position: impactPosition.copy() }];
  }

  drawExplosion(explosion) {
    this.drawStyledExplosion(explosion, {
      coreColor: color(255, 225, 90, 225),
      ringColor: color(255, 140, 40, 210),
      ringWeight: 4,
      coreScale: 0.3,
      ringScale: 0.88,
      glowInner: 'rgba(255,245,170,0.9)',
      glowMid: 'rgba(255,150,40,0.35)',
      glowOuter: 'rgba(255,80,0,0)',
      accent: 'spark',
      accentColor: color(255, 220, 120, 185)
    });
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
