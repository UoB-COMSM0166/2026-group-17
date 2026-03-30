class ShootButton {
   #positionVector;
   #fillColor;
   #outlineColor;

   constructor(posVec = createVector(width / 2, height - (height * 0.16)),
      fillColor = 'lightblue', outColor = 'cadetblue') {
      this.#positionVector = posVec;
      this.#fillColor = fillColor;
      this.#outlineColor = outColor;
   }

   isHovered(ctrlPanelBaseHeight) { return this.#isHovered(ctrlPanelBaseHeight) }

   drawButton(isEnabled, ctrlPanelBaseHeight) {
      push();
      rectMode(CENTER);
      fill(this.#fillColor);
      if (isEnabled && this.#isHovered(ctrlPanelBaseHeight)) {
         stroke(this.#outlineColor);
         strokeWeight(4);
      } else {
         strokeWeight(2);
      }
      rect(this.#positionVector.x, this.#positionVector.y, width / 9, ctrlPanelBaseHeight / 3);

      //fill('yellow');
      //text(`ShootButton: ${this.#isHovered()}`, 120, 120);

      this.#drawText();
      pop();
      /*const x = this.#positionVector.x;
      const y = this.#positionVector.y;
      const rShoot = (controlPanel.baseAltitude * 0.4);
      this.#drawNeonShootButton(x, y, rShoot, this.#isHovered());
      this.#drawText();*/
   }

   /*#drawNeonShootButton(x, y, r, hovered) {
       const ctx = drawingContext;

   
       push();
       noFill();
       ctx.shadowBlur = hovered ? 18 : 12;
       ctx.shadowColor = "rgba(252, 240, 73, 0.9)";
       stroke(255, 170, 40, 220);
       strokeWeight(hovered ? 6 : 5);
       circle(x, y, r * 2.0 - 20);
       pop();

       push();
       noFill();
       ctx.shadowBlur = hovered ? 22 : 16;
       ctx.shadowColor = "rgba(120, 245, 255, 0.9)";
       stroke(120, 245, 255, 200);
       strokeWeight(hovered ? 6 : 5);
       arc(x, y, r * 2.0 + 4, r * 2.0 + 4, -21,  328);
       strokeWeight(1);
       arc(x, y, r * 2.0 + 18, r * 2.0 + 18, 25, 104);
       arc(x, y, r * 2.0 + 18, r * 2.0 + 18, 135, 235);
       arc(x, y, r * 2.0 + 18, r * 2.0 + 18, 278,  10);
       pop();

       
       //arc(x, y, r * 2.0 + 22, r * 2.0 + 22, -0.35, -0.05);
       pop();
   }*/

   #drawText() {
      push();
      fill(255);
      stroke(250);
      textSize(25);
      textAlign(CENTER, CENTER);
      text("SHOOT", this.#positionVector.x, this.#positionVector.y);
      pop();
   }

   #isHovered(ctrlPanelBaseHeight) {
      const w = width / 9;
      const h = ctrlPanelBaseHeight / 3;
      return (
         mouseX >= this.#positionVector.x - w / 2 &&
         mouseX <= this.#positionVector.x + w / 2 &&
         mouseY >= this.#positionVector.y - h / 2 &&
         mouseY <= this.#positionVector.y + h / 2
      );
   }
}