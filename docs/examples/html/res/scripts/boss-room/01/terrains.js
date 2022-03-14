function loadTexelMap(level, gameWindow, collection = {}) {

  console.info(level.data.texels);

  var texels = level.data.texels.texels,

    ux = level.data.unit_size.x,

    uy = level.data.unit_size.y;

  min = level.data.unit_size.min,
    max = level.data.unit_size.max;

  var spr, spritesPerRow;

  spr = spritesPerRow = Math.floor(4000 / 20) + 1;

  var count = 0;

  collection.rowSize = spr;

  var LevelOffsetVertical = 500;


  var tiles = [];

  for (var x = 0; x < texels.length; x++) {

    if (texels[x] == 0) {
      continue;
    } else {

      var sprite;

      if (texels[x].name.indexOf('stone-01') >= 0 || texels[x].name.indexOf('stone-02') >= 0) {

        sprite = new Gamelab.Sprite('./res/images/blocks/stone-block.png');

        collection.tiles.push(sprite);

        tiles.push(sprite);

        sprite.invisible = true;

        collection.terrains.push(sprite);
      }


      if (texels[x].name.indexOf('watertop') >= 0) {

        sprite = new Gamelab.Sprite('./res/images/elements/water.png');

        sprite.active = false;

        collection.waterTop.push(sprite);
      } else if (texels[x].name.indexOf('water') >= 0) {

        sprite = new Gamelab.Sprite('./res/images/elements/water.png');


        sprite.active = false;

        collection.waterTiles.push(sprite);
      }

      if (!sprite) {
        continue;
      }


      sprite.Size(80, 80);

      var rowIx = x % spr,
        colIx = Math.floor(x / spr);

      sprite.Position(rowIx * 80, colIx * 80 + LevelOffsetVertical);

      sprite.onLoad(function() {


      });



      gameWindow.add(sprite);

    }


  }

  console.info(collection);


  collection.tiles.maxX = function(){
    var maxX = new Gamelab.Vector(-Infinity, -Infinity);
    for(var x  = 0; x < this.length; x++ )
    {
      var p = this[x].position;
      if(p.x > maxX.x)
      {
        maxX = p;
      }
    }
    return maxX;
  };

  collection.tiles.maxY = function(){
    var maxY = new Gamelab.Vector(-Infinity, -Infinity);
    for(var x  = 0; x < this.length; x++ )
    {
      var p = this[x].position;
      if(p.y > maxY.y)
      {
        maxY = p;
      }
    }
    return maxY;
  };

  return collection;

};

module.exports = function() {

  var xmlhttp = new XMLHttpRequest();
  var url = "http://localhost:8080/examples/res/scenes/jungle-gym.json";

  var $data = {
    level: {},
    sprites: {
      terrains:[],
      waterTop:[],
      waterTiles:[],
      tiles:[]
    }
  };

  var done = false;

  xmlhttp.onreadystatechange = function() {

    if (done)
      return;

    if (this.readyState == 4 && this.status == 200) {
      $data.level = JSON.parse(this.responseText);
      loadTexelMap($data.level, gameWindow, $data.sprites);
      console.info($data);
      done = true;
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();


  return $data.sprites;

};
