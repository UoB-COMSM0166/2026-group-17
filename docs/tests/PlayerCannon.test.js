import { describe, it, expect, beforeAll } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

beforeAll(() => loadGameFiles([
  'AbstractWeapon.js', 'Projectile.js', 'CannonBall.js', 'Bubblegumshot.js', 'PlayerCannon.js',
]));

function makeCannon(loadout) {
  return new PlayerCannon({
    position: createVector(100, 200),
    wheelRadius: 20,
    barrelSize: createVector(40, 10),
    barrelAngle: 0,
    fillColor: color(255, 0, 0),
    strokeColor: color(0),
    moveSteps: 3,
    weaponLoadout: loadout,
  });
}

describe('PlayerCannon - loadout and firing behaviour', () => {

  // Verify that firing a weapon creates a Projectile and consumes it from the loadout
  it('fires the currently selected weapon as a Projectile and records firing power', () => {
    const cannon = makeCannon([new Bubblegumshot()]);
    cannon.barrelPower = 500;
    const shot = cannon.fireCurrentWeapon();
    expect(shot).toBeInstanceOf(Projectile);
    expect(cannon.lastFiredPower).toBe(500);
    expect(cannon.weaponLoadout).toHaveLength(0);
  });
  //Ensure that barrel angle affects the projectile launch direction
  it('different angles produce different projectile directions', () => {
    const cannon1 = makeCannon([new CannonBall()]);
    cannon1.barrelPower = 100;
    cannon1.barrelAngle = 0;
    const shot1 = cannon1.fireCurrentWeapon();
    const cannon2 = makeCannon([new CannonBall()]);
    cannon2.barrelPower = 100;
    cannon2.barrelAngle = Math.PI / 2;
    const shot2 = cannon2.fireCurrentWeapon();
    expect(shot1.velocity.x).not.toBeCloseTo(shot2.velocity.x);
    expect(shot1.velocity.y).not.toBeCloseTo(shot2.velocity.y);
  });

  // Ensure weapon selection cycles correctly forward and backward through the loadout
  it('cycles selected weapon index forward and backward within the loadout', () => {
    const cannon = makeCannon([new CannonBall(), new Bubblegumshot()]);

    expect(cannon.currentWeapon.id).toBe('cannon_ball');
    cannon.cycleWeapon(1);
    expect(cannon.currentWeapon.id).toBe('bubblegumshot');
    cannon.cycleWeapon(-1);
    expect(cannon.currentWeapon.id).toBe('cannon_ball');
  });

  // Check that movement targets are constrained within valid canvas boundaries
  it('clamps movement target to the canvas bounds', () => {
    const cannon = makeCannon([new CannonBall()]);
    cannon.setTargetX(-100, 800);
    expect(cannon.targetX).toBe(20);
    cannon.setTargetX(1000, 800);
    expect(cannon.targetX).toBe(780);
  });
});