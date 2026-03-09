class MovePadWidget {
  #positionVector;
  #plateOutlineColor;
  #plateFillColor;

  #isFollowing = false;
  #step = 5;    
  #gap = 10;
  #btnWidth = 60;
  #btnHeight = 60;

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
  isHovered() { return this.#isHovered() }
  set isFollowing(track) { this.#isFollowing = track; }

  drawMovePad() {
    this.#drawBoard();
    this.#drawButtons(-1);
    this.#drawButtons(1);
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

  #drawButtons(dir) {
    const buttonRect = this.#getRect(dir);

    push();
    rectMode(CENTER);
    stroke(this.#plateOutlineColor);
    if (this.#isHovered(buttonRect)) {
      strokeWeight(4);
    } else {
      strokeWeight(2);
    }

    fill(this.#plateFillColor);
    rect(buttonRect.cx, buttonRect.cy, buttonRect.w, buttonRect.h);
    this.#drawArrow(buttonRect.cx, buttonRect.cy, dir);
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
    vertex(4, -6);
    vertex(4, -10);
    vertex(12, 0);
    vertex(4, 10);
    vertex(4, 6);
    vertex(-8, 6);
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

  #isHovered(r) {
    const mx = mouseX, my = mouseY;
    return (
      mx >= r.cx - r.w / 2 &&
      mx <= r.cx + r.w / 2 &&
      my >= r.cy - r.h / 2 &&
      my <= r.cy + r.h / 2
    );
  }

  mousePressed() {
    lastButtonClicked = mouseButton.left;

    if (this.#isHovered(this.#getRect(-1))) {
      this.#isFollowing = true;
      return 'left';
    }

    if (this.#isHovered(this.#getRect(1))) {
      this.#isFollowing = true;
      return 'right';
    }
    return null;
  }
}