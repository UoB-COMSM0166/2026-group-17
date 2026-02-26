console.log("TestExplosion success");
let explosion;

function setup(){
    createCanvas(800, 600);
}

function draw(){
    background(30);

    if(explosion){
        explosion.update();
        explosion.draw();
    }
}

function mousePressed(){
    explosion = new Explosion(mouseX, mouseY)
}