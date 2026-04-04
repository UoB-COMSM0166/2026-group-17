class TurnController { 
   #turnNumber = 1;
   #maxTurns = 5;
   #activePlayerId = 0;
   #windEvent;

   constructor(wind) { 
      this.#windEvent = wind;
   }

   get activePlayerId() { return this.#activePlayerId; }
   get turnNumber() { return this.#turnNumber; }
   get maxTurns() { return this.#maxTurns; }

  advancePhase() {
   console.log("advancePhase BEFORE:", this.#activePlayerId, this.#turnNumber);
   console.trace("advancePhase caller");
   this.#updateActivePlayerId();
   if (this.#activePlayerId === 0) this.#turnNumber++;
   console.log("advancePhase AFTER :", this.#activePlayerId, this.#turnNumber);
}
   #updateActivePlayerId() {
      this.#activePlayerId = 1 - this.#activePlayerId;
   }

   get isGameOver() {
      return this.#turnNumber > this.#maxTurns;
   }
}