let bgTop;
let bgBottom;
let player1;
let controlPanel;
let lastButtonClicked;

function setup() {
    bgTop = color(0);
    bgBottom = color(0, 80, 100);
    createCanvas(1280, 700);
    controlPanel = new ControlPanel(color(20));
    const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);
    player1 = new PlayerCannon(createVector(
        random(wheelRadius, width - wheelRadius),
        height - controlPanel.altitude - wheelRadius),
        wheelRadius, barrelSizeVector, color('silver'), color('lightslategray'));
    ellipseMode(RADIUS);
    angleMode(DEGREES);
}

function draw() {
    drawLinearGradient(bgTop, bgBottom);
    player1.drawPlayer();
    controlPanel.drawCtrlPanel();
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
}

function drawLinearGradient(colorA, colorB) {
    strokeWeight(1);
    for (let i = 0; i < height; ++i) {
        stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
        line(0, i, width, i);
    }
}