
var levelWidth = 20000, levelHeight = 20000;

module.exports = function(){

  for(var x = 0; x <= levelWidth; x+= 1000)
  {
      for(var y = 0; y <= levelHeight; y+= 1000)
      {
            var skyTile = new Gamelab.Sprite('./res/images/sky/sky.png').Layer(-100);

            skyTile.scrollFactor =  0.5;
            skyTile.Size(1000, 1000);
            skyTile.Position(x - 2000, y - 2000);

            if(x % 2000 == 0)
            {
              skyTile.flipX = true;
            }
            if(y % 2000 == 0)
            {
              skyTile.flipY = true;
            }
            skyTile.onLoad(function(){

            });
            gameWindow.add(skyTile);
      }
  }

};
