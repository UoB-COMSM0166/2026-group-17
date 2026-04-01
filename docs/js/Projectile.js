class Projectile {
   #position;
   #velocity;
   #radius;
   #isActive;
   #weapon;
   #target;
   #age = 0;
   #state = {};
   #previousPosition;

   constructor(muzzlePos, vel, rad, weapon = null, target = null) {
      this.#position = muzzlePos;
      this.#velocity = vel;
      this.#radius = rad;
      this.#isActive = true;
      this.#weapon = weapon;
      this.#target = target;
      this.#previousPosition = muzzlePos.copy();
   }

   // returns outcome object which is either null or signals OOB or impact position
   updatePhysics(dt, gravity, wind, rain, quake, terrain, controlPanel, canvasWidth) {
      if (!this.#isActive) return null;
      this.#age += dt;
      this.#previousPosition = this.#position.copy();
      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyEventEffects(wind, rain, quake, dt);
      this.#weapon?.beforeProjectileStep?.(this, {
         dt, gravity, wind, rain, quake, terrain, controlPanel, canvasWidth
      });
      this.#position.add(this.#velocity.copy().mult(dt));
      let outcome = this.#checkBoundaries(canvasWidth);
      if (outcome) return outcome;
      const groundY = min(
         terrain.getHeightAt(this.#position.x),
         controlPanel.getAltitudeAt(this.#position.x)
      );
      if (this.#position.y >= groundY) {
         this.#refineImpactPosition(terrain, dt);
         this.#isActive = false;
         outcome = {
            type: 'TERRAIN_IMPACT',
            pos: this.#position.copy(),
            weapon: this.#weapon,
            projectile: this
         };
      }
      return outcome;
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

   #refineImpactPosition(terrain, dt) {
      const oldPosition = p5.Vector.sub(this.#position, this.#velocity.copy().mult(dt));
      let low = 0, high = 1, testPosition;
      // binary search to close in on precise position on terrain surface
      for (let i = 0; i < 4; i++) {
         const mid = (low + high) / 2;
         testPosition = p5.Vector.lerp(oldPosition, this.#position, mid);
         if (testPosition.y >= terrain.getHeightAt(testPosition.x)) high = mid;
         else low = mid;
      }
      this.#position.set(floor(testPosition.x), floor(testPosition.y));
   }

   drawShot() {
      if (!this.#isActive) return;
      if (this.#weapon?.drawProjectileInstance) {
         this.#weapon.drawProjectileInstance(this);
         return;
      }
      if (this.#weapon?.drawProjectile) {
         this.#weapon.drawProjectile(this.#position.x, this.#position.y, this.#radius);
         return;
      }
      strokeWeight(2);
      stroke('whitesmoke');
      fill('snow');
      circle(this.#position.x, this.#position.y, this.#radius);
   }

   get position() { return this.#position; }
   get vel() { return this.#velocity; }
   get isActive() { return this.#isActive; }
   get weapon() { return this.#weapon; }
   get target() { return this.#target; }
   get age() { return this.#age; }
   get state() { return this.#state; }
   get radius() { return this.#radius; }
   get previousPosition() { return this.#previousPosition; }
   set isActive(truthVal) { this.#isActive = truthVal; }
}
