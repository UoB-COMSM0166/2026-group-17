class PlayerCannon {
    #positionVector;
    #wheelRadius;
    #barrelSize;
    #fillColor;
    #outlineColor;

    constructor(posVec, wheelRad, barrelSz, fillColor, outColor) {
        this.#positionVector = posVec;
        this.#wheelRadius = wheelRad;
        this.#barrelSize = barrelSz;
        this.#fillColor = fillColor;
        this.#outlineColor = outColor;
    }

    drawPlayer() {
        fill(this.#fillColor);
        stroke(this.#outlineColor);
        this.#drawBarrel();
        this.#drawWheel();
    }

    #drawWheel() {
        circle(this.#positionVector.x, this.#positionVector.y,
            this.#wheelRadius);
    }
    #drawBarrel() {
        push();
        rectMode(CENTER);
        translate(this.#positionVector.x, this.#positionVector.y);
        rotate(controlPanel.angleDial.needleRotation - 90);
        rect(this.#wheelRadius, 0,
            this.#barrelSize.x, this.#barrelSize.y);
        pop();
    }
}