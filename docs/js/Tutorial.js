class Tutorial {
   #currentStep = 3;
   #movePad;
   #angleWidget;
   #powerWidget;
   #shootButton;
   #positionVector;

   constructor(positionVector, movePad, angleWidget, powerWidget, shootButton) {
      this.#positionVector = positionVector;
      this.#movePad = new movePad(positionVector);
      this.#angleWidget = angleWidget;
      this.#powerWidget = powerWidget;
      this.#shootButton = shootButton;
   }
    
}