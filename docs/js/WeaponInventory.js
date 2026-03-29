class WeaponInventory {
    #positionVector;
    #isExpanded = false;
    #isPicked = false;
    weapons = [];
    #currentWeapon = 0;
    #weaponsCount = 5;
    #weaponBoxHeight = 64;
    #weaponBoxWidth = 64;
    #gap = 10;
    
    constructor(posV = createVector(width / 3, height - height / 6)) {
        this.#positionVector = posV;
    }

    setWeaponLoadouts(loadouts = []) {
        this.weapons = Array.isArray(loadouts) ? loadouts : [];
        this.#weaponsCount = Math.max(this.weapons.length, 1);
    }

    drawInventory() {
        push();
        rectMode(CENTER);
        fill('lightgray');
        stroke('gray');
        strokeWeight(2);
        rect(this.#positionVector.x, this.#positionVector.y, width / 6, controlPanel.baseAltitude / 2);
        textAlign(CENTER, CENTER);
        fill('white');
        noStroke();
        textSize(16);
        text(this.weapons[this.#currentWeapon]?.name || "No Weapon",
             this.#positionVector.x + this.#gap * 2, this.#positionVector.y);
        push();
        rectMode(CORNER);
        ellipseMode(RADIUS);
        this.weapons[this.#currentWeapon]?.drawIcon?.(this.#positionVector.x - this.#gap * 6, this.#positionVector.y, 12);
        pop();
        pop();

        if(this.#isExpanded) {
            this.#drawWeaponPicker();
        }
    }

    #drawWeaponPicker() {
        const pickerWidth =
            this.#weaponBoxWidth * this.#weaponsCount + this.#gap * (this.#weaponsCount - 1) + 20;
        const pickerHeight = this.#weaponBoxHeight + this.#gap * 2 + 18;
        const pickerY = this.#positionVector.y - controlPanel.baseAltitude / 2;

        push();
        rectMode(CENTER);
        fill(25, 40, 60, 235);
        stroke(120, 220, 255);
        strokeWeight(2);
        rect(this.#positionVector.x, pickerY, pickerWidth, pickerHeight, 10);


        if (this.weapons.length === 0) {
            fill(220);
            text("No weapons", this.#positionVector.x, pickerY + 8);
            pop();
            return;
        }

        const startX =
            this.#positionVector.x -
            (this.weapons.length * this.#weaponBoxWidth + (this.weapons.length - 1) * this.#gap) / 2 +
            this.#weaponBoxWidth / 2;
        const boxY = pickerY + 8;

        for (let i = 0; i < this.weapons.length; i++) {
            const weapon = this.weapons[i];
            const boxX = startX + i * (this.#weaponBoxWidth + this.#gap);

            fill(240, 248, 255);
            stroke(40, 80, 110);
            rect(boxX, boxY, this.#weaponBoxWidth, this.#weaponBoxHeight, 8);

            push();
            drawingContext.save();
            drawingContext.beginPath();
            drawingContext.roundRect(
                boxX - this.#weaponBoxWidth / 2 + 4,
                boxY - this.#weaponBoxHeight / 2 + 4,
                this.#weaponBoxWidth - 8,
                this.#weaponBoxHeight - 8,
                8
            );
            drawingContext.clip();

            fill(225, 235, 245);
            noStroke();
            rect(boxX, boxY, this.#weaponBoxWidth - 10, this.#weaponBoxHeight - 10, 6);

            push();
            rectMode(CORNER);
            ellipseMode(RADIUS);
            weapon?.drawIcon?.(boxX, boxY, 12);
            pop();

            drawingContext.restore();
            pop();
        }

        pop();
    }

    handleMousePressed() {
        const rectWidth = width / 6;
        const rectHeight = controlPanel.baseAltitude / 2;
        if (mouseX > this.#positionVector.x - rectWidth / 2 && 
            mouseX < this.#positionVector.x + rectWidth / 2 &&
            mouseY > this.#positionVector.y - rectHeight / 2 && 
            mouseY < this.#positionVector.y + rectHeight / 2) {
                this.#isExpanded = !this.#isExpanded;
        }

        if(this.#isExpanded == true) {
            for (let i = 0; i < this.weapons.length; i++) {
                
            }
        }
        
    }
    
}
