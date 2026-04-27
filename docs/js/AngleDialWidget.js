class AngleDialWidget {
   //the outlook part
   static #needleColor;
   #positionVector;
   #radius;
   #plateFillColor;
   #plateOutlineColor;
   //the control part
   #isFollowing = false;
   #needleRotation = 45;
   #leftHeld = false;
   #rightHeld = false;
   #holdDelay = 180;
   #repeatInterval = 25;
   #leftHoldTimer = 0;
   #rightHoldTimer = 0;
   #lastLeftRepeat = 0;
   #lastRightRepeat = 0;

   constructor(posV = createVector(width / 6, height - height / 5), rad = 60,
      plateInColor = color('paleturquoise'),
      plateOutColor = color('teal')) {
      this.#positionVector = posV;
      this.#radius = rad;
      this.#plateFillColor = plateInColor;
      this.#plateOutlineColor = plateOutColor;
      AngleDialWidget.#needleColor = color('crimson');
   }

   drawAngleDial(player, isEnabled) {
      this.#drawPlate(isEnabled);
      this.#drawNeedle(player, isEnabled);
      this.#drawAngleText();
   }

   get isFollowing() { return this.#isFollowing; }
   get isKeyboardControlled() { return this.#leftHeld || this.#rightHeld; }
   get isHovered() { return this.#isHovered(); }
   get needleRotation() { return this.#needleRotation; }
   set needleRotation(angle) { this.#needleRotation = angle; }
   set isFollowing(track) { this.#isFollowing = track; }

   #drawPlate(isEnabled) {
      push();
      fill(this.#plateFillColor);
      if (isEnabled && this.#isHovered()) {
         strokeWeight(4);
         if (mouseButton.left) fill('darkturquoise');
      }
      else strokeWeight(2);
      stroke(this.#plateOutlineColor);
      circle(this.#positionVector.x, this.#positionVector.y, this.#radius);
      pop();
   }

   #drawNeedle(player, isEnabled) {
      push();
      translate(this.#positionVector.x, this.#positionVector.y);
      rotate(180);
      rotate(this.#needleRotation);
      if (isEnabled && (this.#isHovered() || this.#isFollowing)) {
         stroke('maroon');
         strokeWeight(2);
      }
      else noStroke();
      fill(AngleDialWidget.#needleColor);
      bezierOrder(2);
      beginShape();
      vertex(-2, 52);
      vertex(0, 56);
      vertex(2, 52);
      bezierVertex(0, 0);
      bezierVertex(15, 0);
      bezierVertex(0, 0);
      bezierVertex(1, -25);
      vertex(-1, -25);
      bezierVertex(0, 0);
      bezierVertex(-15, 0);
      bezierVertex(0, 0);
      bezierVertex(-2, 52);
      endShape();
      pop();
      this.#updateAngle(player);
   }

   #isHovered() {
      let mouseVector = createVector(mouseX, mouseY);
      return this.#positionVector.dist(mouseVector) <= this.#radius;
   }

   //Set the needle angle
   #updateAngle(player) {
      if (this.#isFollowing)
         this.#needleRotation = 90 + atan2(mouseY - this.#positionVector.y, mouseX - this.#positionVector.x);
      else if (player) this.#needleRotation = player.barrelAngle + 90;
   }

   #drawAngleText() {
      push();
      noStroke();
      fill(255);
      textSize(16);
      textAlign(CENTER, CENTER);
      const angle = ((360 - (this.#needleRotation - 90)) % 360).toFixed(0);
      text(`Angle: ${angle} °`, this.#positionVector.x, this.#positionVector.y - this.#radius * 1.5);
      pop();
   }

   //----------------keyboard control for angle dial-----------------
   handleKeypressed(keyId) {
      const pressedKey = keyId.toLowerCase();
      const now = millis();

      if (pressedKey === 'a') {
         this.#isFollowing = false;
         this.#leftHeld = true;
         this.#leftHoldTimer = now;
         this.#lastLeftRepeat = now;
         this.#needleRotation -= 1;
         this.#rightHeld = false;
      }
      else if (pressedKey === 'd') {
         this.#isFollowing = false;
         this.#rightHeld = true;
         this.#rightHoldTimer = now;
         this.#lastRightRepeat = now;
         this.#needleRotation += 1;
         this.#leftHeld = false;
      }
   }

   handleKeyReleased(keyId) {
      const releasedKey = keyId.toLowerCase();
      if (releasedKey === 'a') this.#leftHeld = false;
      if (releasedKey === 'd') this.#rightHeld = false;
   }

   updateKeyboardControl(controlable = true) {
      if (!controlable) return;

      const now = millis();

      // Only allow turning if exactly one of the keys is registered as held
      if (this.#leftHeld && this.#rightHeld) return;

      if (this.#leftHeld) {
         const heldLongEnough = now - this.#leftHoldTimer > this.#holdDelay;
         const shouldRepeat = now - this.#lastLeftRepeat > this.#repeatInterval;
         if (heldLongEnough && shouldRepeat) {
            this.#needleRotation -= 1;
            this.#lastLeftRepeat = now;
         }
      }
      else if (this.#rightHeld) {
         const heldLongEnough = now - this.#rightHoldTimer > this.#holdDelay;
         const shouldRepeat = now - this.#lastRightRepeat > this.#repeatInterval;
         if (heldLongEnough && shouldRepeat) {
            this.#needleRotation += 1;
            this.#lastRightRepeat = now;
         }
      }
   }
}