class Projectile {
    constructor(x, y, vx, vy) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;

        this.r = 8;
        this.dead = false;
        this.justHitGround = false;
    }

    update(wind, groundY) {
        this.justHitGround = false;

        this.vy += 0.35;
        this.vx += wind * 0.02;

        this.x += this.vx;
        this.y += this.vy;

        if (this.y + this.r >= groundY) {
            this.y = groundY - this.r;
            this.dead = true;
            this.justHitGround = true;
        }

        if (this.x < -200 || this.x > width + 200 || this.y < -300) {
            this.dead = true;
        }
    }

    render() {
        push();
        translate(this.x, this.y);

        noStroke();
        fill(170, 0, 220);
        ellipse(0, 0, this.r * 2, this.r * 2);

        fill(255, 180);
        ellipse(-3, -3, 4, 4);

        pop();
    }
}