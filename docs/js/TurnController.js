class TurnController {
   #turnNumber = 1;
   #maxTurns = 5;
   #activePlayerId = 0;
   #windEvent;

   constructor(wind, onSkipCallback) { 
      this.windEvent = wind; 
      this.onSkipCallback = onSkipCallback;
   }

   get activePlayerId() { return this.#activePlayerId; }
   get turnNumber() { return this.#turnNumber; }
   get maxTurns() { return this.#maxTurns; }

   advancePhase(players) {
      do{
         this.#updateActivePlayerId();
         if (this.#activePlayerId === 0) this.#turnNumber++;
           
         const currentPlayer = players[this.#activePlayerId];
      
         if(!currentPlayer.canAct(this)){
            const playerId = this.#activePlayerId;
            this.onSkipCallback?.(playerId);
         }
      }
      while(!players[this.#activePlayerId].canAct(this));         
   }

   #updateActivePlayerId() {
      this.#activePlayerId = 1 - this.#activePlayerId;
   }

   get isGameOver() {
      return this.#turnNumber > this.#maxTurns;
   }

}