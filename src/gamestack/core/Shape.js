


class Elipse{

  constructor(pos, size){
    this.position = new Gamestack.Vector(0, 0, 0);
    this.size = new Gamestack.Vector(0, 0, 0);
    this.rotation = new Gamestack.Vector(0, 0, 0);
    this.Pos(pos);
    this.Size(size);
  }

  draw(){
              var halfX = (this.size.x / 2);
              var halfY = (this.size.y / 2);
              Gamestack.Canvas.arc(this.position, new Gamestack.Vector(halfX, halfY));
  }

}

Gamestack.Elipse = Elipse;
