let gravity;
let bgTop;
let bgBottom;
let players = [];
let turnController;
let turnCounter;
let controlPanel;
let movePad;
let lastButtonClicked;
let wind;
let terrain;
let lastShooterId = 0;
let scoreBoard;
let scoreCalculator;
let currentShot = null;
let currentExplosion = null;
let secondaryShots = [];
let poisonClouds = [];
let shibaImpacts = [];
let hasScoredThisExplosion = false;
let lastTurnNumber = 1;
let floatingScores = [];
let pendingRoundAnimation = false;
let shakeFrames = 0;
let shakeMag = 0;
let weaponSystem;
let pineappleImg, starImg, shibaImg;
function triggerShake(frames = 10, mag = 6) { shakeFrames = frames; shakeMag = mag; }

let startMenu;
//Flag to check if the game has started
let gameStarted = false;
async function setup() {
  createCanvas(1280, 700);

  try {
    pineappleImg = await loadImage("weapons/pineapple.png");
    starImg = await loadImage("weapons/star.png");
    shibaImg = await loadImage("weapons/shiba.png");
  } catch (err) {
    console.error("Weapon image load failed:", err);
  }

  wind = new WindSystem();
  angleMode(DEGREES);
  ellipseMode(RADIUS);
  startMenu = new StartMenu(width, height);
  gravity = createVector(0, 400);
}

