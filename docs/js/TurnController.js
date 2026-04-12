class TurnController {
   #turnNumber = 1;
   #maxTurns = 5;
   #activePlayerId = 0;

<<<<<<< HEAD
   constructor(wind, onSkipCallback) { 
      this.windEvent = wind; 
      this.onSkipCallback = onSkipCallback;
   }
=======
>>>>>>> origin/main

   get activePlayerId() { return this.#activePlayerId; }
   get turnNumber() { return this.#turnNumber; }
   get maxTurns() { return this.#maxTurns; }

   advancePhase(players) {

      if(!Array.isArray(players) || players.length === 0) return;
      let attempts = 0;   
      while(attempts < 2){
      this.#updateActivePlayerId();
         if (this.#activePlayerId === 0) this.#turnNumber++;
           
         const currentPlayer = players?.[this.#activePlayerId];
         if(!currentPlayer) return;

         const canAct = currentPlayer.canAct?.(this) ?? true;
    
         if(canAct) return;

         this.onSkipCallback?.(this.#activePlayerId);
         attempts++;
         }
   }         
   
   #updateActivePlayerId() {
      this.#activePlayerId = 1 - this.#activePlayerId;
   }

   get isGameOver() {
      return this.#turnNumber > this.#maxTurns;
   }

}