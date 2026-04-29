// A utility class for handling global visual feedback
// Primarily manages the screen shaking effect
class Effects {
   #shakeFrames = 0;
   #shakeMag = 0;

   // Sets the duration and intensity of a screen shake event
   triggerShake(frames = 10, mag = 6) {
      this.#shakeFrames = frames;
      this.#shakeMag = mag; }

   updateShake() {
      if (this.#shakeFrames > 0) this.#shakeFrames--;
   }

   // Applies a random translation to the canvas based on current shake settings
   applyShake() {
      if (this.#shakeFrames > 0)
         translate(random(-this.#shakeMag, this.#shakeMag), random(-this.#shakeMag, this.#shakeMag));
   }
}