function draw() {
  if (!gameStarted) {
    background(0);
    startMenu.draw();
    return;
  }

  push();
  if (shakeFrames > 0) {
    translate(random(-shakeMag, shakeMag), random(-shakeMag, shakeMag));
    shakeFrames--;
  }

  drawLinearGradient(bgTop, bgBottom);
  terrain.drawTerrain();

  if (wind) wind.draw();
  if (movePad) movePad.drawMovePad();

  let currentPlayerId = turnController.activePlayerId;
  players[currentPlayerId].updateMove(0.18);

  const hasActiveSecondaryShots = secondaryShots.some(
    s => s.isActive || s.isExploding
  );

  const hasActivePoisonClouds = poisonClouds.length > 0;

  const hasAnyExplosion =
    Boolean(currentShot?.isExploding) ||
    Boolean(currentExplosion) ||
    hasActivePoisonClouds;

  const hasAnyProjectileInFlight =
    Boolean(currentShot?.isActive) || hasActiveSecondaryShots;

  if (
    !turnController.playerCanAct(
      hasAnyProjectileInFlight,
      hasAnyExplosion
    )
  ) {
    currentShot?.updatePhysics(deltaTime / 1000);
    currentShot?.drawShotSequence();
  } else {
    if (controlPanel.angleDial.isFollowing) {
      players[currentPlayerId].barrelAngle =
        controlPanel.angleDial.needleRotation - 90;
    }
  }

  for (let i = secondaryShots.length - 1; i >= 0; i--) {
    let s = secondaryShots[i];

    s.updatePhysics(deltaTime / 1000);
    s.drawShotSequence();

    if (!s.isActive && !s.isExploding) {
      secondaryShots.splice(i, 1);
    }
  }

  const starTurnFinished =
    currentShot &&
    currentShot.weaponId === "star" &&
    !currentShot.isActive &&
    !currentShot.isExploding &&
    secondaryShots.length === 0 &&
    !currentExplosion;

  if (starTurnFinished) {
    turnController.advancePhase();
    pendingRoundAnimation = true;
    currentShot = null;
  }
  const pineappleTurnFinished =
    currentShot &&
    currentShot.weaponId === "pineapple" &&
    !currentShot.isActive &&
    !currentShot.isExploding &&
    !currentExplosion &&
    poisonClouds.length === 0;

  if (pineappleTurnFinished) {
    turnController.advancePhase();
    pendingRoundAnimation = true;
    currentShot = null;
  }
  players[currentPlayerId].barrelPower = controlPanel.powerAdjust.power * 7;

  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    const groundY = min(
      controlPanel.getAltitudeAt(p.positionVector.x) - p.wheelRadius,
      height - terrain.getHeightAt(p.positionVector.x) - p.wheelRadius
    );

    if (p.isAirborne) {
      p.verticalVelocity += 0.9;
      p.positionVector.y += p.verticalVelocity;

      if (p.positionVector.y >= groundY) {
        p.positionVector.y = groundY;
        p.isAirborne = false;

        if (p.pendingCraterRadius > 0) {
          terrain.applyExplosion(
            createVector(p.positionVector.x, p.positionVector.y + p.wheelRadius),
            p.pendingCraterRadius
          );
          triggerShake(10, 8);
          p.pendingCraterRadius = 0;
        }
      }
    } else {
      p.positionVector.y = groundY;
    }
  }

  players[0].drawPlayer();
  players[1].drawPlayer();

  const pid = turnController.activePlayerId;

  push();
  noFill();
  strokeWeight(4);
  if (pid === 0) stroke(255, 80, 80);
  else stroke(80, 180, 255);
  circle(
    players[pid].positionVector.x,
    players[pid].positionVector.y,
    players[pid].wheelRadius + 15
  );

  let arrowY = players[pid].positionVector.y - 50;
  fill(pid === 0 ? color(255, 80, 80) : color(80, 180, 255));
  noStroke();
  triangle(
    players[pid].positionVector.x - 10,
    arrowY,
    players[pid].positionVector.x + 10,
    arrowY,
    players[pid].positionVector.x,
    arrowY + 15
  );
  pop();

  // explosion update / draw / score
  if (currentExplosion) {
    currentExplosion.update();
    currentExplosion.draw();

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

      if (currentExplosion.kind === "starFragment") {
        hasScoredThisExplosion = true;
      } else {
        const { enemy, self } = scoreCalculator.calculateExplosionScore(
          currentExplosion,
          players,
          shooterId
        );

        if (enemy > 0) {
          if (shooterId === 0) {
            scoreBoard.score1 += enemy;
          } else {
            scoreBoard.score2 += enemy;
          }

          floatingScores.push(
            new FloatingScore(
              players[shooterId].positionVector.x,
              players[shooterId].positionVector.y - 60,
              +enemy,
              color(255, 220, 0)
            )
          );
        }
        if (self > 0) {
          if (shooterId === 0) {
            scoreBoard.score1 -= self;
          } else {
            scoreBoard.score2 -= self;
          }
          floatingScores.push(
            new FloatingScore(
              players[shooterId].positionVector.x,
              players[shooterId].positionVector.y - 60,
              -self,
              color(255, 80, 80)
            )
          );
        }
        scoreBoard.score1 = Math.max(0, scoreBoard.score1);
        scoreBoard.score2 = Math.max(0, scoreBoard.score2);
        hasScoredThisExplosion = true;
        pendingRoundAnimation = true;
        console.log(shooterId, enemy, self);
      }
    }
    if (currentExplosion.finished) {
      currentExplosion = null;
    }
  }
  if (!currentExplosion) {
    hasScoredThisExplosion = false;
  }

  pop();

  if (
    turnController.playerCanAct(
      hasAnyProjectileInFlight,
      hasAnyExplosion
    )
  ) {
    if (wind && wind.isActive === false) {
      const windForce = wind ? wind.forceVector : createVector(0, 0);
      const enemyId = currentPlayerId === 0 ? 1 : 0;
      drawTrajectoryPreview(
        players[currentPlayerId],
        gravity,
        windForce,
        terrain,
        players[enemyId]
      );
    }
  }

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

  turnCounter.drawCounter(
    turnController.turnNumber,
    turnController.maxTurns,
    turnController.activePlayerId
  );

  for (let i = floatingScores.length - 1; i >= 0; i--) {
    floatingScores[i].update();
    floatingScores[i].draw();
    if (floatingScores[i].finished) {
      floatingScores.splice(i, 1);
    }
  }
  for (let i = poisonClouds.length - 1; i >= 0; i--) {
    const cloud = poisonClouds[i];

    cloud.update(deltaTime / 1000);
    cloud.applyEffect(players, scoreBoard, floatingScores);
    cloud.draw();

    if (cloud.finished) {
      poisonClouds.splice(i, 1);
    }
  }
  for (let i = shibaImpacts.length - 1; i >= 0; i--) {
    const fx = shibaImpacts[i];
    fx.update();
    fx.draw();
    if (fx.finished) {
      shibaImpacts.splice(i, 1);
    }
  }
  if (weaponSystem) {
    weaponSystem.drawHUD(120, 90);
  }

  const anyAirborne = players.some(p => p.isAirborne);

  if (
    turnController.isGameOver() &&
    !currentExplosion &&
    poisonClouds.length === 0 &&
    !anyAirborne &&
    (!currentShot || !currentShot.isActive)
  ) {
    background("black");
    fill("white");
    noStroke();
    textAlign(CENTER, TOP);
    textFont("Comic Sans MS, Chalkboard SE, Marker Felt, cursive", 36);

    const result = scoreBoard.getHighestScorePlayerId();
    let statusText;
    if (result.leader === "tie") statusText = "N/A - Draw!";
    else statusText = `Player ${result.leader + 1}`;

    textSize(60);
    text(`Winner: ${statusText}`, width / 2, 120);

    textSize(32);
    text(
      "Player 1 Score: " + scoreBoard.score1 + "\n" +
      "Player 2 Score: " + scoreBoard.score2,
      width / 2,
      250
    );

    textSize(24);
    text("Press 'R' to restart", width / 2, 400);
  }

  scoreBoard.draw();
}
function mousePressed() {
  if (!gameStarted) {
    //Handle Start menu clicks
    const mode = startMenu.handleMousePressed();
    if (mode) {
      //Initialize game objects selecting difficulty
      gameStarted = true;
      initGame(mode);
    }
    return;
  }

  lastButtonClicked = mouseButton.left;

  const hasActiveSecondaryShots = secondaryShots.some(
    s => s.isActive || s.isExploding
  );

  const hasActivePoisonClouds = poisonClouds.length > 0;

  const hasAnyExplosion =
    Boolean(currentShot?.isExploding) ||
    Boolean(currentExplosion) ||
    hasActivePoisonClouds;

  const hasAnyProjectileInFlight =
    Boolean(currentShot?.isActive) || hasActiveSecondaryShots;

  const shotFree = turnController.playerCanAct(
    hasAnyProjectileInFlight,
    hasAnyExplosion
  );
  const currentPlayerId = turnController.activePlayerId;

  const shotRadius = 4;
  if (lastButtonClicked && controlPanel.shootButton.isHovered && shotFree) {
    lastShooterId = currentPlayerId;
    const weaponId = weaponSystem ? weaponSystem.getCurrentWeaponId() : "ball";
    currentShot = players[currentPlayerId].fireShot(shotRadius, weaponId);
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
  if (controlPanel.angleDial.isHovered && !controlPanel.angleDial.isFollowing && lastButtonClicked)
    controlPanel.angleDial.isFollowing = true;
  else controlPanel.angleDial.isFollowing = false;

  if (controlPanel.powerAdjust.isHovered && !controlPanel.powerAdjust.isFollowing && lastButtonClicked)
    controlPanel.powerAdjust.isFollowing = true;
  else controlPanel.powerAdjust.isFollowing = false;
}

function initGame(mode) {
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
  terrain = new Terrain(createVector(width, height), color(255, 0, 0));
  const terrainSeed = floor(random(99999));
  terrain.generateInitialTerrain(terrainSeed);
  scoreCalculator = new ScoreCalculator();
  turnCounter = new TurnCounter(createVector(width / 2, height / 20));
  const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);

  // left cannon
  const cannon1X = random(wheelRadius, width / 4);
  const cannon1Position = createVector(
    cannon1X,
    height - terrain.getHeightAt(cannon1X) - wheelRadius
  );
  // right cannon
  const cannon2X = random(width - width / 5, width - wheelRadius);
  const cannon2Position = createVector(
    cannon2X,
    height - terrain.getHeightAt(cannon2X) - wheelRadius
  );

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
  weaponSystem = new WeaponSystem();

  weaponSystem.registerWeapon("ball", {
    id: "ball",
    label: "Cannon Ball",
    sprite: null,
    drawWidth: 0,
    drawHeight: 0
  });

  weaponSystem.registerWeapon("pineapple", {
    id: "pineapple",
    label: "Evil Pineapple",
    sprite: pineappleImg,
    drawWidth: 58,
    drawHeight: 72
  });

  weaponSystem.registerWeapon("star", {
    id: "star",
    label: "Star Rocket",
    sprite: starImg,
    drawWidth: 66,
    drawHeight: 66
  });

  weaponSystem.registerWeapon("shiba", {
    id: "shiba",
    label: "Shiba Hammer",
    sprite: shibaImg,
    drawWidth: 68,
    drawHeight: 68
  });
}

function keyReleased() {
  let shotRadius = 4;
  const hasActiveSecondaryShots = secondaryShots.some(s => s.isActive || s.isExploding);
  if (
    (key === 'r' || key === 'R') &&
    turnController &&
    turnController.isGameOver()
  ) {
    window.location.reload();
    return;
  }
  if (key === 'Space' &&
    !currentShot?.isActive &&
    !currentShot?.isExploding &&
    !hasActiveSecondaryShots) {
    const weaponId = weaponSystem ? weaponSystem.getCurrentWeaponId() : "ball";
    currentShot = players[turnController.activePlayerId].fireShot(shotRadius, weaponId);
  }
  if (weaponSystem) {
    if (key === 'q' || key === 'Q') {
      weaponSystem.prevWeapon();
    }
    if (key === 'e' || key === 'E') {
      weaponSystem.nextWeapon();
    }
    if (key === '1') weaponSystem.setWeapon("ball");
    if (key === '2') weaponSystem.setWeapon("pineapple");
    if (key === '3') weaponSystem.setWeapon("star");
    if (key === '4') weaponSystem.setWeapon("shiba");
  }
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
  const hitRadius = enemyPlayer.wheelRadius + 20; // the radius

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