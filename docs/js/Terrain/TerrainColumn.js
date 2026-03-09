// terrain/TerrainColumn.js
class TerrainColumn {
   #xPosition;
   #pixels = [];
   #spans = [];
   #targetSpans = [];
   #settleProgress = -1;

   constructor(xPos, top, bottom) {
      this.#xPosition = xPos;
      for (let pxHeight = top; pxHeight <= bottom; pxHeight++) this.#pixels.push(pxHeight);
      //if (this.#pixels.length >= 2)
      //this.#spans.push({ topY: this.#pixels[0], bottomY: this.#pixels[this.#pixels.length - 1] });
      this.#spans = this.#computeSpans();
   }

   get xPosition() { return this.#xPosition; }
   get spans() { return this.#spans }
   getTopHeight(ctrlPanelTopY) { return this.#spans.length > 0 ? this.#spans[0].topY : ctrlPanelTopY }
   getBottomHeight() { return this.#pixels[this.#pixels.length - 1] }
   setTopHeight(topY) { this.#pixels[0] = topY }

   removeExplodedPixels(center, radius, ctrlPanelTopY) {
      this.#pixels = this.#pixels.filter(
         (pxHeight) => center.dist(createVector(this.#xPosition, pxHeight)) > radius
      );
      if (this.#pixels.length === 0) {
         this.#spans.length = 0;
         this.#targetSpans.length = 0;
         return;
      }
      this.#spans = this.#computeSpans();
      //this.#targetSpans = [...this.#spans];
      this.#targetSpans = this.#spans.map(s => ({
         topY: s.topY,
         bottomY: s.bottomY
      }));
   }

   startSettling(ctrlPanelTopY) {
      if (this.#settleProgress >= 0) return;
      let anchorY = ctrlPanelTopY;
      for (let i = this.#targetSpans.length - 1; i >= 0; i--) {
         if (this.#targetSpans[i].bottomY + 1 === anchorY) anchorY = this.#targetSpans[i].topY;
         else {
            let gap = anchorY - this.#targetSpans[i].bottomY - 1;
            this.#targetSpans[i].bottomY += gap;
            this.#targetSpans[i].topY += gap;
            anchorY = this.#targetSpans[i].topY;
         }
      }
      this.#settleProgress = 0;
      //console.log(`Col ${this.#xPosition}: START SETTLING progress=0, target=`, 
      //this.#targetSpans.map(s => `${s.topY}-${s.bottomY}`));
      //this.#rebuildPixelsFromSpans();
   }

   updateAnimation(dt) {
      //if (this.#settleProgress > 0) for (let span of this.#spans) console.log(span);
      if (this.#settleProgress < 0) {
         //console.log(`Col ${this.#xPosition}: IDLE (progress=${this.#settleProgress})`);
         return;
      }
      //console.log(`Col ${this.#xPosition}: ANIMATING progress=${this.#settleProgress} →`, this.#settleProgress += dt / 500) ;
      this.#settleProgress += dt * 0.0001;
      if (this.#settleProgress >= 1.0) {
         console.log("Progress ended:", this.#settleProgress);
         //this.#spans = [...this.#targetSpans];
         this.#spans = this.#spans.map(s => ({
            topY: s.topY,
            bottomY: s.bottomY
         }));
         this.#rebuildPixelsFromSpans();
         this.#settleProgress = -1;
         return;
      }
      for (let i = 0; i < this.#spans.length; i++) {
         console.log("Progress in time:", this.#settleProgress);
         this.#spans[i].topY = lerp(this.#spans[i].topY, this.#targetSpans[i].topY, this.#settleProgress);
         this.#spans[i].bottomY = lerp(this.#spans[i].bottomY, this.#targetSpans[i].bottomY, this.#settleProgress);
      }
   }

   #computeSpans() {
      let spans = [];
      let spanStart = 0;
      for (let pxId = 1; pxId < this.#pixels.length; pxId++) {
         if (this.#pixels[pxId] - this.#pixels[pxId - 1] > 1) {
            spans.push({ topY: this.#pixels[spanStart], bottomY: this.#pixels[pxId - 1] });
            spanStart = pxId;
         }
      }
      spans.push({ topY: this.#pixels[spanStart], bottomY: this.#pixels[this.#pixels.length - 1] });
      return spans;
   }

   #rebuildPixelsFromSpans() {
      this.#pixels.length = 0;
      for (let span of this.#spans)
         for (let pxY = span.topY; pxY <= span.bottomY; pxY++)
            this.#pixels.push(pxY);
   }
}