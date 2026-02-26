class PlayerCannon {
    #positionVector;
    #wheelRadius;
    #barrelSize;
    #barrelAngle = 0;
    #barrelPower = 0;
    #fillColor;
    #outlineColor;

    constructor(posVec, wheelRad, barrelSz, barrAngle, fillColor, outColor) {
        this.#positionVector = posVec;
        this.#wheelRadius = wheelRad;
        this.#barrelSize = barrelSz;
        this.#barrelAngle = barrAngle;
        this.#fillColor = fillColor;
        this.#outlineColor = outColor;
    }

    fireShot(shotRadius) {
        // this value can be used for the power
        //const SPEED = 300;
        // offset of muzzle tip from positionVector
        let offset = createVector(this.#wheelRadius + this.#barrelSize.x / 2, 0);
        let velocity = createVector(cos(this.#barrelAngle), sin(this.#barrelAngle)).mult(this.#barrelPower);
        offset.rotate(this.#barrelAngle);
        return new Projectile(p5.Vector.add(this.#positionVector, offset), velocity, shotRadius);
    }
    drawPlayer() {
        fill(this.#fillColor);
        stroke(this.#outlineColor);
        this.#drawBarrel();
        this.#drawWheel();
    }


    get barrelAngle() { return this.#barrelAngle; }
    get barrelPower() { return this.#barrelPower; }
    set barrelAngle(needleAngle) { this.#barrelAngle = needleAngle; }
    set barrelPower(power) { this.#barrelPower = power; }

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