class Projectile {
   #position;
   #velocity;
   #radius;
   #isActive;
   #impactPosition = createVector(0, 0);
   #isExploding;
   #explosionStartTime;
   #maxExplosionRadius = 50;

   constructor(muzzlePos, vel, rad) {
      this.#position = muzzlePos;
      this.#velocity = vel;
      this.#radius = rad;
      this.#isActive = true;
   }

   updatePhysics(dt, gravity, wind, rain, terrain, controlPanel, turnController) {
      if (this.#isExploding) return;
      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyWeatherEffects(wind, rain, dt);
      this.#position.add(this.#velocity.copy().mult(dt));
      const groundY = min(
         terrain.getHeightAt(this.#position.x),
         controlPanel.getAltitudeAt(this.#position.x)
      );
      if (this.#position.y >= groundY) {
         this.#refineImpactPosition(terrain, dt);
         this.#isActive = false;
         this.#isExploding = true;
         this.#explosionStartTime = frameCount;
      }
      else if (this.#position.x <= 0 || this.#position.x >= width) {
         this.#isActive = false;
         turnController.advancePhase();
      }
   }

   drawShotSequence(terrain, turnController) {
      if (this.#isActive) this.#drawShot();
      else if (this.#isExploding) {
         this.#drawExplosion(terrain, turnController);
      }
   }

   #applyWeatherEffects(wind, rain, dt) {
      if (wind) wind.applyTo(this, dt);
      if (rain) rain.applyTo(this, dt);
   }

   #refineImpactPosition(terrain, dt) {
      this.#impactPosition = this.#position;
      const oldPosition = p5.Vector.sub(this.#position, this.#velocity.copy().mult(dt));
      let low = 0, high = 1;
      // binary search to close in on precise position on terrain surface
      for (let i = 0; i < 4; i++) {
         const mid = (low + high) / 2;
         this.#impactPosition = p5.Vector.lerp(oldPosition, this.#position, mid);
         if (this.#impactPosition.y >= terrain.getHeightAt(this.#impactPosition.x)) high = mid;
         else low = mid;
      }
      this.#position = this.#impactPosition;
   }

   #drawShot() {
      strokeWeight(2);
      stroke('whitesmoke');
      fill('snow');
      circle(this.#position.x, this.#position.y, this.#radius);
   }

   #drawExplosion(terrain, turnController) {
      let age = frameCount - this.#explosionStartTime;
      let progress = constrain(map(age, 0, this.#maxExplosionRadius, 0, 1), 0, 1);
      let explosionRadius = this.#maxExplosionRadius * progress;
      if (explosionRadius >= this.#maxExplosionRadius) {
         this.#isExploding = false;
         terrain.applyExplosion(this.#impactPosition, this.#maxExplosionRadius);
         turnController.advancePhase();
         return;
      }
      stroke('orange');
      fill('yellow');
      circle(this.#impactPosition.x, this.#impactPosition.y, explosionRadius);
   }

   get position() { return this.#position; }
   //because velocity is private
   get vel() { return this.#velocity; }
   get impactPosition() { return this.#impactPosition; }
   get maxExplosionRadius() { return this.#maxExplosionRadius; }
   get isActive() { return this.#isActive; }
   get isExploding() { return this.#isExploding; }
   get isDead() { return !this.#isActive && !this.#isExploding; }
   set isActive(truthVal) { this.#isActive = truthVal; }
}
