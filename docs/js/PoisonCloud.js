class PoisonCloud {
    constructor(x, y, ownerId) {
        this.x = x;
        this.y = y;
        this.ownerId = ownerId;

        this.baseRadius = 28;
        this.maxRadius = 90;
        this.radius = this.baseRadius;

        this.lifeTime = 3.2; // seconds
        this.age = 0;
        this.finished = false;

        this.damageInterval = 0.45; // every 0.45s deduct score once
        this.damageTimer = 0;

        this.enemyTicked = false;
        this.selfTicked = false;
    }

    update(dt) {
        this.age += dt;
        this.damageTimer += dt;

        // grow first, then hold, then fade
        const growProgress = min(this.age / 0.8, 1);
        this.radius = lerp(this.baseRadius, this.maxRadius, growProgress);

        if (this.age >= this.lifeTime) {
            this.finished = true;
        }
    }

    affectsPlayer(player) {
        const d = dist(this.x, this.y, player.positionVector.x, player.positionVector.y);
        return d <= this.radius;
    }

    applyEffect(players, scoreBoard, floatingScores) {
        if (this.damageTimer < this.damageInterval) return;
        this.damageTimer = 0;

        const shooterId = this.ownerId;
        const targetId = 1 - shooterId;

        const shooter = players[shooterId];
        const target = players[targetId];

        if (target && this.affectsPlayer(target)) {
            const d = dist(
                this.x,
                this.y,
                target.positionVector.x,
                target.positionVector.y
            );

            const factor = constrain(1 - d / this.radius, 0, 1);
            const poisonScore = Math.round(8 + factor * 20);
            if (shooterId === 0) scoreBoard.score1 += poisonScore;
            else scoreBoard.score2 += poisonScore;
            floatingScores.push(
                new FloatingScore(
                    players[shooterId].positionVector.x,
                    players[shooterId].positionVector.y - 60,
                    +poisonScore,
                    color(160, 80, 220)
                )
            );

            target.triggerHitFlash(6);
        }
    }

    draw() {
        push();
        noStroke();

        const lifeRatio = 1 - this.age / this.lifeTime;
        const alphaBase = 70 * lifeRatio + 20;

        // outer fog
        for (let i = 0; i < 9; i++) {
            fill(160, 60, 210, alphaBase * 0.55);
            circle(
                this.x + random(-16, 16),
                this.y + random(-10, 10),
                this.radius + random(-18, 18)
            );
        }

        // inner toxic core
        for (let i = 0; i < 5; i++) {
            fill(210, 120, 255, alphaBase * 0.75);
            circle(
                this.x + random(-10, 10),
                this.y + random(-8, 8),
                this.radius * 0.65 + random(-10, 10)
            );
        }

        // bottom haze贴地效果
        fill(120, 40, 150, alphaBase * 0.45);
        ellipse(this.x, this.y + 10, this.radius * 0.95, this.radius * 0.42);

        pop();
    }
}