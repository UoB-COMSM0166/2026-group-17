class Projectile {
    #position;
    #velocity;
    #radius;
    #isActive;
    #impactPosition;
    #isExploding;
    #explosionStartTime;
    #maxExplosionRadius = 50;

    constructor(muzzlePos, vel, rad) {
        this.#position = muzzlePos;
        this.#velocity = vel;
        this.#radius = rad;
        this.#isActive = true;
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
        let groundY = height - terrain.getHeightAt(this.#position.x);
       /* if (this.#position.y >= height - controlPanel.altitude) {
            this.#isActive = false;
            this.#impactPosition = this.#position;
            this.#isExploding = true;
            this.#explosionStartTime = frameCount;
        }
<<<<<<< HEAD
        else if (this.#position.x <= 0 || this.#position.x >= width) this.#isActive = false;
    */
    if (this.#position.y >= groundY) {
        this.#isActive = false;
        this.#impactPosition = this.#position.copy();
        this.#isExploding = true;
        this.#explosionStartTime = frameCount;
        //use applyExplosion method to modify the terrain
        terrain.applyExplosion(this.#impactPosition, this.#maxExplosionRadius);
   }
   else if (this.#position.x <= 0 || this.#position.x >= width) {
        this.#isActive = false;
        turnController.advancePhase();
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
            turnController.advancePhase();
            return;
        }
        stroke('orange');
        fill('yellow');
        circle(this.#impactPosition.x, this.#impactPosition.y, explosionRadius);
    }

    get position() { return this.#position; }
    //because velocity is private
    get vel() { return this.#velocity; }
    get impactPosition() { return this.#impactPosition; }
    get maxExplosionRadius() { return this.#maxExplosionRadius; }
    get isActive() { return this.#isActive; }
    get isExploding() { return this.#isExploding; }
    set isActive(truthVal) { this.#isActive = truthVal; }
}
