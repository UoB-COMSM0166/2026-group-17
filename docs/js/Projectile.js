class Projectile {
    #position;
    #velocity;
    #radius;
    #isActive;
    #impactPosition;
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
        this.#position.add(this.#velocity.copy().mult(dt));
        if (this.#position.y >= height - controlPanel.altitude) {
            this.#isActive = false;
             let groundY = height - controlPanel.altitude;

         this.#impactPosition = createVector(this.#position.x, groundY);
    this.#isExploding = true;
    this.#explosionStartTime = frameCount;
    currentExplosion = new Explosion(
        this.#impactPosition.x,
        this.#impactPosition.y,
        terrain
    );
}

        //TestExplosion
        else if (terrain.isColliding(this.#position.x, this.#position.y)) {

    this.#isActive = false;
    let groundHeight = terrain.getHeightAt(this.#position.x);
    let groundY = height - groundHeight;
    this.#impactPosition = createVector(this.#position.x, groundY);
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
    get isActive() { return this.#isActive; }
    get isExploding() { return this.#isExploding; }
    set isActive(truthVal) { this.#isActive = truthVal; }
    //Added
    get hasAppliedExplosion(){ return this.#hasAppliedExplosion;}
    set hasAppliedExplosion(val){ this.#hasAppliedExplosion = val;}
}