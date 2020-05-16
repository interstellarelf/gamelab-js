

class Water{


  constructor(tiles, gameWindow){

    if(tiles.length == 0)
    return [];

    this.tiles =  tiles;

    console.info('Water --tiles:', tiles);

    tiles.minX = function(){

        var min_point = new Gamelab.Vector(Infinity, Infinity);

        for(var x = 0; x < this.length; x++)
        {

            if(this[x].position.x < min_point.x)
            {
              min_point = this[x].position;
            }
        }

        return min_point;
    };


    tiles.minY = function(){

        var min_point = new Gamelab.Vector(Infinity, Infinity);

        for(var x = 0; x < this.length; x++)
        {

            if(this[x].position.y < min_point.y)
            {
              min_point = this[x].position;
            }
        }

        return min_point;
    };


    tiles.maxX = function(){

        var max_point = new Gamelab.Vector(-Infinity, -Infinity);

        for(var x = 0; x < this.length; x++)
        {

            if(this[x].position.x > max_point.x)
            {
              max_point = this[x].position;
            }
        }

        return max_point;
    };


    tiles.maxY = function(){

      var max_point = new Gamelab.Vector(-Infinity, -Infinity);

      for(var x = 0; x < this.length; x++)
      {

          if(this[x].position.y > max_point.y)
          {
            max_point = this[x].position;
          }
      }

      return max_point;
    };

    this.min = new Gamelab.Vector(this.tiles.minX().x, this.tiles.minY().y);

    this.max = new Gamelab.Vector(this.tiles.maxX().x + this.tiles[0].size.x, this.tiles.maxY().y  + this.tiles[0].size.y);

    var line = new Gamelab.Line2D().Color('rgba(0, 200, 200, 0.3)').StepFunction(function (portion, ONE) {

      ONE = ONE || 1.0;

      if (this.offsetX > this.size.x)
        this.offsetX = this.size.x;

      portion += this.offsetX / this.size.x;

      return Math.sin(portion * (this.frequency));

    });


    line.offsetX = 0;

    line.Size( Math.abs(this.max.x - this.min.x), 20);

    line.shapeSize = new Gamelab.Vector( Math.abs(this.max.x - this.min.x), Math.abs(this.max.y - this.min.y));


    line.frequency = 10;

    line.fv = 0.2;

    line.ov = 10.0;

    line.Position(this.min.x, this.min.y + line.size.y);

    gameWindow.add(line);

    gameWindow.onBeforeDraw(function () {

    //  console.log('WATER LINE DRAW');

      line.points = [];

      line.frequency += line.fv;

      var maxFreq = line.size.x / 50;

      if (line.frequency > maxFreq - 2.0) {
        if (line.fv > -0.05)
          line.fv -= 0.001;

        if (line.frequency > maxFreq)
          line.frequency = maxFreq;
        }

      if (line.frequency < -maxFreq + 2.0) {

        if (line.fv < 0.05) {
                line.fv += 0.001;
        }

        if (line.frequency < -maxFreq) {
              line.frequency = -maxFreq;
        }

      }

      if (line.fv > 0.05) {
        line.fv = 0.05;
      }

      if (line.fv < -0.05)
        line.fv = -0.05;

      line.offsetX += line.ov;

      line.Fill();

      line.points.push(new Gamelab.Vector(line.position.x + line.size.x, line.position.y + line.shapeSize.y));

      line.points.push(new Gamelab.Vector(line.position.x,  line.position.y + line.shapeSize.y));

      line.points.push(new Gamelab.Vector(line.points[0]));

      line.fillStyle = 'rgba(0, 200, 200, 0.3)';


    });

  }

}



module.exports = function(waterTiles, gameWindow){

  var water = new Water(waterTiles, gameWindow);

  return water;
};
