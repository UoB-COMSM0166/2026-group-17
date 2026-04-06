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

   #secondaryShots = [];
   #poisonClouds = [];
   #shibaImpacts = [];
   #pendingTurnAdvance = false;

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
      Match.#GRAVITY = createVector(0, 400);
      Match.#ZERO_VECTOR = createVector(0, 0);

      this.#width = resolution.x;
      this.#height = resolution.y;

      this.#wind = new WindSystem();
      this.#rain = new RainSystem();
      this.#earthquake = new EarthquakeSystem(shakeCallback);

      this.#bgTopColour = color(0);
      this.#bgBottomColour = color(0, 80, 100);

      this.#scoreBoard = new ScoreBoard();
      this.#scoreBoard.setup();

      this.#controlPanel = new ControlPanel(color(20));
      this.#scoreCalculator = new ScoreCalculator();
      this.#turnCounter = new TurnCounter(createVector(this.#width / 2, this.#height / 20));

      this.#terrain = new Terrain(this.#controlPanel, color(255, 0, 0));
      const terrainSeed = floor(random(99999));
      this.#terrain.generateInitialTerrain(terrainSeed);

      this.#spawnPlayers();
      this.#applyLoadout(loadout0, 0);
      this.#applyLoadout(loadout1, 1);

      this.#turnController = new TurnController(this.#wind);

      this.#isEasyDifficulty = (gameMode === "easy");
      this.#trajectoryPreviewer = new TrajectoryPreview(resolution);
      this.#setModeBasedWeather();
      this.#shakeCallback = shakeCallback;
   }

   updateMatch(dt) {
      this.#handleRoundTransition();
      this.#syncControlPanel();
      this.#updateShot(dt);
      this.#updateSecondaryShots(dt);
      this.#updatePoisonClouds(dt);
      this.#updateShibaImpacts();
      this.#updatePlayers();

      if (this.#currentExplosions.length > 0) this.#updateExplosions(dt);

      this.#updateFloatingScores();

      if (
         this.#pendingTurnAdvance &&
         this.#currentExplosions.length === 0 &&
         this.#secondaryShots.length === 0 &&
         this.#poisonClouds.length === 0
      ) {
         this.#turnController.advancePhase();
         this.#pendingTurnAdvance = false;
      }
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

   onMousePressed(x, y, button) {
      this.#lastMouseButton = (button === LEFT) || (button?.left === true);
   }

   onMouseReleased(x, y, button) {
      const wasLeftMousePress = this.#lastMouseButton === true;
      this.#lastMouseButton = false;
      if (!this.#physicsDone() || !wasLeftMousePress) return;

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
      const wheelRadius = 12;
      const barrelSizeVector = createVector(wheelRadius * 6, 8);

      this.#addPlayer(
         wheelRadius,
         this.#width / 4,
         wheelRadius,
         barrelSizeVector,
         -45,
         3,
         color('silver'),
         color('lightslategray')
      );

      this.#addPlayer(
         this.#width - this.#width / 5,
         this.#width - wheelRadius,
         wheelRadius,
         barrelSizeVector,
         220,
         3,
         color('moccasin'),
         color('navajowhite')
      );
   }

   #addPlayer(randMin, randMax, radius, barrSz, barrAngle, steps, fillCol, outCol) {
      const posX = random(randMin, randMax);
      const posVec = createVector(
         posX,
         this.#terrain.getHeightAt(posX) - radius
      );
      this.#players.push(
         new PlayerCannon(posVec, radius, barrSz, barrAngle, steps, fillCol, outCol)
      );
   }

   #applyLoadout(loadout, id) {
      const fallbackLoadout = WEAPON_REGISTRY.map((weapon) => new weapon.constructor());
      const resolvedLoadout = (loadout && loadout.length > 0) ? loadout : fallbackLoadout;
      this.#players[id].weaponLoadout = resolvedLoadout;
      this.#players[id].currentWeaponIndex = 0;
      resolvedLoadout.forEach(w => w.resetUsage?.());
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
      } else if (currentWeather === "rain") {
         this.#rain.isActive = true;
         this.#rain.newTurn();
      } else if (currentWeather === "earthquake") {
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

      if (impactEvent?.type === "STAR_SPLIT") {
         const shooter = this.#players[this.#lastShooterId];
         const weapon = shooter?.weaponLoadout?.find(w => w.id === "star") ?? null;

         this.#shakeCallback?.(10, 10);
         this.spawnWeaponExplosion(
            this.#currentShot.position.copy(),
            "star",
            this.#currentShot,
            weapon
         );
         this.#secondaryShots.push(...impactEvent.fragments);
         this.#currentShot = null;
         return;
      }

      if (impactEvent) this.#handleShotImpact(impactEvent);
   }

   #handleShotImpact(impactEvent) {
      const shot = this.#currentShot;
      this.#currentShot = null;

      if (impactEvent.type === 'OUT_OF_BOUNDS') {
         this.#turnController.advancePhase();
         return;
      }

      if (impactEvent.type !== 'TERRAIN_IMPACT') return;

      if (shot?.weaponId === "starFragment") {
         const starWeapon = this.#players[this.#lastShooterId]
            ?.weaponLoadout?.find(w => w.id === "star") ?? null;

         this.spawnWeaponExplosion(impactEvent.pos, "starFragment", shot, starWeapon);
         return;
      }

      const shooter = this.#players[this.#lastShooterId];
      const weapon =
         shooter?.weaponLoadout?.find(w => w.id === shot?.weaponId) ?? null;

      if (weapon?.onImpact) {
         weapon.onImpact(this, impactEvent, shot);
         return;
      }

      const kind = shot?.weaponId ?? "ball";
      this.#handleWeaponEffectFallback(kind, impactEvent, shot, weapon);
   }

   #handleWeaponEffectFallback(kind, impactEvent, shot, weapon = null) {
      if (kind === "pineapple") {
         this.spawnWeaponExplosion(impactEvent.pos, "pineapple", shot, weapon);
         this.spawnPoisonCloud(impactEvent.pos);
         return;
      }

      if (kind === "shiba") {
         this.spawnWeaponExplosion(impactEvent.pos, "shiba", shot, weapon);
         this.spawnShibaImpact(impactEvent.pos);
         return;
      }

      if (kind === "star") {
         this.spawnWeaponExplosion(impactEvent.pos, "star", shot, weapon);
         return;
      }

      this.spawnWeaponExplosion(impactEvent.pos, kind || "ball", shot, weapon);
   }

   spawnWeaponExplosion(pos, kind = "ball", shot = null, weapon = null) {
      this.#currentExplosions.push(
         new Explosion(
            pos.copy(),
            this.#terrain,
            weapon,
            { kind }
         )
      );
   }

   spawnPoisonCloud(pos) {
      this.#poisonClouds.push(
         new PoisonCloud(pos.x, pos.y, this.#lastShooterId)
      );
   }

   spawnShibaImpact(pos) {
      const impactX = pos.x;
      const impactY = pos.y;

      const targetId = 1 - this.#lastShooterId;
      const target = this.#players[targetId];

      let strengthFactor = 0.35;

      if (target) {
         const d = dist(
            impactX,
            impactY,
            target.positionVector.x,
            target.positionVector.y
         );

         const effectRadius = 140;

         if (d <= effectRadius) {
            const factor = constrain(1 - d / effectRadius, 0, 1);
            strengthFactor = factor;

            const launchStrength = lerp(10, 22, factor);
            const craterRadius = lerp(18, 46, factor);

            target.startShibaLaunch(launchStrength, craterRadius);

            const score = Math.round(10 + factor * 160);
            this.#updateScore(score, color(255, 160, 80));

            target.triggerHitFlash(8);
         }
      }

      this.#shibaImpacts.push(new ShibaImpactEffect(impactX, impactY, strengthFactor));
      this.#shakeCallback?.(8, 7);
   }

   spawnStarFragments(pos, sourceShot) {
      const shooterId = this.#lastShooterId;

      for (let i = 0; i < 8; i++) {
         let a;

         if (shooterId === 0) {
            a = random(-55, 55);
         } else {
            a = random(125, 235);
         }

         const vel = p5.Vector.fromAngle(radians(a)).mult(random(260, 340));
         const frag = new Projectile(
            createVector(pos.x, pos.y - 8),
            vel,
            3,
            "starFragment"
         );

         this.#secondaryShots.push(frag);
      }
   }

   #updateSecondaryShots(dt) {
      for (let i = this.#secondaryShots.length - 1; i >= 0; i--) {
         const shot = this.#secondaryShots[i];

         const impactEvent = shot.updatePhysics(
            dt / 1000,
            Match.#GRAVITY,
            this.#wind,
            this.#rain,
            this.#earthquake,
            this.#terrain,
            this.#controlPanel,
            this.#width
         );

         if (impactEvent?.type === 'TERRAIN_IMPACT') {
            const starWeapon = this.#players[this.#lastShooterId]
               ?.weaponLoadout?.find(w => w.id === "star") ?? null;

            this.spawnWeaponExplosion(impactEvent.pos, "starFragment", shot, starWeapon);
            this.#secondaryShots.splice(i, 1);
            continue;
         }

         if (impactEvent?.type === 'OUT_OF_BOUNDS' || !shot.isActive) {
            this.#secondaryShots.splice(i, 1);
         }
      }
   }

   #updatePoisonClouds(dt) {
      for (let i = this.#poisonClouds.length - 1; i >= 0; i--) {
         const cloud = this.#poisonClouds[i];
         cloud.update(dt / 1000);

         if (cloud.applyEffect) {
            cloud.applyEffect(this.#players, this.#scoreBoard, this.#floatingScores);
         }

         if (cloud.finished) {
            this.#poisonClouds.splice(i, 1);
         }
      }
   }

   #updateShibaImpacts() {
      for (let i = this.#shibaImpacts.length - 1; i >= 0; i--) {
         const fx = this.#shibaImpacts[i];
         fx.update();
         if (fx.finished) this.#shibaImpacts.splice(i, 1);
      }
   }

   #updatePlayers() {
      const currentPlayer = this.#players[this.#turnController.activePlayerId];

      if (this.#controlPanel.angleDial.isFollowing)
         currentPlayer.barrelAngle = this.#controlPanel.angleDial.needleRotation - 90;

      if (this.#controlPanel.powerAdjust.isFollowing)
         currentPlayer.barrelPower = this.#controlPanel.powerAdjust.power * 7;

      currentPlayer.updateMove(0.18);

      for (let player of this.#players) {
         const groundY = min(
            this.#controlPanel.getAltitudeAt(player.positionVector.x) - player.wheelRadius,
            this.#terrain.getHeightAt(player.positionVector.x) - player.wheelRadius
         );

         if (player.isAirborne) {
            player.verticalVelocity += 0.9;
            player.positionVector.y += player.verticalVelocity;

            if (player.positionVector.y >= groundY) {
               player.positionVector.y = groundY;
               player.isAirborne = false;

               if (player.pendingCraterRadius > 0) {
                  this.#terrain.applyExplosion(
                     createVector(
                        player.positionVector.x,
                        player.positionVector.y + player.wheelRadius
                     ),
                     player.pendingCraterRadius
                  );
                  this.#shakeCallback?.(10, 8);
                  player.pendingCraterRadius = 0;
               }
            }
         } else {
            player.positionVector.y = groundY;
         }
      }
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

         if (!explosion.finished) {
            this.#handleExplosionFeedback(explosion);
         } else {
            this.#handleExplosionScoring(explosion);
            const finishedKind = explosion.kind;
            this.#currentExplosions.splice(i, 1);
            removedAnyExplosion = true;

            if (
               finishedKind === "pineapple" ||
               finishedKind === "star" ||
               finishedKind === "starFragment"
            ) {
               this.#pendingTurnAdvance = true;
            }
         }
      }

      if (
         removedAnyExplosion &&
         this.#currentExplosions.length === 0 &&
         this.#secondaryShots.length === 0 &&
         this.#poisonClouds.length === 0
      ) {
         this.#turnController.advancePhase();
         this.#pendingTurnAdvance = false;
      }
   }

   #handleExplosionFeedback(explosion) {
      let distance = this.#calculateExplosionDistance(explosion, 1 - this.#lastShooterId);
      this.#applyExplosionFeedback(explosion, 'enemyFeedbackTriggered', distance, 1 - this.#lastShooterId, 12, 6, 8);

      distance = this.#calculateExplosionDistance(explosion, this.#lastShooterId);
      this.#applyExplosionFeedback(explosion, 'selfFeedbackTriggered', distance, this.#lastShooterId, 10, 5, 6);
   }

   #calculateExplosionDistance(explosion, playerId) {
      return this.#players[playerId].positionVector.dist(explosion.position);
   }

   #applyExplosionFeedback(explosion, id, distance, playerId, flashFrames, shakeFrames, shakeMag) {
      if (!explosion[id] && distance <= explosion.radius) {
         this.#players[playerId].triggerHitFlash(flashFrames);
         this.#shakeCallback?.(shakeFrames, shakeMag);
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
      this.#scoreBoard.addScoreToPlayer?.(this.#lastShooterId, extraPoints);

      if (!this.#scoreBoard.addScoreToPlayer) {
         if (this.#lastShooterId === 0) this.#scoreBoard.score1 += extraPoints;
         else this.#scoreBoard.score2 += extraPoints;
      }

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
      const shooter = this.#players[this.#turnController.activePlayerId];
      const target = this.#players[1 - this.#turnController.activePlayerId];
      const noWind = Match.#ZERO_VECTOR;
      this.#trajectoryPreviewer.drawPreview(shooter, target, this.#terrain, Match.#GRAVITY, noWind);
   }

   #drawShotSequence() {
      this.#currentShot?.drawShot();

      for (const shot of this.#secondaryShots) shot.drawShot?.();
      for (const explosion of this.#currentExplosions) explosion.draw();
      for (const cloud of this.#poisonClouds) cloud.draw();
      for (const fx of this.#shibaImpacts) fx.draw();
   }

   #drawHUD() {
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
         this.#pendingTurnAdvance = false;
         this.#lastShooterId = this.#turnController.activePlayerId;
         const shooter = this.#players[this.#lastShooterId];
         const selectedIndex = shooter.currentWeaponIndex ?? 0;
         const selectedWeapon = shooter.weaponLoadout?.[selectedIndex] ?? null;
         if (selectedWeapon && !selectedWeapon.consume()) return;
         const target = this.#players[1 - this.#lastShooterId];
         this.#currentShot = shooter.fireShot(selectedWeapon, target);
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

   #switchCurrentWeapon(step) {
      if (!this.#physicsDone()) return;
      const player = this.#players[this.#turnController.activePlayerId];
      player.cycleWeapon(step);
      this.#controlPanel.setWeaponLoadouts(
         player.weaponLoadout ?? [],
         player.currentWeaponIndex ?? 0
      );
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
      return !this.#currentShot &&
         this.#currentExplosions.length === 0 &&
         this.#secondaryShots.length === 0 &&
         this.#poisonClouds.length === 0 &&
         this.#shibaImpacts.length === 0 &&
         this.#terrain.isSettled;
   }

   get isMatchOver() {
      return this.#turnController.isGameOver && this.#physicsDone() && this.#floatingScores.length === 0;
   }

   get matchResults() {
      return {
         score1: this.#scoreBoard.score1,
         score2: this.#scoreBoard.score2,
         winnerData: this.#scoreBoard.getHighestScorePlayerId()
      };
   }
}