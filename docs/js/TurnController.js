class TurnController {
   #turnNumber = 1;
   #maxTurns = 5;
   #activePlayerId = 0;

   constructor(wind, onSkipCallback) { 
      this.windEvent = wind; 
      this.onSkipCallback = onSkipCallback;
   }

   get activePlayerId() { return this.#activePlayerId; }
   get turnNumber() { return this.#turnNumber; }
   get maxTurns() { return this.#maxTurns; }

   advancePhase(players) {
      //Ensure valid palyer list
      if(!Array.isArray(players) || players.length === 0) return;
      let attempts = 0;
      //Try to find a player who can act
      //Attempt max two times for skipping   
      while(attempts < 2){
         const previousPlayer = this.#activePlayerId;
         this.#activePlayerId = 1 - this.#activePlayerId;
         const currentPlayer = players?.[this.#activePlayerId];
         if(!currentPlayer) return;
         // if(!currentPlayer) return;
         //Check whether the player is affected by status effects
         const canAct = currentPlayer.canAct(this);
    
         if(previousPlayer === 1 && this.#activePlayerId === 0) {
            this.#turnNumber++;
         }
         
         if(!canAct){
            currentPlayer.stuckUntilTurn = 0;
            //Player is skipping due to status effect
            this.onSkipCallback?.(this.#activePlayerId);
            attempts++;
            continue;
         }
         return;
      }    
   }

   #updateActivePlayerId() {
      this.#activePlayerId = 1 - this.#activePlayerId;
   }
         
   get isGameOver() {
      return this.#turnNumber > this.#maxTurns;
   }

}