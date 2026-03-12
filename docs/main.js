let gravity;
let bgTop;
let bgBottom;
let players = [];
let lastActivePlayerId = -1;
let turnController;
let turnCounter;
let controlPanel;
let lastButtonClicked;

let wind;
let terrain;
let lastShooterId = 0;
let scoreBoard;
let scoreCalculator;
let currentShot = null;
let currentExplosion = null;
let hasScoredThisExplosion = false;
let lastTurnNumber = 1;
let floatingScores = [];
let pendingRoundAnimation = false;
let shakeFrames = 0;
let shakeMag = 0;
function triggerShake(frames = 10, mag = 6) { shakeFrames = frames; shakeMag = mag; }

let startMenu;
//Flag to check if the game has started
//new changes
let gameStarted = false;
let weaponShop;
let pendingMode = null;
let gamePhase = 'menu';

function setup() {
  createCanvas(1280, 700);
  //cnv.elt.setAttribute('tabindex', '0'); 
  wind = new WindSystem();
  angleMode(DEGREES);
  ellipseMode(RADIUS);
  //Initialize StartMenu
  startMenu = new StartMenu(width, height);
  gravity = createVector(0, 400);
  //set wind
  wind = new WindSystem();
  turnController = new TurnController(wind);
  bgTop = color(0);
  bgBottom = color(0, 80, 100);
  scoreBoard = new ScoreBoard();
  scoreBoard.setup();
  controlPanel = new ControlPanel(color(20));
  terrain = new Terrain(controlPanel, color(255, 0, 0));
  const terrainSeed = floor(random(99999));
  terrain.generateInitialTerrain(terrainSeed);
  scoreCalculator = new ScoreCalculator();
  turnCounter = new TurnCounter(createVector(width / 2, height / 20));
  const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);

  // left cannon
  const cannon1X = random(wheelRadius, width / 4);
  console.log("terrain height for cannon1: " + terrain.getHeightAt(cannon1X));
  const cannon1Position = createVector(
    cannon1X,
    terrain.getHeightAt(cannon1X) - wheelRadius
  );

  // right cannon
  const cannon2X = random(width - width / 5, width - wheelRadius);
  console.log("terrain height for cannon2: " + terrain.getHeightAt(cannon2X));
  const cannon2Position = createVector(
    cannon2X,
    terrain.getHeightAt(cannon2X) - wheelRadius
  );

  angleMode(DEGREES);
  players[0] = new PlayerCannon(
    cannon1Position,
    wheelRadius,
    barrelSizeVector,
    -45,
    3,
    color('silver'),
    color('lightslategray')
  );
  players[1] = new PlayerCannon(
    cannon2Position,
    wheelRadius,
    barrelSizeVector,
    220,
    3,
    color('moccasin'),
    color('navajowhite')
  );

  randomWinner = round(random(0, 1));
  ellipseMode(RADIUS);
}

