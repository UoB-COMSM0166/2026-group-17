// Central controller (Context) for the entire application
// Manages the lifecycle of game states and delegates p5.js events to the currently active state.
class Game {
   static #resolution;
   #currentState = null;
   #effects;
   #pendingMode = null; // Used to store difficulty mode before a state transition

   constructor(canvasResolution) {
      Game.#resolution = canvasResolution;
      this.#effects = new Effects();
      // Boot up the first state
      this.switchState(new MenuState(this, Game.#resolution));
   }

   static setupGame() {
      // Global P5 settings
      createCanvas(Game.#resolution.x, Game.#resolution.y);
      angleMode(DEGREES);
      ellipseMode(RADIUS);
   }

   // Replaces the current logic/UI behavior with a new State object
   switchState(newState) { this.#currentState = newState; }

   update(dt) { this.#currentState?.updateState?.(dt) }
   drawGame() { this.#currentState?.drawState?.(); }

   // The following methods map p5.js events to state-specific logic
   // Using optional chaining (?.) ensures the game doesn't crash if a state hasn't implemented a specific input handler

   handleMousePressed(cursorX, cursorY, button) {
      this.#currentState?.onMousePressed?.(cursorX, cursorY, button);
   }

   handleMouseReleased(cursorX, cursorY, button) {
      this.#currentState?.onMouseReleased?.(cursorX, cursorY, button);
   }

   handleMouseMoved(cursorX, cursorY) {
      this.#currentState?.onMouseMoved?.(cursorX, cursorY);
   }

   handleKeyPressed(inputKey, keyId) {
      this.#currentState?.onKeyPressed?.(inputKey, keyId);
   }

   handleKeyReleased(inputKey, keyId) {
      this.#currentState?.onKeyReleased?.(inputKey, keyId);
   }

   get effects() { return this.#effects; }
   get pendingMode() { return this.#pendingMode; }
   set pendingMode(newMode) { this.#pendingMode = newMode; }
}
