class AIController {
   static States = Object.freeze(
      { IDLE: 'IDLE', SHOPPING: 'SHOPPING', THINKING: 'THINKING', AIMING: 'AIMING', FIRING: 'FIRING' });
   #state = AIController.States.IDLE;
   #location;
   #difficulty;
   #thinkTimer = 0;
   #dotAnimationClock = 0;
   #activeDots = 0;

   constructor(mode, place) {
      this.#difficulty = mode;
      this.#location = place;
      //this.#pickWeapon = pickWeaponCallback;
   }

   updateAI(dt, context) {
      switch (this.#state) {
         case AIController.States.THINKING:
            this.#handleThinking(dt);
            break;
         case AIController.States.SHOPPING:
            this.#handleShopping(context);
            break;
         case AIController.States.AIMING:
            this.#handleAiming(context);
            break;
         case AIController.States.FIRING:
            this.#handleFiring(context);
            break;
         case AIController.States.IDLE: default:
            break;
      }
   }

   drawThinkIndicator(position) {
      if (this.#state !== AIController.States.THINKING) return;
      push();
      noStroke();
      for (let i = 0; i < 3; i++) {
         if (i < this.#activeDots) fill('white');
         else fill(255, 255, 255, 100);
         circle(position.x + (i * 20) - 20, position.y - 60, 3);
      }
      pop();
   }

   startThinking() {
      if (this.#state !== AIController.States.IDLE) return;
      if (this.#location === 'SHOP') this.#thinkTimer = random(600, 1500);
      else this.#thinkTimer = random(1000, 5000);
      this.#dotAnimationClock = 0;
      this.#state = AIController.States.THINKING;
   }

   #handleThinking(dt) {
      this.#thinkTimer -= dt;
      this.#dotAnimationClock += dt;
      this.#updateDots();
      if (this.#thinkTimer <= 0) {
         if (this.#location === 'SHOP') this.#state = AIController.States.SHOPPING;
         else this.#state = AIController.States.AIMING;
      }
   }

   #handleShopping(shopState) {
      shopState.pickWeapon();
      this.#state = AIController.States.IDLE;
   }

   #handleAiming(worldState) {
      const bestShotParams = this.#findBestShotParams(worldState);
      this.#applyDifficultyJitter(worldState.shooter, bestShotParams);
      this.#state = AIController.States.FIRING;
   }

   #handleFiring(worldState) {
      worldState.executeShot();
      this.#state = AIController.States.IDLE;
   }

   #findBestShotParams(worldState) {
      const { shooter, target } = worldState;
      let bestAngle = shooter.barrelAngle;
      let bestPower = shooter.barrelPower;
      let minDistance = Infinity;
      for (let testAngle = -100; testAngle > -175; testAngle -= 2) {
         for (let testPower = 250; testPower < 650; testPower += 5) {
            const result = this.#testMockShot(testAngle, testPower, worldState);
            const distToEnemy = p5.Vector.dist(result.endPos, target.position);
            if (distToEnemy < minDistance) {
               minDistance = distToEnemy;
               bestAngle = testAngle;
               bestPower = testPower;
            }
            if (minDistance < 5) return { angle: bestAngle, power: bestPower };
         }
      }
      return { angle: bestAngle, power: bestPower };
   }

   #testMockShot(angle, power, worldState) {
      const { shooter, target, terrain, gravity, wind } = worldState;
      const weapon = shooter.currentWeapon;
      const { launchPos, launchVel } = TrajectoryPreview.getLaunchState(shooter, angle, power);
      const stepForce = p5.Vector.add(gravity, wind).mult(TrajectoryPreview.simTimeStep);
      const mockShot = { position: launchPos, velocity: launchVel, age: 0, state: {} };
      for (let i = 0; i < TrajectoryPreview.maxSteps; i++) {
         const result = TrajectoryPreview.simulationStep(mockShot, stepForce, terrain, target, weapon);
         if (result.collision) return { endPos: mockShot.position };
      }
      return { endPos: mockShot.position };
   }

   #applyDifficultyJitter(shooter, { angle, power }) {
      if (this.#difficulty === "easy") {
         // Randomly offset "perfect" shot by up to 12 degrees & 60 power
         shooter.barrelAngle = angle + random(-12, 12);
         shooter.barrelPower = power + random(-60, 60);
      }
      else {
         // Offset shot by a significantly lesser amount than easy mode
         shooter.barrelAngle = angle + random(-1.5, 1.5);
         shooter.barrelPower = power + random(-10, 10);
      }
   }

   #updateDots() {
      const cycleDuration = 2000;
      let loopTime  = this.#dotAnimationClock % cycleDuration;
      this.#activeDots = floor(map(loopTime, 0, cycleDuration, 0, 4));
   }

   set location(place) { this.#location = place; }
}