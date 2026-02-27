class TurnController {
    #turnNumber = 1;
    #maxTurns = 5;
    #activePlayerId = 0;

    get activePlayerId() { return this.#activePlayerId; }
    get turnNumber() { return this.#turnNumber; }
    get maxTurns() { return this.#maxTurns; }

    playerCanAct(flying, exploding) { return !(this.isGameOver() || flying || exploding); }
    advancePhase() {
        if (!this.isGameOver()) {
            this.#updateActivePlayerId();
            this.#incrementTurnCounter();
        }
    }

    isGameOver() { return this.#turnNumber > this.#maxTurns; }
    #updateActivePlayerId() { this.#activePlayerId = 1 - this.#activePlayerId; }
    #incrementTurnCounter() { if (this.#activePlayerId === 0) this.#turnNumber++; }
}