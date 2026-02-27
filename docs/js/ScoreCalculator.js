// ScoreCalculator.js
class ScoreCalculator {
 constructor(terrain) {
    this.terrain = terrain;
  }
  calculateHitPoints(explosion, cannon) {
  const cannonPos = cannon.position;
  const dx = cannonPos.x - explosion.x;
  const dy = cannonPos.y - explosion.y; 
  const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > explosion.maxRadius) return 0;
    const pts = map(
      constrain(distance, 0, explosion.maxRadius),
      0, explosion.maxRadius,
      100, 0
    );
    return Math.floor(pts);
  }
  calculateExplosionScore(explosion, players, shooterId) {
    const enemyId = 1 - shooterId;
    const enemyPts = this.calculateHitPoints(explosion, players[enemyId]);
    const selfPts  = this.calculateHitPoints(explosion, players[shooterId]);
    return { enemy: enemyPts, self: selfPts };
  }
}