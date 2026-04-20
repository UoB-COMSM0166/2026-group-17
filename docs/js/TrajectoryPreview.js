// Logic used to create a dotted line showing the trajectory of a shot before it has been fired
// Used to assist the player in Easy mode
class TrajectoryPreview {
   static simTimeStep = 0.016;
   static maxSteps = 600;
   static #hitTolerance = 20;
   static #resolution;

   constructor(resolution) { TrajectoryPreview.#resolution = resolution; }

   static simulationStep(mockShot, stepForce, terrain, enemy, weapon) {
      const hitRadius = enemy.wheelRadius + this.#hitTolerance;
      mockShot.age += this.simTimeStep;
      mockShot.velocity.add(stepForce);
      weapon?.beforeProjectileStep?.(mockShot, { dt: this.simTimeStep, terrain });
      mockShot.position.add(p5.Vector.mult(mockShot.velocity, this.simTimeStep));
      if (this.#isOutOfBounds(mockShot.position)) return { collision: true, willHit: false };
      if (this.#hitsEnemy(mockShot.position, enemy, hitRadius)) return { collision: true, willHit: true };
      if (this.#hitsTerrain(mockShot.position, terrain)) return { collision: true, willHit: false };
      return { collision: false };
   }

   static getLaunchState(player, barrelAngle, barrelPower) {
      const angle = barrelAngle ?? player.barrelAngle;
      const speed = barrelPower ?? player.barrelPower;
      const offset = createVector(player.wheelRadius + player.barrelSize.x / 2, 0);
      offset.rotate(angle);
      return {
         launchPos: p5.Vector.add(player.position, offset),
         launchVel: createVector(cos(angle) * speed, sin(angle) * speed)
      }
   }

   drawPreview(params) {
      const { player, enemy } = params;
      // Calculate projectile starting point
      const { launchPos, launchVel } = TrajectoryPreview.getLaunchState(player);
      // identify if this shot would hit the enemy by simulating the trajectory in advance
      const simResult = this.#runSimulation(launchPos, launchVel, params);
      this.#renderPath(simResult.path, simResult.willHit);
      const targetHitRadius = player.wheelRadius + TrajectoryPreview.#hitTolerance;
      if (simResult.willHit) this.#renderHitMarker(enemy.position, targetHitRadius);
   }

   #runSimulation(launchPos, launchVel, params) {
      const { gravity, wind, rain, terrain, enemy } = params;
      const weapon = params.player.currentWeapon;
      const path = [];
      //const stepForce = p5.Vector.add(gravity, wind).add(rain).mult(TrajectoryPreview.simTimeStep);
      const stepForce = p5.Vector.mult(gravity, TrajectoryPreview.simTimeStep);
      const mockShot = { position: launchPos, velocity: launchVel, age: 0, state: {} };
      for (let i = 0; i < TrajectoryPreview.maxSteps; i++) {
         const result = TrajectoryPreview.simulationStep(mockShot, stepForce, terrain, enemy, weapon);
         this.#addToPath(mockShot.position, i, path);
         if (result.collision) return { path, willHit: result.willHit };
      }
      return { path, willHit: false };
   }

   static #isOutOfBounds(pos) {
      return (pos.x < 0 || pos.x > this.#resolution.x || pos.y > this.#resolution.y);
   }

   static #hitsTerrain(pos, terrain) {
      return pos.y >= terrain.getHeightAt(pos.x);
   }

   static #hitsEnemy(pos, enemy, hitRadius) {
      return p5.Vector.dist(pos, enemy.position) < hitRadius;
   }

   #addToPath(pos, i, path) {
      if (i % 2 === 0) path.push({ pos: pos.copy(), index: i })
   }

   #renderPath(path, willHit) {
      // colors for hit and miss
      const baseColor = willHit ? [80, 255, 120] : [0, 245, 212];
      const glowColor = willHit ? `rgba(80,255,120,` : `rgba(0,245,212,`;
      push();
      noStroke();
      for (const point of path) {
         const progress = point.index / TrajectoryPreview.maxSteps;
         const alpha = lerp(255, 0, progress);
         const size = lerp(3, 0.8, progress);
         // Glow layer
         drawingContext.shadowBlur = lerp(18, 0, progress);
         drawingContext.shadowColor = `${glowColor}${alpha / 255})`;
         fill(...baseColor, alpha * 0.4);
         circle(point.pos.x, point.pos.y, size * 1.5);
         // Core layer
         drawingContext.shadowBlur = lerp(8, 0, progress);
         fill(200, 255, 250, alpha);
         circle(point.pos.x, point.pos.y, size);
      }
      pop();
   }

   #renderHitMarker(targetPos, hitRadius) {
      push();
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = 'rgba(80, 255, 120, 0.9)';
      // Pulsing circle
      noFill();
      stroke(80, 255, 120, 200);
      strokeWeight(2);
      // frameCount for pulsing effect
      const pulse = sin(frameCount * 5) * 4;
      circle(targetPos.x, targetPos.y, hitRadius + pulse);
      // "HIT" text
      noStroke();
      drawingContext.shadowBlur = 10;
      fill(80, 255, 120);
      textAlign(CENTER, BOTTOM);
      textSize(14);
      text('HIT', targetPos.x, targetPos.y - hitRadius - 8);
      pop();
   }
}
