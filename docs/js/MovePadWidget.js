class MovePadWidget {
  #positionVector;
  #plateOutlineColor;
  #plateFillColor;
  #isFollowing = false;
  #step = 3;
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
  get step() { return this.#step; }
  set step(s) { this.#step = s; }

  drawMovePad() {
    this.#drawBoard();
    this.#drawButtons(-1);
    this.#drawButtons(1);
    this.#drawSteps();
  }

  #drawSteps() {
  push();
  rectMode(CENTER);

   push();
  rectMode(CENTER);

  const x = this.#positionVector.x;
  const y = this.#positionVector.y - this.#btnHeight; 
  const w = this.#btnWidth * 2 + this.#gap;
  const h = 30;
  const r = 8;

  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 220, 255, 0.25)';
  stroke(0, 220, 255, 140);
  strokeWeight(2);
  fill(18, 28, 38, 220);
  rect(x, y, w, h, r);

  noStroke();
  fill(140, 225, 240, 180);
  textAlign(LEFT, CENTER);
  textSize(20);
  text("STEPS", x - w / 2 + 14, y);


  const boxW = 42;
  const boxH = 22;
  const boxX = x + w / 2 - 30;
  const boxY = y;

  noStroke();
  fill(8, 12, 18, 235);
  rect(boxX, boxY, boxW, boxH, 5);

  stroke(20, 30, 40, 220);
  strokeWeight(2);
  line(boxX - boxW / 2 + 3, boxY - boxH / 2 + 2, boxX + boxW / 2 - 3, boxY - boxH / 2 + 2);
  line(boxX - boxW / 2 + 2, boxY - boxH / 2 + 3, boxX - boxW / 2 + 2, boxY + boxH / 2 - 3);

  stroke(100, 230, 255, 70);
  line(boxX - boxW / 2 + 3, boxY + boxH / 2 - 2, boxX + boxW / 2 - 3, boxY + boxH / 2 - 2);
  line(boxX + boxW / 2 - 2, boxY - boxH / 2 + 3, boxX + boxW / 2 - 2, boxY + boxH / 2 - 3);

  noStroke();
  fill(235, 250, 255);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(this.#step, boxX, boxY + 0.5);
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