//for weapon inventory management and display

class WeaponInventory {
    #positionVector;
    #isExpanded = false;
    #currentWeapon = 0;
    #weaponsCount = 5;
    #weaponBoxHeight = 64;
    #weaponBoxWidth = 64;
    #gap = 10;
    #plateOutlineColor;
    weapons = [];
    
    constructor(posV = createVector(width / 3, height - height / 5), plateOutColor = color('teal')) {
        this.#positionVector = posV;
        this.#plateOutlineColor = plateOutColor;
    }


    // array of weapon and number of weapons in loadout
    setWeaponLoadouts(loadouts = []) {
        this.weapons = Array.isArray(loadouts) ? loadouts : [];
        this.#weaponsCount = max(this.weapons.length, 1);
        if (this.weapons.length === 0) this.#currentWeapon = 0;
        else this.#currentWeapon = constrain(this.#currentWeapon, 0, this.weapons.length - 1);
    }

    //set the current weapon index to dispaly in the inventory, default is the first weapon
    setCurrentWeaponIndex(index = 0) {
        if (this.weapons.length === 0) {
            this.#currentWeapon = 0;
            return;
        }
        this.#currentWeapon = constrain(index, 0, this.weapons.length - 1);
    }

    get currentWeaponIndex() { return this.#currentWeapon; }

    drawInventory(baseAltitude = height * 0.25) {
        const { rectWidth, rectHeight } = this.#getInventoryRect(baseAltitude);
        const activeWeapon = this.weapons[this.#currentWeapon];

        push();
        rectMode(CENTER);
        fill(28, 42, 60, 235);
        stroke(120, 220, 255);
        strokeWeight(this.#isExpanded ? 3 : 2);
        rect(this.#positionVector.x, this.#positionVector.y, rectWidth, rectHeight, 10);
        textAlign(CENTER, CENTER);
        fill('white');
        noStroke();
        textSize(16);
        text(activeWeapon?.name || "No Weapon",
             this.#positionVector.x + this.#gap * 3, this.#positionVector.y);

        push();
        rectMode(CORNER);
        ellipseMode(RADIUS);
        activeWeapon?.drawIcon?.(this.#positionVector.x - this.#gap * 6, this.#positionVector.y, 12);
        pop();
        pop();

        if(this.#isExpanded) {
            this.#drawWeaponPicker(baseAltitude);
        }
    }

    #drawWeaponPicker(baseAltitude) {
        const pickerWidth =
            this.#weaponBoxWidth * this.#weaponsCount + this.#gap * (this.#weaponsCount - 1) + 20;
        const pickerHeight = this.#weaponBoxHeight + this.#gap * 2 + 18;
        const pickerY = this.#positionVector.y - baseAltitude / 2;

        push();
        rectMode(CENTER);
        fill(25, 40, 60, 235);
        stroke(this.#plateOutlineColor);
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
            const isSelected = i === this.#currentWeapon;
            const isHovered = this.#contains(mouseX, mouseY, boxX, boxY, this.#weaponBoxWidth, this.#weaponBoxHeight);

            fill(isHovered ? color(255, 243, 204) : (isSelected ? color(220, 245, 255) : color(240, 248, 255)));
            stroke(isHovered ? color(255, 170, 50) : (isSelected ? color(0, 220, 255) : color(40, 80, 110)));
            strokeWeight(isHovered ? 3 : (isSelected ? 3 : 1));
            if (isHovered) {
                drawingContext.shadowBlur = 12;
                drawingContext.shadowColor = 'rgba(255, 170, 50, 0.55)';
            }
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

            fill(isHovered ? color(255, 236, 186) : color(225, 235, 245));
            noStroke();
            rect(boxX, boxY, this.#weaponBoxWidth - 10, this.#weaponBoxHeight - 10, 6);

            push();
            rectMode(CORNER);
            ellipseMode(RADIUS);
            const iconSize = 40;
            weapon?.drawIcon?.(boxX, boxY, iconSize);
            pop();

            drawingContext.restore();
            drawingContext.shadowBlur = 0;
            pop();
        }

        pop();
    }

    handleMousePressed(baseAltitude = height * 0.25) {
        const { rectWidth, rectHeight } = this.#getInventoryRect(baseAltitude);
        if (this.#contains(mouseX, mouseY, this.#positionVector.x, this.#positionVector.y, rectWidth, rectHeight)) {
            this.#isExpanded = !this.#isExpanded;
            return { handled: true, selectedIndex: null };
        }

        if (this.#isExpanded) {
            for (let i = 0; i < this.weapons.length; i++) {
                const box = this.#getWeaponBoxRect(i, baseAltitude);
                if (this.#contains(mouseX, mouseY, box.x, box.y, box.w, box.h)) {
                    this.#currentWeapon = i;
                    this.#isExpanded = false;
                    return { handled: true, selectedIndex: i };
                }
            }
            this.#isExpanded = false;
            return { handled: true, selectedIndex: null };
        }

        return { handled: false, selectedIndex: null };
    }

    #getInventoryRect(baseAltitude) {
        return { rectWidth: width / 6, rectHeight: MovePadWidget.BOARD_HEIGHT };
    }

    #getWeaponBoxRect(index, baseAltitude) {
        const pickerWidth =
            this.#weaponBoxWidth * this.#weaponsCount + this.#gap * (this.#weaponsCount - 1) + 20;
        const pickerY = this.#positionVector.y - baseAltitude / 2;
        const startX =
            this.#positionVector.x -
            (this.weapons.length * this.#weaponBoxWidth + (this.weapons.length - 1) * this.#gap) / 2 +
            this.#weaponBoxWidth / 2;
        return {
            x: startX + index * (this.#weaponBoxWidth + this.#gap),
            y: pickerY + 8,
            w: this.#weaponBoxWidth,
            h: this.#weaponBoxHeight,
            pickerWidth
        };
    }

    #contains(mx, my, cx, cy, w, h) {
        return (
            mx > cx - w / 2 &&
            mx < cx + w / 2 &&
            my > cy - h / 2 &&
            my < cy + h / 2
        );
    }
}
