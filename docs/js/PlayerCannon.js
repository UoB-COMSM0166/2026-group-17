class PlayerCannon {
   #positionVector;
   #wheelRadius;
   #barrelSize;
   #barrelAngle = 0;
   #barrelPower = 350;
   #savedBarrelPower = 350;
   #fillColor;
   #outlineColor;
   #targetX;
   #moveSteps = 3;
   #hitFlashFrames = 0;
   #weaponLoadout = [];
   #currentWeaponIndex = 0;


   constructor(posVec, wheelRad, barrelSz, barrAngle, moveSteps, fillColor, outColor) {
      this.#positionVector = posVec;
      this.#wheelRadius = wheelRad;
      this.#barrelSize = barrelSz;
      this.#barrelAngle = barrAngle;
      this.#savedBarrelPower = 350;
      this.#fillColor = fillColor;
      this.#outlineColor = outColor;
      this.#targetX = posVec.x; // for smooth movement
      this.#moveSteps = moveSteps;
   }

   updateMove(follow = 0.30) {
      this.#positionVector.x = lerp(this.#positionVector.x, this.#targetX, follow);
   }

   fireShot(weapon = null, target = null) {
      // offset of muzzle tip from positionVector
      this.#savedBarrelPower = this.#barrelPower;
      let offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
      const speedMultiplier = weapon ? weapon.speed / 6 : 1;
      let velocity = createVector(cos(this.#barrelAngle), sin(this.#barrelAngle))
         .mult(this.#barrelPower * speedMultiplier);
      offset.rotate(this.#barrelAngle);
      return new Projectile(
         p5.Vector.add(this.#positionVector, offset),
         velocity,
         weapon?.shotRadius ?? 4,
         weapon,
         target
      );
   }
   drawPlayer() {
      fill(this.#fillColor);
      if (this.#hitFlashFrames > 0) {
         stroke(255, 255, 0);
         strokeWeight(6);
      } else {
         stroke(this.#outlineColor);
         strokeWeight(2);
      }

      this.#drawBarrel();
      this.#drawWheel();
      this.tickEffects();
   }

   drawIndicator(playerId) {
      push();
      noFill();
      strokeWeight(4);
      // Red for player 1, blue for player 2
      const indicatorColor = (playerId === 0) ? color(255, 80, 80) : color(80, 180, 255);
      stroke(indicatorColor);
      circle(this.#positionVector.x, this.#positionVector.y, this.#wheelRadius + 15);
      const arrowY = this.#positionVector.y - 50;
      fill(indicatorColor);
      noStroke();
      triangle(
         this.#positionVector.x - 10, arrowY,
         this.#positionVector.x + 10, arrowY,
         this.#positionVector.x, arrowY + 15
      );
      pop();
   }

   triggerHitFlash(frames = 10) {
      this.#hitFlashFrames = Math.max(this.#hitFlashFrames, frames);
   }

   tickEffects() {
      if (this.#hitFlashFrames > 0) this.#hitFlashFrames--;
   }
   get barrelAngle() { return this.#barrelAngle; }
   get barrelPower() { return this.#barrelPower; }
   get lastFiredPower() { return this.#savedBarrelPower; }
   set barrelAngle(a) { this.#barrelAngle = a; }
   set barrelPower(p) { this.#barrelPower = p; }
   get positionVector() { return this.#positionVector; }
   get position() { return this.#positionVector; }
   get wheelRadius() { return this.#wheelRadius; }
   get targetX() { return this.#targetX; }
   get moveSteps() { return this.#moveSteps; }
   set moveSteps(s) { this.#moveSteps = s; }
   get barrelSize() { return this.#barrelSize; }
   get weaponLoadout() { return this.#weaponLoadout; }
   set weaponLoadout(loadout) { this.#weaponLoadout = loadout ?? []; }
   get currentWeaponIndex() { return this.#currentWeaponIndex; }
   set currentWeaponIndex(index) {
      const lastIndex = max(0, this.#weaponLoadout.length - 1);
      this.#currentWeaponIndex = constrain(index, 0, lastIndex);
   }
   get currentWeapon() {
      if (this.#weaponLoadout.length === 0) return null;
      return this.#weaponLoadout[this.#currentWeaponIndex] ?? this.#weaponLoadout[0];
   }

   cycleWeapon(step = 1) {
      if (this.#weaponLoadout.length === 0) return;
      this.#currentWeaponIndex = (this.#currentWeaponIndex + step + this.#weaponLoadout.length)
         % this.#weaponLoadout.length;
   }

   setTargetX(x, canvasWidth) {
      this.#targetX = constrain(x, this.#wheelRadius, canvasWidth - this.wheelRadius);
   }

   #drawWheel() {
      circle(this.#positionVector.x, this.#positionVector.y, this.#wheelRadius);
   }
   #drawBarrel() {
      push();
      rectMode(CENTER);
      translate(this.#positionVector.x, this.#positionVector.y);
      rotate(this.#barrelAngle);
      rect(this.#wheelRadius, 0, this.#barrelSize.x, this.#barrelSize.y);
      pop();
   }
}
