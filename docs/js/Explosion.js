class Explosion {
  constructor(x, y, terrainRef = null) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.maxRadius = 50;
    this.terrain = terrainRef;          
    this.hasAppliedTerrain = false;
    this.finished = false;              
  }

  update() {
    if (this.finished) return;
    this.radius += 0.5;
    if (!this.hasAppliedTerrain && this.radius >= this.maxRadius) {
      if (this.terrain) {
        //this.terrain.applyExplosion(createVector(this.x, this.y), this.maxRadius);
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
    circle(this.x, this.y, this.radius);
  }
}