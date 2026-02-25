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

    applyTo(projectile) {

        if (!this.isActive) return;

        projectile.vel.x += this.windForce;

        let speed = projectile.vel.mag();
        let dragMagnitude = this.dragCoefficient * speed * speed;

        let drag = projectile.vel.copy();
        drag.normalize();
        drag.mult(-dragMagnitude);

        projectile.vel.add(drag);
    }

    draw() {

        if (!this.isActive) return;

        push();
        fill(255);
        textSize(16);
        text("Wind: " + this.windForce.toFixed(2), 20, 30);
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