class PlayerCannon {
    #positionVector;
    #wheelRadius;
    #barrelSize;
    #barrelAngle = 0;
    #barrelPower = 50;
    #fillColor;
    #outlineColor;
    #targetX;
      #hitFlashFrames = 0;
  #hitFlashMax = 10;


    constructor(posVec, wheelRad, barrelSz, barrAngle, fillColor, outColor) {
        this.#positionVector = posVec;
        this.#wheelRadius = wheelRad;
        this.#barrelSize = barrelSz;
        this.#barrelAngle = barrAngle;
        this.#fillColor = fillColor;
        this.#outlineColor = outColor;
        this.#targetX = posVec.x; // for smooth movement
    }

    updateMove(follow = 0.30) {
      this.#positionVector.x = lerp(this.#positionVector.x, this.#targetX, follow);
    }

    fireShot(shotRadius) {
        // offset of muzzle tip from positionVector
        let offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
        let velocity = createVector(cos(this.#barrelAngle), sin(this.#barrelAngle)).mult(this.#barrelPower);
        offset.rotate(this.#barrelAngle);
        return new Projectile(p5.Vector.add(this.#positionVector, offset), velocity, shotRadius);
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

    triggerHitFlash(frames = 10) {
    this.#hitFlashFrames = Math.max(this.#hitFlashFrames, frames);
  }

  tickEffects() {
    if (this.#hitFlashFrames > 0) this.#hitFlashFrames--;
  }
    get barrelAngle() { return this.#barrelAngle; }
    get barrelPower() { return this.#barrelPower; }
    set barrelAngle(a) { this.#barrelAngle = a; }
    set barrelPower(p) { this.#barrelPower = p; }
    get positionVector() { return this.#positionVector; }
    get position() { return this.#positionVector; }
    get wheelRadius() { return this.#wheelRadius; }
    get targetX() { return this.#targetX; }
    set targetX(x) { this.#targetX = x; } 

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