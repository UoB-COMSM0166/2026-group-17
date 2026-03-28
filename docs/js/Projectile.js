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
      // add wind
      if (typeof wind !== "undefined") {
         //add dt
         wind.applyTo(this, dt);
      }
      // Rain effect
      if (rain && rain.isActive) {
         rain.applyTo(this, dt);
      }
      this.#position.add(this.#velocity.copy().mult(dt));
      const groundY = min(
         terrain.getHeightAt(this.#position.x),
         controlPanel.getAltitudeAt(this.#position.x)
      );
      if (this.#position.y >= groundY) {
         this.#isActive = false;
         this.#impactPosition.set(floor(this.#position.x), floor(this.#position.y));
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
