class WeaponInventory {
    #positionVector;
    #isExpanded = false;
    weapons = [];
    weaponsCOUNT = 5;
    
    constructor(posV = createVector(width / 3, height - height / 6)) {
        this.#positionVector = posV;
        //this.weapons = weapons;
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
        text("Weapon", this.#positionVector.x, this.#positionVector.y);
        pop();

        if(this.#isExpanded) {
            this.#drawWeaponPicker();
        }
    }

    #drawWeaponPicker(){
        push();
        rectMode(CENTER);
        fill('green');
        stroke('red');
        strokeWeight(2);
        rect(this.#positionVector.x, this.#positionVector.y - controlPanel.baseAltitude, width / 6, controlPanel.baseAltitude);
        textAlign(CENTER, CENTER);
        fill('white');
        noStroke();
        text("Weapon Picker", this.#positionVector.x, this.#positionVector.y - controlPanel.baseAltitude / 2);
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
        
    }
    
}