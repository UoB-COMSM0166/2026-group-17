class MatchState extends State {
   #match;

   constructor(game, resolution, loadout0, loadout1) {
      super(game, resolution);
      this.#match = new Match(resolution, this.game.pendingMode, loadout0, loadout1);
   };

   updateState(dt) {
      this.game.effects.updateShake();
      this.#match.updateMatch();
      if (this.#match.isMatchOver)
         this.game.switchState(new EndState(this.game, this.resolution, this.#match.matchResults));
   }

   drawState() {
      push();
      this.game.effects.applyShake();
      this.#match.drawMatch();
      pop();
   }

   onMousePressed(cursorX, cursorY, button) {
      this.#match.onMousePressed(button);
   }

   onMouseReleased(cursorX, cursorY, button) {
      this.#match.onMouseReleased(cursorX, cursorY, button);
   }

   onKeyReleased(inputKey, keyId) {
      this.#match.onMouseReleased(inputKey, keyId);
   }
}