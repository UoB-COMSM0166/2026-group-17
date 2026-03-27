class TrajectoryPreview {
   #resolution;
   #maxSteps = 600;
   #simTimeStep = 0.016;
   #hitTolerance = 20;

   constructor(resolution) {  this.#resolution = resolution; }

   drawPreview(player, enemy, terrain, gravityVec, windVec) {
      // Calculate projectile starting point
      const { launchPos, launchVel } = this.#getLaunchState(player);
      // Environment forces
      const wind = createVector(windVec?.x ?? 0, windVec?.y ?? 0);
      const targetHitRadius = enemy.wheelRadius + this.#hitTolerance;
      // identify if this shot would hit the enemy by simulating the trajectory in advance
      const simResult = this.#runSimulation(
         launchPos, launchVel, gravityVec, wind, terrain, enemy, targetHitRadius
      );
      this.#renderPath(simResult.path, simResult.willHit);
      if (simResult.willHit) this.#renderHitMarker(enemy.positionVector, targetHitRadius);
   }

   #getLaunchState(player) {
      const angle = player.barrelAngle;
      const speed = player.barrelPower;
      const offset = createVector(player.wheelRadius + player.barrelSize.x / 2, 0);
      offset.rotate(angle);
      return {
         launchPos: player.positionVector.copy().add(offset),
         launchVel: createVector(cos(angle) * speed, sin(angle) * speed)
      }
   }

   #runSimulation(pos, vel, gravity, wind, terrain, enemy, hitRadius) {
      const stepForce = p5.Vector.add(gravity, wind).mult(this.#simTimeStep);
      const path = [];
      let willHit = false;
      for (let i = 0; i < this.#maxSteps; i++) {
         vel.add(stepForce);
         pos.add(p5.Vector.mult(vel, this.#simTimeStep));
         this.#addToPath(pos, i, path);
         if (this.#isOutOfBounds(pos) || this.#hitsTerrain(pos, terrain)) break;
         if (this.#hitsEnemy(pos, enemy, hitRadius)) {
            willHit = true;
            break;
         }
      }
      return { path, willHit };
   }

   #isOutOfBounds(pos) {
      return (pos.x < 0 || pos.x > this.#resolution.x || pos.y > this.#resolution.y);
   }

   #hitsTerrain(pos, terrain) {
      return pos.y >= terrain.getHeightAt(pos.x);
   }

   #hitsEnemy(pos, enemy, hitRadius) {
      return p5.Vector.dist(pos, enemy.positionVector) < hitRadius;
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
         const progress = point.index / this.#maxSteps;
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
      // "HIT" txt
      noStroke();
      drawingContext.shadowBlur = 10;
      fill(80, 255, 120);
      textAlign(CENTER, BOTTOM);
      textSize(14);
      text('HIT', targetPos.x, targetPos.y - hitRadius - 8);
      pop();
   }
}