// Manages the life cycle of a fired shot. Handles movement, environmental physics,
// collision detection with players/terrain, and specialized weapon behaviors like splitting into fragments

class Projectile {
   #position;
   #velocity;
   #radius;
   #shooter;
   #weapon;
   #weaponId;
   #isActive;
   #age = 0;
   #state = {};
   #previousPosition;
   #hasSplit = false;
   #isLaunching = true;

   constructor(muzzlePos, vel, shooter, weapon = null) {
      this.#position = muzzlePos;
      this.#velocity = vel;
      this.#radius = weapon?.shotRadius ?? 4;
      this.#shooter = shooter;
      this.#initializeWeaponData(weapon);
      this.#isActive = true;
      this.#previousPosition = this.#position.copy();
   }

   // returns outcome object which is either null or signals OOB or impact position
   updatePhysics(physicsData) {
      if (!this.#isActive) return null;
      const { dt, gravity, wind, rain, earthquake, terrain, players } = physicsData;
      this.#age += dt;
      this.#previousPosition = this.#position.copy();
      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyEventEffects(wind, rain, earthquake, dt);
      this.#weapon?.beforeProjectileStep?.(this, physicsData);
      this.#position.add(this.#velocity.copy().mult(dt));
      let outcome = this.#handleSpecialBehaviours();
      if (!outcome) outcome = this.#checkBoundaries(physicsData.resolution);
      if (!outcome) outcome = this.#checkPlayers(players, dt);
      if (!outcome) outcome = this.#checkTerrain(terrain, dt);
      return outcome;
   }

   drawShot() {
      if (!this.#isActive) return;
      if (this.#weapon?.drawProjectileInstance) {
         this.#weapon.drawProjectileInstance(this);
         return;
      }
      push();
      translate(this.#position.x, this.#position.y);
      rotate(this.#velocity.heading());
      if (this.#weapon) this.#weapon.drawProjectile(0, 0, this.#radius);
      else if (this.#weaponId === "starFragment") new Starshot().drawProjectile(0, 0, this.#radius);
      else {
         strokeWeight(2);
         stroke('whitesmoke');
         fill('snow');
         circle(0, 0, this.#radius);
      }
      pop();
   }

   // As some of the code assigns to weapon a simple string, rather than a weapon object
   #initializeWeaponData(weapon) {
      if (typeof weapon === 'string') {
         this.#weapon = null;
         this.#weaponId = weapon;
         this.#radius = (weapon === "starFragment") ? 3 : 4;
      }
      else {
         this.#weapon = weapon;
         this.#weaponId = weapon?.id ?? "ball";
         this.#radius = weapon?.shotRadius ?? 4;
      }
   }

   #applyEventEffects(wind, rain, earthquake, dt) {
      wind?.applyTo(this, dt);
      rain?.applyTo(this, dt);
      earthquake?.applyTo(this, dt);
   }

   #handleSpecialBehaviours() {
      // Star splits in air when it reaches apex and starts falling
      if (this.#weaponId === "star" && !this.#hasSplit && this.#velocity.y > 0) {
         this.#hasSplit = true;
         this.#isActive = false;
         return { type: "STAR_SPLIT", fragments: this.#createStarFragments() };
      }
      return null;
   }

   #createStarFragments() {
      const fragments = [];
      const movingRight = this.#velocity.x >= 0;
      for (let i = 0; i < 8; i++) {
         const angle = movingRight ? random(-70, 60) : random(120, 250);
         const vel = p5.Vector.fromAngle(radians(angle)).mult(random(280, 380));
         fragments.push(new Projectile(
            createVector(this.#position.x, this.#position.y - 8),
            vel,
            this.#shooter,
            "starFragment"
         ));
      }
      return fragments;
   }

   #checkBoundaries(resolution) {
      const isOutOfBoundsX = this.#position.x <= 0 || this.#position.x >= resolution.x;
      if (isOutOfBoundsX || this.#position.y >= resolution.y) {
         this.#isActive = false;
         return { type: 'OUT_OF_BOUNDS' };
      }
      return null;
   }

   #checkPlayers(players, dt) {
      for (let player of players) {
         const isColliding = player.checkCollision(this.#position, this.#radius);
         const outcome = this.#processPlayerCollision(player, isColliding, dt);
         if (outcome) return outcome;
      }
      return null;
   }

   #processPlayerCollision(player, isColliding, dt) {
      if (isColliding && player === this.#shooter && this.#isLaunching) return null;
      else if (isColliding) {
         this.#refineImpactPosition(dt, (pos) => player.checkCollision(pos, this.#radius));
         this.#isActive = false;
         return { type: 'PLAYER_HIT', pos: this.#position.copy() };
      }
      else if (player === this.#shooter) this.#isLaunching = false;
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
      // const oldPosition = p5.Vector.sub(this.#position, this.#velocity.copy().mult(dt));
      const oldPosition = this.#previousPosition;
      let low = 0, high = 1, testPosition;
      // binary search to close in on precise position on terrain surface
      for (let i = 0; i < 5; i++) {
         const mid = (low + high) / 2;
         testPosition = p5.Vector.lerp(oldPosition, this.#position, mid);
         if (isInsidePredicate(testPosition)) high = mid;
         else low = mid;
      }
      this.#position.set(floor(testPosition.x), floor(testPosition.y));
   }

   get position() { return this.#position; }
   get velocity() { return this.#velocity; }
   get isActive() { return this.#isActive; }
   set isActive(truthVal) { this.#isActive = truthVal; }
   get weapon() { return this.#weapon; }
   get weaponId() { return this.#weaponId; }
   get age() { return this.#age; }
   get state() { return this.#state; }
   get radius() { return this.#radius; }
   get previousPosition() { return this.#previousPosition; }
}