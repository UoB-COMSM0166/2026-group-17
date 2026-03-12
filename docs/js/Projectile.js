class Projectile {
    #position;
    #velocity;
    #radius;
    #isActive;
    #impactPosition = createVector(0, 0);
    #isExploding;
    #explosionStartTime;
    #maxExplosionRadius = 50;

    //Added
    #hasAppliedExplosion;

    constructor(muzzlePos, vel, rad) {
        this.#position = muzzlePos;
        this.#velocity = vel;
        this.#radius = rad;
        this.#isActive = true;
        //Added
        this.#hasAppliedExplosion = false;
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
            terrain.getHeightAt(this.#position.x),
            controlPanel.getAltitudeAt(this.#position.x)
        );
        if (this.#position.y >= groundY) {
            this.#isActive = false;
            this.#impactPosition.set(floor(this.#position.x), floor(this.#position.y));
            this.#isExploding = true;
            this.#explosionStartTime = frameCount;
            currentExplosion = new Explosion(
                this.#impactPosition.x,
                this.#impactPosition.y,
                terrain
            );
        }
        else if (this.#position.x <= 0 || this.#position.x >= width) {
            this.#isActive = false;
            turnController.advancePhase();
        }
    }

    drawShotSequence() {
        if (this.#isActive) this.#drawShot();
        else if (this.#isExploding) {
            this.#drawExplosion();
        }
    }
    #drawShot() {
        strokeWeight(2);
        stroke('whitesmoke');
        fill('snow');
        circle(this.#position.x, this.#position.y, this.#radius);
    }
    #drawExplosion() {
        let age = frameCount - this.#explosionStartTime;
        let progress = constrain(map(age, 0, this.#maxExplosionRadius, 0, 1), 0, 1);
        let explosionRadius = this.#maxExplosionRadius * progress;
        if (explosionRadius >= this.#maxExplosionRadius) {
            this.#isExploding = false;
            terrain.applyExplosion(this.#impactPosition, this.#maxExplosionRadius);
            turnController.advancePhase();
            return;
        }
        stroke('orange');
        fill('yellow');
        circle(this.#impactPosition.x, this.#impactPosition.y, explosionRadius);
    }

    get position() { return this.#position; }
    get vel() { return this.#velocity; }
    get isActive() { return this.#isActive; }
    get isExploding() { return this.#isExploding; }
    set isActive(truthVal) { this.#isActive = truthVal; }
    get hasAppliedExplosion() { return this.#hasAppliedExplosion; }
    set hasAppliedExplosion(val) { this.#hasAppliedExplosion = val; }
}