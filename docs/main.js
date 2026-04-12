let game;
let pineappleImg, starImg, shibaImg, bubblegumImg, cannonballImg, earthwormImg;

async function setup() {
   const [pineapple, star, shiba, bubblegum, cannonball, earthworm, impactgun] = await Promise.all([
      loadImage("weapons/pineapple.png"),
      loadImage("weapons/star.png"),
      loadImage("weapons/shiba.png"),
      loadImage("weapons/bubblegum.png"),
      loadImage("weapons/cannonball.png"),
      loadImage("weapons/earthworm.png"),
            loadImage("weapons/impactgun.png")
   ]);

   pineappleImg = pineapple;
   starImg = star;
   shibaImg = shiba;
   bubblegumImg = bubblegum;
   cannonballImg = cannonball;
   earthwormImg = earthworm;
   impactgunImg = impactgun;

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