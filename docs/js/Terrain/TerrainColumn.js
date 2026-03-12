class TerrainColumn {
   #xPosition;
   #pixels = [];
   #startSpans = [];
   #spans = [];
   #targetSpans = [];
   #settleProgress = -1;

   constructor(xPos, top, bottom) {
      this.#xPosition = xPos;
      for (let pxHeight = top; pxHeight <= bottom; pxHeight++) this.#pixels.push(pxHeight);
      this.#spans = this.#computeSpans();
   }

   get xPosition() { return this.#xPosition; }
   get spans() { return this.#spans }
   getTopHeight(ctrlPanelTopY) { return this.#spans.length > 0 ? this.#spans[0].topY : ctrlPanelTopY }
   getBottomHeight() { return this.#pixels[this.#pixels.length - 1] }
   setTopHeight(topY) { this.#pixels[0] = topY }

   removeExplodedPixels(center, radius) {
      this.#pixels = this.#pixels.filter(
         (pxHeight) => center.dist(createVector(this.#xPosition, pxHeight)) > radius
      );
      if (this.#pixels.length === 0) {
         this.#spans.length = 0;
         this.#targetSpans.length = 0;
         return;
      }
      this.#spans = this.#computeSpans();
      // shallow copy 2 levels deep (array, then objects with primitive fields inside)
      this.#targetSpans = this.#spans.map(this.#cloneSpan);
   }

   startSettling(ctrlPanelTopY) {
      if (this.#settleProgress > 0) return;
      let anchorY = ctrlPanelTopY;
      for (let i = this.#targetSpans.length - 1; i >= 0; i--) {
         if (this.#targetSpans[i].bottomY + 1 != anchorY) {
            let gap = anchorY - this.#targetSpans[i].bottomY - 1;
            this.#targetSpans[i].bottomY += gap;
            this.#targetSpans[i].topY += gap;
         }
         anchorY = this.#targetSpans[i].topY;
      }
      this.#startSpans = this.#spans.map(this.#cloneSpan);
      this.#settleProgress = 0;
   }

   updateAnimation(dt) {
      if (this.#settleProgress < 0) return;
      this.#settleProgress += dt * 0.001;
      if (this.#settleProgress >= 1) {
         // shallow copy 2 levels deep (array, then objects with primitive fields inside)
         this.#spans = this.#targetSpans.map(this.#cloneSpan);
         this.#rebuildPixelsFromSpans();
         this.#settleProgress = -1;
         return;
      }
      for (let i = 0; i < this.#spans.length; i++) {
         this.#spans[i].topY = lerp(this.#startSpans[i].topY, this.#targetSpans[i].topY, this.#settleProgress);
         this.#spans[i].bottomY = lerp(this.#startSpans[i].bottomY, this.#targetSpans[i].bottomY, this.#settleProgress);
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

   #cloneSpan(span) { return { topY: span.topY, bottomY: span.bottomY }; }
}