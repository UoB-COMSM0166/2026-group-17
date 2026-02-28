let gravity;
let bgTop;
let bgBottom;
let player1;
let player2;
let players = { player1, player2 };
let turnController = new TurnController();
let turnCounter;
let controlPanel;
let movePad;
let lastButtonClicked;
let terrain;
let currentShot = null;
let randomWinner;

function setup() {
    gravity = createVector(0, 400);
    bgTop = color(0);
    bgBottom = color(0, 80, 100);
    createCanvas(1280, 700);
    controlPanel = new ControlPanel(color(20));
    terrain = new Terrain(createVector(width, height), color(255, 0, 0));
    console.log("terrain create:", terrain);
    terrainSeed = floor(random(99999));
    console.log("seed:", terrainSeed);
    terrain.generateInitialTerrain(terrainSeed);
    console.log("columns number:", terrain.columns.length);
    turnCounter = new TurnCounter(createVector(width / 2, height / 20));
    const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);
    let cannon1X = random(wheelRadius, width / 4);
    let cannon1Position = createVector(cannon1X, height - terrain.getHeightAt(cannon1X) - wheelRadius);
    let cannon2X = random(width - width / 5, width - wheelRadius);
    let cannon2Position = createVector(cannon2X, height - terrain.getHeightAt(cannon2X) - wheelRadius);
    angleMode(DEGREES);
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
    randomWinner = round(random(0, 1));
    ellipseMode(RADIUS);
}

function draw() {
    drawLinearGradient(bgTop, bgBottom);
    terrain.drawTerrain();
    movePad.drawMovePad();
    //update the location each time
    let currentPlayerId = turnController.activePlayerId;


    players[currentPlayerId].updateMove(0.18);

    players[currentPlayerId].positionVector.y = 
        height - terrain.getHeightAt(players[currentPlayerId].positionVector.x) - players[currentPlayerId].wheelRadius;
    if (!turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding))) {
        currentShot?.updatePhysics(deltaTime / 1000);
        currentShot?.drawShotSequence();

    }
    else {
        if (controlPanel.angleDial.isFollowing)
        players[currentPlayerId].barrelAngle = controlPanel.angleDial.needleRotation - 90;
        players[currentPlayerId].barrelPower = controlPanel.powerAdjust.power * 5;
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

    const shotFree = turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding));
    const currentPlayerId = turnController.activePlayerId;

    let shotRadius = 4;
    if (lastButtonClicked && controlPanel.shootButton.isHovered  && shotFree) {
        currentShot = players[turnController.activePlayerId].fireShot(shotRadius);
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

}

function drawLinearGradient(colorA, colorB) {
    strokeWeight(1);
    for (let i = 0; i < height; ++i) {
        stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
        line(0, i, width, i);
    }
}