class ScoreBoard {
  constructor() {
    this.score1 = 0;
    this.score2 = 0;
    let fontLoaded = null;
  }

  setup() {
    //createCanvas(windowWidth, windowHeight);

    textAlign(LEFT, TOP);
    textFont('Comic Sans MS, Chalkboard SE, Marker Felt, cursive');
  }

  draw() {
    //background(20);
    push();
    this.drawScoreBoard();
    pop();
  }

  drawScoreBoard() {
    const margin = 20;
    textAlign(LEFT, TOP);
    textSize(18);
    noStroke();

    // Player1
    fill(255, 80, 80);
    text("PLAYER 1", margin, 15);

    fill(255);
    textSize(26);
    text(this.score1, margin, 40);

    // Player2
    //let label = "PLAYER 2";
    //let labelWidth = textWidth(label);
    textAlign(RIGHT, TOP);
    const label = "PLAYER 2";
    textSize(18);
    fill(80, 180, 255);
    //const labelWidth = textWidth(label);
    text(label, width - margin, 15);

    textSize(26);
    fill(255);
    //const scoreText = this.score2.toString();
    //const scoreWidth = textWidth(scoreText);
    text(this.score2, width - margin, 40);
  }

  // A Player1 
  // L Player2 
  // R reset
  keyPressed() {

    if (key === 'a' || key === 'A') {
      this.score1 += 1;
    }

    if (key === 'l' || key === 'L') {
      this.score2 += 1;
    }

    if (key === 'r' || key === 'R') {
      this.score1 = 0;
      this.score2 = 0;
    }
  }

  addPointToPlayer1(points) {
    this.score1 = Math.max(this.score1 + points, 0);
  }

  addPointToPlayer2(points) {
    this.score2 = Math.max(this.score2 + points, 0);
  }

  getHighestScorePlayerId() {
    if (this.score1 > this.score2) return { leader: 0 };
    else if (this.score1 < this.score2) return { leader: 1 };
    else return { leader: "tie" };
  }


  reset() {
    this.score1 = 0;
    this.score2 = 0;
  }
}
