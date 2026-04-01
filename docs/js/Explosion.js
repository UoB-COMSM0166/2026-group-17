class Explosion {
  constructor(x, y, terrainRef = null, kind = "ball") {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.maxRadius = random(40, 120);
    this.terrain = terrainRef;
    this.hasAppliedTerrain = false;
    this.finished = false;
    this.kind = kind;
    this.gasRadius = 0;
    this.maxGasRadius = 120;
    this.waveRadius = 0;

    this.enemyFeedbackTriggered = false;
    this.selfFeedbackTriggered = false;
  }

  update() {
    if (this.finished) return;

    this.radius += 7;
    if (this.kind === "pineapple") {
      this.gasRadius += 1.5;
    }
    if (this.kind === "shiba") {
      this.waveRadius += 10;
    }

    if (!this.hasAppliedTerrain && this.radius >= this.maxRadius) {
      if (this.terrain) {
        this.terrain.applyExplosion(createVector(this.x, this.y), this.maxRadius);
      }
      this.hasAppliedTerrain = true;
      this.finished = true;
    }
  }

  draw() {

    if (this.finished) return;

    if (this.kind === "ball") {
      noFill();
      stroke(255, 150, 0);
      strokeWeight(3);
      circle(this.x, this.y, this.radius);
      return;
    }

    // 菠萝：毒雾 + 果核 + 恶魔紫气
    else if (this.kind === "pineapple") {

      push();

      // outer purple shock
      noStroke();
      fill(150, 80, 220, 80);
      circle(this.x, this.y, this.radius * 1.6);

      // toxic cloud
      fill(80, 220, 120, 110);
      circle(this.x, this.y, this.radius * 1.2);

      // pineapple flash
      fill(255, 240, 120, 180);
      circle(this.x, this.y, this.radius * 0.5);

      // glow
      stroke(120, 255, 160, 160);
      strokeWeight(2);
      noFill();
      circle(this.x, this.y, this.radius * 1.1);

      pop();
      fill(120, 220, 120, 60);
      circle(this.x, this.y, this.gasRadius);
    }

    else if (this.kind === "star") {

      push();
      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = 'orange';
      // outer glow
      noStroke();
      fill(255, 220, 90, 120);
      circle(this.x, this.y, this.radius * 1.3);

      // center flash
      fill(255, 255, 255, 160);
      circle(this.x, this.y, this.radius * 0.4);

      // spark star
      StarSpark.draw(this.x, this.y, this.radius * 0.9);

      // sparkle lines
      stroke(255, 240, 120, 180);
      strokeWeight(2);

      line(this.x, this.y - this.radius,
        this.x, this.y + this.radius);

      line(this.x - this.radius, this.y,
        this.x + this.radius, this.y);

      pop();
    }
    else if (this.kind === "shiba") {

      triggerShake(8, 10);
      push();

      // dust shock
      noStroke();
      fill(170, 120, 90, 100);
      circle(this.x, this.y, this.radius * 1.5);

      // impact flash
      fill(255, 130, 80, 160);
      circle(this.x, this.y, this.radius * 0.9);

      // cross shockwave
      stroke(255, 80, 80);
      strokeWeight(3);

      line(this.x - this.radius * 0.6, this.y,
        this.x + this.radius * 0.6, this.y);

      line(this.x, this.y - this.radius * 0.5,
        this.x, this.y + this.radius * 0.5);

      pop();
    }
  }
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