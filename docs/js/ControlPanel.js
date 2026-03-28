class ControlPanel {
   #baseAltitude = height * 0.25;
   #backgroundColor;
   #angleDial;
   #shootButton;
   #powerAdjust;
   #movePad;

   static #profile;
   constructor(bgColor) {
      this.#backgroundColor = bgColor;
      this.#angleDial = new AngleDialWidget(createVector(width / 6, height - this.#baseAltitude / 2));
      this.#shootButton = new ShootButton();
      this.#powerAdjust = new PowerAdjustWidget();
      this.#movePad = new MovePadWidget();

      // array of vectors for the position of each point forming the top of the control panel shape
      ControlPanel.#profile = [
         createVector(0, height - this.#baseAltitude),
         createVector(width * 0.08, height - this.#baseAltitude),
         createVector(width * 0.11, height - this.#baseAltitude * 1.2),
         createVector(width * 0.25, height - this.#baseAltitude * 1.2),
         createVector(width * 0.25 + 10, height - this.#baseAltitude * 1.2 + 10),
         createVector(width * 0.75 - 10, height - this.#baseAltitude * 1.2 + 10),
         createVector(width * 0.75, height - this.#baseAltitude * 1.2),
         createVector(width * 0.89, height - this.#baseAltitude * 1.2),
         createVector(width * 0.92, height - this.#baseAltitude),
         createVector(width, height - this.#baseAltitude)
      ];
   }

   drawCtrlPanel(player, isEnabled) {
      this.#drawBackground();

      push();
      beginShape();

      stroke(250, 180);
      strokeWeight(2);
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = 'rgb(232, 237, 238)';
      fill(25, 240);
      vertex(0, height - 2);
      for (let vertId = 1; vertId < ControlPanel.#profile.length - 1; vertId++)
         vertex(ControlPanel.#profile[vertId].x, ControlPanel.#profile[vertId].y);
      vertex(width, height - 2);
      vertex(width * 0.67, height - 2);
      vertex(width * 0.67 - 30, height - 30);
      vertex(width * 0.33 + 30, height - 30);
      vertex(width * 0.33, height - 2);

      endShape(CLOSE);
      pop();

      push();
      strokeWeight(6);
      stroke(0, 245, 212);
      drawingContext.shadowBlur = 30;
      drawingContext.shadowColor = 'rgb(0, 204, 255)';
      line(width * 0.42, height - 15, width * 0.58, height - 15);
      line(width * 0.37, height - this.#baseAltitude * 1.2 + 10, width * 0.63, height - this.#baseAltitude * 1.2 + 10);
      line(width * 0.16, height - this.#baseAltitude * 1.2, width * 0.20, height - this.#baseAltitude * 1.2);
      line(width * 0.80, height - this.#baseAltitude * 1.2, width * 0.84, height - this.#baseAltitude * 1.2);
      pop();

      this.#angleDial.drawAngleDial(player, isEnabled);
      this.#shootButton.drawButton(isEnabled, this.#baseAltitude);
      this.#powerAdjust.drawPowerAdjust(isEnabled);
      this.#movePad.drawMovePad(isEnabled);
   }
   getAltitudeAt(panelTopX) {
      for (let vecId = 0; vecId < ControlPanel.#profile.length - 1; vecId++) {
         const segStartVec = ControlPanel.#profile[vecId];
         const segEndVec = ControlPanel.#profile[vecId + 1];
         if (panelTopX >= segStartVec.x && panelTopX <= segEndVec.x) {
            const amount = map(panelTopX, segStartVec.x, segEndVec.x, 0, 1);
            return ceil(lerp(segStartVec.y, segEndVec.y, amount));
         }
      }
   }

   get baseAltitude() { return this.#baseAltitude; }
   get angleDial() { return this.#angleDial; }
   get powerAdjust() { return this.#powerAdjust; }
   get shootButton() { return this.#shootButton; }
   handleMovePadClick() { return this.#movePad.mousePressed(); }
   setMoveSteps(steps) { this.#movePad.step = steps; }

   #drawBackground() {
      fill(this.#backgroundColor);
      rectMode(CORNER);
      rect(0, height - this.#baseAltitude, width, this.#baseAltitude);
   }
}