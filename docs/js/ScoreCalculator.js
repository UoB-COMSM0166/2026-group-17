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
  }
  //Legacy score calculation based on max radius
  calculateScore(explosion) {
    return Math.floor(explosion.maxRadius);
  }
}