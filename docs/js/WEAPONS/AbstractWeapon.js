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
}