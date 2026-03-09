class TurnController {
    #turnNumber = 1;
    #maxTurns = 5;
    #activePlayerId = 0;
    #windEvent;

    constructor(wind) { this.windEvent = wind; }

    get activePlayerId() { return this.#activePlayerId; }
    get turnNumber() { return this.#turnNumber; }
    get maxTurns() { return this.#maxTurns; }

    playerCanAct(flying, exploding) { return !(this.isGameOver() || flying || exploding); }
    advancePhase() {
        this.#updateActivePlayerId();
        if (this.#activePlayerId === 0) {
            this.#turnNumber++;

            if (this.#windEvent && this.#windEvent.isActive) {
                this.#windEvent.newTurn();
            }
        }
    }

    isGameOver() {
        return this.#turnNumber > this.#maxTurns;
    }

    #updateActivePlayerId() {
        this.#activePlayerId = 1 - this.#activePlayerId;
    }

    #incrementTurnCounter() {
        if (this.#activePlayerId === 0) {
            this.#turnNumber++;

            if (this.#windEvent !== undefined) {
                this.#windEvent.newTurn();
            }
        }
    }
}