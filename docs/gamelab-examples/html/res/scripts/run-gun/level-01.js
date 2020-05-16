var module = module || {};

module.exports = function() {


  function loadTiles() {

    var tiles = [];
    for (var x = 0; x < 200; x++) {

      var tile = new Gamelab.Sprite('./res/images/blocks/orange-brick.png');
      tile.position = new Gamelab.Vector(x * 100, 600);
      tile.Size(100, 100);

      tile.onLoad(function () {

        this.Size(100, 100);

      });

      gameWindow.add(tile);

      tiles.push(tile);

    }

    return tiles;

  };

  return loadTiles();

};
