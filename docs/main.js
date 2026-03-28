let game;

function setup() {
   const resolution = createVector(1280, 700);
   game = new Game(resolution);
   Game.setupGame();
}

function draw() {
   game?.update(deltaTime);
   game?.drawGame();
}

function mousePressed() {
   game?.handleMousePressed(mouseX, mouseY, mouseButton);
}

function mouseReleased() {
   game?.handleMouseReleased(mouseX, mouseY, mouseButton);
}

function mouseMoved() {
   game?.handleMouseMoved(mouseX, mouseY);
}

function keyReleased() {
   game?.handleKeyReleased(key, keyCode);
}