function draw() {
  //add new logic to handle different game phases
  if (gamePhase === 'menu') {
    background(0);
    startMenu.draw();
    return;
  }
  if (gamePhase === 'shop') {
    console.log('now-shop', weaponShop);
    //background(30);
    weaponShop.draw();
    return;
  }

  push();
  if (shakeFrames > 0) {
    translate(random(-shakeMag, shakeMag), random(-shakeMag, shakeMag));
    shakeFrames--;
  }

  drawLinearGradient(bgTop, bgBottom);
  terrain.drawTerrain(deltaTime);

  if (wind) wind.draw();
  //update the location each time
  let currentPlayerId = turnController.activePlayerId;


  players[currentPlayerId].updateMove(0.18);


  if (currentPlayerId !== lastActivePlayerId) {
    controlPanel.angleDial.needleRotation = players[currentPlayerId].barrelAngle + 90;
    controlPanel.powerAdjust.power = players[currentPlayerId].barrelPower / 7;
    controlPanel.setMoveSteps(players[currentPlayerId].moveSteps);
    lastActivePlayerId = currentPlayerId;
  }

  if (!turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding))) {
    currentShot?.updatePhysics(deltaTime / 1000);
    currentShot?.drawShotSequence();
    if (currentShot?.isExploding && !currentExplosion && currentShot?.impactPosition) {
      currentExplosion = new Explosion(
        currentShot.impactPosition.x,
        currentShot.impactPosition.y
      );
      currentExplosion.maxRadius = currentShot.maxExplosionRadius;
    }
  }
  else {
    if (controlPanel.angleDial.isFollowing)
      players[currentPlayerId].barrelAngle = controlPanel.angleDial.needleRotation - 90;
    if (controlPanel.powerAdjust.isFollowing) {
      players[currentPlayerId].barrelPower = controlPanel.powerAdjust.power * 7;
    }
  }


  for (let player of players) player.positionVector.y = min(
    controlPanel.getAltitudeAt(player.positionVector.x) - player.wheelRadius,
    terrain.getHeightAt(player.positionVector.x) - player.wheelRadius
  );

  players[0].drawPlayer();
  players[1].drawPlayer();
  const pid = turnController.activePlayerId;

  push();
  noFill();
  strokeWeight(4);
  if (pid === 0) stroke(255, 80, 80);
  else stroke(80, 180, 255);
  circle(players[pid].positionVector.x, players[pid].positionVector.y, players[pid].wheelRadius + 15);
  let arrowY = players[pid].positionVector.y - 50;
  fill(pid === 0 ? color(255, 80, 80) : color(80, 180, 255));
  noStroke();
  triangle(players[pid].positionVector.x - 10, arrowY, players[pid].positionVector.x + 10, arrowY, players[pid].positionVector.x, arrowY + 15);
  pop();
  // update/draw explosion + score once per explosion 
  if (currentExplosion) {
    currentExplosion.update();
    if (!currentExplosion.finished) {
      const shooterId = lastShooterId;
      const targetId = 1 - shooterId;

      const dxEnemy = players[targetId].positionVector.x - currentExplosion.x;
      const dyEnemy = players[targetId].positionVector.y - currentExplosion.y;
      const distEnemy = Math.sqrt(dxEnemy * dxEnemy + dyEnemy * dyEnemy);

      const dxSelf = players[shooterId].positionVector.x - currentExplosion.x;
      const dySelf = players[shooterId].positionVector.y - currentExplosion.y;
      const distSelf = Math.sqrt(dxSelf * dxSelf + dySelf * dySelf);
      if (
        !currentExplosion.enemyFeedbackTriggered &&
        distEnemy <= currentExplosion.radius
      ) {
        players[targetId].triggerHitFlash(12);
        triggerShake(6, 8);
        currentExplosion.enemyFeedbackTriggered = true;
      }
      if (
        !currentExplosion.selfFeedbackTriggered &&
        distSelf <= currentExplosion.radius
      ) {
        players[shooterId].triggerHitFlash(10);
        triggerShake(5, 6);
        currentExplosion.selfFeedbackTriggered = true;
      }
    }

    if (currentExplosion.finished && !hasScoredThisExplosion) {
      const shooterId = lastShooterId;
      const targetId = 1 - shooterId;
      const { enemy, self } = scoreCalculator.calculateExplosionScore(
        currentExplosion,
        players,
        shooterId
      );
      console.log(enemy, self);
      if (enemy > 0) {
        if (shooterId === 0) {
          scoreBoard.score1 += enemy;
        } else {
          scoreBoard.score2 += enemy;
        }

        floatingScores.push(new FloatingScore(
          players[shooterId].positionVector.x,
          players[shooterId].positionVector.y - 60,
          +enemy,
          color(255, 220, 0)
        ));
      }

      if (self > 0) {
        if (shooterId === 0) {
          scoreBoard.score1 -= self;
        } else {
          scoreBoard.score2 -= self;
        }

        floatingScores.push(new FloatingScore(
          players[shooterId].positionVector.x,
          players[shooterId].positionVector.y - 60,
          -self,
          color(255, 80, 80)
        ));
      }

      scoreBoard.score1 = Math.max(0, scoreBoard.score1);
      scoreBoard.score2 = Math.max(0, scoreBoard.score2);

      hasScoredThisExplosion = true;
      pendingRoundAnimation = true;
      console.log(shooterId, enemy, self);
    }

    if (currentExplosion.finished) {
      currentExplosion = null;
    }
  }
  // allow scoring again on next explosion
  if (!currentExplosion) hasScoredThisExplosion = false;
  pop();
  if (turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding))) {
    //only show trajectory preview when player can act and wind is not active
    if (wind && wind.isActive === false) {
      const windSystem = wind ? wind.forceVector : createVector(0, 0);
      const enemyId = currentPlayerId === 0 ? 1 : 0; // opponent player id
      drawTrajectoryPreview(players[currentPlayerId], gravity, windSystem, terrain, players[enemyId]);
    }
  }
  // UI
  if (
    turnController.turnNumber !== lastTurnNumber &&
    pendingRoundAnimation &&
    !currentExplosion
  ) {
    if (wind && wind.isActive) {
      wind.newTurn();
    }
    turnCounter.startRoundAnimation(turnController.turnNumber);
    lastTurnNumber = turnController.turnNumber;
    pendingRoundAnimation = false;
  }
  controlPanel.drawCtrlPanel();

  turnCounter.drawCounter(turnController.turnNumber, turnController.maxTurns, turnController.activePlayerId);
  for (let i = floatingScores.length - 1; i >= 0; i--) {
    floatingScores[i].update();
    floatingScores[i].draw();
    if (floatingScores[i].finished) {
      floatingScores.splice(i, 1);
    }
  }
  /*
  if (turnController.isGameOver()) {

  turnCounter.drawCounter(turnController.turnNumber, turnController.maxTurns, turnController.activePlayerId);
*/
  scoreBoard.draw();

  //Wait until the last shot and explosion are finished
  //before switching to the end screen
  if (turnController.isGameOver() && !currentExplosion
    && (!currentShot || !currentShot.isActive)) {

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
  //menu 
  if (gamePhase === 'menu') {
    const mode = startMenu.handleMousePressed();
    document.querySelector('canvas').focus();
    if (mode) {
      pendingMode = mode;
      gamePhase = 'shop';
      weaponShop = new WeaponShop(width, height);
    }
    return;
  }

  if (gamePhase === 'shop') {
    if (!weaponShop) return;
    weaponShop.handleClick(mouseX, mouseY);
    if (weaponShop.isStartButtonClicked(mouseX, mouseY)) {
      const loadout0 = weaponShop.getLoadout(0);
      const loadout1 = weaponShop.getLoadout(1);
      initGame(pendingMode, loadout0, loadout1);
      gamePhase = 'game';
    }
    return;
  }


  /*if (!gameStarted) {
    //Handle Start menu clicks
    const mode = startMenu.handleMousePressed();
    if (mode) {
      //Initialize game objects selecting difficulty
      gameStarted = true;
      initGame(mode);
    }
    return;
  }*/

  lastButtonClicked = mouseButton.left;

  const shotFree = turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding));
  const currentPlayerId = turnController.activePlayerId;

  const shotRadius = 4;
  if (lastButtonClicked && controlPanel.shootButton.isHovered && shotFree) {
    lastShooterId = currentPlayerId;
    currentShot = players[currentPlayerId].fireShot(shotRadius);
  }


  const res = controlPanel.handleMovePadClick();
  if (players[currentPlayerId].moveSteps > 0) {
    if (res === 'left') {
      players[currentPlayerId].targetX -= 50;
      players[currentPlayerId].moveSteps -= 1;
    }
    else if (res === 'right') {
      players[currentPlayerId].targetX += 50;
      players[currentPlayerId].moveSteps -= 1;
    }
    controlPanel.setMoveSteps(players[currentPlayerId].moveSteps);
  }


  players[currentPlayerId].targetX = constrain(
    players[currentPlayerId].targetX,
    players[currentPlayerId].wheelRadius,
    width - players[currentPlayerId].wheelRadius
  );

}
//add a new function
function mouseMoved() {
  if (gamePhase === 'shop' && weaponShop) {
    weaponShop.handleMouseMove(mouseX, mouseY);
  }
}

