class ScoreCalculator {
  constructor(terrain) {
    this.terrain = terrain;
  }

  calculateExplosionScore(explosion, players, shooterId) {
  const enemyId = 1 - shooterId;

  const shooter = players[shooterId];
  const enemy = players[enemyId];
    
  if(!shooter || !enemy) return { enemy: 0, self: 0 };

  const enemyPts = this.#calculateHit(explosion, enemy);
  const selfPts  = this.#calculateHit(explosion, shooter);
 
    return { enemy: enemyPts, self: selfPts };
  }

  
#calculateHit(explosion, cannon) {
  if(!cannon) return 0;

  const dx = cannon.positionVector.x - explosion.x;
  const dy = cannon.positionVector.y - explosion.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > explosion.maxRadius || isNaN(distance)) return 0;

  const base = map(distance, 0, explosion.maxRadius, 100, 0);

  let bonus = 0;

  if (distance < explosion.maxRadius * 0.2) bonus = 30;
  else if (distance < explosion.maxRadius * 0.5) bonus = 10;

  return Math.floor(base + bonus);
}
}