class MatchState extends State {
   #match;

   constructor(game, resolution, loadout0, loadout1, aiController) {
      super(game, resolution);
      const shakeLambda = (frames, mag) => this.game.effects.triggerShake(frames, mag);
      this.#match = new Match(
         resolution, this.game.pendingMode, loadout0, loadout1, aiController, shakeLambda);
   }

   updateState(dt) {
      this.game.effects.updateShake();
      this.#match.updateMatch(dt, this.game.effects);
      if (this.#match.isMatchOver)
         this.game.switchState(new EndState(this.game, this.resolution, this.#match.matchResults));
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

   onKeyReleased(inputKey, keyId) {
      this.#match.onKeyReleased(inputKey, keyId);
   }
}