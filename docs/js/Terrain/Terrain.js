// terrain/Terrain.js
class Terrain {
  constructor(w, h, baseColor) {
    this.width = w;
    this.height = h;
    this.baseColor = baseColor;
    this.columns = [];
  }


generateInitialTerrain(seed) {
    randomSeed(seed);
    noiseSeed(seed);
//use global var height, make a different name
    let panelHeight = 700 * 0.25; //because the control panel is 175px

    for (let x = 0; x < this.width; x++) {
        let terrainHeight = map(noise(x * 0.005), 0, 1,
            panelHeight + 20,   // min
            panelHeight + 200   // max
        );
        this.columns.push(new TerrainColumn(x, terrainHeight));
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
    for (let x = center.x - radius; x < center.x + radius; x++) {
    // the distance from this col to the center of explosion
      let dx = x - center.x;
      //triangle: |_\  to avoid negative : max()
      let craterDepth = sqrt(max(0, radius * radius - dx * dx));
      let col = this.columns[floor(x)];
      if (col) {
      //change the height
        col.setHeight(col.height - craterDepth);
      }
    }
  }

  drawTerrain() {
    fill(this.baseColor);
    noStroke();
    beginShape();
    vertex(0, height);
    for (let col of this.columns) {
      vertex(col.xIndex, col.getTopY());
    }
    vertex(this.width, height);
    endShape(CLOSE);
  }
}