class PlayerCannon {
    #positionVector;
    #wheelRadius;
    #barrelSize;
<<<<<<< HEAD
=======
    #barrelAngle = 0;
>>>>>>> 179dcb5bf8fe382958ada10e247a2614121db903
    #fillColor;
    #outlineColor;

    constructor(posVec, wheelRad, barrelSz, fillColor, outColor) {
        this.#positionVector = posVec;
        this.#wheelRadius = wheelRad;
        this.#barrelSize = barrelSz;
        this.#fillColor = fillColor;
        this.#outlineColor = outColor;
    }

<<<<<<< HEAD
=======
    fireShot(shotRadius) {
        // this value can be used for the power
        const SPEED = 300;
        // offset of muzzle tip from positionVector
        let offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
        let velocity = createVector(cos(this.#barrelAngle), sin(this.#barrelAngle)).mult(SPEED);
        offset.rotate(this.#barrelAngle);
        return new Projectile(p5.Vector.add(this.#positionVector, offset), velocity, shotRadius);
    }
>>>>>>> 179dcb5bf8fe382958ada10e247a2614121db903
    drawPlayer() {
        fill(this.#fillColor);
        stroke(this.#outlineColor);
        this.#drawBarrel();
        this.#drawWheel();
    }

<<<<<<< HEAD
    #drawWheel() {
        circle(this.#positionVector.x, this.#positionVector.y,
            this.#wheelRadius);
=======
    set barrelAngle(needleAngle) { this.#barrelAngle = needleAngle; }

    #drawWheel() {
        circle(this.#positionVector.x, this.#positionVector.y, this.#wheelRadius);
>>>>>>> 179dcb5bf8fe382958ada10e247a2614121db903
    }
    #drawBarrel() {
        push();
        rectMode(CENTER);
        translate(this.#positionVector.x, this.#positionVector.y);
<<<<<<< HEAD
        rotate(controlPanel.angleDial.needleRotation - 90);
        rect(this.#wheelRadius, 0,
            this.#barrelSize.x, this.#barrelSize.y);
=======
        rotate(this.#barrelAngle);
        rect(this.#wheelRadius, 0, this.#barrelSize.x, this.#barrelSize.y);
>>>>>>> 179dcb5bf8fe382958ada10e247a2614121db903
        pop();
    }
}