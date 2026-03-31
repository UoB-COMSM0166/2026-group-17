class Explosion {
   #position;
   #terrain;
   #currentRadius = 0;
   #maxRadius = 50;
   #startTime = frameCount;
   #finished;

   constructor(impactPosition, terrainRef = null) {
      this.#position = impactPosition;
      this.#terrain = terrainRef;
      this.#finished = false;
      this.enemyFeedbackTriggered = false;
      this.selfFeedbackTriggered = false;
   }

   update(turnController) {
      if (this.#finished) return;
      const age = frameCount - this.#startTime;
      const progress = constrain(map(age, 0, this.#maxRadius, 0, 1), 0, 1);
      this.#currentRadius = this.#maxRadius * progress;
      if (this.#currentRadius >= this.#maxRadius) {
         this.#terrain.applyExplosion(this.#position.copy(), this.#maxRadius);
         this.#finished = true;
         turnController.advancePhase();
      }
   }

   draw() {
      if (this.#finished) return;
      push();
      stroke(255, 150, 0);
      strokeWeight(3);
      fill('yellow');
      circle(this.#position.x, this.#position.y, this.#currentRadius);
      pop();
   }

   get position() { return this.#position; }
   get radius() { return this.#currentRadius }
   get maxRadius() { return this.#maxRadius }
   get finished() { return this.#finished; }
}