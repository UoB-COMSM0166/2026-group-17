class EarthquakeSystem {
    constructor(shakeCallback = null) {
        this.isActive = false;
        this.intensity = 0;
        this.shakeCallback = shakeCallback;
    }

    newTurn() {
        this.intensity = random(0.6, 1.4);
    }
    applyTo(projectile, dt) {
        if (!this.isActive) return;
        projectile.vel.x += random(-0.6, 0.6) * this.intensity;
    }

    draw() {
        if (!this.isActive) return;
        if (this.shakeCallback) {
            this.shakeCallback(2, this.intensity * 6);
        }

        push();
        fill(255, 80, 80);
        textSize(26);
        textStyle(BOLD);
        text(
            "Earthquake: " + this.intensity.toFixed(2),
            160,
            40
        );
        pop();
    }
}