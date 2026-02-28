class ScoreCalculator{
    constructor(terrain){
        //reference to Terrain object
        this.terrain = terrain;
    }

    //Calculate damage to cannon based on explosion
    calculateDamage(explosion, opponentCannon){
    const cannonPos = opponentCannon.position;
    const dx = cannonPos.x - explosion.x;
    const dy = this.terrain.getHeightAt(cannonPos.x) - explosion.y;

    const distance = Math.sqrt(dx * dx + dy * dy);
    //Map distance to damages
    //closer to enemy ->enemy get more damage, further to enemy -> enemy get less damage
    const damage = map(
        constrain(distance, 0, explosion.maxRadius), 
        0, explosion.maxRadius, 100, 0);

    return Math.floor(damage);
  }
  //Legacy score calculation based on max radius
  calculateScore(explosion) {
    return Math.floor(explosion.maxRadius);
  }
}