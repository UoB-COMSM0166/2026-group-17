class Tank {
    constructor(x, groundY) {
        this.x = x;
        this.groundY = groundY;
        this.y = groundY - 10;
        this.weapon = new Weapon(this);
    }

    render() {
        push();
        translate(this.x, this.y);

        noStroke();
        fill(90);
        rect(-45, -25, 90, 35, 10);

        fill(70);
        rect(-55, 5, 110, 18, 9);

        fill(110);
        ellipse(0, -20, 26, 18);

        pop();

        this.weapon.render();
    }
}