class Projectile {
   #position;
   #velocity;
   #radius;
   #isActive;
   #weapon;
   #weaponId;
   #target;
   #age = 0;
   #state = {};
   #previousPosition;
   #hasSplit = false;

   constructor(muzzlePos, vel, rad, weapon = null, target = null) {
      this.#position = muzzlePos.copy ? muzzlePos.copy() : muzzlePos;
      this.#velocity = vel.copy ? vel.copy() : vel;
      this.#radius = rad;
      this.#isActive = true;
      this.#weapon = weapon;
      this.#weaponId = typeof weapon === "string" ? weapon : (weapon?.id ?? "ball");
      this.#target = target;
      this.#previousPosition = this.#position.copy ? this.#position.copy() : this.#position;
   }

   // returns:
   // null
   // { type: 'OUT_OF_BOUNDS' }
   // { type: 'TERRAIN_IMPACT', pos, weapon, projectile }
   // { type: 'STAR_SPLIT', fragments }
   updatePhysics(dt, gravity, wind, rain, quake, terrain, controlPanel, canvasWidth, canvasHeight = height) {
      if (!this.#isActive) return null;

      this.#age += dt;
      this.#previousPosition = this.#position.copy();

      this.#velocity.add(gravity.copy().mult(dt));
      this.#applyEventEffects(wind, rain, quake, dt);

      this.#weapon?.beforeProjectileStep?.(this, {
         dt, gravity, wind, rain, quake, terrain, controlPanel, canvasWidth, canvasHeight
      });

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
                     "starFragment",
                     this.#target
                  )
               );
            }

            this.#isActive = false;
            return { type: "STAR_SPLIT", fragments };
         }
      }

      let outcome = this.#checkBoundaries(canvasWidth, canvasHeight);
      if (outcome) return outcome;

      const groundY = min(
         controlPanel.getAltitudeAt(this.#position.x),
         terrain.getHeightAt(this.#position.x)
      );

      if (this.#position.y >= groundY) {
         this.#refineImpactPosition(terrain, controlPanel, dt);
         this.#isActive = false;
         return {
            type: 'TERRAIN_IMPACT',
            pos: this.#position.copy(),
            weapon: this.#weapon,
            projectile: this
         };
      }

      return null;
   }

   #applyEventEffects(wind, rain, quake, dt) {
      wind?.applyTo(this, dt);
      rain?.applyTo(this, dt);
      quake?.applyTo(this, dt);
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

      if (this.#weapon?.drawProjectileInstance) {
         this.#weapon.drawProjectileInstance(this);
         return;
      }

      if (this.#weapon?.drawProjectile) {
         this.#weapon.drawProjectile(this.#position.x, this.#position.y, this.#radius);
         return;
      }

      const weaponMap = {
         ball: CannonBall,
         cannon_ball: CannonBall,
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
   get weapon() { return this.#weapon; }
   get weaponId() { return this.#weaponId; }
   get target() { return this.#target; }
   get age() { return this.#age; }
   get state() { return this.#state; }
   get radius() { return this.#radius; }
   get previousPosition() { return this.#previousPosition; }

   set isActive(truthVal) { this.#isActive = truthVal; }
}