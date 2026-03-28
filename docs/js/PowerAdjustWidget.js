class PowerAdjustWidget {
   #positionVector;
   #p1; #p2; #p3;
   #plateOutlineColor;
   #plateFillColor;
   #isFollowing = false;
   #power = 0;
   #sliderX;

   constructor(posV = createVector(width / 6 * 5, height - height / 5),
      plateInColor = color('paleturquoise'),
      plateOutColor = color('teal')) {
      this.#positionVector = posV;

      this.#plateFillColor = plateInColor;
      this.#plateOutlineColor = plateOutColor;

      this.#p1 = { x: this.#positionVector.x - 100, y: this.#positionVector.y + 100 };
      this.#p2 = { x: this.#positionVector.x + 60, y: this.#positionVector.y };
      this.#p3 = { x: this.#positionVector.x + 60, y: this.#positionVector.y + 100 };
      const xMin = Math.min(this.#p1.x + 2, this.#p3.x - 2);
      const xMax = Math.max(this.#p1.x + 2, this.#p3.x - 2);
      this.#sliderX = (xMin + xMax) / 2;
   }

   get isFollowing() { return this.#isFollowing; }
   get isHovered() { return this.#isHovered(); }
   set isFollowing(track) { this.#isFollowing = track; }
   get power() { return this.#power; }
   set power(p) {
      const xMin = Math.min(this.#p1.x + 2, this.#p3.x - 2);
      const xMax = Math.max(this.#p1.x + 2, this.#p3.x - 2);
      this.#sliderX = map(p, 0, 100, xMin, xMax);
      this.#power = p;
   }

   drawPowerAdjust(isEnabled) {
      this.#drawBoard(isEnabled);
      this.#drawPower(isEnabled);
   }

   #drawBoard(isEnabled) {
      push();
      const ctx = drawingContext;
      //gradient colour
      const col1 = "green";
      const col2 = "red";
      //set the position of the triangle board
      const minX = Math.min(this.#p1.x, this.#p2.x, this.#p3.x);
      const maxX = Math.max(this.#p1.x, this.#p2.x, this.#p3.x);
      const minY = Math.min(this.#p1.y, this.#p2.y, this.#p3.y);
      //set the gradient
      const g = ctx.createLinearGradient(minX, minY, maxX, minY);
      g.addColorStop(0, col1);
      g.addColorStop(1, col2);
      //the
      ctx.fillStyle = g;

      //move
      if (isEnabled && this.#isHovered() && this.#isFollowing) {
         stroke(this.#plateOutlineColor);
         strokeWeight(4);
      }
      else if (isEnabled && (this.#isHovered() || this.#isFollowing)) {
         stroke(this.#plateOutlineColor);
         strokeWeight(4);
         drawingContext.shadowBlur = 15;
         drawingContext.shadowColor = 'rgb(234, 240, 241)';
      }
      else {
         stroke(250);
         strokeWeight(2);
      }

      triangle(this.#p1.x, this.#p1.y, this.#p2.x, this.#p2.y, this.#p3.x, this.#p3.y);

      beginShape();

      fill(this.#plateFillColor);
      noStroke();
      vertex(this.#p3.x, this.#p3.y);
      vertex(this.#p2.x, this.#p2.y);
      vertex(this.#sliderX, this.yOnLineByX(this.#sliderX, this.#p1, this.#p2));
      vertex(this.#sliderX, this.#p3.y);

      fill(10, 220);
      noStroke();
      vertex(this.#p3.x - 1, this.#p3.y - 1);
      vertex(this.#p2.x - 1, this.#p2.y + 1);
      vertex(this.#sliderX, this.yOnLineByX(this.#sliderX, this.#p1, this.#p2) + 1);
      vertex(this.#sliderX, this.#p3.y - 1);

      endShape();

      pop();
   }

   #drawPower(isEnabled) {
      push();
      fill(250);

      const xMin = Math.min(this.#p1.x + 2, this.#p3.x - 2);
      const xMax = Math.max(this.#p1.x + 2, this.#p3.x - 2);

      if (this.#isFollowing) {
         this.#sliderX = constrain(mouseX, xMin, xMax);
      }

      this.#power = map(this.#sliderX, xMin, xMax, 0, 100);
      const px = this.#sliderX;

      if (isEnabled && (this.#isHovered() || this.#isFollowing)) {
         stroke(this.#plateOutlineColor);
         strokeWeight(2);
      } else {
         noStroke();
      }

      triangle(px, this.#p1.y, px - 6, this.#p1.y + 12, px + 6, this.#p1.y + 12);
      pop();

      this.#drawPowerText();
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


   yOnLineByX(x, pA, pB) {
      const x1 = pA.x, y1 = pA.y;
      const x2 = pB.x, y2 = pB.y;

      const t = (x - x1) / (x2 - x1);
      return y1 + (y2 - y1) * t;
   }

   #drawPowerText() {
      push();
      noStroke();
      fill(255);
      textSize(16);
      textAlign(LEFT, CENTER);

      const label = `Power: ${Math.round(this.#power)}`;

      text(label, this.#p1.x, this.#p1.y - 20);

      pop();
   }
}