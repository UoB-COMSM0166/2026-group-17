class Projectile {
    #position;
    #velocity;
    #radius;
    #isActive;
    #impactPosition;
    #isExploding;
    #explosionStartTime;
    #maxExplosionRadius = 50;
    #weaponId;
    #hasSplit = false;
    #hasShattered = false;
    //Added
    #hasAppliedExplosion;

    constructor(muzzlePos, vel, rad, weaponId = "ball") {
        this.#position = muzzlePos;
        this.#velocity = vel;
        this.#radius = rad;
        this.#isActive = true;
        this.#weaponId = weaponId;
    }

    updatePhysics(dt) {
        if (this.#isExploding) return;
        this.#velocity.add(gravity.copy().mult(dt));
        // add wind
        if (typeof wind !== "undefined") {
            //add dt
            wind.applyTo(this, dt);
        }
        this.#position.add(this.#velocity.copy().mult(dt));
        //new:using real terrain height for collision detection
        const groundY = min(
            height - terrain.getHeightAt(this.#position.x),
            controlPanel.getAltitudeAt(this.#position.x)
        );
        if (this.#weaponId === "star" && !this.#hasSplit) {
            if (this.#velocity.y > 0) { // 到达顶点
                this.#hasSplit = true;
                for (let i = 0; i < 8; i++) {
                    // 只朝“前方半边”散开，避免炸到自己
                    let a;
                    let spawnX;
                    let spawnY = this.#position.y - 8;

                    if (lastShooterId === 0) {
                        // 左边炮：只往右边散
                        a = random(-55, 55);
                        spawnX = this.#position.x + 18;
                    } else {
                        // 右边炮：只往左边散
                        a = random(125, 235);
                        spawnX = this.#position.x - 18;
                    }
                    let vel = p5.Vector.fromAngle(radians(a)).mult(random(260, 340));
                    secondaryShots.push(
                        new Projectile(
                            createVector(spawnX, spawnY),
                            vel,
                            3,
                            "starFragment"
                        )
                    );
                }
                this.#isActive = false;
                this.#isExploding = false;
                return;
            }
        }
        if (this.#position.y >= groundY) {
            this.#isActive = false;
            this.#impactPosition = this.#position.copy();
            if (this.#weaponId === "pineapple") {
                const hitX = this.#impactPosition.x;
                const cloudY = groundY - 8;
                poisonClouds.push(
                    new PoisonCloud(hitX, cloudY, lastShooterId)
                );
                this.#isExploding = false;
                this.#explosionStartTime = 0;
                return;
            }
            if (this.#weaponId === "shiba") {
                const impactX = this.#impactPosition.x;
                const impactY = this.#impactPosition.y;
                const targetId = 1 - lastShooterId;
                const target = players[targetId];
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
                        const launchStrength = lerp(10, 22, factor);
                        const craterRadius = lerp(18, 46, factor);
                        target.startShibaLaunch(launchStrength, craterRadius);
                        const score = Math.round(10 + factor * 160);
                        if (lastShooterId === 0) scoreBoard.score1 += score;
                        else scoreBoard.score2 += score;

                        floatingScores.push(
                            new FloatingScore(
                                players[lastShooterId].positionVector.x,
                                players[lastShooterId].positionVector.y - 60,
                                +score,
                                color(255, 160, 80)
                            )
                        );

                        shibaImpacts.push(
                            new ShibaImpactEffect(impactX, impactY, factor)
                        );
                        triggerShake(8, 7);
                    } else {
                        shibaImpacts.push(
                            new ShibaImpactEffect(impactX, impactY, 0.35)
                        );
                    }
                }
                this.#isExploding = false;
                this.#explosionStartTime = 0;
                turnController.advancePhase();
                return;
            }
            this.#isExploding = true;
            this.#explosionStartTime = frameCount;
            if (this.#weaponId === "starFragment") {
                const fakeExplosion = {
                    x: this.#impactPosition.x,
                    y: this.#impactPosition.y,
                    maxRadius: 45,
                    kind: "star"
                };
                const { enemy } = scoreCalculator.calculateExplosionScore(
                    fakeExplosion,
                    players,
                    lastShooterId
                );
                if (enemy > 0) {
                    if (lastShooterId === 0) scoreBoard.score1 += enemy;
                    else scoreBoard.score2 += enemy;

                    floatingScores.push(new FloatingScore(
                        players[lastShooterId].positionVector.x,
                        players[lastShooterId].positionVector.y - 60,
                        +enemy,
                        color(255, 220, 0)
                    ));
                }
            }
            currentExplosion = new Explosion(
                this.#impactPosition.x,
                this.#impactPosition.y,
                terrain,
                this.#weaponId
            );
        }
        else if (this.#position.x <= 0 || this.#position.x >= width) {
            this.#isActive = false;

            const mainWeapons = ["ball"];

            if (mainWeapons.includes(this.#weaponId)) {
                turnController.advancePhase();
            }
        }
    }

    drawShotSequence() {
        //console.log("Projectile state:", {   // debugging code
        //    isActive: this.#isActive,
        //    isExploding: this.#isExploding,
        //});
        if (this.#isActive) this.#drawShot();
        else if (this.#isExploding) {
            this.#drawExplosion();
        }
    }

    #drawShot() {
        if (this.#weaponId === "ball" || typeof weaponSystem === "undefined") {
            strokeWeight(2);
            stroke('whitesmoke');
            fill('snow');
            circle(this.#position.x, this.#position.y, this.#radius);
            return;
        }
        let weapon = weaponSystem.weaponData[this.#weaponId];
        if (!weapon && this.#weaponId === "starFragment") {
            weapon = weaponSystem.weaponData["star"];
        }
        if (!weapon && this.#weaponId === "pineappleShard") {
            weapon = weaponSystem.weaponData["pineapple"];
        }
        if (!weapon || !weapon.sprite) {
            strokeWeight(2);
            stroke('whitesmoke');
            fill('snow');
            circle(this.#position.x, this.#position.y, this.#radius);
            return;
        }
        const angle = degrees(Math.atan2(this.#velocity.y, this.#velocity.x));
        push();
        imageMode(CENTER);
        translate(this.#position.x, this.#position.y);
        rotate(angle);
        const w = weapon.drawWidth || 54;
        const h = weapon.drawHeight || 54;
        image(weapon.sprite, 0, 0, w, h);
        pop();
    }

    #drawExplosion() {
        if (!this.#impactPosition) return;
        let age = frameCount - this.#explosionStartTime;
        let progress = constrain(
            map(age, 0, this.#maxExplosionRadius, 0, 1),
            0, 1
        );
        let r = this.#maxExplosionRadius * progress;
        if (r >= this.#maxExplosionRadius) {
            this.#isExploding = false;
            terrain.applyExplosion(this.#impactPosition, this.#maxExplosionRadius);
            const mainWeapons = ["ball", "pineapple", "shiba"];
            if (mainWeapons.includes(this.#weaponId)) {
                turnController.advancePhase();
            }
            return;
        }
        let x = this.#impactPosition.x;
        let y = this.#impactPosition.y;

        // cannonball
        if (this.#weaponId === "ball") {
            stroke('orange');
            fill('yellow');
            circle(x, y, r);
        }

        // pineapple
        else if (this.#weaponId === "pineapple") {
            noStroke();

            fill(160, 80, 220, 80);
            circle(x, y, r * 1.6);

            fill(90, 220, 120, 120);
            circle(x, y, r * 1.1);

            fill(255, 240, 120, 180);
            circle(x, y, r * 0.5);

            stroke(180, 255, 120, 180);
            strokeWeight(2);

            line(x, y - r * 0.8, x, y - r * 1.1);
            line(x, y + r * 0.8, x, y + r * 1.1);
            line(x - r * 0.8, y, x - r * 1.1, y);
            line(x + r * 0.8, y, x + r * 1.1, y);

            line(x - r * 0.55, y - r * 0.55, x - r * 0.9, y - r * 0.9);
            line(x + r * 0.55, y - r * 0.55, x + r * 0.9, y - r * 0.9);
            line(x - r * 0.55, y + r * 0.55, x - r * 0.9, y + r * 0.9);
            line(x + r * 0.55, y + r * 0.55, x + r * 0.9, y + r * 0.9);
        }

        // star
        else if (this.#weaponId === "star" || this.#weaponId === "starFragment") {
            noStroke();
            fill(255, 230, 90, 160);
            circle(x, y, r * 1.3);

            fill(255, 255, 255, 180);
            circle(x, y, r * 0.4);

            push();
            translate(x, y);
            beginShape();

            for (let i = 0; i < 10; i++) {
                let ang = -HALF_PI + i * PI / 5;
                let rr = i % 2 === 0 ? r : r * 0.45;
                vertex(cos(ang) * rr, sin(ang) * rr);
            }
            endShape(CLOSE);
            pop();
        }

        // shiba
        else if (this.#weaponId === "shiba") {
            noStroke();
            fill(180, 120, 80, 120);
            circle(x, y, r * 1.4);

            fill(255, 140, 90, 180);
            circle(x, y, r * 0.8);

            stroke(255, 80, 80);
            strokeWeight(3);

            line(x - r * 0.6, y, x + r * 0.6, y);
            line(x, y - r * 0.5, x, y + r * 0.5);

        }
    }
    get position() { return this.#position; }
    get vel() { return this.#velocity; }
    get isActive() { return this.#isActive; }
    get isExploding() { return this.#isExploding; }
    get weaponId() { return this.#weaponId; }
    set isActive(truthVal) { this.#isActive = truthVal; }

    //Added
    get hasAppliedExplosion() { return this.#hasAppliedExplosion; }
    set hasAppliedExplosion(val) { this.#hasAppliedExplosion = val; }
}