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
      this.#targetX = posVec.x; // for smooth movement
      this.#moveSteps = moveSteps;
      this.stuckUntilTurn = 0; //Turn-based status
   }

   updateMove(follow = 0.30) {
      this.#positionVector.x = lerp(this.#positionVector.x, this.#targetX, follow);
   }
   //Return true if the cannon can act this turn
   canAct(turnController){
      return turnController.turnNumber >= this.stuckUntilTurn;
   }

   fireShot(weapon, shotRadius) {
      // offset of muzzle tip from positionVector
      this.#savedBarrelPower = this.#barrelPower;
      let offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
      let velocity = createVector(cos(this.#barrelAngle), sin(this.#barrelAngle)).mult(this.#barrelPower);
      offset.rotate(this.#barrelAngle);
      return new Projectile(p5.Vector.add(this.#positionVector, offset), velocity, shotRadius, weapon);
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
         fill(255, 120, 180, 150);
         noStroke();
         ellipse(this.#positionVector.x, this.#positionVector.y, this.#wheelRadius * 2);
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
