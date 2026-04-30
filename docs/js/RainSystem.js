class RainSystem {

    constructor() {
        this.intensity = 0;
        this.isActive = false;

        this.drops = [];
        this.splashes = [];

        this.newTurn();
    }

    newTurn() {
        this.intensity = random(0.3, 1.2);
    }

    applyTo(projectile, dt) {
        if (!this.isActive) return;
        // rain drag
        projectile.velocity.y += this.intensity * 15 * dt;
        // slight air resistance
        projectile.velocity.mult(0.995);
    }

    draw(terrain) {
        if (!this.isActive) return;
        push();
        let level = this.getRainLevel();
        if (level === "Light") fill(0, 150, 255);
        if (level === "Medium") fill(255, 150, 0);
        if (level === "Heavy") fill(255, 60, 60);

        textSize(26);
        textStyle(BOLD);
        text(
            "Rain: " + this.intensity.toFixed(2) + " (" + level + ")",
            width * 0.15,
            40
        );
        pop();
        this.drawDrops(terrain);
        this.drawSplashes();
    }

    drawDrops(terrain) {

        if (frameCount % 2 === 0) {
            this.drops.push({
                x: random(width),
                y: random(-50, 0),
                speed: random(8, 12),
                splash: false
            });
        }

        for (let d of this.drops) {

            d.y += d.speed;

            let groundY = terrain.getHeightAt(d.x);

            if (d.y >= groundY && !d.splash) {
                this.spawnSplash(d.x, groundY);
                d.splash = true;
            }

            stroke(180, 200, 255, 180);
            line(d.x, d.y, d.x, d.y + 10);
        }

        this.drops = this.drops.filter(d => !d.splash && d.y < height);
    }

    spawnSplash(x, y) {
        this.splashes.push({
            x: x,
            y: y,
            life: 10
        });
    }

    drawSplashes() {

        for (let s of this.splashes) {
            stroke(200, 220, 255, s.life * 20);
            line(s.x - 2, s.y, s.x - 4, s.y - 3);
            line(s.x + 2, s.y, s.x + 4, s.y - 3);
            s.life--;
        }
        this.splashes = this.splashes.filter(s => s.life > 0);
    }
    getRainLevel() {
        if (this.intensity < 0.9) {
            return "Light";
        }
        else if (this.intensity < 1.3) {
            return "Medium";
        }
        else {
            return "Heavy";
        }
    }
}