class MovePadWidget {
  #positionVector;
  #p1; #p2; #p3;
  #plateOutlineColor;
  #plateFillColor;
  #isFollowing = false;
  #power = 0;
  #sliderX;

  constructor(posV = createVector(width / 2, height - height / 5),
    plateInColor = color('paleturquoise'),
    plateOutColor = color('teal')) {
    this.#positionVector = posV;
    this.#plateFillColor = plateInColor;
    this.#plateOutlineColor = plateOutColor;

    
  }

  get isFollowing() { return this.#isFollowing; }
  get isHovered() { return this.#isHovered() }
  set isFollowing(track) { this.#isFollowing = track; }


  drawMovePad() {
    
  }

  #drawBoard() {

  }

  #drawArrow() {
    constructor(posVec, direct){
        this.#positionVector = posV;
    }

    Push();
    beginShape();
    vertex(this.#positionVector.x - 6, this.#positionVector.y);
    vertex(this.#positionVector.x - 3, this.#positionVector.y - 3);
    vertex(this.#positionVector.x - 3, this.#positionVector.y - 1.5);
    vertex(this.#positionVector.x + 6, this.#positionVector.y - 1.5);
    vertex(this.#positionVector.x + 6, this.#positionVector.y + 1.5);
    vertex(this.#positionVector.x - 3, this.#positionVector.y + 1.5);
    vertex(this.#positionVector.x - 3, this.#positionVector.y + 3);
    end();
    pop();
  }

  #isHovered() {
    
  }

    

  
  #drawPowerText() {

  }
}