class Game {
   static #resolution;
   #currentState = null;
   #effects;
   #pendingMode = null;

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

   switchState(newState) { this.#currentState = newState; }

   update(dt) { this.#currentState?.updateState?.(dt) }
   drawGame() { this.#currentState?.drawState?.(); }

   handleMousePressed(cursorX, cursorY, button) {
      this.#currentState?.onMousePressed?.(cursorX, cursorY, button);
   }

   handleMouseReleased(cursorX, cursorY, button) {
      this.#currentState?.onMouseReleased?.(cursorX, cursorY, button);
   }

   handleMouseMoved(cursorX, cursorY) {
      this.#currentState?.onMouseMoved?.(cursorX, cursorY);
   }

   handleKeyReleased(inputKey, keyId) {
      this.#currentState?.onKeyReleased?.(inputKey, keyId);
   }

   get effects() { return this.#effects; }
   get pendingMode() { return this.#pendingMode; }
   set pendingMode(newMode) { this.#pendingMode = newMode; }
}
