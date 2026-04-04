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

   constructor(posVec, wheelRad, barrelSz, barrAngle, moveSteps, fillColor, outColor) {
      this.#positionVector = posVec;
      this.#wheelRadius = wheelRad;
      this.#barrelSize = barrelSz;
      this.#barrelAngle = barrAngle;
      this.#savedBarrelPower = 350;
      this.#fillColor = fillColor;
      this.#outlineColor = outColor;
      this.#targetX = posVec.x;
      this.#moveSteps = moveSteps;

      // special-weapon / physics-related state
      this.weaponLoadout = [];
      this.currentWeaponIndex = 0;
      this.isAirborne = false;
      this.verticalVelocity = 0;
      this.pendingCraterRadius = 0;
   }

   updateMove(follow = 0.30) {
      this.#positionVector.x = lerp(this.#positionVector.x, this.#targetX, follow);
   }

   getCurrentWeapon() {
      if (!this.weaponLoadout || this.weaponLoadout.length === 0) return null;
      return this.weaponLoadout[this.currentWeaponIndex];
   }

   nextWeapon() {
      if (!this.weaponLoadout || this.weaponLoadout.length === 0) return;
      this.currentWeaponIndex = (this.currentWeaponIndex + 1) % this.weaponLoadout.length;
   }

   prevWeapon() {
      if (!this.weaponLoadout || this.weaponLoadout.length === 0) return;
      this.currentWeaponIndex =
         (this.currentWeaponIndex - 1 + this.weaponLoadout.length) % this.weaponLoadout.length;
   }

   fireShot(defaultShotRadius, weapon = null) {
      this.#savedBarrelPower = this.#barrelPower;

      const offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
      offset.rotate(this.#barrelAngle);

      const velocity = createVector(
         cos(this.#barrelAngle),
         sin(this.#barrelAngle)
      ).mult(this.#barrelPower);

      if (weapon?.useAmmo && !weapon.useAmmo()) return null;

      return new Projectile(
         p5.Vector.add(this.#positionVector, offset),
         velocity,
         weapon?.shotRadius ?? defaultShotRadius,
         weapon?.id ?? "ball"
      );
   }

   startShibaLaunch(strength, craterRadius) {
      this.isAirborne = true;
      this.verticalVelocity = -strength;
      this.pendingCraterRadius = craterRadius;
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

   setTargetX(x, canvasWidth) {
      this.#targetX = constrain(x, this.#wheelRadius, canvasWidth - this.#wheelRadius);
   }

   get barrelAngle() { return this.#barrelAngle; }
   get barrelPower() { return this.#barrelPower; }
   get lastFiredPower() { return this.#savedBarrelPower; }
   get positionVector() { return this.#positionVector; }
   get position() { return this.#positionVector; }
   get wheelRadius() { return this.#wheelRadius; }
   get targetX() { return this.#targetX; }
   get moveSteps() { return this.#moveSteps; }
   get barrelSize() { return this.#barrelSize; }

   set barrelAngle(a) { this.#barrelAngle = a; }
   set barrelPower(p) { this.#barrelPower = p; }
   set targetX(x) { this.#targetX = x; }
   set moveSteps(s) { this.#moveSteps = s; }

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