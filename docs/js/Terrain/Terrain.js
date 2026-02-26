// terrain/Terrain.js
class Terrain {
  //colsizevector
  //replace w,h
  constructor(sizeVec, baseColor) {
    this.sizeVector = createVector(sizeVec.x, sizeVec.y);
    this.baseColor = baseColor;
    this.columns = [];
  }


generateInitialTerrain(seed) {
    randomSeed(seed);
    noiseSeed(seed);
//use global var height, make a different name
    let panelHeight = this.sizeVector.y * 0.25;

    for (let x = 0; x < this.sizeVector.x; x++) {
        let terrainHeight = map(noise(x * 0.005), 0, 1,
            panelHeight + 20,   // min
            panelHeight + 200   // max
        );
        //this.columns.push(new TerrainColumn(x, terrainHeight));
        this.columns.push(new TerrainColumn(x, terrainHeight, this.sizeVector.y)
);
    }
}
  getHeightAt(x) {
    let col = this.columns[floor(x)];
    return col ? col.height : 0;
  }

  setHeightAt(x, h) {
  //floor() change to int
    let col = this.columns[floor(x)];
    if (col) col.setHeight(h);
  }

  applyExplosion(center, radius) {
  //loop each cols which is under the area of explosion
   console.log("applyExplosion called at", center, "radius:", radius);
    for (let x = center.x - radius; x < center.x + radius; x++) {
    // the distance from this col to the center of explosion
      let dx = x - center.x;
      //triangle: |_\  to avoid negative : max()
      let craterDepth = sqrt(max(0, radius * radius - dx * dx));
      let col = this.columns[floor(x)];
      if (col) {
      //change the height
       console.log("before:", col.height, "craterDepth:", craterDepth);
       col.setHeight(col.height - craterDepth);
       console.log("after:", col.height); 
      }
    }
  }

  drawTerrain() {
    fill(this.baseColor);
    noStroke();
    beginShape();
    vertex(0, this.sizeVector.y);
    for (let col of this.columns) {
        vertex(col.xIndex, col.getTopY());
    }
    vertex(this.sizeVector.x, this.sizeVector.y);
    endShape(CLOSE);
}
}