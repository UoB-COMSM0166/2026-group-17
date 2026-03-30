class TurnController {
   #turnNumber = 1;
   #maxTurns = 5;
   #activePlayerId = 0;
   #windEvent;

   constructor(wind) { this.windEvent = wind; }

   get activePlayerId() { return this.#activePlayerId; }
   get turnNumber() { return this.#turnNumber; }
   get maxTurns() { return this.#maxTurns; }

   advancePhase() {
      this.#updateActivePlayerId();
      if (this.#activePlayerId === 0) this.#turnNumber++;
   }

   #updateActivePlayerId() {
      this.#activePlayerId = 1 - this.#activePlayerId;
   }

   get isGameOver() {
      return this.#turnNumber > this.#maxTurns;
   }

}