function mouseReleased() {
  if (gamePhase !== 'game') return;
  if (controlPanel.angleDial.isHovered && !controlPanel.angleDial.isFollowing && lastButtonClicked)
    controlPanel.angleDial.isFollowing = true;
  else controlPanel.angleDial.isFollowing = false;

  if (controlPanel.powerAdjust.isHovered && !controlPanel.powerAdjust.isFollowing && lastButtonClicked)
    controlPanel.powerAdjust.isFollowing = true;
  else controlPanel.powerAdjust.isFollowing = false;
}

function initGame(mode, loadout0 = [], loadout1 = []) {
  wind = new WindSystem();
  if (mode === "easy") wind.isActive = false;
  if (mode === "hard") wind.isActive = true;
  wind.newTurn();
  turnController = new TurnController(wind);
  bgTop = color(0);
  bgBottom = color(0, 80, 100);
  scoreBoard = new ScoreBoard();
  scoreBoard.setup();
  controlPanel = new ControlPanel(color(20));
  terrain = new Terrain(controlPanel, color(255, 0, 0));
  const terrainSeed = floor(random(99999));
  terrain.generateInitialTerrain(terrainSeed);
  scoreCalculator = new ScoreCalculator();
  turnCounter = new TurnCounter(createVector(width / 2, height / 20));
  const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);

  // left cannon
  const cannon1X = random(wheelRadius, width / 4);
  const cannon1Position = createVector(
    cannon1X,
    terrain.getHeightAt(cannon1X) - wheelRadius
  );
  // right cannon
  const cannon2X = random(width - width / 5, width - wheelRadius);
  const cannon2Position = createVector(
    cannon2X,
    terrain.getHeightAt(cannon2X) - wheelRadius
  );

  players[0] = new PlayerCannon(
    cannon1Position,
    wheelRadius,
    barrelSizeVector,
    -45,
    3,
    color('silver'),
    color('lightslategray')
  );
  players[1] = new PlayerCannon(
    cannon2Position,
    wheelRadius,
    barrelSizeVector,
    220,
    3,
    color('moccasin'),
    color('navajowhite')
  );
  if (loadout0.length > 0) {
    players[0].weaponLoadout = loadout0;
    players[0].currentWeaponIndex = 0;
    loadout0.forEach(w => w.resetAmmo());
  }

  if (loadout1.length > 0) {
    players[1].weaponLoadout = loadout1;
    players[1].currentWeaponIndex = 0;
    loadout1.forEach(w => w.resetAmmo());
  }
}

