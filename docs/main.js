let gravity;
let bgTop;
let bgBottom;
let players = [];
let turnController = new TurnController();
let turnCounter;
let controlPanel;
let lastButtonClicked;

//add wind
let wind;
//new
let terrain;
let currentShot = null;
let randomWinner;

function setup() {
    gravity = createVector(0, 400);
    //set wind
    wind = new WindSystem();
    bgTop = color(0);
    bgBottom = color(0, 80, 100);
    createCanvas(1280, 700);
    controlPanel = new ControlPanel(color(20));
    turnCounter = new TurnCounter();

    terrain = new Terrain(createVector(width, height), color(255, 0, 0));
    console.log("terrain create:", terrain);
    terrainSeed = floor(random(99999));
    console.log("seed:", terrainSeed);
    terrain.generateInitialTerrain(terrainSeed);
    console.log("columns number:", terrain.columns.length);
    const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);
    let cannonX = random(wheelRadius, width - wheelRadius);
    let groundHeight = terrain.getHeightAt(cannonX);
    let cannonY = height - groundHeight - wheelRadius;
    players[0] = new PlayerCannon(
        createVector(cannonX, cannonY),
        wheelRadius,
        barrelSizeVector,
        color('silver'),
        color('lightslategray')
    );
    let cannon2X = random(wheelRadius, width - wheelRadius);
    let cannon2GroundHeight = terrain.getHeightAt(cannon2X);
    let cannon2Y = height - cannon2GroundHeight - wheelRadius;
    players[1] = new PlayerCannon(
        createVector(cannon2X, cannon2Y),
        wheelRadius,
        barrelSizeVector,
        color('moccasin'),
        color('navajowhite')
    );
    randomWinner = round(random(0, 1));
    ellipseMode(RADIUS);
}

function draw() {
    drawLinearGradient(bgTop, bgBottom);
    terrain.drawTerrain();
    if (currentShot?.isActive || currentShot?.isExploding) {
        currentShot?.updatePhysics(deltaTime / 1000);
        currentShot?.drawShotSequence();

    }
    else {
        if (controlPanel.angleDial.isFollowing)
            players[turnController.activePlayerId].barrelAngle = controlPanel.angleDial.needleRotation - 90;
        players[turnController.activePlayerId].barrelPower = controlPanel.powerAdjust.power * 5;
    }
    players[0].drawPlayer();
    players[1].drawPlayer();
    controlPanel.drawCtrlPanel();
    turnCounter.drawCounter(turnController.turnNumber, turnController.maxTurns);
    if (turnController.isGameOver()) {
        background('black');
        textFont('MS Trebuchet', 36);
        text(`Winner: Player ${randomWinner}\n\nPress 'R' to restart`, width / 2, height / 2);
        if (key === "r" || key === "R") window.location.reload();
    }
}

function mousePressed() {
    lastButtonClicked = mouseButton.left;
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

function keyReleased() {
    if (key === 'Enter' && !currentShot?.isActive && !currentShot?.isExploding) {
        currentShot = players[turnController.activePlayerId].fireShot(4);
    }
}

function drawLinearGradient(colorA, colorB) {
    strokeWeight(1);
    for (let i = 0; i < height; ++i) {
        stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
        line(0, i, width, i);
    }
}