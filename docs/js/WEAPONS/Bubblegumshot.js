class Bubblegumshot extends AbstractWeapon {
  constructor() {
    super({
      id: 'bubblegumshot', name: 'Bubblegumshot',
      description: 'A cute pink bubblegum-like gun with a sticky. \nStick to the opponent cannon, preventing movement and skipping the opponent\'s next turn.',
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

  drawIcon(x, y, size){
   if(!bubblegumImg) return;

   push();
   imageMode(CENTER);
   image(bubblegumImg, x, y, 60, 60);
   pop();
  }
  
  drawProjectile(cx, cy, r) {

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

  
  drawExplosion(explosion){
    const x = explosion.position.x;
    const y = explosion.position.y;
    const r = explosion.radius;
    const t = explosion.progress;

    push();
    translate(x, y);
    //Squash and strech effect
    const squash = 1 + sin(t * PI) * 0.3;
    const strech = 1 - sin(t * PI) * 0.2;
    scale(squash, strech);

    noStroke();
    //Outer soft bubble
    fill(255, 150, 200, 50);
    ellipse(0, 0, r * 2.5, r * 2.2);
    //Main sticky bubble body
    fill(255, 100, 180, 140);
    circle(0, 0, r * 1.8, r * 1.6);
    //Inner bubble
    fill(255, 60, 150, 180);
    ellipse(0, 0, r * 1.0, r * 0.9);
    //Highlight
    fill(255, 255, 255, 120);
    ellipse(-r * 0.3, -r * 0.3, r * 0.5, r * 0.3);
    //Sticky
    stroke(255, 120, 180, 140);
    strokeWeight(2);

    for(let i = 0; i < 5; i++){
      let threadAngle = (frameCount * 0.04 + i) * PI / 2.5;
      let threadLength = r * (0.6 + sin(t * PI + i) * 0.3);
      
      let wobble = sin(frameCount * 0.1 + i) * 3;
      //Curve
      let endX = cos(threadAngle) * threadLength + wobble;
      let endY = sin(threadAngle) * threadLength + wobble;
      
      noFill();
      beginShape();
      vertex(0, 0);
      line(0, 0, endX, endY);
      endShape();
    }
    pop();
  }

  onImpact(match, impactEvent, shot){
    
    const rawPos = impactEvent?.pos;
    if(!rawPos || rawPos.x == null || rawPos.y == null) return;
    const impactPos = rawPos.copy ? rawPos.copy() : createVector(rawPos.x, rawPos.y);
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
      const turnController = match.getTurnController();
      //Opponent cannot act for next 1 full turn
      target.stuckUntilTurn = Math.max(
        target.stuckUntilTurn, 
        turnController.turnNumber + 1
      );
    }
  }
}
