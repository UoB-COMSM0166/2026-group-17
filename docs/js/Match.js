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

   #secondaryShots = [];
   #poisonClouds = [];
   #shibaImpacts = [];

   #turnController;
   #turnCounter;
   #controlPanel;
   #lastTurnNumber = 1;
   #floatingScores = [];
   #trajectoryPreviewer;
   #isEasyDifficulty;
   #lastMouseButton;
   #shakeCallback;
   #pendingTurnAdvance = false;

   constructor(resolution, gameMode, loadout0, loadout1, shakeCallback) {
      Match.#GRAVITY = createVector(0, 400);
      Match.#ZERO_VECTOR = createVector(0, 0);

      this.#width = resolution.x;
      this.#height = resolution.y;

      this.#wind = new WindSystem();
      this.#rain = new RainSystem();

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
      if (this.#currentExplosion) this.#updateExplosion(dt);
      this.#updateFloatingScores();

      // delayed turn advance for lingering special effects
     if (
   this.#pendingTurnAdvance &&
   !this.#currentExplosion &&
   this.#secondaryShots.length === 0 &&
   this.#poisonClouds.length === 0
) {
   console.log("delayed advance triggered");
   this.#turnController.advancePhase();
   this.#pendingTurnAdvance = false;
}
   }

   drawMatch() {
      this.#drawEnvironment();
      this.#drawPlayers();
      if (!this.#turnController.isGameOver) this.#drawTrajectory();
      this.#drawShotSequence();
      this.#drawHUD();
   }

   onMousePressed(cursorX, cursorY, button) {
      this.#lastMouseButton = button;
   }

   onMouseReleased(cursorX, cursorY, button) {
      if (!this.#physicsDone()) return;
      this.#handleAngleDialToggle();
      this.#handlePowerAdjustToggle();
      this.#triggerMouseCannonShot();
      this.#triggerMouseCannonMovement();
   }
   onMouseMoved(cursorX, cursorY) {
      // reserved for widgets that need explicit mouse move syncing
   }

   onKeyReleased(inputKey, keyId) {
      if (inputKey === 'Space' || keyId === 32) this.#executeCannonShot();
      if (keyId === 37) this.#executeCannonMovement('left');
      if (keyId === 39) this.#executeCannonMovement('right');

      const player = this.#players[this.#turnController.activePlayerId];
      if (!player) return;

      if (inputKey === 'q' || inputKey === 'Q') player.prevWeapon?.();
      if (inputKey === 'e' || inputKey === 'E') player.nextWeapon?.();
   }

   #setModeBasedWeather() {
      if (!this.#isEasyDifficulty) this.#generateRandomWeather();
      else this.#wind.isActive = this.#rain.isActive = false;
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
         this.#height - this.#terrain.getHeightAt(posX) - radius
      );
      this.#players.push(
         new PlayerCannon(posVec, radius, barrSz, barrAngle, steps, fillCol, outCol)
      );
   }

   #applyLoadout(loadout, id) {
      if (!loadout || loadout.length === 0) {
         loadout = [
            new CannonBall(),
            new Pineappleshot(),
            new Shibashot(),
            new Starshot()
         ];
      }

      this.#players[id].weaponLoadout = loadout;
      this.#players[id].currentWeaponIndex = 0;
      loadout.forEach(w => w.resetAmmo?.());
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
      } else if (currentWeather === "rain") {
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
         this.#controlPanel.angleDial.needleRotation =
            this.#players[currentPID].barrelAngle + 90;
         this.#controlPanel.powerAdjust.power =
            this.#players[currentPID].barrelPower / 7;
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
         this.#terrain,
         this.#controlPanel,
         this.#width,
         this.#height
      );

      if (impactEvent?.type === "STAR_SPLIT") {
   this.#shakeCallback?.(10, 10);
   this.spawnWeaponExplosion(this.#currentShot.position.copy(), "star", this.#currentShot, null);
   this.#secondaryShots.push(...impactEvent.fragments);
   this.#currentShot = null;
   return;
}
      if (impactEvent) this.#handleShotImpact(impactEvent);
   }

   #handleShotImpact(impactEvent) {
      const shot = this.#currentShot;
      console.log("impact weaponId =", shot?.weaponId);
      this.#currentShot = null;

      if (impactEvent.type === 'OUT_OF_BOUNDS') {
         this.#turnController.advancePhase();
         return;
      }

      if (impactEvent.type !== 'TERRAIN_IMPACT') return;

      if (shot?.weaponId === "starFragment") {
         this.spawnWeaponExplosion(impactEvent.pos, "starFragment", shot, null);
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
      this.#handleWeaponEffectFallback(kind, impactEvent, shot);
   }

   #handleWeaponEffectFallback(kind, impactEvent, shot) {
      if (kind === "pineapple") {
         this.spawnWeaponExplosion(impactEvent.pos, "pineapple", shot, null);
         this.spawnPoisonCloud(impactEvent.pos);
         return;
      }

      if (kind === "shiba") {
         this.spawnWeaponExplosion(impactEvent.pos, "shiba", shot, null);
         this.spawnShibaImpact(impactEvent.pos);
         return;
      }

      if (kind === "star") {
         this.spawnWeaponExplosion(impactEvent.pos, "star", shot, null);
         return;
      }

      this.spawnWeaponExplosion(impactEvent.pos, kind || "ball", shot, null);
   }

   spawnWeaponExplosion(pos, kind = "ball", shot = null, weapon = null) {
      this.#currentExplosion = new Explosion(pos.copy(), this.#terrain, kind);
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
            this.#scoreBoard.addScoreToPlayer(this.#lastShooterId, score);

            this.#floatingScores.push(
               new FloatingScore(
                  this.#players[this.#lastShooterId].positionVector.x,
                  this.#players[this.#lastShooterId].positionVector.y - 60,
                  +score,
                  color(255, 160, 80)
               )
            );

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
            // 左边炮，往右半边散
            a = random(-55, 55);
         } else {
            // 右边炮，往左半边散
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
            this.#terrain,
            this.#controlPanel,
            this.#width,
            this.#height
         );

         if (impactEvent?.type === 'TERRAIN_IMPACT') {
            this.spawnWeaponExplosion(impactEvent.pos, "starFragment", shot, null);
            this.#secondaryShots.splice(i, 1);
            continue;
         }

         if (impactEvent?.type === 'OUT_OF_BOUNDS' || !shot.isActive) {
            this.#secondaryShots.splice(i, 1);
         }
      }

      // if main star shot is already gone, no active explosion, and all fragments are done,
      // then the turn can advance
      if (
         this.#secondaryShots.length === 0 &&
         !this.#currentShot &&
         !this.#currentExplosion
      ) {
         // avoid advancing during poison/shiba aftermath
         if (this.#poisonClouds.length === 0 && this.#shibaImpacts.length === 0) {
            // only safe for star-style fragment resolution
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

      if (this.#controlPanel.angleDial.isFollowing) {
         currentPlayer.barrelAngle =
            this.#controlPanel.angleDial.needleRotation - 90;
      }

      if (this.#controlPanel.powerAdjust.isFollowing) {
         currentPlayer.barrelPower =
            this.#controlPanel.powerAdjust.power * 7;
      }

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
         if (this.#floatingScores[i].finished) {
            this.#floatingScores.splice(i, 1);
         }
      }
   }

   #updateExplosion(dt) {
   if (!this.#currentExplosion) return;

   this.#currentExplosion.update(this.#turnController, dt);

   if (!this.#currentExplosion.finished) {
      this.#handleExplosionFeedback();
      return;
   }

   const finishedKind = this.#currentExplosion.kind;

   this.#handleExplosionScoring();
   this.#currentExplosion = null;
   this.#hasScoredThisExplosion = false;

   // normal weapons: advance immediately after explosion ends
   if (
      finishedKind === "ball" ||
      finishedKind === "cannon_ball" ||
      finishedKind === "shiba"
   ) {
      this.#pendingTurnAdvance = false;
      this.#turnController.advancePhase();
      return;
   }

   // pineapple: only use delayed advance
   if (finishedKind === "pineapple") {
      if (this.#poisonClouds.length === 0) {
         this.#pendingTurnAdvance = false;
         this.#turnController.advancePhase();
      } else {
         this.#pendingTurnAdvance = true;
      }
      return;
   }

   // star main explosion: NEVER advance here
   // wait until all fragments are gone, then delayed block will advance once
   if (finishedKind === "star") {
      this.#pendingTurnAdvance = true;
      return;
   }

   // star fragment explosion: also NEVER advance here
   // only mark pending; delayed block will do the single advance once all are done
   if (finishedKind === "starFragment") {
      this.#pendingTurnAdvance = true;
      return;
   }

   // fallback
   this.#pendingTurnAdvance = false;
   this.#turnController.advancePhase();
}

   #handleExplosionFeedback() {
      let distance = this.#calculateExplosionDistance(1 - this.#lastShooterId);
      this.#applyExplosionFeedback(
         'enemyFeedbackTriggered',
         distance,
         1 - this.#lastShooterId,
         12,
         6,
         8
      );

      distance = this.#calculateExplosionDistance(this.#lastShooterId);
      this.#applyExplosionFeedback(
         'selfFeedbackTriggered',
         distance,
         this.#lastShooterId,
         10,
         5,
         6
      );
   }

   #calculateExplosionDistance(playerId) {
      return this.#players[playerId].positionVector.dist(this.#currentExplosion.position);
   }

   #applyExplosionFeedback(id, distance, playerId, flashFrames, shakeFrames, shakeMag) {
      if (!this.#currentExplosion[id] && distance <= this.#currentExplosion.radius) {
         this.#players[playerId].triggerHitFlash(flashFrames);
         this.#shakeCallback?.(shakeFrames, shakeMag);
         this.#currentExplosion[id] = true;
      }
   }

   #handleExplosionScoring() {
      if (this.#hasScoredThisExplosion) return;

      if (this.#currentExplosion.kind === "starFragment") {
         this.#hasScoredThisExplosion = true;
         return;
      }

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
      this.#scoreBoard.addScoreToPlayer(this.#lastShooterId, extraPoints);

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
   }

   #drawPlayers() {
      const playerId = this.#turnController.activePlayerId;
      for (const player of this.#players) player.drawPlayer();
      if (!this.#turnController.isGameOver) {
         this.#players[playerId].drawIndicator(playerId);
      }
   }

   #drawTrajectory() {
      if (!this.#isEasyDifficulty || !this.#physicsDone()) return;

      const shooter = this.#players[this.#turnController.activePlayerId];
      const target = this.#players[1 - this.#turnController.activePlayerId];
      const noWind = Match.#ZERO_VECTOR;

      this.#trajectoryPreviewer.drawPreview(
         shooter,
         target,
         this.#terrain,
         Match.#GRAVITY,
         noWind
      );
   }

   #drawShotSequence() {
      this.#currentShot?.drawShot();

      for (const shot of this.#secondaryShots) {
         shot.drawShot?.();
      }

      this.#currentExplosion?.draw();

      for (const cloud of this.#poisonClouds) {
         cloud.draw();
      }

      for (const fx of this.#shibaImpacts) {
         fx.draw();
      }
   }

   #drawHUD() {
      const { turnNumber, maxTurns, activePlayerId } = this.#turnController;
      const currentPlayer = this.#players[activePlayerId];
      const currentWeapon = currentPlayer.getCurrentWeapon?.();

      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      textSize(18);
      text(`Weapon: ${currentWeapon ? currentWeapon.name : "NONE"}`, 20, 80);
      textSize(14);
      text("Q / E to switch", 20, 105);
      this.#controlPanel.drawCtrlPanel(
         this.#players[activePlayerId],
         this.#physicsDone()
      );

      this.#turnCounter.drawCounter(turnNumber, maxTurns, activePlayerId);

      for (const floatingScore of this.#floatingScores) {
         floatingScore.draw();
      }

      this.#scoreBoard.draw();
   }

   #handleAngleDialToggle() {
      const dial = this.#controlPanel.angleDial;
      const powerWidget = this.#controlPanel.powerAdjust;

      if (dial.isHovered && !powerWidget.isFollowing) {
         dial.isFollowing = !dial.isFollowing;
         if (dial.isFollowing) powerWidget.isFollowing = false;
      }
   }

   #handlePowerAdjustToggle() {
      const powerWidget = this.#controlPanel.powerAdjust;
      const dial = this.#controlPanel.angleDial;

      if (powerWidget.isHovered && !dial.isFollowing) {
         powerWidget.isFollowing = !powerWidget.isFollowing;
         if (powerWidget.isFollowing) dial.isFollowing = false;
      }
   }

   #triggerMouseCannonShot() {
      if (this.#controlPanel.shootButton.isHovered(this.#controlPanel.baseAltitude)) {
         this.#executeCannonShot();
      }
   }

   #executeCannonShot() {
   if (!this.#physicsDone()) return;

   this.#pendingTurnAdvance = false;

   this.#lastShooterId = this.#turnController.activePlayerId;
   const shooter = this.#players[this.#lastShooterId];
   const weapon = shooter.getCurrentWeapon?.() ?? null;
   console.log("fire weapon =", weapon?.id, weapon?.name);

   this.#currentShot = shooter.fireShot(4, weapon);
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
      const terrainSettled =
         this.#terrain?.isSettled === undefined ? true : this.#terrain.isSettled;

      return (
         !this.#currentShot &&
         !this.#currentExplosion &&
         this.#secondaryShots.length === 0 &&
         this.#poisonClouds.length === 0 &&
         this.#shibaImpacts.length === 0 &&
         terrainSettled
      );
   }

   get isMatchOver() {
      return (
         this.#turnController.isGameOver &&
         this.#physicsDone() &&
         this.#floatingScores.length === 0
      );
   }

   get matchResults() {
      return {
         score1: this.#scoreBoard.score1,
         score2: this.#scoreBoard.score2,
         winnerData: this.#scoreBoard.getHighestScorePlayerId()
      };
   }
}