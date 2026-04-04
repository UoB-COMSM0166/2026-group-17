class Projectile {
   #position;
   #velocity;
   #radius;
   #isActive;
   #weaponId;
   #hasSplit = false;

   constructor(muzzlePos, vel, rad, weaponId = "ball") {
      this.#position = muzzlePos.copy ? muzzlePos.copy() : muzzlePos;
      this.#velocity = vel.copy ? vel.copy() : vel;
      this.#radius = rad;
      this.#isActive = true;
      this.#weaponId = weaponId;
   }

   // returns:
   // null
   // { type: 'OUT_OF_BOUNDS' }
   // { type: 'TERRAIN_IMPACT', pos: p5.Vector }
   // { type: 'STAR_SPLIT', fragments: Projectile[] }
   updatePhysics(dt, gravity, wind, rain, terrain, controlPanel, canvasWidth, canvasHeight) {
      if (!this.#isActive) return null;

      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyEventEffects(wind, rain, dt);
      this.#position.add(this.#velocity.copy().mult(dt));

      // Star splits in air when it reaches apex and starts falling
      if (this.#weaponId === "star" && !this.#hasSplit) {
         if (this.#velocity.y > 0) {
            this.#hasSplit = true;

            const fragments = [];
const movingRight = this.#velocity.x >= 0;

for (let i = 0; i < 8; i++) {
   let a;

   if (movingRight) {
      a = random(-70, 60);
   } else {
      a = random(120, 250);
   }

   const vel = p5.Vector.fromAngle(radians(a)).mult(random(280, 380));

   fragments.push(
      new Projectile(
         createVector(this.#position.x, this.#position.y - 8),
         vel,
         3,
         "starFragment"
      )
   );
}

this.#isActive = false;
return { type: "STAR_SPLIT", fragments };
         }
      }

      const outcome = this.#checkBoundaries(canvasWidth, canvasHeight);
      if (outcome) return outcome;

      const groundY = min(
         controlPanel.getAltitudeAt(this.#position.x),
         terrain.getHeightAt(this.#position.x)
      );

      if (this.#position.y >= groundY) {
         this.#refineImpactPosition(terrain, controlPanel, dt);
         this.#isActive = false;
         return { type: 'TERRAIN_IMPACT', pos: this.#position.copy() };
      }

      return null;
   }

   #applyEventEffects(wind, rain, dt) {
      if (wind) wind.applyTo(this, dt);
      if (rain) rain.applyTo(this, dt);
   }

   #checkBoundaries(canvasWidth, canvasHeight) {
      if (
         this.#position.x <= 0 ||
         this.#position.x >= canvasWidth ||
         this.#position.y >= canvasHeight ||
         this.#position.y < -200
      ) {
         this.#isActive = false;
         return { type: 'OUT_OF_BOUNDS' };
      }
      return null;
   }

   #refineImpactPosition(terrain, controlPanel, dt) {
      const oldPosition = p5.Vector.sub(
         this.#position,
         this.#velocity.copy().mult(dt)
      );

      let low = 0;
      let high = 1;
      let testPosition = this.#position.copy();

      for (let i = 0; i < 5; i++) {
         const mid = (low + high) / 2;
         testPosition = p5.Vector.lerp(oldPosition, this.#position, mid);

         const groundY = min(
            controlPanel.getAltitudeAt(testPosition.x),
            terrain.getHeightAt(testPosition.x)
         );

         if (testPosition.y >= groundY) high = mid;
         else low = mid;
      }

      this.#position.set(floor(testPosition.x), floor(testPosition.y));
   }

   drawShot() {
      if (!this.#isActive) return;

      const weaponMap = {
         ball: CannonBall,
         pineapple: Pineappleshot,
         shiba: Shibashot,
         star: Starshot,
         starFragment: Starshot,
      };

      const WeaponClass = weaponMap[this.#weaponId];

      if (WeaponClass) {
         const weapon = new WeaponClass();
         weapon.drawProjectile(this.#position.x, this.#position.y, this.#radius);
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
   get weaponId() { return this.#weaponId; }

   set isActive(truthVal) { this.#isActive = truthVal; }
}