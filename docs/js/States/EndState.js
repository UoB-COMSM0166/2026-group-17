class EndState extends State {
   #results;

   constructor(game, resolution, results) {
      super(game, resolution);
      this.#results = results;
   };

   drawState() {
      background('black');
      fill('white');
      noStroke();
      textAlign(CENTER, TOP);
      textFont('MS Trebuchet');
      let statusText;
      if (this.#results.winnerData === "tie") statusText = "N/A - Draw!";
      else statusText = `Player ${this.#results.winnerData + 1}`;
      //Display winner
      textSize(60);
      text(`Winner: ${statusText}`, this.resolution.x / 2, 120);
      //Display final scores
      textSize(32);
      text(
         "Player 1 Score: " + this.#results.score1 + "\n" +
         "Player 2 Score: " + this.#results.score2,
         this.resolution.x / 2,
         250
      );
      //Restart instruction
      textSize(24);
      text("Press 'R' to restart", this.resolution.x / 2, 400);
   }

   onKeyReleased(keyReleased) {
      if (keyReleased === 'r' || keyReleased === 'R') window.location.reload();
   }
}