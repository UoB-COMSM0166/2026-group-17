let gravity;
let bgTop;
let bgBottom;
let player1;
let player2;
let players = { player1, player2 };
let turnController = new TurnController();
let turnCounter;
let controlPanel;
let lastButtonClicked;

//add wind
let wind;
//new
let terrain;
let lastShooterId = 0;
let scoreBoard;
let scoreCalculator;
let currentShot = null;
let currentExplosion = null;
let hasScoredThisExplosion = false;

function setup() {
  createCanvas(1280, 700);
  gravity = createVector(0, 200);
  wind = new WindSystem();
  bgTop = color(0);
  bgBottom = color(0, 80, 100);
  scoreBoard = new ScoreBoard();
  scoreBoard.setup();
  controlPanel = new ControlPanel(color(20));
  terrain = new Terrain(width, height, color(255, 0, 0));
  const terrainSeed = floor(random(99999));
  terrain.generateInitialTerrain(terrainSeed);
  scoreCalculator = new ScoreCalculator(terrain);
  turnCounter = new TurnCounter(createVector(width / 2, height / 20));
  const wheelRadius = 12;
  const barrelSizeVector = createVector(wheelRadius * 6, 8);

  // left cannon
  const cannon1X = random(wheelRadius, width / 4);
  const cannon1Pos = createVector(
    cannon1X,
    height - terrain.getHeightAt(cannon1X) - wheelRadius
  );

  // right cannon
  const cannon2X = random(width - width / 5, width - wheelRadius);
  const cannon2Pos = createVector(
    cannon2X,
    height - terrain.getHeightAt(cannon2X) - wheelRadius
  );

  player1 = new PlayerCannon(cannon1Pos, wheelRadius, barrelSizeVector, -45, color('silver'), color('lightslategray'));
  player2 = new PlayerCannon(cannon2Pos, wheelRadius, barrelSizeVector, 220, color('moccasin'), color('navajowhite'));

  players[0] = player1;
  players[1] = player2;

  angleMode(DEGREES);
  randomWinner = round(random(0, 1));
  ellipseMode(RADIUS);
}
function draw() {
  drawLinearGradient(bgTop, bgBottom);
  terrain.drawTerrain();
  const pid = turnController.activePlayerId;
  players[0].positionVector.y = height - terrain.getHeightAt(players[0].positionVector.x) - players[0].wheelRadius;
  players[1].positionVector.y = height - terrain.getHeightAt(players[1].positionVector.x) - players[1].wheelRadius;
  if (wind) wind.draw();
  players[pid].barrelAngle = controlPanel.angleDial.needleRotation - 90;
  players[pid].barrelPower = controlPanel.powerAdjust.power * 8;

  // draw both cannons
  players[0].drawPlayer();
  players[1].drawPlayer();

  // update/draw projectile
  if (currentShot?.isActive || currentShot?.isExploding) {
    currentShot.updatePhysics(deltaTime / 1000);
    currentShot.drawShotSequence();
  }

  // update/draw explosion + score once per explosion 
  if (currentExplosion) {
    currentExplosion.update();
    currentExplosion.draw();
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
    hasScoredThisExplosion = true;
  }    
  if (currentExplosion.finished) {
      currentExplosion = null;
    }
  }
  // allow scoring again on next explosion
  if (!currentExplosion) hasScoredThisExplosion = false;

  // UI
  controlPanel.drawCtrlPanel();
  scoreBoard.draw();
}


function mousePressed() {
  lastButtonClicked = mouseButton.left;
  const shotFree = turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding));
  let shotRadius = 4;
  if (lastButtonClicked && controlPanel.shootButton.isHovered  && shotFree) {
    const pid = turnController.activePlayerId;
    lastShooterId = pid;  
    currentShot = players[pid].fireShot(shotRadius); 
  }
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

    // press W
    if (key === 'w' || key === 'W') {

        wind.newTurn();
        wind.isActive = true;

        // 5 second close
        setTimeout(() => {
            wind.isActive = false;
        }, 5000);
      }
}

function drawLinearGradient(colorA, colorB) {
  strokeWeight(1);
  for (let i = 0; i < height; ++i) {
    stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
    line(0, i, width, i);
  }
}