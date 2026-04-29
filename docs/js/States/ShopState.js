// Manages the weapon selection phase before a match.
// Coordinates between the WeaponShop UI and the AIController to finalize 
// loadouts for both players before transitioning to MatchState.
class ShopState extends State {
   #weaponShop;
   #aiController;

   constructor(game, resolution) {
      super(game, resolution);
      this.#weaponShop = new WeaponShop(resolution.x, resolution.y);
      this.#aiController = new AIController(this.game.pendingMode, 'SHOP');
   }

   updateState(dt) {
      this.#weaponShop.update(dt, this.#aiController);
   }

   drawState() {
      this.#weaponShop.draw();
   }

   // Switch to match state via mouse click
   onMousePressed(cursorX, cursorY, button) {
      this.#weaponShop.handleClick(cursorX, cursorY);
      if (this.#weaponShop.isStartButtonClicked(cursorX, cursorY)) {
         this.#transitionToMatch();
      }
   }

   onMouseMoved(cursorX, cursorY) {
      this.#weaponShop.handleMouseMove(cursorX, cursorY);
   }

   // Transition to match via pressing a key
   onKeyReleased(inputKey, keyId) {
      if (inputKey === ENTER && this.#weaponShop.isDone()) {
         this.#transitionToMatch();
      }
   }

   // Helper method to bundle the loadouts and move to the main gameplay loop.
   #transitionToMatch() {
      const loadout0 = this.#weaponShop.getLoadout(0);
      const loadout1 = this.#weaponShop.getLoadout(1);
      this.game.switchState(new MatchState(this.game, this.resolution, loadout0, loadout1, this.#aiController));
   }

}