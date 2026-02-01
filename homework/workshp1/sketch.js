let currentColor;
let brushSize = 20;

function setup() {
  createCanvas(1000, 1000);
  background(255);      
  currentColor = color(51);
  fill(255, 0, 0); 
  textSize(16); // size of text
  textAlign(CENTER); // in the center
  text("This is a painting game", width / 2, 30); 
  text(" R, G, B for Changing Colour | C for Cleaning Screen | S for Saving", width / 2, 55);
}

function draw() {
  if (mouseIsPressed) {   
    fill(currentColor);
    noStroke();
    ellipse(mouseX, mouseY, brushSize, brushSize);
  }
}

function keyPressed() {
  //if you want to change colour just use keyboard
  if (key === 'R') currentColor = color(255, 0, 0);
  if (key === 'G') currentColor = color(0, 255, 0);
  if (key === 'B') currentColor = color(0, 0, 255);
//if you want to change the size of brush:
  if (key === '=') brushSize += 5;
  if (key === '-') brushSize -= 5;
  if (key ==='C') clear();

  brushSize = constrain(brushSize, 5, 100);
  //save your work
  if (key === 'S') {
    save('myCanvas.jpg');
}
}

