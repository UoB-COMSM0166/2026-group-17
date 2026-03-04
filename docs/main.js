let gravity;
let bgTop;
let bgBottom;
let players = [];
let turnController;
let turnCounter;
let controlPanel;
let movePad;
let lastButtonClicked;

let wind;
let terrain;
let lastShooterId = 0;
let scoreBoard;
let scoreCalculator;
let currentShot = null;
let currentExplosion = null;
let hasScoredThisExplosion = false;

function setup() {
  createCanvas(1280, 700);
  angleMode(DEGREES);
  ellipseMode(RADIUS);
  gravity = createVector(0, 400);
  //set wind
  wind = new WindSystem();
  turnController = new TurnController(wind);
  bgTop = color(0);
  bgBottom = color(0, 80, 100);
  scoreBoard = new ScoreBoard();
  scoreBoard.setup();
  controlPanel = new ControlPanel(color(20));
  terrain = new Terrain(createVector(width, height), color(255, 0, 0));
  const terrainSeed = floor(random(99999));
  terrain.generateInitialTerrain(terrainSeed);
  scoreCalculator = new ScoreCalculator();
  turnCounter = new TurnCounter(createVector(width / 2, height / 20));
  const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);

  // left cannon
  const cannon1X = random(wheelRadius, width / 4);
  const cannon1Position = createVector(
    cannon1X,
    height - terrain.getHeightAt(cannon1X) - wheelRadius
  );

  // right cannon
  const cannon2X = random(width - width / 5, width - wheelRadius);
  const cannon2Position = createVector(
    cannon2X,
    height - terrain.getHeightAt(cannon2X) - wheelRadius
  );

  movePad = new MovePadWidget();
  players[0] = new PlayerCannon(
    cannon1Position,
    wheelRadius,
    barrelSizeVector,
    -45,
    color('silver'),
    color('lightslategray')
  );
  players[1] = new PlayerCannon(
    cannon2Position,
    wheelRadius,
    barrelSizeVector,
    220,
    color('moccasin'),
    color('navajowhite')
  );
}

function draw() {
  drawLinearGradient(bgTop, bgBottom);
  terrain.drawTerrain();

  if (wind) wind.draw();
  movePad.drawMovePad();
  //update the location each time
  let currentPlayerId = turnController.activePlayerId;

  players[currentPlayerId].updateMove(0.18);

  if (!turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding))) {
    currentShot?.updatePhysics(deltaTime / 1000);
    currentShot?.drawShotSequence();
  }
  else {
    if (controlPanel.angleDial.isFollowing)
      players[currentPlayerId].barrelAngle = controlPanel.angleDial.needleRotation - 90;
  }

  players[currentPlayerId].barrelPower = controlPanel.powerAdjust.power * 7;

  players[currentPlayerId].positionVector.y = min(
    controlPanel.getAltitudeAt(players[currentPlayerId].positionVector.x) - players[currentPlayerId].wheelRadius,
    height - terrain.getHeightAt(players[currentPlayerId].positionVector.x) - players[currentPlayerId].wheelRadius);

  players[0].drawPlayer();
  players[1].drawPlayer();

  // update/draw explosion + score once per explosion 
  if (currentExplosion) {
    currentExplosion.update();
    // commenting below line out until we resolve double explosion from Projectile & Explosion classes issue
    //currentExplosion.draw();
    if (currentExplosion.finished && !hasScoredThisExplosion) {
      const shooterId = lastShooterId;
      const { enemy, self } = scoreCalculator.calculateExplosionScore(
        currentExplosion,
        players,
        shooterId
      );
      if (enemy > 0) {
        if (shooterId === 0) {
          scoreBoard.score1 += enemy;
        }
        else scoreBoard.score2 += enemy;
      }
      if (self > 0) {
        if (shooterId === 0) {
          scoreBoard.score1 -= self;
        }
        else scoreBoard.score2 -= self;
      }
      scoreBoard.score1 = Math.max(0, scoreBoard.score1);
      scoreBoard.score2 = Math.max(0, scoreBoard.score2);

      hasScoredThisExplosion = true;
      // Need to fix bug where last hit in last turn doesn't count correctly towards the score
      console.log(shooterId, enemy, self);
    }
    if (currentExplosion.finished) {
      currentExplosion = null;
    }
  }
  // allow scoring again on next explosion
  if (!currentExplosion) hasScoredThisExplosion = false;

  // UI
  controlPanel.drawCtrlPanel();
  turnCounter.drawCounter(turnController.turnNumber, turnController.maxTurns);

  if (turnController.isGameOver()) {
    background('black');
    fill('white');
    noStroke();
    textAlign(CENTER, TOP);
    textFont('MS Trebuchet', 36);
    const result = scoreBoard.getHighestScorePlayerId();
    
    let statusText;
    if (result.leader === "tie") statusText = "N/A - Draw!";
    else statusText = `Player ${result.leader + 1}`;
    //Display wineer
    textSize(60);
    text(`Winner: ${statusText}`, width / 2, 120); 
    //Display final scores
    textSize(32);
    text(
      "Player 1 Score: " + scoreBoard.score1 + "\n" +
      "Player 2 Score: " + scoreBoard.score2,
      width / 2,
      250
    );
    //Restart instruction
    textSize(24);
    text("Press 'R' to restart", width / 2, 400);

    if (key === 'r' || key === 'R') window.location.reload();
  }
  scoreBoard.draw();
}


function mousePressed() {
  lastButtonClicked = mouseButton.left;

  const shotFree = turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding));
  const currentPlayerId = turnController.activePlayerId;

  const shotRadius = 4;
  if (lastButtonClicked && controlPanel.shootButton.isHovered && shotFree) {
    lastShooterId = currentPlayerId;
    currentShot = players[currentPlayerId].fireShot(shotRadius);
  }

  const res = movePad.mousePressed();
  if (res === 'left') {
    players[currentPlayerId].targetX -= 100;
  }
  else if (res === 'right') {
    players[currentPlayerId].targetX += 100;
  }
  players[currentPlayerId].targetX = constrain(
    players[currentPlayerId].targetX,
    players[currentPlayerId].wheelRadius,
    width - players[currentPlayerId].wheelRadius
  );
}

function mouseReleased() {
  if (controlPanel.angleDial.isHovered && !controlPanel.angleDial.isFollowing && lastButtonClicked)
    controlPanel.angleDial.isFollowing = true;
  else controlPanel.angleDial.isFollowing = false;

  if (controlPanel.powerAdjust.isHovered && !controlPanel.powerAdjust.isFollowing && lastButtonClicked)
    controlPanel.powerAdjust.isFollowing = true;
  else controlPanel.powerAdjust.isFollowing = false;
}

function keyReleased() {
  let shotRadius = 4;
  if (key === 'Space' && !currentShot?.isActive && !currentShot?.isExploding) {
    currentShot = players[turnController.activePlayerId].fireShot(shotRadius);
  }
}

function drawLinearGradient(colorA, colorB) {
  strokeWeight(1);
  for (let i = 0; i < height; ++i) {
    stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
    line(0, i, width, i);
  }
}