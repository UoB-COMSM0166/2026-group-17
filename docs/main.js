let gravity;
let bgTop;
let bgBottom;
let player1;
let controlPanel;
let lastButtonClicked;
let terrain;
let scoreBoard;
let scoreCalculator;
let currentShot = null;
let currentExplosion = null;
let hasScoredThisExplosion = false;

function setup() {
    createCanvas(1280, 700);
    scoreBoard = new ScoreBoard();
    scoreBoard.setup();  
    gravity = createVector(0, 400);
    bgTop = color(0);
    bgBottom = color(0, 80, 100);
    controlPanel = new ControlPanel(color(20));
    terrain = new Terrain(width, height, color(255,0,0));
      console.log("terrain create:", terrain);
        terrainSeed = floor(random(99999));
        console.log("seed:", terrainSeed);
        terrain.generateInitialTerrain(terrainSeed);
       console.log("columns number:", terrain.columns.length);
       scoreCalculator = new ScoreCalculator(terrain); 
    const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);
    let cannonX = random(wheelRadius, width - wheelRadius);
    let groundHeight = terrain.getHeightAt(cannonX);
    let cannonY = height - groundHeight -wheelRadius;
    player1 = new PlayerCannon(
    createVector(cannonX,cannonY),
    wheelRadius,
    barrelSizeVector,
    color('silver'),
    color('lightslategray')
    );
    ellipseMode(RADIUS);
    angleMode(DEGREES);
}

function draw() {
    drawLinearGradient(bgTop, bgBottom);
    terrain.drawTerrain();
    player1.barrelAngle = controlPanel.angleDial.needleRotation - 90;
    player1.barrelPower = controlPanel.powerAdjust.power * 5;
    player1.drawPlayer();
    if (currentShot?.isActive || currentShot?.isExploding) {
        currentShot?.updatePhysics(deltaTime / 1000);
        currentShot?.drawShotSequence();
    }
    if (currentExplosion) {
    currentExplosion.update();
    currentExplosion.draw();
        if (currentExplosion.finished) {
        currentExplosion = null;
        }
  }
    controlPanel.drawCtrlPanel();
    if (currentExplosion && !hasScoredThisExplosion) {
   const points = scoreCalculator.calculateScore(currentExplosion);
   scoreBoard.score1 += points;
   hasScoredThisExplosion = true;
}

if (!currentExplosion) {
  hasScoredThisExplosion = false;
}
scoreBoard.draw();
}

function mousePressed() {
    lastButtonClicked = mouseButton.left;

    const shotFree = (!currentShot?.isActive && !currentShot?.isExploding);
    if (lastButtonClicked && controlPanel.shootButton.isHovered && shotFree) {
        currentShot = player1.fireShot(4);
    }
}

function mouseReleased() {
    if (controlPanel.angleDial.isHovered &&
        !controlPanel.angleDial.isFollowing &&
        lastButtonClicked)
        controlPanel.angleDial.isFollowing = true;
    else controlPanel.angleDial.isFollowing = false;

    if (controlPanel.powerAdjust.isHovered &&
        !controlPanel.powerAdjust.isFollowing &&
        lastButtonClicked)
        controlPanel.powerAdjust.isFollowing = true;
    else controlPanel.powerAdjust.isFollowing = false;

}

/*function keyReleased() {
    if (key === 'Enter' && !currentShot?.isActive && !currentShot?.isExploding) {
        currentShot = player1.fireShot(4);
    }
}*/

function drawLinearGradient(colorA, colorB) {
    strokeWeight(1);
    for (let i = 0; i < height; ++i) {
        stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
        line(0, i, width, i);
    }
}