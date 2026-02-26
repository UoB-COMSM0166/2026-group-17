class HUD {
    constructor(gameRef) {
        this.game = gameRef;

        this.angleDial = new Dial(95, 95, 55, 0, 90, 30, "ANGLE");
        this.powerDial = new Dial(230, 95, 55, 0, 100, 60, "POWER");

        this.fireBtn = new Button(335, 68, 120, 54, "FIRE");
        this.windBtn = new Toggle(335, 132, 120, 44, "WIND", false);

        this.activeControl = null;
    }

    render() {
        push();
        noStroke();
        fill(30);
        rect(20, 20, 460, 170, 14);
        pop();

        this.angleDial.render();
        this.powerDial.render();

        const a = this.game.tank.weapon.angleDeg().toFixed(0);
        const p = this.game.tank.weapon.power().toFixed(0);

        fill(255);
        textAlign(LEFT, CENTER);
        textSize(14);
        text(`Angle: ${a}°`, 20, 210);
        text(`Power: ${p}`, 120, 210);

        text(`Score (profit): ${this.game.score}`, 220, 210);
        if (this.game.windEnabled) text(`Wind: ${this.game.wind.toFixed(2)}`, 420, 210);

        this.fireBtn.render();
        this.windBtn.set(this.game.windEnabled);
        this.windBtn.render();
    }

    onMousePressed() {
        if (this.angleDial.hit(mouseX, mouseY)) this.activeControl = this.angleDial;
        else if (this.powerDial.hit(mouseX, mouseY)) this.activeControl = this.powerDial;
        else this.activeControl = null;

        if (this.fireBtn.hit(mouseX, mouseY)) this.game.fire();
        if (this.windBtn.hit(mouseX, mouseY)) this.game.windEnabled = !this.game.windEnabled;
    }

    onMouseDragged() {
        if (this.activeControl) this.activeControl.onDrag(mouseX, mouseY);
    }

    onMouseReleased() {
        this.activeControl = null;
    }
}