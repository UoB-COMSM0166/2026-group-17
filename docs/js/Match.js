class Match {
   static #GRAVITY;
   static #ZERO_VECTOR;
   #width;
   #height;
   #bgTopColour;
   #bgBottomColour;
   #players = [];
   #lastActivePlayerId = -1;
   #wind;
   #rain;
   #weatherQueue = [];
   #weatherIndex = 0;
   #terrain;
   #lastShooterId = 0;
   #scoreBoard;
   #scoreCalculator;
   #currentShot = null;
   #currentExplosion = null;
   #hasScoredThisExplosion = false;
   #turnController;
   #turnCounter;
   #controlPanel;
   #lastTurnNumber = 1;
   #floatingScores = [];
   #trajectoryPreviewer;
   #isEasyDifficulty;
   #lastMouseButton;

   constructor(resolution, gameMode, loadout0, loadout1) {
      // Per match systems / constants
      Match.#GRAVITY = createVector(0, 400);
      Match.#ZERO_VECTOR = createVector(0, 0);
      this.#width = resolution.x;
      this.#height = resolution.y;
      this.#wind = new WindSystem();
      this.#rain = new RainSystem();
      // Background colors
      this.#bgTopColour = color(0);
      this.#bgBottomColour = color(0, 80, 100);
      // UI and scoring
      this.#scoreBoard = new ScoreBoard();
      this.#scoreBoard.setup();
      this.#controlPanel = new ControlPanel(color(20));
      this.#scoreCalculator = new ScoreCalculator();
      this.#turnCounter = new TurnCounter(createVector(this.#width / 2, this.#height / 20));
      // Terrain generation
      this.#terrain = new Terrain(this.#controlPanel, color(255, 0, 0));
      const terrainSeed = floor(random(99999));
      this.#terrain.generateInitialTerrain(terrainSeed);
      // Player initialisation
      this.#spawnPlayers();
      this.#applyLoadout(loadout0, 0);
      this.#applyLoadout(loadout1, 1);
      // Turn logic
      this.#turnController = new TurnController(this.#wind);
      // Difficulty-related
      this.#isEasyDifficulty = (gameMode === "easy");
      this.#trajectoryPreviewer = new TrajectoryPreview(resolution);
      this.#setModeBasedWeather();
   }

   updateMatch(dt) {
      this.#handleRoundTransition();
      this.#syncControlPanel();
      if (this.#currentShot) this.#updateShot(dt);
      this.#updatePlayers();
      if (this.#currentExplosion) this.#updateExplosion();
      this.#updateFloatingScores();
   }

   drawMatch() {
      this.#drawEnvironment();
      this.#drawShot();
      this.#drawPlayers();
      this.#drawTrajectory();
      this.#drawHUD();
   }

   onMousePressed(button) {
      this.#lastMouseButton = button;
   }

   onMouseReleased(cursorX, cursorY, button) {
      //if (this.#lastMouseButton !== LEFT) return;  // DOESN'T WORK (and without all mouse buttons work)
      console.log("Mouse Released in Match")
      this.#handleWidgetToggles();
      this.#triggerMouseCannonShot();
      this.#triggerMouseCannonMovement();
      this.#lastMouseButton = null;       // new; potential issue?
   }

   onKeyReleased(inputKey, keyId) {
      if (inputKey === 'Space' || keyId === 32) this.#executeCannonShot();
      if (keyId === 37) this.#executeCannonMovement('left');
      if (keyId === 39) this.#executeCannonMovement('right');
   }

   #setModeBasedWeather() {
      if (!this.#isEasyDifficulty) this.#generateRandomWeather();
      else this.#wind.isActive = this.#rain.isActive = false;
   }

   #spawnPlayers() {
      const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);
      // left cannon
      this.#addPlayer(wheelRadius, this.#width / 4, wheelRadius,
         barrelSizeVector, -45, 3, color('silver'), color('lightslategray'));
      // right cannon
      this.#addPlayer(this.#width - this.#width / 5, this.#width - wheelRadius, wheelRadius,
         barrelSizeVector, 220, 3, color('moccasin'), color('navajowhite'));
   }

   #addPlayer(randMin, randMax, radius, barrSz, barrAngle, steps, fillCol, outCol) {
      const posX = random(randMin, randMax);
      const posVec = createVector(posX, this.#terrain.getHeightAt(posX) - radius);
      this.#players.push(new PlayerCannon(posVec, radius, barrSz, barrAngle, steps, fillCol, outCol));
   }

   #applyLoadout(loadout, id) {
      if (loadout && loadout.length > 0) {
         this.#players[id].weaponLoadout = loadout;
         this.#players[id].currentWeaponIndex = 0;
         loadout.forEach(w => w.resetAmmo());
      }
   }

   #handleRoundTransition() {
      if (this.#turnController.turnNumber === this.#lastTurnNumber) return;
      this.#lastTurnNumber = this.#turnController.turnNumber;
      this.#setModeBasedWeather();
      this.#turnCounter.startRoundAnimation(this.#turnController.turnNumber);
   }

   #generateRandomWeather() {
      if (this.#weatherIndex >= this.#weatherQueue.length) this.#generateWeatherQueue();
      const currentWeather = this.#weatherQueue[this.#weatherIndex];
      this.#weatherIndex++;
      this.#wind.isActive = false;
      this.#rain.isActive = false;
      if (currentWeather === "wind") {
         this.#wind.isActive = true;
         this.#wind.newTurn();
      }
      else if (currentWeather === "rain") {
         this.#rain.isActive = true;
         this.#rain.newTurn();
      }
   }

   #generateWeatherQueue() {
      this.#weatherQueue = ["wind", "rain", "none"];
      this.#weatherQueue.push(random(["wind", "rain", "none"]));
      shuffle(this.#weatherQueue, true);
      this.#weatherIndex = 0;
   }

   #syncControlPanel() {
      const currentPID = this.#turnController.activePlayerId;
      if (currentPID !== this.#lastActivePlayerId) {
         this.#controlPanel.angleDial.needleRotation = this.#players[currentPID].barrelAngle + 90;
         this.#controlPanel.powerAdjust.power = this.#players[currentPID].barrelPower / 7;
         this.#controlPanel.setMoveSteps(this.#players[currentPID].moveSteps);
         this.#lastActivePlayerId = currentPID;
      }
   }

   #updateShot(dt) {
      // Destructuring assignment: after this local constant isActive = currentShot.isActive, etc.
      const { isActive, isExploding, impactPosition, maxExplosionRadius } = this.#currentShot;
      if (!this.#turnController.playerCanAct(isActive, isExploding)) {
         this.#currentShot.updatePhysics(
            dt / 1000, Match.#GRAVITY, this.#wind, this.#rain,
            this.#terrain, this.#controlPanel, this.#turnController
         );
         this.#spawnExplosion(isExploding, impactPosition);
         this.#currentExplosion.maxRadius = maxExplosionRadius;
      }
   }

   #spawnExplosion(isExploding, impactPosition) {
      if (isExploding && !this.#currentExplosion && impactPosition)
         this.#currentExplosion = new Explosion(impactPosition.x, impactPosition.y);
   }

   #updatePlayers() {
      const currentPlayer = this.#players[this.#turnController.activePlayerId];
      if (this.#controlPanel.angleDial.isFollowing)
         currentPlayer.barrelAngle = this.#controlPanel.angleDial.needleRotation - 90;
      if (this.#controlPanel.powerAdjust.isFollowing)
         currentPlayer.barrelPower = this.#controlPanel.powerAdjust.power * 7;
      currentPlayer.updateMove(0.18);
      for (let player of this.#players) player.positionVector.y = min(
         this.#controlPanel.getAltitudeAt(player.positionVector.x) - player.wheelRadius,
         this.#terrain.getHeightAt(player.positionVector.x) - player.wheelRadius
      );
   }

   #updateFloatingScores() {
      for (let i = this.#floatingScores.length - 1; i >= 0; i--) {
         this.#floatingScores[i].update();
         if (this.#floatingScores[i].finished) this.#floatingScores.splice(i, 1);
      }
   }

   #updateExplosion() {
      this.#currentExplosion.update();
      if (!this.#currentExplosion.finished) this.#handleExplosionFeedback();
      else {
         this.#handleExplosionScoring();
         this.#currentExplosion = null;
         this.#currentShot = null;     // kill shot object. Test if this doesn't break anything!
         this.#hasScoredThisExplosion = false;
      }
   }

   #handleExplosionFeedback() {
      // lastShooterId for self, 1 - lastShooterId for enemy
      let distance = this.#calculateExplosionDistance(1 - this.#lastShooterId);
      this.#applyExplosionFeedback('enemyFeedbackTriggered', distance, 1 - this.#lastShooterId, 12, 6, 8);
      distance = this.#calculateExplosionDistance(this.#lastShooterId);
      this.#applyExplosionFeedback('selfFeedbackTriggered', distance, this.#lastShooterId, 10, 5, 6);
   }

   #calculateExplosionDistance(playerId) {
      return this.#players[playerId].dist(this.#currentExplosion);
   }

   #applyExplosionFeedback(key, distance, playerId, flashFrames, shakeFrames, shakeMag) {
      if (!this.#currentExplosion[key] && distance <= this.#currentExplosion.radius) {
         this.#players[playerId].triggerHitFlash(flashFrames);
         this.game.effects.triggerShake(shakeFrames, shakeMag);
         this.#currentExplosion[key] = true;
      }
   }

   #handleExplosionScoring() {
      if (this.#hasScoredThisExplosion) return;
      const { enemy, self } = this.#scoreCalculator.calculateExplosionScore(
         this.#currentExplosion,
         this.#players,
         this.#lastShooterId
      );
      if (enemy > 0) this.#updateScore(enemy, color(255, 220, 0));
      if (self > 0) this.#updateScore(-self, color(255, 80, 80));
      this.#scoreBoard.score1 = Math.max(0, this.#scoreBoard.score1);
      this.#scoreBoard.score2 = Math.max(0, this.#scoreBoard.score2);
      this.#hasScoredThisExplosion = true;
   }

   #updateScore(extraPoints, scoreColor) {
      if (this.#lastShooterId === 0) this.#scoreBoard.score1 += extraPoints;
      else this.#scoreBoard.score2 += extraPoints;
      this.#floatingScores.push(new FloatingScore(
         this.#players[this.#lastShooterId].positionVector.x,
         this.#players[this.#lastShooterId].positionVector.y - 60,
         extraPoints,
         scoreColor
      ));
   }

   #drawEnvironment() {
      DrawUtils.drawLinearGradient(this.#bgTopColour, this.#bgBottomColour);
      this.#terrain.drawTerrain();
      this.#wind?.draw();
      this.#rain?.draw();
   }

   #drawShot() {
      if (this.#currentShot?.isActive) this.#currentShot.drawShotSequence(this.#terrain);
   }

   #drawPlayers() {
      const playerId = this.#turnController.activePlayerId;
      for (const player of this.#players) player.drawPlayer();
      this.#players[playerId].drawIndicator(playerId);
   }

   #drawTrajectory() {
      const { isActive, isExploding } = this.#currentShot ?? { isActive: false, isExploding: false };
      if (!this.#isEasyDifficulty || !this.#turnController.playerCanAct(isActive, isExploding)) return;
      const shooter = this.#players[this.#turnController.activePlayerId]
      const target = this.#players[1 - this.#turnController.activePlayerId];
      const noWind = Match.#ZERO_VECTOR;
      this.#trajectoryPreviewer.drawPreview(shooter, target, this.#terrain, Match.#GRAVITY, noWind);
   }

   #drawHUD() {
      const { turnNumber, maxTurns, activePlayerId } = this.#turnController;
      this.#controlPanel.drawCtrlPanel(this.#players[activePlayerId]);
      this.#turnCounter.drawCounter(turnNumber, maxTurns, activePlayerId);
      for (const floatingScore of this.#floatingScores) floatingScore.draw();
      this.#scoreBoard.draw();
   }

   #handleWidgetToggles() {
      this.#handleAngleDialToggle();
      this.#handlePowerAdjustToggle();
   }

   #handleAngleDialToggle() {
      const dial = this.#controlPanel.angleDial;
      dial.isFollowing = (dial.isHovered && !dial.isFollowing);
   }

   #handlePowerAdjustToggle() {
      const powerWidget = this.#controlPanel.powerAdjust;
      powerWidget.isFollowing = (powerWidget.isHovered && !powerWidget.isFollowing);
   }

   #triggerMouseCannonShot() {
      console.log("test:-", this.#controlPanel.shootButton.isHovered);
      if (this.#controlPanel.shootButton.isHovered) this.#executeCannonShot();
   }

   #executeCannonShot() {
      console.log("Attempting shot. Current shot status:", this.#currentShot);
      if (!this.#currentShot) {
         this.#lastShooterId = this.#turnController.activePlayerId;
         const shotRadius = 4;
         this.#currentShot = this.#players[this.#lastShooterId].fireShot(shotRadius);
      }
   }

   #triggerMouseCannonMovement() {
      const moveType = this.#controlPanel.handleMovePadClick();
      if (moveType) this.#executeCannonMovement(moveType);
   }

   #executeCannonMovement(direction) {
      const player = this.#players[this.#turnController.activePlayerId];
      if (player.moveSteps > 0) {
         const moveDistance = 50;
         const multiplier = (direction === 'left') ? -1 : 1;
         player.setTargetX(player.targetX + (moveDistance * multiplier), this.#width);
         player.moveSteps -= 1;
         this.#controlPanel.setMoveSteps(player.moveSteps);
      }
   }

   get isMatchOver() { return this.#turnController.isGameOver() && !this.#currentShot; }
   get matchResults() {
      return {
         score1: this.#scoreBoard.score1,
         score2: this.#scoreBoard.score2,
         winnerData: this.#scoreBoard.getHighestScorePlayerId
      }
   }
}