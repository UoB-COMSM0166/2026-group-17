class Projectile {
   #position;
   #velocity;
   #radius;
   #isActive;

   constructor(muzzlePos, vel, rad) {
      this.#position = muzzlePos;
      this.#velocity = vel;
      this.#radius = rad;
      this.#isActive = true;
   }

   // returns outcome object which is either null or signals OOB or impact position
   updatePhysics(dt, gravity, wind, rain, terrain, controlPanel, canvasWidth) {
      if (!this.#isActive) return null;
      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyEventEffects(wind, rain, dt);
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
         outcome = { type: 'TERRAIN_IMPACT', pos: this.#position.copy() };
      }
      return outcome;
   }

   #applyEventEffects(wind, rain, dt) {
      if (wind) wind.applyTo(this, dt);
      if (rain) rain.applyTo(this, dt);
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
      strokeWeight(2);
      stroke('whitesmoke');
      fill('snow');
      circle(this.#position.x, this.#position.y, this.#radius);
   }

   get position() { return this.#position; }
   get vel() { return this.#velocity; }
   get isActive() { return this.#isActive; }
   set isActive(truthVal) { this.#isActive = truthVal; }
}
