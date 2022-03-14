module.exports = function(imagename, numberMin, numberMax, sizeX) {


  for (var x = numberMin; x <= numberMax; x++) {

    var sprite = new Gamelab.Sprite(imagename + ' (' + x + ').png');

    sprite.xix = x - 1;

    var diffX = Math.abs(numberMin - numberMax) * sizeX;

    gameWindow.canvas.width = diffX;

    sprite.onLoad(function() {

      if (gameWindow.canvas.height !== this.size.y)
        gameWindow.canvas.height = this.size.y;


      //  gameWindow.canvas.width = this.xix * this.size.x;
      //  gameWindow.canvas.height = this.size.y;

      this.DRAWOFFSCREEN = true;

      this.Position(this.xix * this.size.x, 0);

      this.draw(gameWindow.ctx);
    });

    console.info(sprite);

  }

  return gameWindow;

};
