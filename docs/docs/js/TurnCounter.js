class TurnCounter {
    #position;

    constructor(posVec) {
        this.#position = posVec;
    }

    drawCounter(turnNumber, maxTurns) {
        textFont('MS Trebuchet', 28);
        textAlign(CENTER, CENTER);
        if (turnNumber <= maxTurns) text(`Turn ${turnNumber}`, this.#position.x, this.#position.y);
        else text(`Turn ${maxTurns}`, this.#position.x, this.#position.y);
    }
}
