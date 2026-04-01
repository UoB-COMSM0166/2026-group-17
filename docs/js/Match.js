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
   #currentExplosions = [];
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
      if (this.#currentExplosions.length > 0) this.#updateExplosions(dt);
      this.#updateFloatingScores();
   }

   drawMatch(applyShake = null) {
      push();
      applyShake?.();
      this.#drawEnvironment();
      this.#drawPlayers();
      if (!this.#turnController.isGameOver) this.#drawTrajectory();
      this.#drawShotSequence();
      pop();
      this.#drawHUD();
   }

   onMousePressed(button) {
      this.#lastMouseButton = (button === LEFT) || (button?.left === true);
   }

   onMouseReleased() {
      const wasLeftMousePress = this.#lastMouseButton === true;
      this.#lastMouseButton = false;
      if (!this.#physicsDone() || !wasLeftMousePress) return;
      this.#handleAngleDialToggle();
      this.#handlePowerAdjustToggle();
      this.#triggerMouseCannonShot();
      this.#triggerMouseCannonMovement();
   }

   onKeyReleased(inputKey, keyId) {
      if (inputKey === 'Space' || keyId === 32) this.#executeCannonShot();
      if (keyId === 37) this.#executeCannonMovement('left');
      if (keyId === 39) this.#executeCannonMovement('right');
      if (inputKey === 'q' || inputKey === 'Q') this.#switchCurrentWeapon(-1);
      if (inputKey === 'e' || inputKey === 'E') this.#switchCurrentWeapon(1);
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
      const fallbackLoadout = WEAPON_REGISTRY.map((weapon) => new weapon.constructor());
      const resolvedLoadout = (loadout && loadout.length > 0) ? loadout : fallbackLoadout;
      this.#players[id].weaponLoadout = resolvedLoadout;
      this.#players[id].currentWeaponIndex = 0;
      resolvedLoadout.forEach(w => w.resetAmmo());
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
         const weapon = impactEvent.weapon;
         const specs = weapon?.createExplosionsFromImpact?.(impactEvent.pos, impactEvent.projectile)
            ?? [{ position: impactEvent.pos.copy() }];
         this.#currentExplosions = specs.map((spec) =>
            new Explosion(
               spec.position.copy(),
               this.#terrain,
               spec.weapon ?? weapon,
               { maxRadius: spec.maxRadius, duration: spec.duration }
            )
         );
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

   #updateExplosions(dt) {
      let removedAnyExplosion = false;
      for (let i = this.#currentExplosions.length - 1; i >= 0; i--) {
         const explosion = this.#currentExplosions[i];
         explosion.update(dt);
         if (!explosion.finished) this.#handleExplosionFeedback(explosion);
         else {
            this.#handleExplosionScoring(explosion);
            this.#currentExplosions.splice(i, 1);
            removedAnyExplosion = true;
         }
      }
      if (removedAnyExplosion && this.#currentExplosions.length === 0) {
         this.#turnController.advancePhase();
      }
   }

   #handleExplosionFeedback(explosion) {
      // lastShooterId for self, 1 - lastShooterId for enemy
      let distance = this.#calculateExplosionDistance(explosion, 1 - this.#lastShooterId);
      // last 3 arguments to applyExplosionFeedback() relate to visual effects
      this.#applyExplosionFeedback(explosion, 'enemyFeedbackTriggered', distance, 1 - this.#lastShooterId, 12, 6, 8);
      distance = this.#calculateExplosionDistance(explosion, this.#lastShooterId);
      this.#applyExplosionFeedback(explosion, 'selfFeedbackTriggered', distance, this.#lastShooterId, 10, 5, 6);
   }

   #calculateExplosionDistance(explosion, playerId) {
      return this.#players[playerId].position.dist(explosion.position);
   }

   #applyExplosionFeedback(explosion, id, distance, playerId, flashFrames, shakeFrames, shakeMag) {
      if (!explosion[id] && distance <= explosion.radius) {
         this.#players[playerId].triggerHitFlash(flashFrames);
         this.#shakeCallback(shakeFrames, shakeMag);
         explosion[id] = true;
      }
   }

   #handleExplosionScoring(explosion) {
      const { enemy, self } = this.#scoreCalculator.calculateExplosionScore(
         explosion,
         this.#players,
         this.#lastShooterId
      );
      if (enemy > 0) this.#updateScore(enemy, color(255, 220, 0));
      if (self > 0) this.#updateScore(-self, color(255, 80, 80));
      this.#scoreBoard.score1 = Math.max(0, this.#scoreBoard.score1);
      this.#scoreBoard.score2 = Math.max(0, this.#scoreBoard.score2);
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
      for (const explosion of this.#currentExplosions) explosion.draw();
   }

   #drawHUD() {
      // Destructuring assignment: after this local constant turnNumber = turnController.turnNumber, etc.
      const { turnNumber, maxTurns, activePlayerId } = this.#turnController;
      this.#controlPanel.drawCtrlPanel(this.#players[activePlayerId], this.#physicsDone());
      this.#turnCounter.drawCounter(turnNumber, maxTurns, activePlayerId);
      this.#drawWeaponHUD(activePlayerId);
      for (const floatingScore of this.#floatingScores) floatingScore.draw();
      this.#scoreBoard.draw();
   }

   #drawWeaponHUD(activePlayerId) {
      const player = this.#players[activePlayerId];
      const weapon = player.currentWeapon;
      if (!weapon) return;

      push();
      rectMode(CORNER);
      noStroke();
      fill(10, 20, 30, 170);
      rect(20, 20, 280, 68, 12);

      fill(255);
      textAlign(LEFT, TOP);
      textSize(16);
      text(`Weapon: ${weapon.name}`, 84, 30);
      textSize(12);
      text(`Ammo ${weapon.ammoLeft}/${weapon.ammo}  Radius ${weapon.explosionRadius}`, 84, 52);
      text(`Q/E switch`, 210, 52);

      weapon.drawIcon(52, 53, 16);
      pop();
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
         const player = this.#players[this.#lastShooterId];
         const weapon = player.currentWeapon;
         const target = this.#players[1 - this.#lastShooterId];
         if (weapon && !weapon.useAmmo()) return;
         this.#currentShot = player.fireShot(weapon, target);
      }
   }

   #switchCurrentWeapon(step) {
      if (!this.#physicsDone()) return;
      this.#players[this.#turnController.activePlayerId].cycleWeapon(step);
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
      return !this.#currentShot && this.#currentExplosions.length === 0 && this.#terrain.isSettled;
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
