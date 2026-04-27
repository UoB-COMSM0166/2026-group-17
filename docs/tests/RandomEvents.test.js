import { describe, it, expect, beforeAll } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

beforeAll(() => loadGameFiles(['WindSystem.js', 'RainSystem.js', 'EarthquakeSystem.js']));

describe('Hard-mode random event systems - projectile modifiers', () => {

  // Verify that wind has no effect when inactive, and applies horizontal force when enabled
  it('wind is inactive by default, then applies horizontal force when active', () => {
    const wind = new WindSystem();
    const projectile = { velocity: createVector(0, 0) };

    wind.applyTo(projectile, 1);
    expect(projectile.velocity.x).toBe(0);

    wind.isActive = true;
    wind.windForce = 1;
    wind.applyTo(projectile, 0.5);
    expect(projectile.velocity.x).toBeCloseTo(9.99, 2);
  });

  // Ensure that rain only affects vertical velocity when the system is active
  it('acid rain applies downward force only when active', () => {
    const rain = new RainSystem();
    const projectile = { velocity: createVector(0, 0) };

    rain.applyTo(projectile, 1);
    expect(projectile.velocity.y).toBe(0);

    rain.isActive = true;
    rain.intensity = 2;
    rain.applyTo(projectile, 0.5);
    expect(projectile.velocity.y).toBeCloseTo(14.925, 3);
  });

  // Test that earthquake introduces random horizontal disturbance without affecting vertical velocity
  it('earthquake perturbs horizontal projectile velocity while active', () => {
    const quake = new EarthquakeSystem();
    const projectile = {
      velocity: createVector(10, 10),
    };

    // Mock random function to ensure deterministic test behavior
    const originalRandom = globalThis.random;
    globalThis.random = vi.fn((min, max) => {
      if (min === -0.6 && max === 0.6) return 0.5;
      return 1;
    });
    quake.isActive = true;
    quake.intensity = 6;
    quake.applyTo(projectile, 1);
    expect(projectile.velocity.x).toBe(13);
    expect(projectile.velocity.y).toBe(10);
    globalThis.random = originalRandom;
  });
});