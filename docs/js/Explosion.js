class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.maxRadius = random(40, 120);
    //Added
    this.terrain = terrain;
    this.hasAppliedTerrain = false;
    this.finished = false; 
  }

  update() {
    this.radius += 4;
    //Remove terrain when the explosion reaches its maximum radius
    if(!this.hasAppliedTerrain && this.radius >= this.maxRadius){
        this.terrain.applyExplosion(
            createVector(this.x, this.y), 
            this.maxRadius
        );
        this.hasAppliedTerrain = true;
    }
    if (this.radius >= this.maxRadius) {
    this.finished = true; 
}
  }

  draw() {
    noFill();
    stroke(255, 150, 0);
    strokeWeight(3);
    circle(this.x, this.y, this.radius);
  }

  calculateScore() {
    return floor(this.maxRadius);
  }
}