// terrain/Terrain.js
class Terrain {
   //colsizevector
   #controlPanel;
   #baseColor;
   #columns;

   constructor(ctrlPanel, baseColor) {
      this.#controlPanel = ctrlPanel;
      this.#baseColor = baseColor;
      this.#columns = [];
   }

   generateInitialTerrain(seed) {
      noiseSeed(seed);
      for (let x = 0; x < width; x++) {
         const panelHeight = this.#controlPanel.getAltitudeAt(x);
         //console.log(`panel height for x = ${x}: ` + panelHeight);
         const terrainHeight = floor(map(noise(x * 0.005), 0, 1,
            panelHeight - 20,   // min
            panelHeight - 300   // max
         ));
         //console.log(`terrain height for x = ${x}: ` + terrainHeight);
         this.#columns.push(new TerrainColumn(x, terrainHeight, panelHeight));
      }
   }

   getHeightAt(x) {
      const col = this.#columns[floor(x)];
      if (x >= 0 && x < width) {
         let ctrlPanelTopY = this.#controlPanel.getAltitudeAt(col.xPosition);
         return col ? col.getTopHeight(ctrlPanelTopY) : ctrlPanelTopY;
      }
   }

   setHeightAt(x, h) {
      //floor() change to int
      const col = this.#columns[floor(x)];
      if (col) col.setTopHeight(h);
   }

   applyExplosion(center, radius) {
      //loop each cols which is under the area of explosion
      let startId = floor(center.x - radius), endId = ceil(center.x + radius);
      for (let x = startId; x < endId; x++) {
         if (this.#columns[x])
            this.#columns[x].removeExplodedPixels(center, radius, this.#controlPanel.getAltitudeAt(x));
      }
      for (let x = startId; x < endId; x++) {
         if (this.#columns[x]) this.#columns[x].startSettling(this.#controlPanel.getAltitudeAt(x));
      }
   }

   drawTerrain() {
      stroke(this.#baseColor);
      strokeWeight(1);
      for (let col of this.#columns) {
         col.updateAnimation(deltaTime);
         //console.log("Test outer");
         for (let span of col.spans) {
            //console.log("Test inner");
            line(col.xPosition, span.topY, col.xPosition, span.bottomY);
         }
      }
   }
}