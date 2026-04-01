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
   #earthquake;
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
   #shakeCallback;

   constructor(resolution, gameMode, loadout0, loadout1, shakeCallback) {
      // Per match systems / constants
      Match.#GRAVITY = createVector(0, 400);
      Match.#ZERO_VECTOR = createVector(0, 0);
      this.#width = resolution.x;
      this.#height = resolution.y;
      this.#wind = new WindSystem();
      this.#rain = new RainSystem();
      this.#earthquake = new EarthquakeSystem(shakeCallback);
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
      this.#shakeCallback = shakeCallback;
   }

   updateMatch(dt) {
      this.#handleRoundTransition();
      this.#syncControlPanel();
      this.#updateShot(dt);
      this.#updatePlayers();
      if (this.#currentExplosion) this.#updateExplosion(dt);
      this.#updateFloatingScores();
   }

   drawMatch() {
      this.#drawEnvironment();
      this.#drawPlayers();
      if (!this.#turnController.isGameOver) this.#drawTrajectory();
      this.#drawShotSequence();
      this.#drawHUD();
   }

   onMousePressed(button) {
      this.#lastMouseButton = (button === LEFT || button?.left === true);
   }

   onMouseReleased() {
      if (!this.#physicsDone() || this.#lastMouseButton !== true) return;
      const currentPlayer = this.#players[this.#turnController.activePlayerId];
      const inventoryResult = this.#controlPanel.handleWeaponInventoryClick();
      if (inventoryResult.selectedIndex !== null)
         currentPlayer.currentWeaponIndex = inventoryResult.selectedIndex;
      if (inventoryResult.handled) return;
      this.#handleAngleDialToggle();
      this.#handlePowerAdjustToggle();
      this.#triggerMouseCannonShot();
      this.#triggerMouseCannonMovement();
   }

   onKeyReleased(inputKey, keyId) {
      if (inputKey === 'Space' || keyId === 32) this.#executeCannonShot();
      if (keyId === 37) this.#executeCannonMovement('left');
      if (keyId === 39) this.#executeCannonMovement('right');
   }

   #setModeBasedWeather() {
      if (!this.#isEasyDifficulty) {
         this.#generateRandomWeather();
      } else {
         this.#wind.isActive = false;
         this.#rain.isActive = false;
         this.#earthquake.isActive = false;
      }
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
         loadout.forEach(w => w.resetUsage());
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
      this.#earthquake.isActive = false;
      if (currentWeather === "wind") {
         this.#wind.isActive = true;
         this.#wind.newTurn();
      }
      else if (currentWeather === "rain") {
         this.#rain.isActive = true;
         this.#rain.newTurn();
      }
      else if (currentWeather === "earthquake") {
         this.#earthquake.isActive = true;
         this.#earthquake.newTurn();
      }
   }

   #generateWeatherQueue() {
      this.#weatherQueue = ["wind", "rain", "earthquake"];
      this.#weatherQueue.push(random(["wind", "rain", "earthquake"]));
      shuffle(this.#weatherQueue, true);
      this.#weatherIndex = 0;
   }

   #syncControlPanel() {
      const currentPID = this.#turnController.activePlayerId;
      if (currentPID !== this.#lastActivePlayerId) {
         this.#controlPanel.angleDial.needleRotation = this.#players[currentPID].barrelAngle + 90;
         this.#controlPanel.powerAdjust.power = this.#players[currentPID].barrelPower / 7;
         this.#controlPanel.setMoveSteps(this.#players[currentPID].moveSteps);
         this.#controlPanel.setWeaponLoadouts(
            this.#players[currentPID].weaponLoadout ?? [],
            this.#players[currentPID].currentWeaponIndex ?? 0
         );
         this.#lastActivePlayerId = currentPID;
      }
   }

   #updateShot(dt) {
      if (!this.#currentShot?.isActive) return;
      const impactEvent = this.#currentShot.updatePhysics(
         dt / 1000,
         Match.#GRAVITY,
         this.#wind,
         this.#rain,
         this.#earthquake,
         this.#terrain,
         this.#controlPanel,
         this.#width
      );
      if (impactEvent) this.#spawnExplosion(impactEvent);
   }

   #spawnExplosion(impactEvent) {
      this.#currentShot = null;
      if (impactEvent.type === 'TERRAIN_IMPACT') {
         this.#currentExplosion = new Explosion(impactEvent.pos, this.#terrain);
      }
      else if (impactEvent.type === 'OUT_OF_BOUNDS') this.#turnController.advancePhase();
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

   #updateExplosion(dt) {
      if (!this.#currentExplosion) return;
      this.#currentExplosion.update(this.#turnController, dt);
      if (!this.#currentExplosion.finished) this.#handleExplosionFeedback();
      else {
         this.#handleExplosionScoring();
         this.#currentExplosion = null;
         this.#hasScoredThisExplosion = false;
      }
   }

   #handleExplosionFeedback() {
      // lastShooterId for self, 1 - lastShooterId for enemy
      let distance = this.#calculateExplosionDistance(1 - this.#lastShooterId);
      // last 3 arguments to applyExplosionFeedback() relate to visual effects
      this.#applyExplosionFeedback('enemyFeedbackTriggered', distance, 1 - this.#lastShooterId, 12, 6, 8);
      distance = this.#calculateExplosionDistance(this.#lastShooterId);
      this.#applyExplosionFeedback('selfFeedbackTriggered', distance, this.#lastShooterId, 10, 5, 6);
   }

   #calculateExplosionDistance(playerId) {
      return this.#players[playerId].position.dist(this.#currentExplosion.position);
   }

   #applyExplosionFeedback(id, distance, playerId, flashFrames, shakeFrames, shakeMag) {
      if (!this.#currentExplosion[id] && distance <= this.#currentExplosion.radius) {
         this.#players[playerId].triggerHitFlash(flashFrames);
         this.#shakeCallback(shakeFrames, shakeMag);
         this.#currentExplosion[id] = true;
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
      this.#wind?.draw(this.#controlPanel.baseAltitude);
      this.#rain?.draw(this.#terrain);
      this.#earthquake?.draw();
   }

   #drawPlayers() {
      const playerId = this.#turnController.activePlayerId;
      for (const player of this.#players) player.drawPlayer();
      if (!this.#turnController.isGameOver) this.#players[playerId].drawIndicator(playerId);
   }

   #drawTrajectory() {
      if (!this.#isEasyDifficulty || !this.#physicsDone()) return;
      const shooter = this.#players[this.#turnController.activePlayerId]
      const target = this.#players[1 - this.#turnController.activePlayerId];
      const noWind = Match.#ZERO_VECTOR;
      this.#trajectoryPreviewer.drawPreview(shooter, target, this.#terrain, Match.#GRAVITY, noWind);
   }

   #drawShotSequence() {
      this.#currentShot?.drawShot();
      this.#currentExplosion?.draw();
   }

   #drawHUD() {
      // Destructuring assignment: after this local constant turnNumber = turnController.turnNumber, etc.
      const { turnNumber, maxTurns, activePlayerId } = this.#turnController;
      this.#controlPanel.drawCtrlPanel(this.#players[activePlayerId], this.#physicsDone());
      this.#turnCounter.drawCounter(turnNumber, maxTurns, activePlayerId);
      for (const floatingScore of this.#floatingScores) floatingScore.draw();
      this.#scoreBoard.draw();
   }

   #handleAngleDialToggle() {
      const dial = this.#controlPanel.angleDial;
      dial.isFollowing = (!this.#controlPanel.powerAdjust.isFollowing && dial.isHovered && !dial.isFollowing);
   }

   #handlePowerAdjustToggle() {
      const powerWidget = this.#controlPanel.powerAdjust;
      powerWidget.isFollowing = (!this.#controlPanel.angleDial.isFollowing && powerWidget.isHovered && !powerWidget.isFollowing);
   }

   #triggerMouseCannonShot() {
      if (this.#controlPanel.shootButton.isHovered(this.#controlPanel.baseAltitude))
         this.#executeCannonShot();
   }

   #executeCannonShot() {
      if (this.#physicsDone()) {
         this.#lastShooterId = this.#turnController.activePlayerId;
         const shooter = this.#players[this.#lastShooterId];
         const selectedIndex = shooter.currentWeaponIndex ?? 0;
         const selectedWeapon = shooter.weaponLoadout?.[selectedIndex] ?? null;
         if (selectedWeapon && !selectedWeapon.consume()) return;
         this.#currentShot = shooter.fireShot(selectedWeapon, 4);
         if (selectedWeapon && Array.isArray(shooter.weaponLoadout)) {
            shooter.weaponLoadout.splice(selectedIndex, 1);
            shooter.currentWeaponIndex = constrain(
               selectedIndex,
               0,
               Math.max(shooter.weaponLoadout.length - 1, 0)
            );
         }
         this.#controlPanel.setWeaponLoadouts(
            shooter.weaponLoadout ?? [],
            shooter.currentWeaponIndex ?? 0
         );
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

   #physicsDone() {
      return !this.#currentShot && !this.#currentExplosion && this.#terrain.isSettled;
   }

   get isMatchOver() {
      return this.#turnController.isGameOver && this.#physicsDone() && this.#floatingScores.length === 0;
   }

   get matchResults() {
      return {
         score1: this.#scoreBoard.score1,
         score2: this.#scoreBoard.score2,
         winnerData: this.#scoreBoard.getHighestScorePlayerId()
      }
   }
}
