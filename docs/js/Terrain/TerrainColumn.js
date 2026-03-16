class TerrainColumn {
   static #fallSpeed = 0.03;
   #xPosition;
   #pixels = [];
   #spans = [];
   #targetSpans = [];
   #isFalling = false;

   constructor(xPos, top, bottom) {
      this.#xPosition = xPos;
      for (let pxHeight = top; pxHeight <= bottom; pxHeight++) this.#pixels.push(pxHeight);
      this.#spans = this.#computeSpans();
   }

   get xPosition() { return this.#xPosition; }
   get spans() { return this.#spans }
   get isFalling() { return this.#isFalling; }
   getTopHeight(ctrlPanelTopY) { return this.#spans.length > 0 ? this.#spans[0].topY : ctrlPanelTopY }
   getBottomHeight() { return this.#pixels.at(-1) }
   setTopHeight(topY) { this.#pixels[0] = topY }

   removeExplodedPixels(center, radius) {
      this.#pixels = this.#pixels.filter(
         pxHeight => center.dist(createVector(this.#xPosition, pxHeight)) > radius
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
      if (this.#isFalling) return;
      let anchorY = ctrlPanelTopY + 1;
      for (let i = this.#targetSpans.length - 1; i >= 0; i--) {
         if (this.#targetSpans[i].bottomY + 1 !== anchorY) {
            let gap = anchorY - this.#targetSpans[i].bottomY - 1;
            this.#targetSpans[i].bottomY += gap;
            this.#targetSpans[i].topY += gap;
            this.#isFalling = true;
         }
         anchorY = this.#targetSpans[i].topY;
      }
   }

   updateAnimation() {
      if (!this.#isFalling) return;
      const displacement = TerrainColumn.#fallSpeed * deltaTime;
      let anyMoved = false;
      for (let i = 0; i < this.#spans.length; ++i)
         if (this.#spans[i].bottomY < this.#targetSpans[i].bottomY) {
            this.#spans[i].topY += displacement;
            this.#spans[i].bottomY += displacement;
            anyMoved = true;
         }
      if (anyMoved) return;
      this.#rebuildPixelsFromSpans();
      this.#spans.length = 1;
      this.#spans[0] = { topY: this.#pixels[0], bottomY: this.#pixels.at(-1) };
      this.#isFalling = false;
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
      spans.push({ topY: this.#pixels[spanStart], bottomY: this.#pixels.at(-1) });
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