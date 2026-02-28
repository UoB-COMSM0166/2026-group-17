class ScoreCalculator {
  constructor(terrain) {
    this.terrain = terrain;
  }

  calculateExplosionScore(explosion, players, shooterId) {
    const enemyId = 1 - shooterId;

    const enemyPts = this.#calculateHit(explosion, players[enemyId]);
    const selfPts  = this.#calculateHit(explosion, players[shooterId]);

    return { enemy: enemyPts, self: selfPts };
  }

  
#calculateHit(explosion, cannon) {
  const dx = cannon.position.x - explosion.x;
  const dy = cannon.position.y - explosion.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > explosion.maxRadius) return 0;

  const base = map(distance, 0, explosion.maxRadius, 100, 0);

  let bonus = 0;

  if (distance < explosion.maxRadius * 0.2) bonus = 30;
  else if (distance < explosion.maxRadius * 0.5) bonus = 10;

  return Math.floor(base + bonus);
}
}