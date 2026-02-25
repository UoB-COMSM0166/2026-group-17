class TerrainColumn {
  constructor(xIndex, height, canvasHeight) {
    this.xIndex = xIndex;
    this.height = height;
    this.canvasHeight = canvasHeight;
  }

  getTopY() {
    return this.canvasHeight - this.height;
  }

  setHeight(h) {
    this.height = constrain(h, 0, this.canvasHeight);
  }
}