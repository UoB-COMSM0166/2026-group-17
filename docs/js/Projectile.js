class Projectile {
   #position;
   #velocity;
   #radius;
   #shooter;
   #weapon;
   #isActive;
   #isLaunching = true;

   constructor(muzzlePos, vel, shooter, weapon = null) {
      this.#position = muzzlePos;
      this.#velocity = vel;
      this.#radius = weapon?.shotRadius ?? 4;
      this.#shooter = shooter;
      this.#weapon = weapon;
      this.#isActive = true;
   }

   // returns outcome object which is either null or signals OOB or impact position
   updatePhysics(physicsData) {
      if (!this.#isActive) return null;
      const { dt, gravity, wind, rain, earthquake, terrain, players } = physicsData;
      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyEventEffects(wind, rain, earthquake, dt);
      this.#position.add(this.#velocity.copy().mult(dt));
      let outcome = this.#checkBoundaries(physicsData.width);
      if (!outcome) outcome = this.#checkPlayers(players, dt);
      if (!outcome) outcome = this.#checkTerrain(terrain, dt);
      return outcome;
   }

   drawShot() {
      if (!this.#isActive) return;
      push();
      if (this.#weapon) {
         translate(this.#position.x, this.#position.y);
         rotate(this.#velocity.heading());
         this.#weapon.drawProjectile(0, 0, this.#radius);
      }
      else {
         strokeWeight(2);
         stroke('whitesmoke');
         fill('snow');
         circle(this.#position.x, this.#position.y, this.#radius);
      }
      pop();
   }

   #applyEventEffects(wind, rain, earthquake, dt) {
      wind?.applyTo(this, dt);
      rain?.applyTo(this, dt);
      earthquake?.applyTo(this, dt);
   }

   #checkBoundaries(canvasWidth) {
      if (this.#position.x <= 0 || this.#position.x >= canvasWidth) {
         this.#isActive = false
         return { type: 'OUT_OF_BOUNDS' };
      }
      return null;
   }

   #checkTerrain(terrain, dt) {
      if (this.#position.y >= terrain.getHeightAt(this.#position.x)) {
         this.#refineImpactPosition(dt, (pos) => pos.y >= terrain.getHeightAt(pos.x));
         this.#isActive = false;
         return { type: 'TERRAIN_IMPACT', pos: this.#position.copy() };
      }
      return null;
   }

   #refineImpactPosition(dt, isInsidePredicate) {
      const oldPosition = p5.Vector.sub(this.#position, this.#velocity.copy().mult(dt));
      let low = 0, high = 1, testPosition;
      // binary search to close in on precise position on terrain surface
      for (let i = 0; i < 4; i++) {
         const mid = (low + high) / 2;
         testPosition = p5.Vector.lerp(oldPosition, this.#position, mid);
         if (isInsidePredicate(testPosition)) high = mid;
         else low = mid;
      }
      this.#position.set(floor(testPosition.x), floor(testPosition.y));
   }

   #checkPlayers(players, dt) {
      let outcome;
      for (let player of players) {
         const isColliding = player.checkCollision(this.#position, this.#radius);
         outcome = this.#checkCollisionWithPlayer(player, isColliding, dt);
         if (outcome) return outcome;
      }
      return null;
   }

   #checkCollisionWithPlayer(player, isColliding, dt) {
      if (isColliding && player === this.#shooter && this.#isLaunching) return null;
      else if (isColliding) {
         this.#refineImpactPosition(dt, (pos) => player.checkCollision(pos, this.#radius));
         this.#isActive = false;
         return { type: 'PLAYER_HIT', pos: this.#position.copy() };
      }
      else if (player === this.#shooter) {
         this.#isLaunching = false;
         return null;
      }
   }

   get position() { return this.#position; }
   get vel() { return this.#velocity; }
   get isActive() { return this.#isActive; }
   set isActive(truthVal) { this.#isActive = truthVal; }
}
