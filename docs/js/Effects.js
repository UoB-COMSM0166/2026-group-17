class Effects {
   #shakeFrames = 0;
   #shakeMag = 0;

   triggerShake(frames = 10, mag = 6) {
      this.#shakeFrames = frames;
      this.#shakeMag = mag; }

   updateShake() {
      if (this.#shakeFrames > 0) this.#shakeFrames--;
   }

   applyShake() {
      if (this.#shakeFrames > 0)
         translate(random(-this.#shakeMag, this.#shakeMag), random(-this.#shakeMag, this.#shakeMag));
   }
}