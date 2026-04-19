let game;
let pineappleImg, starImg, shibaImg, bubblegumImg, cannonballImg, earthwormImg;
let grapeImg, lazerImg, submarineImg, impactgunImg;

async function setup() {
   const [pineapple, star, shiba, bubblegum, cannonball, earthworm, impactgun, grape, lazer, submarine] = await Promise.all([
      loadImage("weapons/pineapple.png"),
      loadImage("weapons/star.png"),
      loadImage("weapons/shiba.png"),
      loadImage("weapons/bubblegum.png"),
      loadImage("weapons/cannonball.png"),
      loadImage("weapons/earthworm.png"),
      loadImage("weapons/impactgun.png"),
      loadImage("weapons/grape.png"),
      loadImage("weapons/lazer.png"),
      loadImage("weapons/submarine.png")
   ]);

   pineappleImg = pineapple;
   starImg = star;
   shibaImg = shiba;
   bubblegumImg = bubblegum;
   cannonballImg = cannonball;
   earthwormImg = earthworm;
   impactgunImg = impactgun;
   grapeImg = grape;
   lazerImg = lazer;
   submarineImg = submarine;

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

function keyPressed() {
   game?.handleKeyPressed(key, keyCode);
}

function keyReleased() {
   game?.handleKeyReleased(key, keyCode);
}