function keyReleased() {
  let shotRadius = 4;

  if (gamePhase === 'shop') {
    console.log('shop keyReleased, isDone:', weaponShop.isDone(), 'keyCode:', keyCode, 'ENTER:', ENTER);
  }
  if (gamePhase === 'shop' && weaponShop.isDone() && keyCode === ENTER) {
    const loadout0 = weaponShop.getLoadout(0);
    const loadout1 = weaponShop.getLoadout(1);
    initGame(pendingMode, loadout0, loadout1);
    gamePhase = 'game';
    return
  }
  if (gamePhase !== 'game') return;

  if (key === 'Space' && !currentShot?.isActive && !currentShot?.isExploding) {
    currentShot = players[turnController.activePlayerId].fireShot(shotRadius);
  }

  const shotFree = turnController.playerCanAct(Boolean(currentShot?.isActive), Boolean(currentShot?.isExploding));
  const currentPlayerId = turnController.activePlayerId;


  if (keyCode === 32 && shotFree) {
    lastShooterId = currentPlayerId;
    currentShot = players[currentPlayerId].fireShot(shotRadius);
  }

  if (players[currentPlayerId].moveSteps > 0) {
    if (keyCode === 37) {
      players[currentPlayerId].targetX -= 50;
      players[currentPlayerId].moveSteps -= 1;
    }
    else if (keyCode === 39) {
      players[currentPlayerId].targetX += 50;
      players[currentPlayerId].moveSteps -= 1;
    }
    controlPanel.setMoveSteps(players[currentPlayerId].moveSteps);
  }
  /*else if (keyCode === 38) {
    controlPanel.powerAdjust.increasePower();
    players[currentPlayerId].barrelPower = controlPanel.powerAdjust.power * 7;
  }
  else if (keyCode === 40) {
    controlPanel.powerAdjust.decreasePower();
    players[currentPlayerId].barrelPower = controlPanel.powerAdjust.power * 7;
  }*/
  players[currentPlayerId].targetX = constrain(
    players[currentPlayerId].targetX,
    players[currentPlayerId].wheelRadius,
    width - players[currentPlayerId].wheelRadius
  );
}

