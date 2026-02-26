// terrain/TerrainColumn.js
class TerrainColumn {
  constructor(xIndex, height, materialType = 'dirt') {
    this.xIndex = xIndex;
    this.height = height;
    this.materialType = materialType;
  }

  getTopY() {
    // return this col's y
    return 700 - this.height;
  }

  setHeight(h) {
    this.height = constrain(h, 0, height);
  }
}