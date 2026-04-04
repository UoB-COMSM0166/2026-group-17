class MatchState extends State {
   #match;

   constructor(game, resolution, loadout0, loadout1) {
      super(game, resolution);
      const shakeLambda = (frames, mag) => this.game.effects.triggerShake(frames, mag);
      this.#match = new Match(resolution, this.game.pendingMode, loadout0, loadout1, shakeLambda);
   }

   updateState(dt) {
      this.game.effects.updateShake();
      this.#match.updateMatch(dt);
      if (this.#match.isMatchOver) {
         this.game.switchState(
            new EndState(this.game, this.resolution, this.#match.matchResults)
         );
      }
   }

   drawState() {
      push();
      this.game.effects.applyShake();
      this.#match.drawMatch();
      pop();
   }

   onMousePressed(cursorX, cursorY, button) {
      this.#match.onMousePressed(cursorX, cursorY, button);
   }

   onMouseReleased(cursorX, cursorY, button) {
      this.#match.onMouseReleased(cursorX, cursorY, button);
   }

   onMouseMoved(cursorX, cursorY) {
      this.#match.onMouseMoved(cursorX, cursorY);
   }

   onKeyReleased(inputKey, keyId) {
      this.#match.onKeyReleased(inputKey, keyId);
   }
}