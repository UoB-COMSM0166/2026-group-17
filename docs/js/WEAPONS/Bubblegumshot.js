class Bubblegumshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'bubblegumshot', name: 'Bubblegumshot',
      description: 'Sticky and explosive!',
      damage: 9, 
      speed: 8, 
      blastRadius: 9, 
      ammo: 3, 
      rarity: 'rare',
      shotRadius: 5, 
      explosionRadius: 110,
    });
    this.used = false;
  }
  drawProjectile(cx, cy, r) {
        if (typeof bubblegumImg !== "undefined" && bubblegumImg) {
      push();
      imageMode(CENTER);
      image(bubblegumImg, cx, cy, 68, 68);
      pop();
      return;
    }
    push();
    translate(cx, cy);
    noStroke();
    fill(160, 160, 160);
    ellipse(0, 0, r*1.8, r*0.7);
    fill(220, 60, 40);
    triangle(-r*1.6, -r*0.35, -r*1.6, r*0.35, -r*2.5, 0);
    fill(100, 100, 100);
    triangle(r*1.1, 0, r*1.9, -r*0.9, r*1.5, 0);
    triangle(r*1.1, 0, r*1.9,  r*0.9, r*1.5, 0);
    pop();
  }

  onImpact(match, impactEvent, shot){
    
    const impactPos = impactEvent.pos ?? impactEvent.position;
    if(!impactPos) return;
    //Spawn the normal explosion effect
    match.spawnWeaponExplosion(impactPos, "bubblegumshot", shot, this);
    //Get match state
    const players = match.getPlayers();
    const turnController = match.getTurnController();
    const shooterId = match.getLastShooterId();
    //Target the opponent
    const targetId = 1 - shooterId;
    const target = players[targetId];
    //Calculate distance from explosion center to target
    const d = dist(
      impactPos.x,
      impactPos.y,
      target.position.x,
      target.position.y
    );

    //If it is within explosion ratius, apply sticky effect
    if(d <= this.explosionRadius){

        target.stuckUntilTurn = Math.max(
        target.stuckUntilTurn, 
        turnController.turnNumber + 1
        );
      target.triggerHitFlash(10);
    }
  }
}
