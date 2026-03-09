class ScoreCalculator {
  //Calculate score impact of an explosion
  calculateExplosionScore(explosion, players, shooterId) {
  //Determine enemy player id
  const enemyId = 1 - shooterId;
  //Get shooter and enemy objects
  const shooter = players[shooterId];
  const enemy = players[enemyId];
  //Check in case players are missing
  if(!shooter || !enemy) return { enemy: 0, self: 0 };
  //Calculate score for enemy hit
  const enemyPts = this.#calculateHit(explosion, enemy);
  //Calculate score for self damage
  const selfPts  = this.#calculateHit(explosion, shooter);
    //Return score results
    return { enemy: enemyPts, self: selfPts };
  }

//Private method that calculates his score 
//based on explosion distance
#calculateHit(explosion, cannon) {
  //If cannon object does not exist, return 0
  if(!cannon) return 0;
  //Calculate distance from explosion center to cannon position
  const dx = cannon.positionVector.x - explosion.x;
  const dy = cannon.positionVector.y - explosion.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  //Include the cannon's wheel radius in the hit detection.
  const hitRadius = explosion.maxRadius + cannon.wheelRadius;
  //If the cannon is outside the effective explosion radius, 
  //no score is given
  if (distance > hitRadius || isNaN(distance)) return 0;
  //Base score decreases as distance increases
  const base = map(distance, 0, explosion.maxRadius, 200, 0);

  let bonus = 0;
  //Bonus score depending on how close the hit is
  if (distance < explosion.maxRadius * 0.2) bonus = 80;
  else if (distance < explosion.maxRadius * 0.5) bonus = 40;
  //Final score
  return Math.floor(base + bonus);
}
}