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

  isColliding(x, y) {
  let groundHeight = this.getHeightAt(x);
  let groundY = height - groundHeight;
  return y >= groundY;
}

  setHeightAt(x, h) {
  //floor() change to int
    let col = this.columns[floor(x)];
    if (col) col.setHeight(h);
  }

applyExplosion(center, radius) {

  let panelHeight = height * 0.25; 

  for (let x = center.x - radius; x < center.x + radius; x++) {

    let dx = x - center.x;
    let craterDepth = sqrt(max(0, radius * radius - dx * dx));

    let col = this.columns[floor(x)];
    if (col) {
      let newHeight = col.height - craterDepth;
      col.setHeight(max(newHeight, panelHeight));
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