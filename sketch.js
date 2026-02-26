let game;

function setup() {
    createCanvas(1000, 600);
    game = new Game();
}

function draw() {
    background(22);
    game.update();
    game.render();
}

function mousePressed() {
    game.onMousePressed();
}

function mouseDragged() {
    game.onMouseDragged();
}

function mouseReleased() {
    game.onMouseReleased();
}

function keyPressed() {
    if (keyCode === 32) game.fire();
}