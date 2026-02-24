class PowerAdjustWidget {
  #positionVector;
  #p1; #p2; #p3;
  #plateOutlineColor;
  #isFollowing = false;
  #power = 0;

  constructor(posV = createVector(width / 6 * 5, height - height / 5)) {
    this.#positionVector = posV;

    this.#p1 = { x: this.#positionVector.x - 100, y: this.#positionVector.y + 100 };
    this.#p2 = { x: this.#positionVector.x + 60,  y: this.#positionVector.y };
    this.#p3 = { x: this.#positionVector.x + 60,  y: this.#positionVector.y + 100 };
  }

  get isFollowing() { return this.#isFollowing; }
  get isHovered() { return this.#isHovered() }
  set isFollowing(track) { this.#isFollowing = track; }

  drawPowerAdjust() {
    this.#drawBoard();
    this.#drawPower();
  }

  #drawBoard() {
    push();
    const ctx = drawingContext;

    const col1 = "green";
    const col2 = "red";

    const minX = Math.min(this.#p1.x, this.#p2.x, this.#p3.x);
    const maxX = Math.max(this.#p1.x, this.#p2.x, this.#p3.x);
    const minY = Math.min(this.#p1.y, this.#p2.y, this.#p3.y);

    const g = ctx.createLinearGradient(minX, minY, maxX, minY);
    g.addColorStop(0, col1);
    g.addColorStop(1, col2);

    ctx.fillStyle = g;
    if (this.#isHovered()) {
      stroke(this.#plateOutlineColor);
      strokeWeight(4);
    } else {
      strokeWeight(2);
    }
    
    triangle(this.#p1.x, this.#p1.y, this.#p2.x, this.#p2.y, this.#p3.x, this.#p3.y);
    pop();
  }

  #drawPower() {
    push();
    fill(250);
    noStroke();

    const xMin = Math.min(this.#p1.x + 2, this.#p3.x - 2);
    const xMax = Math.max(this.#p1.x + 2, this.#p3.x - 2);
    const px = constrain(mouseX, xMin, xMax);

    triangle(
      px, this.#p1.y,
      px - 6, this.#p1.y + 12,
      px + 6, this.#p1.y + 12
    );

    pop();
  }

  #isHovered() {
    const mx = mouseX, my = mouseY;
    const { x: x1, y: y1 } = this.#p1;
    const { x: x2, y: y2 } = this.#p2;
    const { x: x3, y: y3 } = this.#p3;

    const denom = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    if (denom === 0) return false;

    const a = ((y2 - y3) * (mx - x3) + (x3 - x2) * (my - y3)) / denom;
    const b = ((y3 - y1) * (mx - x3) + (x1 - x3) * (my - y3)) / denom;
    const c = 1 - a - b;

    return a >= 0 && b >= 0 && c >= 0;
  }
    
}