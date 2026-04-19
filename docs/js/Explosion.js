class Explosion {
   #position;
   #terrain;
   #weapon;
   #currentRadius = 0;
   #maxRadius = 50;
   #duration = 1000;
   #timer = 0;
   #finished = false;
   #affectsTerrain = true;

   constructor(impactPosition, terrainRef = null, weapon = null, options = {}) {
      this.#position = impactPosition.copy ? impactPosition.copy() : impactPosition;
      this.#terrain = terrainRef;
      this.#weapon = weapon;
      // Some child explosions are visual-only to avoid terrain edge cases.
      this.#affectsTerrain = options.affectsTerrain ?? true;

      this.kind = options.kind ?? weapon?.id ?? "ball";

      this.#maxRadius =
         options.maxRadius ??
         weapon?.explosionRadius ??
         this.#resolveMaxRadius(this.kind);

      this.#duration =
         options.duration ??
         (500 + this.#maxRadius * 4);

      this.enemyFeedbackTriggered = false;
      this.selfFeedbackTriggered = false;
      this.hasAppliedTerrain = false;

      this.gasRadius = 0;
      this.maxGasRadius = 120;
      this.waveRadius = 0;
   }

   #resolveMaxRadius(kind) {
      if (kind === "pineapple") return 20;
      if (kind === "shiba") return 75;
      if (kind === "star") return 80;
      if (kind === "starFragment") return 45;
      return 50;
   }

   update(dt) {
      if (this.#finished) return;

      this.#timer += dt;
      const progress = constrain(this.#timer / this.#duration, 0, 1);
      this.#currentRadius = lerp(0, this.#maxRadius, progress);

      if (this.kind === "pineapple") {
         this.gasRadius = lerp(0, this.maxGasRadius, progress);
      }

      if (this.kind === "shiba") {
         this.waveRadius = lerp(0, this.#maxRadius * 1.6, progress);
      }

      if (!this.hasAppliedTerrain && this.#timer >= this.#duration) {
         if (this.#affectsTerrain && this.#terrain) {
            this.#terrain.applyExplosion(this.#position.copy(), this.#maxRadius);
         }
         this.hasAppliedTerrain = true;
         this.#finished = true;
      }

      if (this.kind === "bubblegumshot") {
         const elastic = sin(progress * PI);

         this.#currentRadius = lerp(0, this.#maxRadius, progress) * (1 + elastic * 0.25);
      }

      if (this.kind === "impactShock") {
         this.#weapon?.drawImpactShock?.(this);
         return;
      }
   }

   draw() {
   if (this.#finished) return;

   const x = this.#position.x;
   const y = this.#position.y;
   const r = this.#currentRadius;

   if (this.kind === "shiba") {
      return;
   }

   if (this.kind === "starFragment") {
   push();
   drawingContext.shadowBlur = 25;
   drawingContext.shadowColor = 'orange';

   noStroke();
   fill(255, 220, 90, 120);
   circle(x, y, r * 1.3);

   fill(255, 255, 255, 160);
   circle(x, y, r * 0.4);

   StarSpark.draw(x, y, r * 0.9);

   stroke(255, 240, 120, 180);
   strokeWeight(2);
   line(x, y - r, x, y + r);
   line(x - r, y, x + r, y);

   pop();
   return;
}

   if (this.#weapon?.drawExplosion) {
      this.#weapon.drawExplosion(this);
      return;
   }

   if (this.kind === "ball" || this.kind === "cannon_ball") {
      push();
      noFill();
      stroke(255, 150, 0);
      strokeWeight(3);
      circle(x, y, r);
      pop();
      return;
   }

   if (this.kind === "pineapple") {
      push();
      noStroke();

      fill(150, 80, 220, 80);
      circle(x, y, r * 1.6);

      fill(80, 220, 120, 110);
      circle(x, y, r * 1.2);

      fill(255, 240, 120, 180);
      circle(x, y, r * 0.5);

      stroke(120, 255, 160, 160);
      strokeWeight(2);
      noFill();
      circle(x, y, r * 1.1);
      pop();

      push();
      noStroke();
      fill(120, 220, 120, 60);
      circle(x, y, this.gasRadius);
      pop();
      return;
   }

   push();
   strokeWeight(3);
   stroke('orange');
   fill('yellow');
   circle(x, y, r);
   pop();
}

   get position() { return this.#position; }
   get radius() { return this.#currentRadius; }
   get maxRadius() { return this.#maxRadius; }
   get finished() { return this.#finished; }
   get weapon() { return this.#weapon; }
   get progress() { return constrain(this.#timer / this.#duration, 0, 1); }
   get affectsTerrain() { return this.#affectsTerrain; }
}

class StarSpark {
   static draw(x, y, r) {
      push();
      translate(x, y);
      beginShape();
      for (let i = 0; i < 10; i++) {
         const ang = -HALF_PI + i * PI / 5;
         const rr = i % 2 === 0 ? r : r * 0.45;
         vertex(cos(ang) * rr, sin(ang) * rr);
      }
      endShape(CLOSE);
      pop();
   }
}