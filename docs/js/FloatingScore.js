class FloatingScore {
   constructor(x, y, value, col) {
      this.x0 = x;
      this.y0 = y;
      this.x1 = x;
      this.y1 = y - 45;
      this.x = x;
      this.y = y;
      this.value = value;
      this.col = col;
      this.t = 0;
      this.life = 1.0;
      this.dead = false;

      this._framesLeft = 90;
   }

   _clamp(v, a, b) {
      return max(a, min(b, v));
   }
   update() {
      this.t += 0.14;
      const tt = this._clamp(this.t, 0, 1);
      const eased = 1 - pow(1 - tt, 3);
      this.x = lerp(this.x0, this.x1, eased);
      this.y = lerp(this.y0, this.y1, eased);
      if (tt >= 1) {
         this._hold = (this._hold ?? 18) - 1;
         if (this._hold <= 0) this.life -= 0.12;
      }
      if (this.life <= 0) this.dead = true;
   }
   draw() {
      push();
      textAlign(CENTER, CENTER);
      let s;
      if (typeof this.value === "number") s = (this.value > 0 ? `+${this.value}` : `${this.value}`);
      else s = String(this.value);
      const scalePop = 1 + 0.35 * exp(-6 * this.t);
      const baseSize = 34;
      textSize(baseSize * scalePop);
      if (typeof drawingContext !== "undefined") {
         drawingContext.shadowBlur = 18;
         drawingContext.shadowColor = "rgba(0,0,0,0.6)";
      }
      const lv = (this.col && this.col.levels) ? this.col.levels : [255, 255, 255];
      stroke(0, 200 * this.life);
      strokeWeight(6);
      fill(lv[0], lv[1], lv[2], 255 * this.life);

      text(s, this.x, this.y);
      pop();
   }

   get finished() {
      return this.dead;
   }
}