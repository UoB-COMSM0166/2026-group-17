/* The primary gameplay controller.
   Orchestrates the main gameplay state, manages the transition 
   to the results screen, and bridges visual effects like screen shake 
   from the game engine to the match logic. */
class MatchState extends State {
   #match;
   #endDelayMs = 1000;
   #matchOverTimer = 0;

   constructor(game, resolution, loadout0, loadout1, aiController) {
      super(game, resolution);
      // Define a callback that lets the Match class trigger shakes without having access to the Game instance
      const shakeLambda = (frames, mag) => this.game.effects.triggerShake(frames, mag);
      this.#match = new Match(
         resolution, this.game.pendingMode, loadout0, loadout1, aiController, shakeLambda);
   }


   // Manages the match lifecycle. Updates physics and logic, while monitoring if the match has concluded
   // to trigger the EndState transition after a short delay
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

   // Input pass-through methods

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
