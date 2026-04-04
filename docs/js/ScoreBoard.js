class ScoreBoard {
   constructor() {
      this.score1 = 0;
      this.score2 = 0;
      this.fontLoaded = null;
   }

   setup() {
      textAlign(LEFT, TOP);
      textFont('Comic Sans MS, Chalkboard SE, Marker Felt, cursive');
   }

   draw() {
      push();
      this.drawScoreBoard();
      pop();
   }

   drawScoreBoard() {
      const margin = 20;

      noStroke();

      // Player 1
      textAlign(LEFT, TOP);
      textSize(18);
      fill(255, 80, 80);
      text("PLAYER 1", margin, 15);

      textSize(26);
      fill(255);
      text(this.score1, margin, 40);

      // Player 2
      textAlign(RIGHT, TOP);
      textSize(18);
      fill(80, 180, 255);
      text("PLAYER 2", width - margin, 15);

      textSize(26);
      fill(255);
      text(this.score2, width - margin, 40);
   }

   addPointToPlayer1(points) {
      this.score1 = Math.max(this.score1 + points, 0);
   }

   addPointToPlayer2(points) {
      this.score2 = Math.max(this.score2 + points, 0);
   }

   addScoreToPlayer(playerId, points) {
      if (playerId === 0) this.addPointToPlayer1(points);
      else if (playerId === 1) this.addPointToPlayer2(points);
   }

   getHighestScorePlayerId() {
      if (this.score1 > this.score2) return { leader: 0 };
      if (this.score2 > this.score1) return { leader: 1 };
      return { leader: "tie" };
   }

   reset() {
      this.score1 = 0;
      this.score2 = 0;
   }
}