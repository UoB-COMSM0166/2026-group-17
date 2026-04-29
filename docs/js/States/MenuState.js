/* The initial state of the game.
   Manages the main menu UI and handles the logic for starting the game
   by transitioning to the ShopState based on user input */
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
      if (!mode) return;
      // Go to weapon shop
      this.game.pendingMode = mode;
      this.game.switchState(new ShopState(this.game, this.resolution));
   }
}