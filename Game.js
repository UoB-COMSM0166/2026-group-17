class Game {
    constructor() {
        this.groundY = height - 90;

        this.tank = new Tank(220, this.groundY);
        this.projectiles = [];

        this.ui = new HUD(this);

        this.score = 0;
        this.wind = 0;
        this.windEnabled = false;
    }

    update() {
        if (this.windEnabled) this.wind = sin(frameCount * 0.01) * 1.5;
        else this.wind = 0;

        this.tank.weapon.setAngle(this.ui.angleDial.value());
        this.tank.weapon.setPower(this.ui.powerDial.value());

        for (const p of this.projectiles) p.update(this.wind, this.groundY);
        this.projectiles = this.projectiles.filter(p => !p.dead);

        for (const p of this.projectiles) {
            if (p.justHitGround) {
                const targetX = 780;
                const distToTarget = abs(p.x - targetX);
                const gain = max(0, floor(100 - distToTarget * 0.3));
                this.score += gain;
            }
        }
    }

    render() {
        noStroke();
        fill(35);
        rect(0, this.groundY, width, height - this.groundY);

        this.drawTarget(780, this.groundY);

        this.tank.render();

        for (const p of this.projectiles) p.render();
        this.ui.render();
    }

    drawTarget(x, y) {
        push();
        translate(x, y);
        stroke(255, 200);
        strokeWeight(2);
        line(0, 0, 0, -80);
        noStroke();
        fill(255, 120);
        ellipse(0, -80, 10, 10);
        fill(255, 200);
        textAlign(CENTER, BOTTOM);
        textSize(12);
        text("TARGET", 0, -88);
        pop();
    }

    fire() {
        const muzzle = this.tank.weapon.getMuzzleWorldPos();
        const v = this.tank.weapon.getMuzzleVelocity();
        this.projectiles.push(new Projectile(muzzle.x, muzzle.y, v.vx, v.vy));
    }

    onMousePressed() { this.ui.onMousePressed(); }
    onMouseDragged() { this.ui.onMouseDragged(); }
    onMouseReleased() { this.ui.onMouseReleased(); }
}