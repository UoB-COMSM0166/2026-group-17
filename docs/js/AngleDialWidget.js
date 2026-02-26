class AngleDialWidget {
    static #needleColor;
    #positionVector;
    #radius;
    #plateFillColor;
    #plateOutlineColor;
    #isFollowing = false;
    #needleRotation = 0;

    constructor(posV = createVector(width / 6, height - height / 5), rad = 60,
        plateInColor = color('paleturquoise'),
        plateOutColor = color('teal')) {
        this.#positionVector = posV;
        this.#radius = rad;
        this.#plateFillColor = plateInColor;
        this.#plateOutlineColor = plateOutColor;
        //THIS.??
        AngleDialWidget.#needleColor = color('crimson');
    }

    drawAngleDial() {
        this.#drawPlate();
        this.#drawNeedle();
    }

    get isFollowing() { return this.#isFollowing; }
    get isHovered() { return this.#isHovered() }
    get needleRotation() { return this.#needleRotation }
    set isFollowing(track) { this.#isFollowing = track; }

    #drawPlate() {
        push();
        fill(this.#plateFillColor);
        if (this.#isHovered()) {
            strokeWeight(4);
            if (mouseButton.left) fill('darkturquoise');
        }
        else strokeWeight(2);
        stroke(this.#plateOutlineColor);
        circle(this.#positionVector.x, this.#positionVector.y, this.#radius);
        pop();
    }
    #drawNeedle() {
        push();
        translate(this.#positionVector.x, this.#positionVector.y);
        rotate(180);
        rotate(this.#needleRotation);
        if (this.#isHovered() || this.#isFollowing) {
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
        this.#updateAngle();
    }
    #isHovered() {
        let mouseVector = createVector(mouseX, mouseY);
        return this.#positionVector.dist(mouseVector) <= this.#radius;
    }
    #updateAngle() {
        if (this.#isFollowing)
            this.#needleRotation = 90 + atan2(mouseY - this.#positionVector.y, mouseX - this.#positionVector.x);
    }
}