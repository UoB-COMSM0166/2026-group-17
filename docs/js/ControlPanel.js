class ControlPanel {
    #altitude = height * 0.25;
    #backgroundColor;
    #angleDial;
    #shootButton;
    #powerAdjust;
    #movePad;
    constructor(bgColor) {
        this.#backgroundColor = bgColor;
        this.#angleDial = new AngleDialWidget(createVector(width / 6, height - this.#altitude / 2));
        this.#shootButton = new ShootButton();
        this.#powerAdjust = new PowerAdjustWidget();
        this.#movePad = new MovePadWidget();
    }

    drawCtrlPanel() {
        this.#drawBackground();
        
        push();
        beginShape();

        stroke(250, 180);
        strokeWeight(2);
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = 'rgb(232, 237, 238)';
        fill(25, 240);
        vertex(0, height - 2);
        vertex(width * 0.08, height - this.#altitude);
        vertex(width * 0.11, height - this.#altitude * 1.2);
        vertex(width * 0.25, height - this.#altitude * 1.2);
        vertex(width * 0.25 + 10, height - this.#altitude * 1.2 + 10);
        vertex(width * 0.75 - 10, height - this.#altitude * 1.2 + 10);
        vertex(width * 0.75, height - this.#altitude * 1.2);
        vertex(width * 0.89, height - this.#altitude * 1.2);
        vertex(width * 0.92, height - this.#altitude);
        vertex(width, height - 2);
        vertex(width * 0.67, height - 2);
        vertex(width * 0.67 - 30, height - 30);
        vertex(width * 0.33 + 30, height - 30);
        vertex(width * 0.33, height - 2);

        endShape(CLOSE);
        pop();

        push();
        strokeWeight(6);
        stroke(0,245,212);
        drawingContext.shadowBlur = 30;
        drawingContext.shadowColor = 'rgb(0, 204, 255)';
        line(width * 0.42, height - 15, width * 0.58, height - 15);
        line(width * 0.37, height - this.#altitude * 1.2 + 10, width * 0.63, height - this.#altitude * 1.2 + 10);
        line(width * 0.16, height - this.#altitude * 1.2, width * 0.20, height - this.#altitude * 1.2 );
        line(width * 0.80, height - this.#altitude * 1.2, width * 0.84, height - this.#altitude * 1.2 );
        pop();
        
        this.#angleDial.drawAngleDial();
        this.#shootButton.drawButton();
        this.#powerAdjust.drawPowerAdjust();
        this.#movePad.drawMovePad();
    }

    get altitude() { return this.#altitude; }
    get angleDial() { return this.#angleDial; }
    get powerAdjust() { return this.#powerAdjust; }
    get shootButton() { return this.#shootButton; }

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