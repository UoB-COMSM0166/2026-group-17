//Tutorial page show up when the game starts.
class Tutorial {
   #currentStep = 0;
   #movePad;
   #angleWidget;
   #powerWidget;
   #shootButton;
   #positionVector;
   #isVisible = false;
   #closeButtonRadius = 20;
   #frameWidth;
   #frameHeight;
   #frameX;
   #frameY;
   #controlPanel;

   constructor(positionVector, controlPanel) {
      //this.#positionVector = positionVector;
      //this.#movePad = new movePad(positionVector);
      //this.#angleWidget = angleWidget;
      //this.#powerWidget = powerWidget;
      //this.#shootButton = shootButton;
      this.#controlPanel = controlPanel;

      this.Title = "TUTORIAL";
      this.Context = "Welcome to the game! Here's a quick tutorial to get you started:\n" + 
                     "Moving the cannon, adjusting the angle and power, choosing the weapon, and shooting at your opponent can be both use keyboard or on-screen controls.";
      this.Steps = [
         "Move your cannon: Use LEFT/RIGHT arrow keys.",
         "Adjust angle: Use A/D keys.",
         "Adjust power: Use W/S keys.",
         "Select weapon: Use Q/E keys.",
         "Fire: Press SPACE."
      ];

      // Calculate frame dimensions (80% of canvas size)
      this.#frameWidth = width * 0.8;
      this.#frameHeight = height * 0.75;
      this.#frameX = (width - this.#frameWidth) / 2;
      this.#frameY = (height - this.#frameHeight) / 2;
   }

   draw() {
      if (!this.#isVisible) return;

      push();

      // Enhanced gradient overlay background
      for (let i = 0; i <= 150; i += 10) {
         fill(0, 0, 0, i);
         rectMode(CORNER);
         rect(0, 0, width, height);
      }

      fill(110, 65, 25);
      stroke(70, 35, 10);
      strokeWeight(8);
      rect(this.#frameX, this.#frameY, this.#frameWidth, this.#frameHeight, 25);

      fill(242, 220, 180);
      noStroke();
      rect(this.#frameX + 15, this.#frameY + 50, this.#frameWidth - 30, this.#frameHeight - 65, 18);

      fill(150, 90, 35);
      stroke(90, 45, 15);
      strokeWeight(4);
      rect(this.#frameX + this.#frameWidth / 2 - 150, this.#frameY + 10, 300, 50, 12);

      //tutorial title
      fill(255, 235, 200);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(32);
      textStyle(BOLD);
      text(this.Title, this.#frameX + this.#frameWidth / 2, this.#frameY + 35);

      //tutorial context
      fill(20);
      textAlign(LEFT, TOP);
      textSize(16);
      textStyle(NORMAL);
      text(this.Context, this.#frameX + 40, this.#frameY + 80, this.#frameWidth - 80);


      // Draw Control Panel illustration at bottom (non-interactive)
      this.#drawControlPanelIllustration();

      // Draw tutorial steps
      this.#drawSteps();

      // Draw buttons (close button)
      this.drawButtons();

      pop();
   }

   #drawControlPanelIllustration() {
      if (this.#controlPanel) {
         push();
         // Calculate scale based on tutorial frame width
         let scaleAdjust = (this.#frameWidth - 30) / width;
         
         // Position at center of tutorial frame, bottom aligned to frame bottom
         translate(this.#frameX + this.#frameWidth / 2, this.#frameHeight + 73);
         scale(scaleAdjust);
         translate(-width / 2, -height);
         
         this.#controlPanel.drawCtrlPanel(null, false);
         pop();
      }
   }

   #drawSteps() {
      let x = this.#frameX + 40;
      let y = this.#frameY + 160;
      let gap = 40;

      fill(20);
      textAlign(LEFT, TOP);
      textSize(16);
      textStyle(NORMAL);

      this.Steps.forEach((step, index) => {
         // Step number in circle
         fill(150, 90, 35);
         stroke(90, 45, 15);
         strokeWeight(2);
         circle(x + 15, y + 8, 15);

         fill(255, 235, 200);
         noStroke();
         textAlign(CENTER, CENTER);
         textSize(14);
         textStyle(BOLD);
         text(index + 1, x + 15, y + 8);

         // Step text
         fill(20);
         textAlign(LEFT, TOP);
         textSize(14);
         textStyle(NORMAL);
         text(step, x + 40, y, this.#frameWidth - 100);

         y += gap;
      });
   }

   //close button
   drawButtons() {
      let closeX = this.#frameX + this.#frameWidth - 25;
      let closeY = this.#frameY + 20;

      push();
      fill(200, 60, 60);
      stroke(150, 30, 30);
      strokeWeight(2);
      circle(closeX, closeY, this.#closeButtonRadius);

      // X symbol
      stroke(255);
      strokeWeight(3);
      strokeCap(ROUND);
      let offset = 8;
      line(closeX - offset, closeY - offset, closeX + offset, closeY + offset);
      line(closeX + offset, closeY - offset, closeX - offset, closeY + offset);

      pop();
   }

   mousePressed() {
      if (!this.#isVisible) return false;

      let closeX = this.#frameX + this.#frameWidth - 25;
      let closeY = this.#frameY + 20;
      let distance = dist(mouseX, mouseY, closeX, closeY);

      if (distance < this.#closeButtonRadius) {
         this.closeTutorial();
         return true;
      }
      return false;
   }

   openTutorial() {
      this.#isVisible = true;
      this.#currentStep = 0;
   }

   closeTutorial() {
      this.#isVisible = false;
   }

   get isVisible() {
      return this.#isVisible;
   }

   set isVisible(value) {
      this.#isVisible = value;
   }
}