class MenuState extends State {
   #startMenu;

   constructor(game, resolution) {
      super(game, resolution);
      this.#startMenu = new StartMenu(resolution.x, resolution.y);
   }

   drawState() {
      background(0);
      this.#startMenu.draw();
   }

   onMousePressed(cursorX, cursorY, button) {
      // Ask the menu if a button was clicked and get the corresponding mode (easy/hard)
      const mode = this.#startMenu.handleMousePressed();
      document.querySelector('canvas').focus();
      if (mode) {
         this.game.pendingMode = mode;
         // Go to shop screen
         this.game.switchState(new ShopState(this.game, this.resolution));
      }
   }
}
