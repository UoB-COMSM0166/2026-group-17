class MovePadWidget {
  #positionVector;
  #plateOutlineColor;
  #plateFillColor;

  #isFollowing = false;
  #step = 5;    
  #gap = 10;
  #btnWidth = 40;
  #btnHeight = 30;

  constructor(
    posV = createVector(width * 0.65, height * 0.85),
    plateInColor = color('paleturquoise'),
    plateOutColor = color('teal')
  ) {
    this.#positionVector = posV;
    this.#plateFillColor = plateInColor;
    this.#plateOutlineColor = plateOutColor;
  }

  get isFollowing() { return this.#isFollowing; }
  set isFollowing(track) { this.#isFollowing = track; }

  drawMovePad() {
    this.#drawBoard();
    this.#drawButtons();
  }

  #drawBoard() {
    push();
    rectMode(CENTER);
    stroke(this.#plateOutlineColor);
    strokeWeight(2);
    fill(this.#plateFillColor);

    const w = this.#btnWidth * 2 + this.#gap + 80;
    const h = this.#btnHeight + 18;
    rect(this.#positionVector.x, this.#positionVector.y, w, h, 10);
    pop();
  }

  #drawButtons() {
    const leftRect = this.#getRect(-1);
    const rightRect = this.#getRect(1);

    push();
    rectMode(CENTER);
    stroke(this.#plateOutlineColor);
    strokeWeight(2);
    fill(this.#plateFillColor);
    rect(leftRect.cx, leftRect.cy, leftRect.w, leftRect.h);
    this.#drawArrow(leftRect.cx, leftRect.cy, -1);
    pop();

    push();
    rectMode(CENTER);
    stroke(this.#plateOutlineColor);
    strokeWeight(2);
    fill(this.#plateFillColor);
    rect(rightRect.cx, rightRect.cy, rightRect.w, rightRect.h);
    this.#drawArrow(rightRect.cx, rightRect.cy, 1);
    pop();
  }

  #drawArrow(cx, cy, dir) {
    // dir: -1 left, +1 right
    push();
    translate(cx, cy);
    noStroke();
    fill('black');

    if (dir === -1) scale(-1, 1);

    beginShape();
    vertex(-8, -6);
    vertex( 4, -6);
    vertex( 4, -10);
    vertex(12,  0);
    vertex( 4, 10);
    vertex( 4,  6);
    vertex(-8,  6);
    endShape(CLOSE);

    pop();
  }

  #getRect(dir) {
    return {
      cx: this.#positionVector.x + dir * (this.#gap / 2 + this.#btnWidth / 2),
      cy: this.#positionVector.y,
      w: this.#btnWidth,
      h: this.#btnHeight
    };
  }
}