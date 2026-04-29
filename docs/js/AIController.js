// Controls the computer player and uses an FSM setup to track its current state
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

   // Think indicator used to show to the player that the AI is taking its time to shoot
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
      if (this.#location === 'SHOP') this.#thinkTimer = random(500, 1000);
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
      if (this.#difficulty === "easy") {
         worldState.wind = createVector(0, 0);
         worldState.rain = createVector(0, 0);
      }
      const bestShotParams = this.#findBestShotParams(worldState);
      this.#applyDifficultyJitter(worldState.shooter, bestShotParams);
      this.#state = AIController.States.FIRING;
   }

   #handleFiring(worldState) {
      worldState.executeShot();
      this.#state = AIController.States.IDLE;
   }

   // Prepare a parameters object and run it through 2 calls of runPass() to find best shot params
   #findBestShotParams(worldState) {
      let passParams = {
         bestAngle: worldState.shooter.barrelAngle,
         bestPower: worldState.shooter.barrelPower,
         minDistance: Infinity,
         angleStep: 8,
         powerStep: 40,
         angleRange: [-95, -179],
         powerRange: [250, 800]
      }
      // Run a coarse and a fine pass with a varying amount of steps for both angle and power
      passParams = this.#runPass(passParams, worldState);
      passParams.angleStep = 2;
      passParams.powerStep = 5;
      const { bestAngle, bestPower } = passParams;
      passParams.angleRange = [min(-95, bestAngle + 10), max(-179, bestAngle - 10)];
      passParams.powerRange = [max(250, bestPower - 40), min(650, bestPower + 40)];
      passParams = this.#runPass(passParams, worldState);
      return { angle: passParams.bestAngle, power: passParams.bestPower };
   }

   // Loop through a limited range of possible angle and power combinations,
   // attempting to find the combination that would result in the most direct hit possible
   #runPass(passParams, worldState) {
      const { shooter, target } = worldState;
      const { angleStep, powerStep, angleRange, powerRange } = passParams;
      for (let testAngle = angleRange[0]; testAngle > angleRange[1]; testAngle -= angleStep) {
         for (let testPower = powerRange[0]; testPower < powerRange[1]; testPower += powerStep) {
            const result = this.#testMockShot(testAngle, testPower, worldState);
            const distToEnemy = p5.Vector.dist(result.endPos, target.position);
            if (distToEnemy < passParams.minDistance) {
               passParams.minDistance = distToEnemy;
               passParams.bestAngle = testAngle;
               passParams.bestPower = testPower;
            }
            if (passParams.minDistance < 5) return passParams;
         }
      }
      return passParams;
   }

   #testMockShot(angle, power, worldState) {
      const { shooter, target, terrain, gravity, wind, rain } = worldState;
      const weapon = shooter.currentWeapon;
      const { launchPos, launchVel } = TrajectoryPreview.getLaunchState(shooter, angle, power);
      const stepForce = p5.Vector.add(gravity, wind).add(rain).mult(TrajectoryPreview.simTimeStep)
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
         shooter.barrelAngle = angle + random(0, 1);
         shooter.barrelPower = power + random(-10, 10);
      }
   }

   #updateDots() {
      const cycleDuration = 2000;
      let loopTime = this.#dotAnimationClock % cycleDuration;
      this.#activeDots = floor(map(loopTime, 0, cycleDuration, 0, 4));
   }

   set location(place) { this.#location = place; }
}