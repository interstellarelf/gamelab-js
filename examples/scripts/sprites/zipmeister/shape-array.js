module.exports = function(rows, cols, containerSprite) {

  var sprite,
    spriteList = [],
    V = Gamelab.Vector;

  containerSprite.rows = rows;
  containerSprite.cols = cols;

  spriteList.hasIndexes = function(ix, iy) {

    var found = false;

    this.forEach(function(spr) {

      if (spr.ix == ix && spr.iy == iy) {
        found = true;
      }

    });

    return found;
  };

  containerSprite.subsprites = [];

  var sources = [
    './images/shapes/triangle-sheet.svg',
    './images/shapes/cross-sheet.svg',
    './images/shapes/square-sheet.svg',
  ];

  gameWindow.onResize(function() {

    var position = containerSprite.position;

    if (!position)
      return console.error('needs containerSprite w/ {position:{x, y}}');

    var greaterWidth = gameWindow.canvas.width > gameWindow.canvas.height ?
      true :
      false;

    var s = greaterWidth ?
      gameWindow.canvas.height / 3.5 :
      gameWindow.canvas.width / 3.5;


    var sx = s / rows,
      sy = s / cols;
    var paddingSizeX = sx * 0.1,
      paddingSizeY = sy * 0.1;

  });

  var spriteIndex = spriteIndex || 0;

  var ids = [];

  setTimeout(function() {

    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {

        var sprite = new Gamelab.Sprite('./images/shapes/circle-ripple.png');

        sprite.Size(3, 3);

        sprite.spriteIndex = spriteIndex;

        spriteIndex += 1;

        sprite.position.x = containerSprite.position.x + x * Program.shapeSize.x + Program.shapeSize.x / 2;
        sprite.position.y = containerSprite.position.y + y * Program.shapeSize.y + Program.shapeSize.y / 2;


        sprite.ix = x;
        sprite.iy = y;


        sprite.getX = function(ix) {

          return containerSprite.position.x + ix * Program.shapeSize.x + Program.shapeSize.x / 2;
        };

        sprite.getY = function(ix) {

          return containerSprite.position.y + ix * Program.shapeSize.y + Program.shapeSize.y / 2;
        };

        sprite.onUpdate(function() {

          if (Gamelab.isPaused()) {
            return;
          }


          this.position.x = this.getX(this.ix);
          this.position.y = this.getY(this.iy);

        });

        gameWindow.add(sprite);

      }
    }

  }, 5000);

  function getAllSpritesByKeyVal(ixKey, value) {

    var $sprites = [];

    spriteList.forEach(function(spr) {

      if (spr && spr[ixKey] == value) {
        $sprites.push(spr);
      }

    });

    return $sprites;

  };

  function addSprite(x, y) {

    var position = containerSprite.position;

    if (!position)
      return console.error('needs containerSprite w/ {position:{x, y}}');

    var greaterWidth = gameWindow.canvas.width > gameWindow.canvas.height ?
      true :
      false;

    var s = greaterWidth ?
      gameWindow.canvas.height / 3.5 :
      gameWindow.canvas.width / 3.5;


    var sx = s / rows,
      sy = s / cols;
    var paddingSizeX = sx * 0.1,
      paddingSizeY = sy * 0.1;

    if (paddingSizeX > 0)
      Program.shapePadding = paddingSizeX;


    var index = (x * cols) + y,
      source_index = Math.round(Math.random() * 2.0);

    var src = sources[source_index];

    sprite = new Gamelab.Sprite(src);

    sprite.gameType = 'enemy-shape';

    sprite.movementBusy = false;

    Object.defineProperty(sprite, 'ix', {
      value: x,
      writable: true
    });

    Object.defineProperty(sprite, 'iy', {
      value: y,
      writable: true
    });

    sprite.Pos(sx * x, sy * y);

    sprite.position = sprite.position.add(position);

    sprite.spin = function(target, multiple) {
      var diff = target - this.rotation.x;
      this.rotation.x += diff * multiple;
    };


    sprite.seekScale = function(scale, multiple) {
      var scaleDiff = scale - this.scale;
      this.scale += scaleDiff * multiple;
      if (this.scale > 1.0) {
        this.scale = 1.0;
      }

      this.Scale(this.scale);
    };


    sprite.setIX = function(value) {

      this.ix = value;
    }

    sprite.setIY = function(value) {
      this.iy = value;
    }

    sprite.onUpdate(function() {

      if (Gamelab.isPaused()) {
        return;
      }

      var position = containerSprite.position;

      var greaterWidth = gameWindow.canvas.width > gameWindow.canvas.height ?
        true :
        false;

      var s = greaterWidth ?
        gameWindow.canvas.height / 3.5 :
        gameWindow.canvas.width / 3.5;


      var sx = s / containerSprite.rows,
        sy = s / containerSprite.cols;
      var paddingSizeX = sx * 0.1,
        paddingSizeY = sy * 0.1;

      var p = this.position.sub(position);

      //  console.log(sx);
      //  console.log(sy);

      var $sprite = this;

      var target = position.add(new Gamelab.Vector(sx * this.ix, sy * this.iy));

      if (!this.movementBusy && (this.position.x !== target.x || this.position.y !== target.y)) {

        this.movementBusy = true;

        this.SlideToPosition(target.x, target.y, 200, function() {

          $sprite.movementBusy = false;

        });

      }


      this.Size(sx - paddingSizeX, sy - paddingSizeY);


      Program.shapeSize = new Gamelab.Vector(sx, sy);

      this.timer += 1;

      if (this.timer % 10000 < 100) {
        this.spin(180, 0.02);


      } else if (this.timer % 10000 < 200) {
        this.spin(0, 0.02);
      }


    });

    sprite.colorKey = 'green';


    sprite.onLoad(function() {

      this.cashValue = 0.20;

      this.anime.FrameSize(64, 64).Size(64, 64).FrameBounds(new V(0, 0), new V(0, 0), new V(0, 0));

      this.colorAnimations = this.colorAnimations || {};

      this.colorAnimations.green = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(0, 0), new V(0, 0), new V(0, 0));
      this.colorAnimations.yellow = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(1, 0), new V(1, 0), new V(1, 0));
      this.colorAnimations.red = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(2, 0), new V(2, 0), new V(2, 0));

      this.colorAnimations.red = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(3, 0), new V(3, 0), new V(3, 0));
      this.colorAnimations.yellow = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(4, 0), new V(4, 0), new V(4, 0));
      this.colorAnimations.green = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(5, 0), new V(5, 0), new V(5, 0));


      this.colorKey = 'green';



      var ix = Math.floor(Math.random() * 6.0);

      if (ix == 0) {
        this.Anime(this.colorAnimations.green);
        this.colorKey = 'green';
      }

      if (ix == 1) {
        this.Anime(this.colorAnimations.yellow);
        this.colorKey = 'yellow';
      }
      if (ix == 2) {
        this.Anime(this.colorAnimations.red);
        this.colorKey = 'red';
      }
      if (ix == 3) {
        this.Anime(this.colorAnimations.red);
        this.colorKey = 'red';
      }
      if (ix == 4) {
        this.Anime(this.colorAnimations.yellow);
        this.colorKey = 'yellow';
      }
      if (ix == 5) {
        this.Anime(this.colorAnimations.green);
        this.colorKey = 'green';
      }

      this.Life(8000000000); //sprite has long life to start

      this.timer = Math.round(Math.random() * 10000);

      //timer is randomized between 0 and BASICANIMATIONDURATION
      var greaterWidth = gameWindow.canvas.width > gameWindow.canvas.height ?
        true :
        false;

      var s = greaterWidth ?
        gameWindow.canvas.height / 3.5 :
        gameWindow.canvas.width / 3.5;

      var sx = s / rows,
        sy = s / cols;
      this.Size(sx - paddingSizeX, sy - paddingSizeY);


      if (Program.shapeSize) {
        this.initSize = new Gamelab.Vector(Program.shapeSize);
        this.initScale = this.size.x / this.image.domElement.width;
      }

      this.scale = this.initScale;

      this.alive = true;

      //  console.log(this.initScale);

    });


    sprite.occupiesX = x;
    sprite.occupiesY = y;

    sprite.Layer(10);

    Program.shapes.push(sprite);

    gameWindow.add(sprite);
    spriteList.push(sprite);

    containerSprite.subsprites.push(sprite);
    Program.enemies.push(sprite);

  };

  return {
    sprites: spriteList,
    getAllSpritesByKeyVal: getAllSpritesByKeyVal,
    rows: rows,
    cols: cols,
    addSprite: addSprite
  };

};
