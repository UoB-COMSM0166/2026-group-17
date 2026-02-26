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

    get isHovered() { return this.#isHovered() }

    drawButton() {
        rectMode(CENTER);
        fill(this.#fillColor);
        if (this.#isHovered()) {
            stroke(this.#outlineColor);
            strokeWeight(4);
        } else {
            strokeWeight(2);
        }
        
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

    #isHovered() {
    let mouseVector = createVector(mouseX, mouseY);
    const w = width / 9;
    const h = controlPanel.altitude / 3;

    return (
        mouseX >= this.#positionVector.x - w / 2 &&
        mouseX <= this.#positionVector.x + w / 2 &&
        mouseY >= this.#positionVector.y - h / 2 &&
        mouseY <= this.#positionVector.y + h / 2
    );
    }
}