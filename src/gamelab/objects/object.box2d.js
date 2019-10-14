


class Box2D{

  constructor(pos, size){
    this.Position(pos | 0);
    this.Size(size | 0);
  }

  Position(x, y)
  {
    this.position = new Gamelab.Vector(x, y);
    return this;
  }
  Size(x, y)
  {
    this.size = new Gamelab.Vector(x, y);
    return this;
  }

}



Gamelab.Box2D = Box2D;
