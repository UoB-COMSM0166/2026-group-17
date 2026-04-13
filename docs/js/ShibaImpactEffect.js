class ShibaImpactEffect {
  constructor(x, y, strength = 1) {
    this.x = x;
    this.y = y;
    this.strength = strength;

    this.age = 0;
    this.life = 20; // frames
    this.finished = false;
  }

  update() {
    this.age++;
    if (this.age >= this.life) {
      this.finished = true;
    }
  }

  draw() {
    const t = this.age / this.life;
    const r = lerp(10, 90 + this.strength * 30, t);
    const alpha = lerp(180, 0, t);

    push();
    noFill();

    strokeWeight(5 - t * 3);
    stroke(255, 210, 140, alpha);
    ellipse(this.x, this.y, r * 1.4, r * 0.55);

    strokeWeight(2);
    stroke(255, 240, 200, alpha * 0.8);
    ellipse(this.x, this.y, r * 0.95, r * 0.35);

    pop();
  }
}