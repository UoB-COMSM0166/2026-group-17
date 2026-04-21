class MatchState extends State {
   #match;
   #endDelayMs = 3000;
   #matchOverTimer = 0;

   constructor(game, resolution, loadout0, loadout1, aiController) {
      super(game, resolution);
      const shakeLambda = (frames, mag) => this.game.effects.triggerShake(frames, mag);
      this.#match = new Match(
         resolution, this.game.pendingMode, loadout0, loadout1, aiController, shakeLambda);
   }

   updateState(dt) {
      this.game.effects.updateShake();
      this.#match.updateMatch(dt, this.game.effects);
      if (this.#match.isMatchOver) {
         this.#matchOverTimer += dt;
         if (this.#matchOverTimer < this.#endDelayMs) return;
         this.game.switchState(new EndState(this.game, this.resolution, this.#match.matchResults));
      } else {
         this.#matchOverTimer = 0;
      }
   }

   drawState() {
      this.#match.drawMatch(() => this.game.effects.applyShake());
   }

   onMousePressed(cursorX, cursorY, button) {
      this.#match.onMousePressed(button);
   }

   onMouseReleased(cursorX, cursorY, button) {
      this.#match.onMouseReleased(cursorX, cursorY, button);
   }

   onKeyPressed(inputKey, keyId) {
      this.#match.onKeyPressed(inputKey, keyId);
   }

   onKeyReleased(inputKey, keyId) {
      this.#match.onKeyReleased(inputKey, keyId);
   }
}
