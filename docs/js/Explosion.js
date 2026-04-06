class Explosion {
   #position;
   #terrain;
   #weapon;
   #currentRadius = 0;
   #maxRadius = 50;
   #duration = 1000;
   #timer = 0;
   #finished = false;

   constructor(impactPosition, terrainRef = null, weapon = null, options = {}) {
      this.#position = impactPosition;
      this.#terrain = terrainRef;
      this.#weapon = weapon;
      this.#maxRadius = options.maxRadius ?? weapon?.explosionRadius ?? 50;
      this.#duration = options.duration ?? constrain(500 + this.#maxRadius * 4, 500, 1400);
      this.enemyFeedbackTriggered = false;
      this.selfFeedbackTriggered = false;
   }

   update(dt) {
      if (this.#finished) return;
      this.#timer += dt;
      this.#currentRadius = lerp(0, this.#maxRadius, this.#timer / this.#duration);
      if (this.#timer >= this.#duration) {
         this.#terrain.applyExplosion(this.#position.copy(), this.#maxRadius);
         this.#finished = true;
      }
   }

   draw() {
      if (this.#finished) return;
      if (this.#weapon?.drawExplosion) {
         this.#weapon.drawExplosion(this);
         return;
      }

      push();
      strokeWeight(3);
      stroke('orange');
      fill('yellow');
      circle(this.#position.x, this.#position.y, this.#currentRadius);
      pop();
   }

   get position() { return this.#position; }
   get radius() { return this.#currentRadius; }
   get maxRadius() { return this.#maxRadius; }
   get finished() { return this.#finished; }
   get weapon() { return this.#weapon; }
   get progress() { return constrain(this.#timer / this.#duration, 0, 1); }
}
