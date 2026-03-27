class StartMenu {
   constructor(width, height) {
      this.width = width;
      this.height = height;
      this.title = "HOT CANNONS";
      //Define buttons for selecting difficulty modes
      this.buttons = [
         { label: "EASY", x: width / 2, y: height / 1.7, w: 200, h: 60, mode: "easy" },
         { label: "HARD", x: width / 2, y: height / 1.7 + 100, w: 200, h: 60, mode: "hard" }
      ];
      this.bgTop = color(30, 0, 10);
      this.bgBottom = color(255, 20, 0);
      //Store the currently selected mode
      this.selectedMode = null;
   }
   draw() {
      //Whole start menu screen
      //background(30, 30, 50);

      DrawUtils.drawLinearGradient(this.bgTop, this.bgBottom);
      textAlign(CENTER, CENTER);

      //Title
      textFont('Impact');
      fill(255, 140, 0);
      textSize(150);
      text(this.title, this.width / 2, this.height / 3);

      //Buttons
      this.drawButton(this.buttons[0]);
      this.drawButton(this.buttons[1]);
   }

   drawButton(button) {
      //Change button color when mouse is over it
      if (this.isMouseOver(button)) {
         fill(70, 130, 180);
      }
      else {
         fill(200);
      }
      //Set the outline color of the rectancle
      stroke(0);
      //Set the thickness of the rectangle's outline
      strokeWeight(3);
      rectMode(CENTER);
      rect(button.x, button.y, button.w, button.h, 10);
      //Disable the outline for the text
      noStroke();
      fill(0);
      textSize(32);
      text(button.label, button.x, button.y);
   }
   handleMousePressed() {
      let selectedMode = null;
      //Check if any button is clicked
      for (let i = 0; i < this.buttons.length; i++) {
         const button = this.buttons[i];
         if (this.isMouseOver(button)) {
            //Store selected mode
            selectedMode = button.mode;
            //Exit loop after first match
            break;
         }
      }
      //Save selected mode to class property
      this.selectedMode = selectedMode;
      //Return selected mode
      return selectedMode;
   }
   isMouseOver(button) {
      //Check if the mouse cursor is inside the button's rectangular area
      //Return true if the mouse is over the button
      return mouseX > button.x - button.w / 2 &&
         mouseX < button.x + button.w / 2 &&
         mouseY > button.y - button.h / 2 &&
         mouseY < button.y + button.h / 2;
   }
}