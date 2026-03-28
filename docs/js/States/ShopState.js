class ShopState extends State {
   #weaponShop;

   constructor(game, resolution) {
      super(game, resolution);
      this.#weaponShop = new WeaponShop(resolution.x, resolution.y);
   }

   drawState() {
      this.#weaponShop.draw();
   }

   onMousePressed(cursorX, cursorY, button) {
      this.#weaponShop.handleClick(cursorX, cursorY);
      if (this.#weaponShop.isStartButtonClicked(cursorX, cursorY)) {
         const loadout0 = this.#weaponShop.getLoadout(0);
         const loadout1 = this.#weaponShop.getLoadout(1);
         // Transition to match
         this.game.switchState(new MatchState(this.game, this.resolution, loadout0, loadout1));
      }
   }

   onMouseMoved(cursorX, cursorY) {
      this.#weaponShop.handleMouseMove(cursorX, cursorY);
   }

   onKeyReleased(inputKey, keyId) {
      if (inputKey === ENTER && this.#weaponShop.isDone()) {
         const loadout0 = this.#weaponShop.getLoadout(0);
         const loadout1 = this.#weaponShop.getLoadout(1);
         this.game.switchState(new MatchState(this.game, this.resolution, loadout0, loadout1));
      }
   }
}