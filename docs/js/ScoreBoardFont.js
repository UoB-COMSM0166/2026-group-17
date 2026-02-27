class ScoreBoard{
  constructor(){
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

  this.drawScoreBoard();
  }

  drawScoreBoard() {

  textSize(18);
  noStroke();

  // Player1
  fill(255, 80, 80);
  text("PLAYER 1", 20, 15);

  fill(255);
  textSize(26);
  text(this.score1, 20, 40);

  // Player2
  let label = "PLAYER 2";
  let labelWidth = textWidth(label);

  textSize(18);
  fill(80,180, 255);
  text(label, width - labelWidth + 10, 15);

  textSize(26);
  fill(255);
  let scoreText = this.score2.toString();
  let scoreWidth = textWidth(scoreText);
  text(scoreText, width - scoreWidth - 25, 40);
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

  addPointToPlayer1(){
    this.score1++;
  }

  addPointToPlayer2(){
    this.score2++;
  }

  reset(){
    this.score1 = 0;
    this.score2 = 0;
  }
}
