// The primary interaction point for committing to a shot.
// Uses a standard Axis-Aligned Bounding Box for mouse hover detection
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
      this.#drawText();
      pop();
   }

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