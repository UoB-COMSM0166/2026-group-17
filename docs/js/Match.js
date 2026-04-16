class Match {
   static #GRAVITY;
   static #ZERO_VECTOR;
   static #MAX_CANNON_SLOPE_ANGLE = 55;
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
   #earthWormImpacts = [];
   #earthWormBump = [];
   #pendingTurnAdvance = false;
   #turnController;
   #turnCounter;
   #controlPanel;
   #lastTurnNumber = 1;
   #floatingScores = [];
   #trajectoryPreviewer;
   #isEasyDifficulty;
   #computerController;
   #lastMouseButton;
   #shakeCallback;

   constructor(resolution, gameMode, loadout0, loadout1, aiController, shakeCallback) {
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
      this.#terrain.generateInitialTerrain(floor(random(99999)));
      // Player initialisation
      this.#spawnPlayers(loadout0, loadout1);
      // Turn logic
      this.#turnController = new TurnController();
      //Skip turn for bubblegumshot
      this.#turnController.onSkipCallback = (playerId) => {this.#handlePlayerSkip(playerId);};
      this.#isEasyDifficulty = (gameMode === "easy");
      this.#trajectoryPreviewer = new TrajectoryPreview(resolution);
      this.#computerController = aiController;
      this.#computerController.location = 'MATCH';
      this.#setModeBasedWeather();
      this.#shakeCallback = shakeCallback;
   }

   updateMatch(dt) {
      this.#handleRoundTransition();
      this.#controlPanel.angleDial.updateKeyboardControl(this.#physicsDone());
      this.#controlPanel.powerAdjust.updateKeyboardControl(this.#physicsDone());
      this.#syncControlPanel();
      this.#updateShot(dt);
      this.#updateSecondaryShots(dt);
      this.#updatePoisonClouds(dt);
      this.#updateShibaImpacts();
      this.#updateComputerController(dt);
      this.#updateEarthWormImpacts(dt);
      this.#updateEarthWormBump(dt)
      this.#updatePlayers();
      if (this.#currentExplosions.length > 0) this.#updateExplosions(dt);
      this.#updateFloatingScores();
      this.#processTurnTransition();
   }

   drawMatch(applyShake = null) {
      push();
      applyShake?.();
      this.#drawEnvironment();
      this.#drawPlayers();
      this.#computerController.drawThinkIndicator(this.#players[1].position);
      if (!this.#isAIPlayerTurn()) this.#drawTrajectory();
      this.#drawShotSequence();
      pop();
      this.#drawHUD();
   }

   onMousePressed(button) {
      if (!this.#inputActive()) return;
      this.#lastMouseButton = button?.left === true;
   }

   onMouseReleased() {
      if (!this.#inputActive() || !this.#lastMouseButton) return;
      this.#lastMouseButton = false;
      if (this.#handleInventoryClick()) return;
      this.#handleAngleDialToggle();
      this.#handlePowerAdjustToggle();
      this.#triggerMouseCannonShot();
      this.#triggerMouseCannonMovement();
   }

   onKeyPressed(inputKey, keyId) {
      if (!this.#inputActive()) return;
      if (inputKey === 'a' || inputKey === 'A' || inputKey === 'd' || inputKey === 'D') {
         this.#controlPanel.angleDial.handleKeypressed(inputKey);
      }
      if (inputKey === 'w' || inputKey === 'W' || inputKey === 's' || inputKey === 'S') {
         this.#controlPanel.powerAdjust.handleKeypressed(inputKey);
      }
   }

   onKeyReleased(inputKey, keyId) {
      if (inputKey === 'a' || inputKey === 'A' || inputKey === 'd' || inputKey === 'D') {
         this.#controlPanel.angleDial.handleKeyReleased(inputKey);
      }
      if (inputKey === 'w' || inputKey === 'W' || inputKey === 's' || inputKey === 'S') {
         this.#controlPanel.powerAdjust.handleKeyReleased(inputKey);
      }
      if (!this.#inputActive()) return;
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

   #spawnPlayers(loadout0, loadout1) {
      const wheelRadius = 12, barrelSizeVector = createVector(wheelRadius * 6, 8);
      // left cannon
      this.#addPlayer({
         position: createVector(random(wheelRadius, this.#width / 4), 0),
         wheelRadius: wheelRadius,
         barrelSize: barrelSizeVector,
         barrelAngle: -45,
         moveSteps: 3,
         fillColor: color('silver'),
         strokeColor: color('lightslategray'),
         weaponLoadout: this.#resolveLoadout(loadout0)
      });
      // right cannon
      this.#addPlayer({
         position: createVector(random(this.#width - this.#width / 5, this.#width - wheelRadius), 0),
         wheelRadius: wheelRadius,
         barrelSize: barrelSizeVector,
         barrelAngle: 220,
         moveSteps: 3,
         fillColor: color('moccasin'),
         strokeColor: color('navajowhite'),
         weaponLoadout: this.#resolveLoadout(loadout1)
      });
   }

   #addPlayer(playerConfig) {
      const { position, wheelRadius } = playerConfig;
      position.y = this.#terrain.getHeightAt(position.x) - wheelRadius;
      this.#players.push(new PlayerCannon(playerConfig));
   }

   #resolveLoadout(loadout) {
      if (loadout && loadout.length > 0) return loadout;
      // If no loadout provided, assign one of everything from the registry
      return WEAPON_REGISTRY.map((weapon) => new weapon.constructor());
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
      const impactEvent = this.#currentShot.updatePhysics({
         dt: dt / 1000,
         gravity: Match.#GRAVITY,
         wind: this.#wind,
         rain: this.#rain,
         earthquake: this.#earthquake,
         terrain: this.#terrain,
         players: this.#players,
         resolution: createVector(this.#width, this.#height)
      });
      if (impactEvent?.type === "STAR_SPLIT") this.#handleStarSplit(impactEvent);
      else if (impactEvent) this.#handleShotImpact(impactEvent);
   }

   #handleStarSplit(impactEvent) {
      this.#shakeCallback?.(10, 10);
      this.spawnWeaponExplosion(
         this.#currentShot.position.copy(),
         "star",
         this.#currentShot,
         this.#currentShot.weapon
      );

      this.#secondaryShots.push(...impactEvent.fragments);
      this.#currentShot = null;
   }

   #handleShotImpact(impactEvent) {
      const shot = this.#currentShot;

      this.#currentShot = null;
      if (impactEvent.type === 'OUT_OF_BOUNDS') {
         this.#pendingTurnAdvance = true;
         return;
      }
      if (impactEvent.type !== 'TERRAIN_IMPACT' && impactEvent.type !== 'PLAYER_HIT') return;

      const weapon = shot?.weapon ?? null;
      const kind = shot?.weaponId ?? "ball";

      if (weapon?.onImpact) {
         weapon.onImpact(this, impactEvent, shot);
         return;
      }
      this.#handleWeaponEffectFallback(kind, impactEvent, shot, weapon);
   }

   #handleWeaponEffectFallback(kind, impactEvent, shot, weapon = null) {
      switch (kind) {
         case "pineapple":
            this.spawnWeaponExplosion(impactEvent.pos, "pineapple", shot, weapon);
            this.spawnPoisonCloud(impactEvent.pos);
            break;
         case "shiba":
            this.spawnWeaponExplosion(impactEvent.pos, "shiba", shot, weapon);
            this.spawnShibaImpact(impactEvent.pos);
            break;
         case "star":
            this.spawnWeaponExplosion(impactEvent.pos, "star", shot, weapon);
            break;
         case "starFragment":
            this.spawnWeaponExplosion(impactEvent.pos, "starFragment", shot, weapon);
            break;
         default:
            this.spawnWeaponExplosion(impactEvent.pos, kind || "ball", shot, weapon);
      }
   }

   spawnWeaponExplosion(pos, kind = "ball", shot = null, weapon = null, options = {}) {

      if(!pos) return;
      this.#currentExplosions.push(new Explosion(
         pos.copy(),
         this.#terrain,
         weapon,
         {
            kind,
            maxRadius: options.maxRadius,
            duration: options.duration,
            affectsTerrain: options.affectsTerrain ?? true
         })
      );
   }

   spawnPoisonCloud(pos) {
      this.#poisonClouds.push(new PoisonCloud(pos.x, pos.y, this.#lastShooterId));
   }

   spawnShibaImpact(pos) {
      const target = this.#players[1 - this.#lastShooterId];
      if (!target) return;
      let strengthFactor = 0.35;

      const distance = dist(pos.x, pos.y, target.position.x, target.position.y);
      const effectRadius = 140;
      if (distance <= effectRadius) {
         const factor = constrain(1 - distance / effectRadius, 0, 1);
         strengthFactor = factor;
         const launchStrength = lerp(10, 22, factor);
         const craterRadius = lerp(18, 46, factor);
         target.startShibaLaunch(launchStrength, craterRadius);
         target.triggerHitFlash(8);
         const score = round(10 + factor * 160);
         this.#updateScore(score, color(255, 160, 80));

      }
      this.#shibaImpacts.push(new ShibaImpactEffect(pos.x, pos.y, strengthFactor));
      this.#shakeCallback?.(8, 7);
   }

   spawnEarthWorm(impactPos, weapon){
      this.#earthWormImpacts.push({
         position: impactPos.copy(),
         weapon: weapon,
         timer: 0,
         duration: random(2.0, 3.5),
         targetX: impactPos.x + random(-150, 150),
         finished: false
      });
   }

   spawnEarthWormBump(x, strength = 10){
      this.#earthWormBump.push({
         x: x,
         strength,
         radius: 35,
         life: 1.0,
         seed: random(1000)
      });
   }

   #updateSecondaryShots(dt) {
      for (let i = this.#secondaryShots.length - 1; i >= 0; i--) {
         const shot = this.#secondaryShots[i];
         const impactEvent = shot.updatePhysics({
            dt: dt / 1000,
            gravity: Match.#GRAVITY,
            wind: this.#wind,
            rain: this.#rain,
            terrain: this.#terrain,
            players: this.#players,
            resolution: createVector(this.#width, this.#height)
         });
         if (impactEvent) {
            this.#handleShotImpact(impactEvent);
            this.#secondaryShots.splice(i, 1);
         }
         else if (!shot.isActive) this.#secondaryShots.splice(i, 1);
      }
   }

   #updatePoisonClouds(dt) {
      for (let i = this.#poisonClouds.length - 1; i >= 0; i--) {
         const cloud = this.#poisonClouds[i];
         cloud.update(dt / 1000);
         if (cloud.applyEffect) cloud.applyEffect(this.#players, this.#scoreBoard, this.#floatingScores);
         if (cloud.finished) this.#poisonClouds.splice(i, 1);
      }
   }

   #updateShibaImpacts() {
      for (let i = this.#shibaImpacts.length - 1; i >= 0; i--) {
         const fx = this.#shibaImpacts[i];
         fx.update();
         if (fx.finished) this.#shibaImpacts.splice(i, 1);
      }
   }

   #updateComputerController(dt) {
      if (!this.#isAIPlayerTurn() || !this.#physicsDone()) return;
      this.#computerController.updateAI(dt, {
         shooter: this.#players[1],
         target: this.#players[0],
         terrain: this.#terrain,
         gravity: Match.#GRAVITY,
         wind: Match.#ZERO_VECTOR,
         executeShot: () => this.#executeCannonShot()
      });
   }

   #updateEarthWormImpacts(dt){
      for(let i = this.#earthWormImpacts.length - 1; i >= 0; i--){
         
         const worm = this.#earthWormImpacts[i];
         //Timer
         worm.timer += dt /1000;
         //Follow enemy
         const target = this.#players[1 - this.#lastShooterId];
         //predicted position
         const prediction = target.position.x + random(-60, 60);
         worm.targetX = prediction;
         //Wave motion
         const wave = sin(frameCount * 0.2 + i) * 3;
         //Move underground with speed change
         const speed = lerp(0.02, 0.08, worm.timer / worm.duration);
         worm.position.x = lerp(worm.position.x, worm.targetX, speed) + wave;
         //Follow Terrain shape
         const ground = this.#terrain.getHeightAt(worm.position.x);
         const depth = lerp(30, 80, worm.timer /worm.duration);
         worm.position.y = ground + depth;
         //Explosion
         if(worm.timer >= worm.duration){

            this.spawnEarthWormBump(worm.position.x, 22);
            //Jump at last time
            worm.position.y -= 20;
            const explosionPos = createVector(
               worm.position.x + random(-50, 50), 
               this.#terrain.getHeightAt(worm.position.x) + 40
            );
            this.spawnWeaponExplosion(explosionPos, "earthworm", null, worm.weapon, {duration: 300});
         
         this.#earthWormImpacts.splice(i, 1);
         }
      }
   }

   #updateEarthWormBump(dt){
      for(let i = this.#earthWormBump.length - 1; i >= 0; i--){
         const bump = this.#earthWormBump[i];

         bump.life -= dt / 1000;

         if(bump.life <= 0){
            this.#earthWormBump.splice(i, 1);
         }
      }
   }

   #updatePlayers() {
      const currentPlayer = this.#players[this.#turnController.activePlayerId];
      if (this.#controlPanel.angleDial.isFollowing || this.#controlPanel.angleDial.isKeyboardControlled){
         const newAngle = this.#controlPanel.angleDial.needleRotation - 90;
         currentPlayer.barrelAngle = newAngle;
      }
      if (this.#controlPanel.powerAdjust.isFollowing || this.#controlPanel.powerAdjust.isKeyboardControlled){
         const newPower = this.#controlPanel.powerAdjust.power * 7;
         if(newPower > 0){
            currentPlayer.barrelPower = newPower;
         }
      }      
      
      this.#stopPlayerAtSteepSlope(currentPlayer, 0.10);

      currentPlayer.updateMove(0.10);
      for (let player of this.#players) this.#handlePlayerPhysics(player);
   }

   #handlePlayerPhysics(player) {
      const groundY = this.#terrain.getHeightAt(player.position.x) - player.wheelRadius;
      if (!player.isAirborne) {
         player.position.y = groundY;
         return;
      }
      player.verticalVelocity += 0.9;
      player.position.y += player.verticalVelocity;
      if (player.position.y >= groundY) this.#resolvePlayerLanding(player, groundY);
   }

   #resolvePlayerLanding(player, groundY) {
      player.position.y = groundY;
      player.isAirborne = false;
      player.verticalVelocity = 0;
      if (player.pendingCraterRadius > 0) {
         const impactPos = createVector(player.position.x, player.position.y + player.wheelRadius);
         this.#terrain.applyExplosion(impactPos, player.pendingCraterRadius);
         this.#shakeCallback?.(10, 8);
         player.pendingCraterRadius = 0;
      }
   }

   #updateFloatingScores() {
      for (let i = this.#floatingScores.length - 1; i >= 0; i--) {
         this.#floatingScores[i].update();
         if (this.#floatingScores[i].finished) this.#floatingScores.splice(i, 1);
      }
   }

   #updateExplosions(dt) {
      for (let i = this.#currentExplosions.length - 1; i >= 0; i--) {
         const explosion = this.#currentExplosions[i];
         explosion.update(dt);
         if (!explosion.finished) this.#handleExplosionFeedback(explosion);
         else {
            this.#handleExplosionScoring(explosion);
            this.#currentExplosions.splice(i, 1);
            this.#pendingTurnAdvance = true;
         }
      }
   }

   #handleExplosionFeedback(explosion) {
      const enemyId = 1 - this.#lastShooterId;
      const distToEnemy = this.#players[enemyId].getDistanceTo(explosion.position);
      // last 3 arguments to applyExplosionFeedback() relate to visual effects
      this.#applyExplosionFeedback(explosion, 'enemyFeedbackTriggered', distToEnemy, enemyId, 12, 6, 8);
      const selfId = this.#lastShooterId;
      const distToSelf = this.#players[selfId].getDistanceTo(explosion.position);
      this.#applyExplosionFeedback(explosion, 'selfFeedbackTriggered', distToSelf, selfId, 10, 5, 6);
   }

   #applyExplosionFeedback(explosion, blastId, distance, playerId, flashFrames, shakeFrames, shakeMag) {
      if (!explosion[blastId] && distance <= explosion.radius) {
         this.#players[playerId].triggerHitFlash(flashFrames);
         this.#shakeCallback(shakeFrames, shakeMag);
         explosion[blastId] = true;
      }
   }

   #handleExplosionScoring(explosion) {
      const { enemy, self } = this.#scoreCalculator.calculateExplosionScore(explosion, this.#players, this.#lastShooterId);
      if (enemy > 0) this.#updateScore(enemy, color(255, 220, 0));
      if (self > 0) this.#updateScore(-self, color(255, 80, 80));
      this.#scoreBoard.score1 = max(0, this.#scoreBoard.score1);
      this.#scoreBoard.score2 = max(0, this.#scoreBoard.score2);
   }

   #updateScore(extraPoints, scoreColor) {
      this.#scoreBoard.addScoreToPlayer?.(this.#lastShooterId, extraPoints);

      if (!this.#scoreBoard.addScoreToPlayer) {
         if (this.#lastShooterId === 0) this.#scoreBoard.score1 += extraPoints;
         else this.#scoreBoard.score2 += extraPoints;
      }

      this.#floatingScores.push(new FloatingScore(
         this.#players[this.#lastShooterId].position.x,
         this.#players[this.#lastShooterId].position.y - 60,
         extraPoints,
         scoreColor
      ));
   }

   #processTurnTransition() {
      if (this.#pendingTurnAdvance && this.#physicsDone()) {
         this.#turnController.advancePhase(this.#players);
         if (this.#isAIPlayerTurn()) {
            this.#computerController.startThinking();
         }
         this.#pendingTurnAdvance = false;
      }
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
      for (const player of this.#players) {
         const x = player.position.x;
         player.drawPlayer();
      }
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
      
      for (const worm of this.#earthWormImpacts) {
         push();
         noStroke();

         const wobble = sin(frameCount * 0.2) * 3;

         fill(120, 80, 40, 200);
         ellipse(worm.position.x, worm.position.y, 18 + wobble, 10);
         pop();
      }
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
      const weapon = player.weaponLoadout?.[player.currentWeaponIndex];

      if (!weapon) return;

      // Move the panel down so it does not overlap the score UI.
      push();
      rectMode(CORNER);
      noStroke();
      fill(10, 20, 30, 170);
      rect(20, 82, 250, 58, 12);

      fill(255);
      textAlign(LEFT, TOP);
      textSize(14);
      text(`Weapon: ${weapon.name}`, 74, 92);
      textSize(11);
      text(`Ammo ${weapon.ammoLeft}/${weapon.ammo}`, 74, 112);
      text(`Q/E switch`, 190, 112);

      weapon.drawIcon(48, 110, 14);
      pop();
   }

   #handleInventoryClick() {
      const currentPlayer = this.#players[this.#turnController.activePlayerId];
      const inventoryResult = this.#controlPanel.handleWeaponInventoryClick();
      if (inventoryResult.selectedIndex !== null)
         currentPlayer.currentWeaponIndex = inventoryResult.selectedIndex;
      return inventoryResult.handled;
   }

   #handleAngleDialToggle() {
      const dial = this.#controlPanel.angleDial;
      dial.isFollowing = (!this.#controlPanel.powerAdjust.isFollowing && dial.isHovered && !dial.isFollowing);
   }

   #handlePowerAdjustToggle() {
      const powerWidget = this.#controlPanel.powerAdjust;
      powerWidget.isFollowing =
         (!this.#controlPanel.angleDial.isFollowing && powerWidget.isHovered && !powerWidget.isFollowing);
   }

   #triggerMouseCannonShot() {
      if (this.#controlPanel.shootButton.isHovered(this.#controlPanel.baseAltitude))
         this.#executeCannonShot();
   }

   #executeCannonShot() {
      if (!this.#physicsDone()) return;
      this.#lastShooterId = this.#turnController.activePlayerId;
      const shooter = this.#players[this.#lastShooterId];
      this.#currentShot = shooter.fireCurrentWeapon();
      if (!this.#currentShot) return;
      this.#controlPanel.setWeaponLoadouts(shooter.weaponLoadout, shooter.currentWeaponIndex);
   }

   #switchCurrentWeapon(step) {
      if (!this.#physicsDone()) return;
      const player = this.#players[this.#turnController.activePlayerId];
      player.cycleWeapon(step);
      this.#controlPanel.setWeaponLoadouts(player.weaponLoadout, player.currentWeaponIndex);
   }

   #triggerMouseCannonMovement() {
      const moveType = this.#controlPanel.handleMovePadClick();
      if (moveType) this.#executeCannonMovement(moveType);
   }

   #executeCannonMovement(direction) {
      const player = this.#players[this.#turnController.activePlayerId];
      if (player.moveSteps > 0) {
         const moveDistance = 100;
         const multiplier = (direction === 'left') ? -1 : 1;
         const candidateX = player.targetX + (this.#getPlayerTangent().x * moveDistance * multiplier);
         const slopeAngle = this.#terrain.getSlopeAngleAt(candidateX);

         if (slopeAngle <= Match.#MAX_CANNON_SLOPE_ANGLE) {
            player.setTargetX(candidateX, this.#width);
            player.moveSteps -= 1;
            this.#controlPanel.setMoveSteps(player.moveSteps);
         }
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

   #isAIPlayerTurn() { return this.#turnController.activePlayerId === 1 }

   #inputActive() {
      return !this.#isAIPlayerTurn() && this.#physicsDone() && !this.#pendingTurnAdvance;
   }

   #stopPlayerAtSteepSlope(player, follow) {
      if (abs(player.targetX - player.position.x) < 0.5) return;

      const nextX = lerp(player.position.x, player.targetX, follow);
      const slopeAngle = this.#terrain.getSlopeAngleAt(nextX);

      if (slopeAngle > Match.#MAX_CANNON_SLOPE_ANGLE) {
         player.setTargetX(player.position.x, this.#width);
      }
   }

   //get the normalized tangent of player in order to decide moving or not
   #getPlayerTangent(){
      let player = this.#players[this.#turnController.activePlayerId]
      let sampleOffset = 5;

      let leftY = this.#terrain.getHeightAt(player.position.x - sampleOffset);
      let rightY = this.#terrain.getHeightAt(player.position.x + sampleOffset);

      let dx = sampleOffset * 2;
      let dy = rightY - leftY;

      let tangent = createVector(dx, dy);
      tangent.normalize();

      return tangent;
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
   //Expose internal state for weapon effects
   //All player cannons in the match 
   getPlayers(){
      return this.#players;
   }
   //Controls turn order and turn number
   getTurnController(){
      return this.#turnController;
   }
   //ID of the player who fired the last shot
   getLastShooterId(){
      return this.#lastShooterId;
   }

   #handlePlayerSkip(playerId){
      this.#turnCounter.showSkip(playerId);
   }
}

