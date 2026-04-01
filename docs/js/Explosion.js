class Explosion {
   #position;
   #terrain;
   #currentRadius = 0;
   #maxRadius = 50;
   #duration = 1000;
   #timer = 0;
   #finished = false;

   constructor(impactPosition, terrainRef = null) {
      this.#position = impactPosition;
      this.#terrain = terrainRef;
      this.enemyFeedbackTriggered = false;
      this.selfFeedbackTriggered = false;
   }

   update(turnController, dt) {
      if (this.#finished) return;
      this.#timer += dt;
      this.#currentRadius = lerp(0, this.#maxRadius, this.#timer / this.#duration);
      if (this.#timer >= this.#duration) {
         this.#terrain.applyExplosion(this.#position.copy(), this.#maxRadius);
         this.#finished = true;
         turnController.advancePhase();
      }
   }

   draw() {
      if (this.#finished) return;
      push();
      strokeWeight(3);
      stroke('orange');
      fill('yellow');
      circle(this.#position.x, this.#position.y, this.#currentRadius);
      pop();
   }

   get position() { return this.#position; }
   get radius() { return this.#currentRadius }
   get maxRadius() { return this.#maxRadius }
   get finished() { return this.#finished; }
}