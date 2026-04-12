class PlayerCannon {
   #position;
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

   constructor(config) {
      this.#position = config.position;
      this.#wheelRadius = config.wheelRadius;
      this.#barrelSize = config.barrelSize;
      this.#barrelAngle = config.barrelAngle;
      this.#savedBarrelPower = 350;

      this.#fillColor = config.fillColor;
      this.#outlineColor = config.strokeColor;
      this.#targetX = config.position.x; // for smooth movement
      this.#moveSteps = config.moveSteps
      this.stuckUntilTurn = 0; //Turn-based status
      this.#setLoadout(config.weaponLoadout);
      // special-weapon / physics-related state
      this.isAirborne = false;
      this.verticalVelocity = 0;
      this.pendingCraterRadius = 0;
   }

   updateMove(follow = 0.30) {
      this.#position.x = lerp(this.#position.x, this.#targetX, follow);
   }

   fireCurrentWeapon() {
      const weapon = this.#weaponLoadout[this.#currentWeaponIndex];
      if (!weapon || !weapon.consume()) return null;
      const projectile = this.#fireShot(weapon);
      if (weapon.id !== "ball") {
         this.#weaponLoadout.splice(this.#currentWeaponIndex, 1);
         this.#currentWeaponIndex = constrain(this.#currentWeaponIndex, 0, max(0, this.#weaponLoadout.length - 1));
      }
      return projectile;
   }

   startShibaLaunch(strength, craterRadius) {
      this.isAirborne = true;
      this.verticalVelocity = -strength;
      this.pendingCraterRadius = craterRadius;
   }

   cycleWeapon(step = 1) {
      if (this.#weaponLoadout.length === 0) return;
      this.#currentWeaponIndex = (this.#currentWeaponIndex + step + this.#weaponLoadout.length) % this.#weaponLoadout.length;
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
      //Draw sticky gum effect
      if(this.stuckUntilTurn > 0){
         push();
         noStroke();
         fill(255, 120, 180, 150);
         ellipse(this.#position.x, this.#position.y, this.#wheelRadius * 2);
         pop();
      }
   }

   drawIndicator(playerId) {
      push();
      noFill();
      strokeWeight(4);
      // Red for player 1, blue for player 2
      const indicatorColor = (playerId === 0) ? color(255, 80, 80) : color(80, 180, 255);
      stroke(indicatorColor);

      circle(this.#position.x, this.#position.y, this.#wheelRadius + 15);
      const arrowY = this.#position.y - 50;

      fill(indicatorColor);
      noStroke();
      triangle(
         this.#position.x - 10, arrowY,
         this.#position.x + 10, arrowY,
         this.#position.x, arrowY + 15
      );
      pop();
   }

   checkCollision(shotPosition, shotRadius) {
      return this.getDistanceTo(shotPosition) < shotRadius;
   }

   triggerHitFlash(frames = 10) {
      this.#hitFlashFrames = max(this.#hitFlashFrames, frames);
   }

   tickEffects() {
      if (this.#hitFlashFrames > 0) this.#hitFlashFrames--;
   }

   #fireShot(weapon = null) {
      // offset of muzzle tip from position
      this.#savedBarrelPower = this.#barrelPower;
      const offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
      offset.rotate(this.#barrelAngle);
      // Keep the same base trajectory for all projectile weapons
      const velocity = createVector(cos(this.#barrelAngle), sin(this.#barrelAngle)).mult(this.#barrelPower);
      const muzzlePosition = p5.Vector.add(this.#position, offset);
      return new Projectile(muzzlePosition, velocity, this, weapon);
   }

   #setLoadout(loadout) {
      if (loadout?.length > 0) {
         this.#weaponLoadout = loadout;
         loadout.forEach(w => w.resetUsage());
      }
   }

   #drawWheel() {
      circle(this.#position.x, this.#position.y, this.#wheelRadius);
   }

   #drawBarrel() {
      push();
      rectMode(CENTER);
      translate(this.#position.x, this.#position.y);
      rotate(this.#barrelAngle);
      rect(this.#wheelRadius, 0, this.#barrelSize.x, this.#barrelSize.y);
      pop();
   }

   get barrelAngle() { return this.#barrelAngle; }
   get barrelPower() { return this.#barrelPower; }
   get lastFiredPower() { return this.#savedBarrelPower; }
   set barrelAngle(a) { this.#barrelAngle = a; }
   set barrelPower(p) { this.#barrelPower = p; }

   get position() { return this.#position; }

   get targetX() { return this.#targetX; }
   get wheelRadius() { return this.#wheelRadius; }
   get moveSteps() { return this.#moveSteps; }
   set moveSteps(s) { this.#moveSteps = s; }
   get barrelSize() { return this.#barrelSize; }

   get weaponLoadout() { return this.#weaponLoadout; }
   set weaponLoadout(loadout) { this.#weaponLoadout = loadout ?? []; }
   get currentWeaponIndex() { return this.#currentWeaponIndex; }
   set currentWeaponIndex(index) {
      // Ensure the index stays within the bounds of the current loadout
      this.#currentWeaponIndex = constrain(index, 0, max(0, this.#weaponLoadout.length - 1));
   }

   get currentWeapon() {
      if (this.#weaponLoadout.length === 0) return null;
      return this.#weaponLoadout[this.#currentWeaponIndex] ?? this.#weaponLoadout[0];
   }

   setTargetX(x, canvasWidth) {
      this.#targetX = constrain(x, this.#wheelRadius, canvasWidth - this.#wheelRadius);
   }

   getDistanceTo(targetPosition) {
      const distanceToWheelCenter = p5.Vector.dist(this.#position, targetPosition);
      const distanceToWheelSurface = max(0, distanceToWheelCenter - this.#wheelRadius);
      const relativeTargetPos = p5.Vector.sub(targetPosition, this.#position);
      const restoringAngle = -this.#barrelAngle;
      // rotate target point to barrel's local coordinate system
      const rotatedTargetPos = createVector(
         relativeTargetPos.x * cos(restoringAngle) - relativeTargetPos.y * sin(restoringAngle),
         relativeTargetPos.x * sin(restoringAngle) + relativeTargetPos.y * cos(restoringAngle)
      );
      // barrel dimensions
      const halfBarrelSz = p5.Vector.div(this.#barrelSize, 2);
      const barrelCenterX = this.#wheelRadius;
      // find closest point on axis-aligned bounding box edge to target's center
      const closestBarrelPoint = createVector(
         constrain(rotatedTargetPos.x, barrelCenterX - halfBarrelSz.x, barrelCenterX + halfBarrelSz.x),
         constrain(rotatedTargetPos.y, -halfBarrelSz.y, halfBarrelSz.y)
      );
      const distanceToBarrelSurface = dist(rotatedTargetPos.x, rotatedTargetPos.y, closestBarrelPoint.x, closestBarrelPoint.y);
      return min(distanceToWheelSurface, distanceToBarrelSurface);
   }

   canAct(turnController){
      return turnController.turnNumber >= this.stuckUntilTurn;
   }
}
