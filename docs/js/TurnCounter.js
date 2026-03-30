class TurnCounter {
   #position;
   constructor(posVec) {
      this.#position = posVec;
      this.roundAnimationTimer = 0;
      this.currentRound = 1;
   }
   startRoundAnimation(roundNumber) {
      this.roundAnimationTimer = 60;
      this.currentRound = roundNumber;
   }

   drawCounter(turnNumber, maxTurns, activePlayerId) {
      push();
      textFont('Comic Sans MS, Chalkboard SE, Marker Felt, cursive');
      textAlign(CENTER, CENTER);
      textSize(26);
      fill(255);
      text(
         `ROUND ${min(turnNumber, maxTurns)} / ${maxTurns}`,
         width / 2,
         this.#position.y
      );
      textSize(38);
      if (activePlayerId === 0) fill(255, 80, 80);
      else fill(80, 180, 255);
      text(
         activePlayerId === 0 ? "PLAYER 1" : "PLAYER 2",
         width / 2,
         this.#position.y + 40
      );
      if (this.roundAnimationTimer > 0 && turnNumber <= maxTurns) {
         let progress = this.roundAnimationTimer / 60;
         let alpha = map(progress, 1, 0, 255, 0);
         let yOffset = map(progress, 1, 0, 0, -40);
         textSize(70);
         fill(255, alpha);
         text(
            `ROUND ${this.currentRound}`,
            width / 2,
            height * 0.35 + yOffset
         );
         this.roundAnimationTimer--;
      }

      pop();
   }
}