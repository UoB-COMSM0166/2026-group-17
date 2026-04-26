import { describe, it, expect, vi, beforeAll } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

beforeAll(() => loadGameFiles([
  'AbstractWeapon.js', 'Starshot.js', 'Projectile.js', 'Explosion.js',
]));

describe('Projectile and Explosion - core physics outcomes', () => {
  // Verify that Starshot triggers a split into multiple projectiles at the correct moment
  it('splits Starshot into eight secondary projectiles when it begins falling', () => {
    const starWeapon = new Starshot();
    const projectile = new Projectile(createVector(100, 100), createVector(20, 5), {}, starWeapon);

    // Simulate a physics update step with no environmental effects
    const outcome = projectile.updatePhysics({
      dt: 0.016,
      gravity: createVector(0, 0),
      wind: null,
      rain: null,
      earthquake: null,
      terrain: { getHeightAt: () => 1000 },
      players: [],
      resolution: createVector(1280, 720),
    });

    expect(outcome.type).toBe('STAR_SPLIT');
    expect(outcome.fragments).toHaveLength(8);
    expect(projectile.isActive).toBe(false);
  });

  // Ensure that projectiles leaving the screen boundaries are correctly detected and deactivated
  it('reports out-of-bounds shots and deactivates the projectile', () => {
    const projectile = new Projectile(createVector(1279, 100), createVector(200, 0), {}, null);
    const outcome = projectile.updatePhysics({
      dt: 0.1,
      gravity: createVector(0, 0),
      wind: null,
      rain: null,
      earthquake: null,
      terrain: { getHeightAt: () => 1000 },
      players: [],
      resolution: createVector(1280, 720),
    });

    expect(outcome).toEqual({ type: 'OUT_OF_BOUNDS' });
    expect(projectile.isActive).toBe(false);
  });

  // Confirm that terrain deformation from explosions is applied exactly once
  it('applies terrain destruction once when an explosion finishes', () => {
    const terrain = { applyExplosion: vi.fn() };
    const explosion = new Explosion(createVector(50, 70), terrain, null, { maxRadius: 30, duration: 10 });

    // Advance time beyond explosion duration to trigger completion
    explosion.update(11);
    explosion.update(11);

    // Terrain should not be carved twice for the same explosion animation.
    expect(explosion.finished).toBe(true);
    expect(explosion.hasAppliedTerrain).toBe(true);
    expect(terrain.applyExplosion).toHaveBeenCalledTimes(1);
    expect(terrain.applyExplosion).toHaveBeenCalledWith(expect.objectContaining({ x: 50, y: 70 }), 30);
  });
});