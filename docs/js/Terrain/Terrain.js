class Terrain {
   #controlPanel;
   #baseColor;
   #columns;
   #bumps = [];

   constructor(ctrlPanel, baseColor) {
      this.#controlPanel = ctrlPanel;
      this.#baseColor = baseColor;
      this.#columns = [];
   }

   generateInitialTerrain(seed) {
      noiseSeed(seed);
      for (let x = 0; x < width; x++) {
         const panelHeight = this.#controlPanel.getAltitudeAt(x);
         const terrainHeight = floor(map(noise(x * 0.005), 0, 1,
            panelHeight - 20,   // min
            panelHeight - 300   // max
         ));
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

   applyExplosion(center, radius) {
      //loop through all columns which are under the area of explosion
      let startId = floor(center.x - radius), endId = ceil(center.x + radius);
      for (let x = startId; x < endId; x++) if (this.#columns[x]) {
            this.#columns[x].removeExplodedPixels(center, radius);
            this.#columns[x].startSettling(this.#controlPanel.getAltitudeAt(x));
      }
   }

   drawTerrain() {
      stroke(this.#baseColor);
      strokeWeight(1);
      //Update bump timer
      for (let bump of this.#bumps){
         bump.timer += 1 / 60;
      }

      this.#bumps = this.#bumps.filter(b => b.timer < b.duration);

      for (let col of this.#columns) {
         col.updateAnimation();

         let offsetY = 0;
         
         for(let bump of this.#bumps){
            const distance = abs(col.xPosition - bump.x);
            const influence = max(0, 1 - distance / bump.radius);
            const wave = sin(influence * PI) * bump.strength * 2.5;
            offsetY -= wave;
         } 

         for (let span of col.spans) {
            line(col.xPosition, span.topY + offsetY, col.xPosition, span.bottomY + offsetY);
         }
      }
   }

   addBump(x, radius, strength = 10, duration = 0.5){
      this.#bumps.push({x, radius, strength, timer: 0, duration});
   }

   get isSettled() { return this.#columns.every((col) => !col.isFalling); }
}