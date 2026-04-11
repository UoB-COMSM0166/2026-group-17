class WeaponSystem {
  constructor() {
    this.weaponOrder = ["cannon_ball", "pineapple", "star", "shiba", "bubblegumshot", "earthworm", "impact", "grapeshot", "lazer", "Submarin"];
    this.currentWeapon = "cannon_ball";
    this.weaponData = {};
  }

  registerWeapon(id, data) {
    this.weaponData[id] = data;
  }

  getCurrentWeaponId() {
    return this.currentWeapon;
  }

  getCurrentWeapon() {
    return this.weaponData[this.currentWeapon];
  }

  setWeapon(id) {
    if (this.weaponData[id]) {
      this.currentWeapon = id;
    }
  }

  nextWeapon() {
    const idx = this.weaponOrder.indexOf(this.currentWeapon);
    const nextIdx = (idx + 1) % this.weaponOrder.length;
    this.currentWeapon = this.weaponOrder[nextIdx];
  }

  prevWeapon() {
    const idx = this.weaponOrder.indexOf(this.currentWeapon);
    const prevIdx = (idx - 1 + this.weaponOrder.length) % this.weaponOrder.length;
    this.currentWeapon = this.weaponOrder[prevIdx];
  }

  drawHUD(x = 120, y = 85) {
    const weapon = this.getCurrentWeapon();
    if (!weapon) return;

    push();
    rectMode(CENTER);
    imageMode(CENTER);
    textAlign(CENTER, CENTER);

    fill(20, 180);
    stroke(255, 120);
    strokeWeight(2);
    rect(x, y, 180, 90, 16);

    noStroke();
    fill(255);
    textSize(18);
    text("WEAPON", x, y - 28);

    if (weapon.sprite) {
      image(weapon.sprite, x - 42, y + 4, 46, 46);
    }

    fill(255);
    textSize(16);
    text(weapon.label || weapon.id, x + 25, y - 2);

    textSize(12);
    fill(210);
    text("Q / E switch", x + 25, y + 22);

    pop();
  }
}