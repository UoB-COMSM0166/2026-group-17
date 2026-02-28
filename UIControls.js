class Dial {
    constructor(cx, cy, r, minV, maxV, initialV, label) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.minV = minV;
        this.maxV = maxV;
        this.v = initialV;
        this.label = label;

        this.aStart = radians(225);
        this.aEnd = radians(-45);
    }

    value() { return this.v; }
    setValue(v) { this.v = constrain(v, this.minV, this.maxV); }

    hit(px, py) { return dist(px, py, this.cx, this.cy) <= this.r; }

    onDrag(px, py) {
        const ang = atan2(py - this.cy, px - this.cx);
        let a = ang;

        while (a < this.aEnd) a += TWO_PI;
        while (a > this.aStart) a -= TWO_PI;

        const clamped = constrain(a, this.aEnd, this.aStart);
        const t = map(clamped, this.aEnd, this.aStart, 0, 1);
        const v = lerp(this.minV, this.maxV, t);
        this.setValue(v);
    }

    render() {
        push();
        translate(this.cx, this.cy);

        noStroke();
        fill(40);
        ellipse(0, 0, this.r * 2 + 8, this.r * 2 + 8);

        fill(55);
        ellipse(0, 0, this.r * 2, this.r * 2);

        stroke(255, 80);
        strokeWeight(6);
        noFill();
        arc(0, 0, this.r * 2 - 10, this.r * 2 - 10, this.aEnd, this.aStart);

        const t = map(this.v, this.minV, this.maxV, 0, 1);
        const a = lerp(this.aEnd, this.aStart, t);
        const px = cos(a) * (this.r - 12);
        const py = sin(a) * (this.r - 12);

        stroke(255);
        strokeWeight(4);
        line(0, 0, px, py);

        noStroke();
        fill(230);
        ellipse(0, 0, 10, 10);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(this.label, 0, this.r + 18);

        textSize(13);
        text(`${Math.round(this.v)}`, 0, 0);

        pop();
    }
}

class Button {
    constructor(x, y, w, h, textLabel) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.textLabel = textLabel;
    }

    hit(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    }

    render() {
        const hovering = this.hit(mouseX, mouseY);

        push();
        noStroke();
        fill(hovering ? 90 : 70);
        rect(this.x, this.y, this.w, this.h, 12);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(18);
        text(this.textLabel, this.x + this.w / 2, this.y + this.h / 2);
        pop();
    }
}

class Toggle {
    constructor(x, y, w, h, label, initial) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.label = label;
        this.state = initial;
    }

    set(v) { this.state = !!v; }

    hit(px, py) {
        return px >= this.x && px <= this.x + this.w && py >= this.y && py <= this.y + this.h;
    }

    render() {
        const hovering = this.hit(mouseX, mouseY);

        push();
        noStroke();
        fill(this.state ? 90 : 55);
        if (hovering) fill(this.state ? 105 : 70);
        rect(this.x, this.y, this.w, this.h, 12);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(16);
        text(`${this.label}: ${this.state ? "ON" : "OFF"}`, this.x + this.w / 2, this.y + this.h / 2);
        pop();
    }
}