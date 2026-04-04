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
  }

  resetAmmo() {
    this.ammoLeft = this.ammo;
  }

  useAmmo() {
    if (this.ammoLeft <= 0) return false;
    this.ammoLeft--;
    return true;
  }

  drawProjectile(cx, cy, r) {
    throw new Error("drawProjectile() must be implemented");
  }

  drawIcon(cx, cy, r) {
    this.drawProjectile(cx, cy, r);
  }

  onImpact(match, impactEvent, shot) {
    match.spawnWeaponExplosion(
      impactEvent.pos,
      this.id === "ball" ? "ball" : this.id,
      shot,
      this
    );
  }
}