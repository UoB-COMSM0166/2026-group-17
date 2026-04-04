//introduction for weapon class
//   LEFT panel  = Player 1 loadout
//   CENTER grid = 10 weapon cards (5×2)
//   RIGHT panel = Player 2 loadout
//   Stat bars have DMG / SPD / AOE labels
//   Stronger glass style---UI design

class WeaponShop {
   constructor(canvasW, canvasH, picksEach = 5) {
      this.W = canvasW;
      this.H = canvasH;
      this.picksEach = picksEach;

      this._selections = [];
      this._hoveredIdx = -1;

      //  Card dimensions
      this._cols = 5;
      this._cardW = 148;
      this._cardH = 172;
      this._gapX = 10;
      this._gapY = 10;

      const gridW = this._cols * this._cardW + (this._cols - 1) * this._gapX;
      const gridH = 2 * this._cardH + this._gapY;

      // Side panels width
      this._panelW = (canvasW - gridW) / 2 - 20;  // ~130px each

      // Vertical centering: header ~90px, leave 10px bottom
      this._gridX = (canvasW - gridW) / 2;
      this._gridY = 95;

      // Panel Y aligns with grid
      this._panelY = this._gridY;
      this._panelH = gridH;
   }


   isDone() {
      return this._selections.length === this.picksEach * 2;
   }

   getLoadout(pid) {
      return this._selections.filter(s => s.player === pid).map(s => s.weapon);
   }
   //interaction
   handleClick(mx, my) {
      //to check if players have finished picking weapons
      // if so, no more selection allowed and store the loadout for each player
      if (this.isDone()) return;
      const idx = this._cardAt(mx, my);
      if (idx < 0) return;
      const weapon = WEAPON_REGISTRY[idx];
      if (this._selections.some(s => s.weapon.id === weapon.id)) return;
      const p = this._currentPlayer();
      if (p === null) return;
      this._selections.push({ weapon, player: p });
   }

   handleMouseMove(mx, my) {
      this._hoveredIdx = this._cardAt(mx, my);
   }

   // Main draw 

   draw() {
      push();
      ellipseMode(CENTER);
      angleMode(DEGREES);
      rectMode(CORNER);

      this._drawBg();
      this._drawHeader();
      // Player 1 — left
      this._drawSidePanel(0);
      // Player 2 — right
      this._drawSidePanel(1);
      this._drawGrid();
      if (this.isDone()) this._drawStartPrompt();

      pop();
   }

