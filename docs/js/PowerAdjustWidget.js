class PowerAdjustWidget {
  #positionVector;
  #p1; #p2; #p3;
  #plateOutlineColor;
  #isFollowing = false;

  constructor(posV = createVector(width / 6 * 5, height - height / 5)) {
    this.#positionVector = posV;

    this.#p1 = { x: this.#positionVector.x - 100, y: this.#positionVector.y + 100 };
    this.#p2 = { x: this.#positionVector.x + 60,  y: this.#positionVector.y };
    this.#p3 = { x: this.#positionVector.x + 60,  y: this.#positionVector.y + 100 };
  }

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
    strokeWeight(2);
    stroke(this.#plateOutlineColor);
    triangle(this.#p1.x, this.#p1.y, this.#p2.x, this.#p2.y, this.#p3.x, this.#p3.y);
    pop();
  }

  #drawPower() {
    push();
    fill(250);
    noStroke();

    const xMin = Math.min(this.#p1.x + 2, this.#p3.x);
    const xMax = Math.max(this.#p1.x - 2, this.#p3.x);
    const px = constrain(mouseX, xMin, xMax);

    triangle(
      px, this.#p1.y,
      px - 6, this.#p1.y + 12,
      px + 6, this.#p1.y + 12
    );

    pop();
  }
}