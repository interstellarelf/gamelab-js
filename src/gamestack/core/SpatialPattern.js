



class SpatialPattern {

  constructor(src, unitSize){
    this.objects= [];
    this.basicGridChunk = new Gamestack.Sprite(src).Size(unitSize, unitSize);

  }

  StepFunction(call){
    this.call = call || function(){};
    return this;
  }

  add(sprite)
  {
    this.objects.push(sprite);

  }

  Min(m1, m2){
    this.min = new Gamestack.Vector(m1, m2);
    return this;
  }
  Max(m1, m2){
    this.max = new Gamestack.Vector(m1, m2);
    return this;
  }

  Fill(callback){

    for(var x = this.min.x; x < this.max.x; x++)
    {

      for(var y = this.min.y; y < this.max.y; y++)
      {

       if(this.call(x, y))
       {

         var chunk = new Gamestack.Sprite().FromData(this.basicGridChunk);

         chunk.target_x = x;
         chunk.target_y = y;

         chunk.onLoad(function(){

          //  this.Size();

          this.Position(this.target_x, this.target_y);

         });

          this.add(chunk);

       }
      }
    }


    callback(this.objects);

  }

}


Gamestack.SpatialPattern = SpatialPattern;