   //background with radial highlight
   _drawBg() {
      noStroke();
      // Base dark
      background(9, 14, 30);

      // Subtle radial highlight in centre
      const g = drawingContext.createRadialGradient(
         this.W / 2, this.H * 0.45, 60,
         this.W / 2, this.H * 0.45, this.W * 0.6
      );
      g.addColorStop(0, 'rgba(30,60,120,0.45)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      drawingContext.fillStyle = g;
      rect(0, 0, this.W, this.H);
   }

   // Header with title and turn indicator
   _drawHeader() {
      const cp = this._currentPlayer();
      const done = this.isDone();

      textAlign(CENTER, TOP);

      // small eyebrow
      noStroke(); fill(80, 110, 160); textSize(11);
      text('HOT CANNON', this.W / 2, 10);

      // main title
      fill(230, 235, 255); textSize(34);
      text('⚔  WEAPON SHOP  ⚔', this.W / 2, 28);

      // turn indicator
      if (!done && cp !== null) {
         const [r, g, b] = cp === 0 ? [255, 110, 68] : [68, 170, 255];
         fill(r, g, b); textSize(14);
         const total = this._selections.length;
         drawingContext.shadowBlur = sin(frameCount * 5) * 8 + 12;
         drawingContext.shadowColor = `rgb(${r},${g},${b})`;
         text(`Player ${cp + 1} — pick a weapon  (${total} / ${this.picksEach * 2})`, this.W / 2, 68);
         drawingContext.shadowBlur = 0;
      }
   }

   //Side panels

   _drawSidePanel(pid) {
      const isLeft = pid === 0;
      const px = isLeft ? 8 : this.W - this._panelW - 8;
      const py = this._panelY;
      const pw = this._panelW;
      const ph = this._panelH;
      const isActive = this._currentPlayer() === pid;
      const picks = this._selections.filter(s => s.player === pid).map(s => s.weapon);
      const [r, g, b] = pid === 0 ? [255, 110, 68] : [68, 170, 255];

      // Glass panel
      noStroke();
      // frosted fill
      fill(r, g, b, isActive ? 28 : 12);
      _glassRect(px, py, pw, ph, 14);

      // border
      noFill();
      stroke(r, g, b, isActive ? 210 : 70);
      strokeWeight(isActive ? 2 : 1.2);
      _glassRect(px, py, pw, ph, 14);

      // Active glow border
      if (isActive) {
         drawingContext.shadowBlur = 18;
         drawingContext.shadowColor = `rgba(${r},${g},${b},0.6)`;
         stroke(r, g, b, 140);
         strokeWeight(2);
         _glassRect(px, py, pw, ph, 14);
         drawingContext.shadowBlur = 0;
      }

      // Player badge
      noStroke();
      drawingContext.shadowBlur = isActive ? 14 : 4;
      drawingContext.shadowColor = `rgb(${r},${g},${b})`;
      fill(r, g, b);
      ellipse(px + pw / 2, py + 22, 18, 18);
      drawingContext.shadowBlur = 0;
      fill(255); textAlign(CENTER, CENTER); textSize(13);
      text(pid + 1, px + pw / 2, py + 22);

      fill(r, g, b); textAlign(CENTER, TOP); textSize(13);
      text(`Player ${pid + 1}`, px + pw / 2, py + 36);

      // pick count
      fill(120, 140, 180); textSize(10);
      text(`${picks.length} / ${this.picksEach}`, px + pw / 2, py + 52);

      // Weapon slots
      const slotH = 34;
      const slotGap = 7;
      const slotX = px + 8;
      const slotW = pw - 16;
      const slotsY0 = py + 70;

      for (let i = 0; i < this.picksEach; i++) {
         const sy = slotsY0 + i * (slotH + slotGap);
         const w = picks[i];

         // slot bg
         noStroke();
         fill(r, g, b, w ? 35 : 12);
         rect(slotX, sy, slotW, slotH, 8);
         stroke(r, g, b, w ? 130 : 35);
         strokeWeight(1);
         noFill();
         rect(slotX, sy, slotW, slotH, 8);

         if (w) {
            // mini icon with clip
            push();
            ellipseMode(CENTER);
            drawingContext.save();
            drawingContext.beginPath();
            drawingContext.arc(slotX + 17, sy + slotH / 2, 12, 0, Math.PI * 2);
            drawingContext.clip();
            w.drawIcon(slotX + 17, sy + slotH / 2, 11);
            drawingContext.restore();
            pop();

            noStroke(); fill(215, 222, 245); textAlign(LEFT, CENTER); textSize(10);
            text(w.name, slotX + 32, sy + slotH / 2);
         } else {
            noStroke(); fill(55, 70, 100); textAlign(CENTER, CENTER); textSize(9);
            text(`— slot ${i + 1} —`, slotX + slotW / 2, sy + slotH / 2);
         }
      }
   }

   // Weapon card grid to show 10 weapons, 5 per row

   _drawGrid() {
      for (let i = 0; i < WEAPON_REGISTRY.length; i++) {
         const col = i % this._cols;
         const row = Math.floor(i / this._cols);
         const x = this._gridX + col * (this._cardW + this._gapX);
         const y = this._gridY + row * (this._cardH + this._gapY);
         this._drawCard(i, x, y);
      }
   }

   _drawCard(idx, x, y) {
      const weapon = WEAPON_REGISTRY[idx];
      const sel = this._selections.find(s => s.weapon.id === weapon.id);
      const isHov = this._hoveredIdx === idx && !sel;
      const cp = this._currentPlayer();

      const rarityRGB = {
         common: [136, 153, 170],
         rare: [68, 136, 255],
         legendary: [255, 170, 0],
      }[weapon.rarity];

      let bdr;
      if (sel) bdr = sel.player === 0 ? [255, 110, 68] : [68, 170, 255];
      else if (isHov) bdr = rarityRGB;
      else bdr = [rarityRGB[0] * 0.45, rarityRGB[1] * 0.45, rarityRGB[2] * 0.45];

      const takenByOther = sel && sel.player !== cp && !this.isDone();

      push();
      translate(x, y);
      if (takenByOther) drawingContext.globalAlpha = 0.32;

      // Glass bg
      noStroke();
      if (sel) {
         fill(bdr[0], bdr[1], bdr[2], 38);
      } else if (isHov) {
         fill(rarityRGB[0], rarityRGB[1], rarityRGB[2], 28);
      } else {
         fill(22, 34, 62, 210);
      }
      _glassRect(0, 0, this._cardW, this._cardH, 12);

      // Border glow
      if (sel || isHov) {
         drawingContext.shadowBlur = sel ? 16 : 10;
         drawingContext.shadowColor = `rgba(${bdr[0]},${bdr[1]},${bdr[2]},0.55)`;
      }
      noFill();
      stroke(...bdr, sel ? 230 : (isHov ? 190 : 90));
      strokeWeight(sel ? 2.2 : 1.5);
      _glassRect(0, 0, this._cardW, this._cardH, 12);
      drawingContext.shadowBlur = 0;

      // Inner top edge highlight (glass effect)
      noFill();
      stroke(255, 255, 255, 30);
      strokeWeight(1);
      line(12, 1, this._cardW - 12, 1);

      // Player badge
      if (sel) {
         noStroke();
         fill(bdr[0], bdr[1], bdr[2]);
         ellipse(14, 14, 10, 10);
         fill(255); textAlign(CENTER, CENTER); textSize(8);
         text(`P${sel.player + 1}`, 14, 14);
      }

      // Rarity label
      noStroke(); textAlign(RIGHT, TOP);
      fill(...rarityRGB); textSize(8);
      text(weapon.rarity.toUpperCase(), this._cardW - 8, 8);

      // ── Weapon icon (clipped circle) ──────────────────────
      const iconCX = this._cardW / 2;
      const iconCY = 52;
      const iconR = 21;

      // Rarity glow under icon
      const ig = drawingContext.createRadialGradient(iconCX, iconCY, 0, iconCX, iconCY, iconR * 1.8);
      ig.addColorStop(0, `rgba(${rarityRGB[0]},${rarityRGB[1]},${rarityRGB[2]},0.22)`);
      ig.addColorStop(1, 'rgba(0,0,0,0)');
      drawingContext.fillStyle = ig;
      noStroke();
      ellipse(iconCX, iconCY, iconR * 1.8 * 2, iconR * 1.8 * 2);

      // Clip icon
      drawingContext.save();
      drawingContext.beginPath();
      drawingContext.arc(iconCX, iconCY, iconR + 8, 0, Math.PI * 2);
      drawingContext.clip();
      push(); ellipseMode(CENTER);
      weapon.drawIcon(iconCX, iconCY, iconR);
      pop();
      drawingContext.restore();

      // Weapon name 
      noStroke(); fill(225, 232, 255); textAlign(CENTER, TOP); textSize(12);
      text(weapon.name, this._cardW / 2, 84);

      // Stat bars with labels  Format: [label, value, [r,g,b], y]
      //DMG:DAMAGE, SPD:SPEED, AOE:BLAST RADIUS
      const stats = [
         ['DMG', weapon.damage, [255, 75, 65], 102],
         ['SPD', weapon.speed, [55, 200, 255], 114],
         ['AOE', weapon.blastRadius, [255, 165, 30], 126],
      ];

      for (const [label, val, col, sy] of stats) {
         // label
         noStroke(); fill(140, 155, 190); textAlign(LEFT, CENTER); textSize(9);
         text(label, 8, sy + 3);
         // track
         fill(20, 28, 50);
         rect(30, sy, this._cardW - 38, 6, 3);
         // fill
         fill(...col);
         drawingContext.shadowBlur = 4;
         drawingContext.shadowColor = `rgba(${col[0]},${col[1]},${col[2]},0.8)`;
         rect(30, sy, (this._cardW - 38) * (val / 10), 6, 3);
         drawingContext.shadowBlur = 0;
      }

      noStroke();
      fill(100, 115, 145);
      textAlign(LEFT, CENTER);
      textSize(8);
      text('ONE USE', 8, 144);

      if (takenByOther) drawingContext.globalAlpha = 1;
      pop();
   }

   //  Start prompt
   _drawStartPrompt() {
      const pulse = sin(frameCount * 4) * 0.18 + 0.82;

      // to make sure the location is the same as isStartButtonClicked
      const bx = this.W / 2 - 180;
      const by = this.H - 52;
      const bw = 360;
      const bh = 36;

      // background glow
      noStroke();
      fill(255, 215, 55, 50 * pulse);
      rect(bx, by, bw, bh, 15);

      // border glow
      noFill();
      stroke(255, 215, 55, 200 * pulse);
      strokeWeight(2);
      rect(bx, by, bw, bh, 15);

      // txt glow
      noStroke();
      fill(255, 220, 68, 255 * pulse);
      drawingContext.shadowBlur = 14 * pulse;
      drawingContext.shadowColor = 'rgba(255,200,0,0.9)';
      textAlign(CENTER, CENTER);
      textSize(15);
      text('✓  All chosen — Click here or press ENTER to battle!', this.W / 2, by + bh / 2);
      drawingContext.shadowBlur = 0;
   }


   _currentPlayer() {
      const p1 = this._selections.filter(s => s.player === 0).length;
      const p2 = this._selections.filter(s => s.player === 1).length;
      if (p1 <= p2 && p1 < this.picksEach) return 0;
      if (p2 < this.picksEach) return 1;
      return null;
   }

   _cardAt(mx, my) {
      for (let i = 0; i < WEAPON_REGISTRY.length; i++) {
         const col = i % this._cols;
         const row = Math.floor(i / this._cols);
         const x = this._gridX + col * (this._cardW + this._gapX);
         const y = this._gridY + row * (this._cardH + this._gapY);
         if (mx >= x && mx <= x + this._cardW && my >= y && my <= y + this._cardH)
            return i;
      }
      return -1;
   }

   isStartButtonClicked(mx, my) {
      if (!this.isDone()) return false;
      const bx = this.W / 2 - 180;
      const by = this.H - 52;
      return mx >= bx && mx <= bx + 360 && my >= by && my <= by + 36;
   }

}

// draw a rounded rectangle with current fill and stroke styles, used for glass panels and cards
//glass effect
function _glassRect(x, y, w, h, r) {
   drawingContext.beginPath();
   drawingContext.moveTo(x + r, y);
   drawingContext.lineTo(x + w - r, y);
   drawingContext.quadraticCurveTo(x + w, y, x + w, y + r);
   drawingContext.lineTo(x + w, y + h - r);
   drawingContext.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
   drawingContext.lineTo(x + r, y + h);
   drawingContext.quadraticCurveTo(x, y + h, x, y + h - r);
   drawingContext.lineTo(x, y + r);
   drawingContext.quadraticCurveTo(x, y, x + r, y);
   drawingContext.closePath();
   if (drawingContext.fillStyle && drawingContext.fillStyle !== 'rgba(0, 0, 0, 0)') {
      drawingContext.fill();
   }
   if (drawingContext.strokeStyle && drawingContext.strokeStyle !== 'rgba(0, 0, 0, 0)') {
      drawingContext.stroke();
   }
}
