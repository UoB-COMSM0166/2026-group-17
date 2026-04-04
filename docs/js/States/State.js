class State {
   constructor(game, resolution) {
      if (this.constructor === State)
         throw new Error("Abstract class State cannot be instantiated");
      this.game = game;
      this.resolution = resolution;
   }

   updateState(dt) { }
   drawState() { }
   onMousePressed(cursorX, cursorY, button) { }
   onMouseReleased(cursorX, cursorY, button) { }
   onMouseMoved(cursorX, cursorY) { }
   onKeyReleased(inputKey, keyId) { }
}