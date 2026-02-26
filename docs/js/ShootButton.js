class ShootButton {
    #positionVector;
    #fillColor;
    #outlineColor;

    constructor(posVec = createVector(width / 2, height - (2 * height * 0.25) / 3),
        fillColor = 'lightblue', outColor = 'cadetblue') {
        this.#positionVector = posVec;
        this.#fillColor = fillColor;
        this.#outlineColor = outColor;
    }

    drawButton() {
        rectMode(CENTER);
        fill(this.#fillColor);
        stroke(this.#outlineColor);
        strokeWeight(4);
        rect(this.#positionVector.x, this.#positionVector.y, width / 9, controlPanel.altitude / 3);
        this.#drawText();
    }

    #drawText() {
        push();
        fill('firebrick');
        stroke('maroon');
        textSize(36);
        textAlign(CENTER, CENTER);
        text("SHOOT", this.#positionVector.x, this.#positionVector.y);
        pop();
    }
}