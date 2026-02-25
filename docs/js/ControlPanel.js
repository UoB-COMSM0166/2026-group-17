class ControlPanel {
    #altitude = height * 0.25;
    #backgroundColor;
    #angleDial;
    #shootButton;
    #powerAdjust;
    constructor(bgColor) {
        this.#backgroundColor = bgColor;
        this.#angleDial = new AngleDialWidget(createVector(width / 6, height - this.#altitude / 2));
        this.#shootButton = new ShootButton();
        this.#powerAdjust = new PowerAdjustWidget();
    }

    drawCtrlPanel() {
        this.#drawBackground();
        this.#angleDial.drawAngleDial();
        this.#shootButton.drawButton();
        this.#powerAdjust.drawPowerAdjust();
    }

    get altitude() { return this.#altitude; }
    get angleDial() { return this.#angleDial; }
    get powerAdjust() { return this.#powerAdjust; }

    #drawBackground() {
        fill(this.#backgroundColor);
        rectMode(CORNER);
        rect(0, height - this.#altitude, width, this.#altitude);
    }
    get altitude() {
        return this.#altitude;
    }
    get angleDial() {
        return this.#angleDial
    }
}