function drawLinearGradient(colorA, colorB) {
  strokeWeight(1);
  for (let i = 0; i < height; ++i) {
    stroke(lerpColor(colorA, colorB, map(i, 0, height, 0, 1)));
    line(0, i, width, i);
  }
}

function drawTrajectoryPreview(player, gravityVec, windVec, terrain, enemyPlayer) {
  const angle = player.barrelAngle;
  const speed = player.barrelPower;
  const offsetDist = player.wheelRadius + player.barrelSize.x / 2;

  let offset = createVector(offsetDist, 0);
  offset.rotate(angle);

  let px = player.positionVector.x + offset.x;
  let py = player.positionVector.y + offset.y;

  let vx = cos(angle) * speed;
  let vy = sin(angle) * speed;

  const wx = windVec?.x ?? 0;
  const wy = windVec?.y ?? 0;
  const dt = 0.035;
  const maxSteps = 300;
  const hitRadius = enemyPlayer.wheelRadius + 20;

  // identify if this shot would hit the enemy by simulating the trajectory in advance
  let willHit = false;
  let simPx = px, simPy = py, simVx = vx, simVy = vy;
  for (let i = 0; i < maxSteps; i++) {
    simVx += (gravityVec.x + wx) * dt;
    simVy += (gravityVec.y + wy) * dt;
    simPx += simVx * dt;
    simPy += simVy * dt;

    if (simPx < 0 || simPx > width || simPy > height) break;
    if (simPy >= height - terrain.getHeightAt(simPx)) break;
    const d = dist(simPx, simPy, enemyPlayer.positionVector.x, enemyPlayer.positionVector.y);
    if (d < hitRadius) { willHit = true; break; }

  }

  // decide colors based on hit or miss
  const baseColor = willHit ? [80, 255, 120] : [0, 245, 212]; // color for hit and miss
  const glowColor = willHit ? `rgba(80,255,120,` : `rgba(0,245,212,`;

  push();
  noStroke();
  for (let i = 0; i < maxSteps; i++) {
    vx += (gravityVec.x + wx) * dt;
    vy += (gravityVec.y + wy) * dt;
    px += vx * dt;
    py += vy * dt;

    if (px < 0 || px > width || py > height) break;
    if (py >= height - terrain.getHeightAt(px)) break;

    if (i % 3 === 0) {
      const progress = i / maxSteps;
      const alpha = lerp(255, 0, progress);
      const sz = lerp(3, 0.8, progress);

      drawingContext.shadowBlur = lerp(18, 0, progress);
      drawingContext.shadowColor = glowColor + (alpha / 255) + ')';
      fill(...baseColor, alpha * 0.4);
      circle(px, py, sz * 1.5);

      drawingContext.shadowBlur = lerp(8, 0, progress);
      fill(200, 255, 250, alpha);
      circle(px, py, sz);
    }
  }

  // hit 
  if (willHit) {
    const ex = enemyPlayer.positionVector.x;
    const ey = enemyPlayer.positionVector.y;

    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'rgba(80, 255, 120, 0.9)';
    noFill();
    stroke(80, 255, 120, 200);
    strokeWeight(2);
    //  frameCount fot pulsing effect
    const pulse = sin(frameCount * 5) * 4;
    circle(ex, ey, hitRadius + pulse);

    // "HIT" txt
    noStroke();
    drawingContext.shadowBlur = 10;
    fill(80, 255, 120);
    textAlign(CENTER, BOTTOM);
    textSize(14);
    text('HIT', ex, ey - hitRadius - 8);
  }

  drawingContext.shadowBlur = 0;
  drawingContext.shadowColor = 'transparent';
  pop();
}
