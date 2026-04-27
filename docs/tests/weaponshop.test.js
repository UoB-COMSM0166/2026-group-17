import { describe, it, expect, beforeAll } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

beforeAll(() => loadGameFiles([
  'DrawUtils.js',
  'AbstractWeapon.js',
  'CannonBall.js', 'Bubblegumshot.js', 'Earthworm.js', 'Lazershot.js', 'Impactgun.js',
  'Submarinshot.js', 'Pineappleshot.js', 'Shibashot.js', 'Starshot.js', 'Grapeshot.js',
  'WEAPON_REGISTRY.js', 'WeaponShop.js',
]));

describe('WeaponShop - pre-match loadout selection', () => {
  // Verify that the weapon registry is complete and contains all expected weapon IDs
  it('contains the full weapon registry used by the shop', () => {
    expect(WEAPON_REGISTRY).toHaveLength(10);
    expect(WEAPON_REGISTRY.map((weapon) => weapon.id)).toEqual(expect.arrayContaining([
      'cannon_ball', 'bubblegumshot', 'earthworm', 'lazer', 'impact',
      'Submarin', 'pineapple', 'shiba', 'star', 'grapeshot',
    ]));
  });

  // Ensure that weapon selection alternates correctly between Player 1 and Player 2
  it('alternates picks between Player 1 and Player 2 until both loadouts are complete', () => {
    const shop = new WeaponShop(1280, 720, 2);
    shop.selectWeaponByIndex(0);
    shop.selectWeaponByIndex(1);
    shop.selectWeaponByIndex(2);
    shop.selectWeaponByIndex(3);
    expect(shop.isDone()).toBe(true);

    // Validate that each player received the correct weapons in alternating order
    expect(shop.getLoadout(0).map((w) => w.id)).toEqual(['cannon_ball', 'earthworm']);
    expect(shop.getLoadout(1).map((w) => w.id)).toEqual(['bubblegumshot', 'lazer']);
  });

  // Confirm that invalid selections are ignored
  it('does not allow duplicate weapons or out-of-range indices', () => {
    const shop = new WeaponShop(1280, 720, 2);

    // Attempt invalid selections: duplicate and out-of-bounds indices
    shop.selectWeaponByIndex(0);
    shop.selectWeaponByIndex(0);
    shop.selectWeaponByIndex(-1);
    shop.selectWeaponByIndex(999);

    // Only the first valid selection should be applied
    expect(shop.getLoadout(0)).toHaveLength(1);
    expect(shop.getLoadout(1)).toHaveLength(0);

    // Selection process should not be marked complete due to invalid inputs
    expect(shop.isDone()).toBe(false);
  });
});