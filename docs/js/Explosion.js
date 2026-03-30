class Explosion {
  constructor(impactPosition, terrainRef = null) {
    this.position = impactPosition;
    this.radius = 10;
    this.maxRadius = 50;
    this.terrain = terrainRef;          
    this.hasAppliedTerrain = false;
    this.finished = false;  
    this.enemyFeedbackTriggered = false;
    this.selfFeedbackTriggered = false;            
  }

  update() {
    if (this.finished) return;
    this.radius += 0.5;
    if (!this.hasAppliedTerrain && this.radius >= this.maxRadius) {
      if (this.terrain) {
        //this.terrain.applyExplosion(createVector(this.position.x, this.position.y), this.maxRadius);
      }
      this.hasAppliedTerrain = true;
      this.finished = true;
    }
  }

  draw() {
    if (this.finished) return;
    noFill();
    stroke(255, 150, 0);
    strokeWeight(3);
    circle(this.position.x, this.position.y, this.radius);
  }
}