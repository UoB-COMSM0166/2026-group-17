class WindSystem {
    constructor() {
        this.windForce = 0;
        this.dragCoefficient = 0.0001;

        this.isActive = false;
        this.particles = [];

        this.newTurn();
    }

    newTurn() {
        this.windForce = random(-3, 3);
    }

    applyTo(projectile, dt) {
        if (!this.isActive) return;
        let windEffect = this.windForce * 50;

        projectile.vel.x += windEffect * dt;

        let speed = projectile.vel.mag();
        if (speed > 0) {
            let dragMag = this.dragCoefficient * speed * speed;
            let dragVec = projectile.vel.copy();
            dragVec.normalize();
            dragVec.mult(-dragMag * dt);
            projectile.vel.add(dragVec);
        }
    }
    draw() {

        if (!this.isActive) return;

        push();
        fill(255);
        textSize(16);
        text("Wind: " + this.windForce.toFixed(2), 50, 30);
        pop();

        this.drawParticles();
    }

    drawParticles() {

        if (frameCount % 3 === 0) {
            this.particles.push({
                x: random(width),
                y: random(0, height - controlPanel.altitude)
            });
        }

        for (let p of this.particles) {

            p.x += this.windForce * 10;

            fill(255, 120);
            noStroke();
            ellipse(p.x, p.y, 4, 2);
        }

        this.particles = this.particles.filter(p =>
            p.x > -20 && p.x < width + 20
        );
    }
}