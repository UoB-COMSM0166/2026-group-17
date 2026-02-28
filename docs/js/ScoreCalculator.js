class ScoreCalculator{
    constructor(terrain){
        //reference to Terrain object
        this.terrain = terrain;
    }
    //Calculate damage to cannon based on explosion
    calculateDamage(explosion, opponentCannons, alreadyScored){
    
      let frameScore = 0;//Total score gained from this explosion
      //Loop through all opponent cannons
      for(let i = 0; i < opponentCannons.length; i++){
      
      const targetCannon = opponentCannons[i];
        //Skip if already scored
        if (!alreadyScored.has(targetCannon)) {
          //Calculate horizontal distance from explosion to cannon
          const dx = targetCannon.position.x - explosion.x;
          //Calculate vertical distance using terrain height
          const dy = this.terrain.getHeightAt(targetCannon.position.x) - explosion.y;
          //Calculate distance from explosion center to cannon
          const distanceToExplosion = Math.sqrt(dx * dx + dy * dy);
          //Apply damage only if cannon is inside explosion radius
          if(distanceToExplosion <= explosion.maxRadius){
            //Base damage decreases based on dsitance
            //100 damage at center, 0 damage at maxRadius
            let basePoints = map(
              constrain(distanceToExplosion, 0, explosion.maxRadius), 
              0, explosion.maxRadius, 100, 0);
            //Find the nearest other opponent cannon for bonus calculation
            let nearestCanonDistance = Infinity;
              for(let j = 0; j < opponentCannons.length; j++){
                const otherCannon = opponentCannons[j];
                if(otherCannon !== targetCannon) {
                  const dx2 = otherCannon.position.x - targetCannon.position.x;
                  const dy2 = this.terrain.getHeightAt(otherCannon.position.x) -
                              this.terrain.getHeightAt(targetCannon.position.x);
                  const distanceBetweenCannons = Math.sqrt(dx2 * dx2 + dy2 * dy2);
                  //Update minimum distance if closer cannon is found
                  if(distanceBetweenCannons < nearestCanonDistance){
                    nearestCanonDistance = distanceBetweenCannons;
                  }
                }
              }
              //Bonus points based on how close
              let bonusPoints = map(
              constrain(nearestCanonDistance, 0, 200),
              0, 200, 50, 0);

              //If player hits self, decrease points
              if(targetCannon.isSelf){
                frameScore -= Math.floor(basePoints + bonusPoints);
              } else {
                //Add total damage (base and bonus points) to frame score
                frameScore += Math.floor(basePoints + bonusPoints);
              }
              //Mark this cannon as already scored
              alreadyScored.add(targetCannon);
          }
        }
      }
    //Return total damage from this explosion
    return frameScore;
  }
}