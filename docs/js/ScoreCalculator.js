class ScoreCalculator{
    constructor(terrain){
        //reference to Terrain object
        this.terrain = terrain;
    }

    //Calculate damage to cannon based on explosion position
    calculateDamage(explosion, enemyCannon){
    //Position of the enemy's cannon
    const cannonPos = enemyCannon.position;
    //Horizontal distance between enemy's cannon and esplosion position
    const dx = cannonPos.x - explosion.x;
    //Vertical distance between enemy's cannon terrain height and explosion position
    const dy = this.terrain.getHeightAt(cannonPos.x) - explosion.y;
    //Calculate distance from explosion position to enemy's cannon 
    const distance = Math.sqrt(dx * dx + dy * dy);
    //Map distance to damages
    //closer to enemy ->enemy get more damage, further to enemy -> enemy get less damage
    //100 damage when explosion is very close, 0 damage when at max radius
    const damage = map(
        constrain(distance, 0, explosion.maxRadius), 
        0, explosion.maxRadius, 100, 0);
    //Return the damage rounded down to on intefer
    return Math.floor(damage);

    //Calculate damage to cannon based on explosion
    calculateDamage(explosion, opponentCannons, alreadyScored){
    
      let frameScore = 0;
      
      for(let i = 0; i < opponentCannons.length; i++){
      const targetCannon = opponentCannons[i];
      //Skip if already scored
        if (!alreadyScored.has(targetCannon)) {
         //Distance from explosion center to cannon
        const dx = targetCannon.position.x - explosion.x;
        const dy = this.terrain.getHeightAt(targetCannon.position.x) - explosion.y;
        const distanceToExplosion = Math.sqrt(dx * dx + dy * dy);
        //Map distance to damages
        //closer to enemy ->enemy get more damage, further to enemy -> enemy get less damage
      if(explosion.radius >= distanceToExplosion){
        let basePoints = map(
        constrain(distanceToExplosion, 0, explosion.maxRadius), 
        0, explosion.maxRadius, 100, 0
      );
    //Add bonus based on proximity to other opponent cannons
    let nearestCanonDistance = Infinity;
    for(let j = 0; j < opponentCannons.length; j++){
      const otherCannon = opponentCannons[j];
      if(otherCannon !== targetCannon) {
      const dx2 = otherCannon.position.x - targetCannon.position.x;
      const dy2 = this.terrain.getHeightAt(otherCannon.position.x) -
                  this.terrain.getHeightAt(targetCannon.position.x);
      const distanceBetweenCannons = Math.sqrt(dx2 * dx2 + dy2 * dy2);

      //Update minimum distance
      if(distanceBetweenCannons < nearestCanonDistance){
        nearestCanonDistance = distanceBetweenCannons;
      }
    }
  }

  //If explosion is close to opponent canon, add bonus points
  let bonusPoints = map(
    constrain(nearestCanonDistance, 0, 200),
    0, 200, 50, 0);
  
  frameScore += Math.floor(basePoints + bonusPoints);

  alreadyScored.add(targetCannon);
  }
}
}
return frameScore;
}
  //Legacy score calculation based on max radius
  calculateScore(explosion) {
    return Math.floor(explosion.maxRadius);
  }
}