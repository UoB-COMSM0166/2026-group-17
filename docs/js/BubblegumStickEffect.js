class BubblegumStickEffect {
    constructor(target){
        this.target = target;
        this.life = 999;
        this.finished = false;
    }

    update(){
        if(!this.target.isStunned){
            this.finished = true;
        }
    }

    draw(){
        const x = this.target.positionVector.x;
        const y = this.target.y;

        push();
        noStroke();
        fill(255, 100, 200, 180);

        ellipse(x, y - 10, 30, 20);
        ellipse(x + 10, y, 20, 15);
        ellipse(x - 10, y, 20, 15);

        pop();
    }
}