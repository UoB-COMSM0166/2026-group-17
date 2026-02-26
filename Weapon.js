class Weapon {
    constructor(tank) {
        this.tank = tank;
        this._angleDeg = 30;
        this._power = 60;
        this.barrelLen = 70;
    }

    setAngle(deg) { this._angleDeg = constrain(deg, 0, 90); }
    setPower(p) { this._power = constrain(p, 0, 100); }

    angleDeg() { return this._angleDeg; }
    power() { return this._power; }

    getPivotWorldPos() {
        return { x: this.tank.x, y: this.tank.y - 20 };
    }

    getMuzzleWorldPos() {
        const pivot = this.getPivotWorldPos();
        const a = radians(-this._angleDeg);
        return { x: pivot.x + cos(a) * this.barrelLen, y: pivot.y + sin(a) * this.barrelLen };
    }

    getMuzzleVelocity() {
        const speed = map(this._power, 0, 100, 0, 18);
        const a = radians(-this._angleDeg);
        return { vx: cos(a) * speed, vy: sin(a) * speed };
    }

    render() {
        const pivot = this.getPivotWorldPos();
        const a = radians(-this._angleDeg);

        push();
        translate(pivot.x, pivot.y);
        rotate(a);

        stroke(180);
        strokeWeight(10);
        line(0, 0, this.barrelLen, 0);

        stroke(120);
        strokeWeight(6);
        line(0, 0, this.barrelLen, 0);

        noStroke();
        fill(210);
        ellipse(this.barrelLen, 0, 16, 16);
        fill(40);
        ellipse(this.barrelLen, 0, 8, 8);

        pop();
    }
}