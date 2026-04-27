import { vi } from 'vitest';
class P5Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy() { return new P5Vector(this.x, this.y); }
  set(x, y) {
    if (typeof x === 'object') {
      this.x = x?.x ?? this.x;
      this.y = x?.y ?? this.y;
    } else {
      this.x = x;
      this.y = y;
    }
    return this;
  }
  add(v, y) {
    if (typeof v === 'number') {
      this.x += v;
      this.y += y ?? 0;
    } else {
      this.x += v?.x ?? 0;
      this.y += v?.y ?? 0;
    }
    return this;
  }
  sub(v) { this.x -= v?.x ?? 0; this.y -= v?.y ?? 0; return this; }
  mult(n) { this.x *= n; this.y *= n; return this; }
  div(n) { this.x /= n; this.y /= n; return this; }
  mag() { return Math.hypot(this.x, this.y); }
  normalize() { const m = this.mag(); if (m) this.div(m); return this; }
  heading() { return Math.atan2(this.y, this.x); }
  rotate(a) {
    const c = Math.cos(a);
    const s = Math.sin(a);
    const x = this.x * c - this.y * s;
    this.y = this.x * s + this.y * c;
    this.x = x;
    return this;
  }

  static add(a, b) { return new P5Vector((a?.x ?? 0) + (b?.x ?? 0), (a?.y ?? 0) + (b?.y ?? 0)); }
  static sub(a, b) { return new P5Vector((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0)); }
  static div(a, n) { return new P5Vector((a?.x ?? 0) / n, (a?.y ?? 0) / n); }
  static dist(a, b) { return Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0)); }
  static lerp(a, b, t) { return new P5Vector((a?.x ?? 0) + ((b?.x ?? 0) - (a?.x ?? 0)) * t, (a?.y ?? 0) + ((b?.y ?? 0) - (a?.y ?? 0)) * t); }
  static fromAngle(a) { return new P5Vector(Math.cos(a), Math.sin(a)); }
}

// Attach vector utilities to global scope to mimic p5.js environment
globalThis.p5 = { Vector: P5Vector };
globalThis.createVector = (x = 0, y = 0) => new P5Vector(x, y);
globalThis.dist = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);
globalThis.map = (n, a, b, c, d) => c + ((n - a) / (b - a)) * (d - c);
globalThis.constrain = (n, lo, hi) => Math.min(Math.max(n, lo), hi);
globalThis.lerp = (a, b, t) => a + (b - a) * t;

// Deterministic random keeps AI aiming, shop selection, and random events repeatable.
globalThis.random = (a, b) => {
  if (Array.isArray(a)) return a[0];
  if (a === undefined) return 0.5;
  return b === undefined ? a / 2 : (a + b) / 2;
};
globalThis.shuffle = (arr) => arr;
globalThis.radians = (deg) => deg * Math.PI / 180;
globalThis.degrees = (rad) => rad * 180 / Math.PI;
globalThis.floor = Math.floor;
globalThis.round = Math.round;
globalThis.ceil = Math.ceil;
globalThis.abs = Math.abs;
globalThis.min = Math.min;
globalThis.max = Math.max;
globalThis.sin = Math.sin;
globalThis.cos = Math.cos;
globalThis.atan2 = Math.atan2;
globalThis.sqrt = Math.sqrt;
globalThis.pow = Math.pow;
globalThis.PI = Math.PI;
globalThis.TWO_PI = Math.PI * 2;

// Define commonly used p5 constants required for UI 
globalThis.CENTER = 'center';
globalThis.CORNER = 'corner';
globalThis.LEFT = 'left';
globalThis.RIGHT = 'right';
globalThis.TOP = 'top';
globalThis.BOTTOM = 'bottom';
globalThis.BOLD = 'bold';
globalThis.NORMAL = 'normal';
globalThis.DEGREES = 'degrees';
globalThis.ADD = 'add';
globalThis.ENTER = 'Enter';
globalThis.width = 1280;
globalThis.height = 720;
globalThis.frameCount = 0;
globalThis.color = (...args) => args;

// Mock browser and canvas related objects to prevent runtime errors in test environment
globalThis.window = globalThis.window ?? { location: { reload: vi.fn() } };
globalThis.document = globalThis.document ?? {};
globalThis.drawingContext = {
  fillStyle: '',
  strokeStyle: '',
  shadowBlur: 0,
  shadowColor: '',
  globalAlpha: 1,
  createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
  createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
};

// Replace all p5 drawing functions with no-op mocks to isolate logic from rendering
const noop = vi.fn();
for (const name of [
  'push', 'pop', 'fill', 'stroke', 'strokeWeight', 'noStroke', 'noFill',
  'circle', 'ellipse', 'rect', 'line', 'triangle', 'quad', 'arc', 'point',
  'beginShape', 'endShape', 'vertex', 'text', 'textSize', 'textAlign', 'textFont',
  'textStyle', 'rectMode', 'ellipseMode', 'angleMode', 'translate', 'rotate',
  'scale', 'image', 'imageMode', 'background', 'blendMode', 'tint', 'noTint'
]) {
  globalThis[name] = noop;
}

// Provide null placeholders for optional image assets to avoid rendering issues in tests
for (const imageName of [
  'cannonballImg', 'bubblegumImg', 'earthwormImg', 'lazerImg', 'impactgunImg',
  'submarineImg', 'pineappleImg', 'shibaImg', 'starImg', 'grapeshotImg'
]) {
  globalThis[imageName] = null;
}

export { P5Vector };