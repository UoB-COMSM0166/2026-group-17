class ControlPanel {
    #altitude = height * 0.25;
    #backgroundColor;
    #angleDial;
    #shootButton;
    constructor(bgColor) {
        this.#backgroundColor = bgColor;
        this.#angleDial = new AngleDialWidget(createVector(width / 6, height - this.#altitude / 2));
        this.#shootButton = new ShootButton();
    }

    drawCtrlPanel() {
        this.#drawBackground();
        this.#angleDial.drawAngleDial();
        this.#shootButton.drawButton();
    }

<<<<<<< HEAD
=======
    get altitude() { return this.#altitude; }
    get angleDial() { return this.#angleDial; }

>>>>>>> 179dcb5bf8fe382958ada10e247a2614121db903
    #drawBackground() {
        fill(this.#backgroundColor);
        rectMode(CORNER);
        rect(0, height - this.#altitude, width, this.#altitude);
    }
<<<<<<< HEAD
    get altitude() {
        return this.#altitude;
    }
    get angleDial() {
        return this.#angleDial
    }
=======
>>>>>>> 179dcb5bf8fe382958ada10e247a2614121db903
}