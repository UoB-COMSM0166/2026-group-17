class Explosion {
  #position;
  #terrain;
  #finished = false;

  constructor(impactPosition, terrainRef = null, kind = "ball") {
    this.#position = impactPosition.copy();
    this.#terrain = terrainRef;
    this.kind = kind;

    this.radius = 10;
    this.maxRadius = this.#resolveMaxRadius(kind);
    this.hasAppliedTerrain = false;

    this.gasRadius = 0;
    this.maxGasRadius = 120;
    this.waveRadius = 0;

    this.enemyFeedbackTriggered = false;
    this.selfFeedbackTriggered = false;
  }

  #resolveMaxRadius(kind) {
    if (kind === "pineapple") return 20;
    if (kind === "shiba") return 75;
    if (kind === "star") return 80;
    if (kind === "starFragment") return 45;
    return 50;
  }

  update(turnController, dt) {
  if (this.#finished) return;

  this.radius += 7;

  if (this.kind === "pineapple") this.gasRadius += 1.5;
  if (this.kind === "shiba") this.waveRadius += 10;

  if (!this.hasAppliedTerrain && this.radius >= this.maxRadius) {
    if (this.#terrain) {
      this.#terrain.applyExplosion(this.#position.copy(), this.maxRadius);
    }
    this.hasAppliedTerrain = true;
    this.#finished = true;
  }
}

  draw() {
    if (this.#finished) return;

    const x = this.#position.x;
    const y = this.#position.y;

    if (this.kind === "ball") {
      push();
      noFill();
      stroke(255, 150, 0);
      strokeWeight(3);
      circle(x, y, this.radius);
      pop();
      return;
    }

    if (this.kind === "pineapple") {
      push();
      noStroke();

      fill(150, 80, 220, 80);
      circle(x, y, this.radius * 1.6);

      fill(80, 220, 120, 110);
      circle(x, y, this.radius * 1.2);

      fill(255, 240, 120, 180);
      circle(x, y, this.radius * 0.5);

      stroke(120, 255, 160, 160);
      strokeWeight(2);
      noFill();
      circle(x, y, this.radius * 1.1);
      pop();

      push();
      noStroke();
      fill(120, 220, 120, 60);
      circle(x, y, this.gasRadius);
      pop();
      return;
    }

    if (this.kind === "star" || this.kind === "starFragment") {
      push();
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = 'orange';

      noStroke();
      fill(255, 220, 90, 120);
      circle(x, y, this.radius * 1.3);

      fill(255, 255, 255, 160);
      circle(x, y, this.radius * 0.4);

      StarSpark.draw(x, y, this.radius * 0.9);

      stroke(255, 240, 120, 180);
      strokeWeight(2);
      line(x, y - this.radius, x, y + this.radius);
      line(x - this.radius, y, x + this.radius, y);

      pop();
      return;
    }

    if (this.kind === "shiba") {
      push();
      noStroke();

      fill(170, 120, 90, 100);
      circle(x, y, this.radius * 1.5);

      fill(255, 130, 80, 160);
      circle(x, y, this.radius * 0.9);

      stroke(255, 80, 80);
      strokeWeight(3);
      line(x - this.radius * 0.6, y, x + this.radius * 0.6, y);
      line(x, y - this.radius * 0.5, x, y + this.radius * 0.5);

      pop();
      return;
    }

    push();
    noFill();
    stroke(255, 150, 0);
    strokeWeight(3);
    circle(x, y, this.radius);
    pop();
  }

  get position() { return this.#position; }
  get finished() { return this.#finished; }
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