class StartMenu {
   constructor(width, height) {
      this.width = width;
      this.height = height;
      this.title = "HOT CANNONS";
      //Define buttons for selecting difficulty modes
      this.buttons = [
         { label: "EASY", x: width / 2, y: height / 1.7, w: 200, h: 60, mode: "easy" },
         { label: "HARD", x: width / 2, y: height / 1.7 + 100, w: 200, h: 60, mode: "hard" },
         { label: "HELP", x: width / 2, y: height / 1.7 + 200, w: 200, h: 60, mode: "help" }
      ];
      this.bgTop = color(30, 0, 10);
      this.bgBottom = color(255, 20, 0);
      //Store the currently selected mode
      this.selectedMode = null;
      this.showHelpPopup = false;
   }

   toggleHelpPopup() {
      this.showHelpPopup = !this.showHelpPopup;
   }
   
   draw() {
      // Whole start menu screen
      DrawUtils.drawLinearGradient(this.bgTop, this.bgBottom);
      textAlign(CENTER, CENTER);

      // Title
      textFont('Impact');
      fill(255, 140, 0);
      textSize(150);
      text(this.title, this.width / 2, this.height / 3);

      // Buttons
      for (let button of this.buttons) {
         this.drawButton(button);
      }

      // Draw help popup
      if (this.showHelpPopup) {
         this.drawHelpPopup();
      }
   }

   drawButton(button) {
      //Change button color when mouse is over it
      if (this.isMouseOver(button)) {
         fill(70, 130, 180);
      }
      else {
         fill(200);
      }
      //Set the outline color of the rectangle
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

   drawHelpPopup() {
      push();

      // overlay dark background
      fill(0, 0, 0, 120);
      rectMode(CORNER);
      rect(0, 0, this.width, this.height);

      // outer wooden frame
      fill(110, 65, 25);
      stroke(70, 35, 10);
      strokeWeight(8);
      rect(80, 40, this.width - 160, this.height - 80, 25);

      // inner parchment panel
      fill(242, 220, 180);
      noStroke();
      rect(110, 70, this.width - 220, this.height - 140, 18);

      // title wooden banner
      fill(150, 90, 35);
      stroke(90, 45, 15);
      strokeWeight(4);
      rect(this.width / 2 - 220, 55, 440, 70, 15);

      fill(255, 235, 200);
      noStroke();
      textFont('Arial');
      textAlign(CENTER, CENTER);
      textSize(34);
      textStyle(BOLD);
      text("HOW TO PLAY", this.width / 2, 90);

      let x = 200;
      let y = 160;
      let gap = 28;

      fill(20);
      textAlign(LEFT, TOP);
      textSize(18);
      textStyle(NORMAL);

      // Welcome
      text("Welcome to ", x, y);
      textStyle(BOLD);
      text("HOT CANNONS!", x + 110, y);
      y += gap * 1.5;

      // Game Modes
      textStyle(BOLD);
      text("Game Modes", x, y);
      y += gap * 1.2;
      textStyle(NORMAL);
      text("• Easy Mode: Includes an aiming guide line for easier shots.", x, y);
      y += gap;
      text("• Hard Mode: No aiming guide line and random events appear each round.", x, y);
      y += gap * 1.5;

      // Weapon Shop
      textStyle(BOLD);
      text("Weapon Shop", x, y);
      y += gap * 1.2;
      textStyle(NORMAL);
      let lineText = "Before the match begins, both players select ";
      text(lineText, x, y);
      let boldX = x + textWidth(lineText) + 8;
      textStyle(BOLD);
      let boldPart = "5 weapons";
      text(boldPart, boldX, y);
      let normalX = boldX + textWidth(boldPart);
      textStyle(NORMAL);
      text(" from the shop.", normalX, y);
      y += gap * 1.5;
      // Gameplay
      textStyle(BOLD);
      text("Gameplay", x, y);
      y += gap * 1.2;
      textStyle(NORMAL);
      text(
         "Adjust your cannon's angle and power, then fire to hit your opponent.",
         x,
         y
      );

      y += gap * 1.2;
      text("Each round:", x, y);
      y += gap;
      text("1. Player 1 turn", x + 25, y);
      y += gap * 0.9;
      text("2. Player 2 / AI turn", x + 25, y);
      y += gap * 1.6;
      textStyle(BOLD);
      text("Highest points after 5 rounds wins.", x, y);

      // close button
      fill(235, 140, 25);
      stroke(180, 90, 10);
      strokeWeight(3);
      rectMode(CENTER);
      rect(this.width / 2, this.height - 55, 260, 60, 18);

      noStroke();
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(24);
      textStyle(BOLD);
      text("CLOSE", this.width / 2, this.height - 55);

      pop();
   }

   handleMousePressed() {
      if (this.showHelpPopup) {
         const closeBtn = {
            x: this.width / 2,
            y: this.height - 55,
            w: 260,
            h: 60
         };
         if (
            mouseX > closeBtn.x - closeBtn.w / 2 &&
            mouseX < closeBtn.x + closeBtn.w / 2 &&
            mouseY > closeBtn.y - closeBtn.h / 2 &&
            mouseY < closeBtn.y + closeBtn.h / 2
         ) {
            this.showHelpPopup = false;
         }
         return null;
      }
      let selectedMode = null;
      //Check if any button is clicked
      for (let button of this.buttons) {
         if (this.isMouseOver(button)) {
            if (button.mode === "help") {
               this.toggleHelpPopup();
               return null;
            }
            selectedMode = button.mode;
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