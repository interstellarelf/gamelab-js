function PositionController(sprite) {
  var positionController = new Gamelab.Sprite('./res/images/position-square.png');
  positionController.sprite = sprite;
  positionController.sizeSprite = new Gamelab.Sprite('./res/images/rectangle.png');

  positionController.Layer(10000)
  positionController.onUpdate(function() {
    this.sizeSprite.Position(this.sprite.position);
    this.sizeSprite.Size(this.sprite.size);
    if (this.isHovered(this.mouse, this.gameWindow)) {
      this.positionerHovered = true;
      if (this.mouse.down) {
        this.hoverMouseDown = true;
      }
      var $ctrl = this;
      if ($ctrl.resetPositioner) {
        clearTimeout($ctrl.resetPositioner);
      }
      $ctrl.resetPositioner = setTimeout(function() {
        $ctrl.positionerHovered = false;
        $ctrl.hoverMouseDown = false;
      }, 100);
    }

    if (this.positionerHovered) {
      this.Size(22, 22);
      if (this.mouse.down) {
        this.Position(new Gamelab.Vector(this.mouse.position).sub(this.size.div(2)));
        this.sprite.Position(new Gamelab.Vector(this.mouse.position).sub(this.mouse.travelledSize).sub(this.sprite.size.div(2)));
      }
    } else {
      this.Size(20, 20);
    }


    this.Position(this.sprite.position.add(this.sprite.size.div(2)).sub(this.size.div(2)));
  });
  return positionController;
};

function PositionMouseControlSprite(sprite, gameWindow) {
  sprite.positionController = new PositionController(sprite);

  var pSprites = [sprite.positionController];

  var mouse = {
    position: new Gamelab.Vector(0, 0),
    down: false
  };

  gameWindow.canvas.addEventListener('mousemove', function(evt) {
    console.info('hover::', evt);
    var rect = gameWindow.canvas.getBoundingClientRect(),
      position = {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };

    mouse.position = position;
    if (mouse.lastPosition) {
      mouse.travelledSize = mouse.lastPosition.sub(mouse.position);
    } else {
      mouse.travelledSize = new Gamelab.Vector(0, 0);
    }
    mouse.lastPosition = new Gamelab.Vector(mouse.position);
  });

  gameWindow.canvas.addEventListener('mousedown', function(evt) {
    mouse.down = true;
  });

  gameWindow.canvas.addEventListener('mouseup', function(evt) {
    mouse.down = false;
  });

  gameWindow.canvas.addEventListener('mouseout', function(evt) {
    mouse.down = false;
  });

  gameWindow.canvas.addEventListener('mouseaway', function(evt) {
    mouse.down = false;
  });

  pSprites.forEach(function(s) {
    gameWindow.add(s);
    gameWindow.add(s.sizeSprite);
    s.gameWindow = gameWindow;
    s.mouse = mouse;
  });

  gameWindow.controllerUpdate = function() {
    var pointer = false;
    this.drawables.forEach(function(item) {
      if (item.sizerHovered || item.positionerHovered) {
        pointer = true;
      }
    });

    if (pointer) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  };

  gameWindow.onUpdate(function() {
    gameWindow.controllerUpdate();
  });

  Object.keys(PositionActionSpriteFxns).forEach(function(key) {
    pSprites.forEach(function(s) {
      s[key] = PositionActionSpriteFxns[key];
    });
  });

  return sprite;
};

let PositionActionSpriteFxns = {
  /**
   * returns a true || false value for immediate color-collision --non-transparent-pixels --between colored-pixels of this sprite and the sprite argument
   * @function
   * @memberof Sprite
   * @param {Sprite} spr the sprite object to be collided
   * @returns {boolean} a true or false value to show if collision is happening
   **********/

  isHovered(mouse, gameWindow) {
    let mouseObject = {};
    //allow position either as direct argument or nested inside the argument
    if (mouse.x && mouse.y) {
      mouseObject.position = mouse;
    } else if (mouse.position) {
      mouseObject.position = mouse.position;
    }
    mouseObject.size = new Gamelab.Vector(1, 1);
    if (Gamelab.Collision.pointInBox(mouseObject.position, this, gameWindow)) {

      return true;
    }
    return false;
  },


  onHoverUpdate: function(gameWindow, callback) {
    let sprite = this;
    let canvas = gameWindow.canvas;
    canvas.addEventListener('mousemove', function(evt) {
      console.info('hover::', evt);
      var rect = canvas.getBoundingClientRect(),
        position = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      if (sprite.isHovered(position, gameWindow)) {
        callback(true, position);
      } else {
        callback(false, position);
      }
    });
  },

  onClick: function(gameWindow, callback) {
    let sprite = this;
    let canvas = gameWindow.canvas;
    canvas.addEventListener('click', function(evt) {
      //console.info('click::', evt);
      var rect = canvas.getBoundingClientRect(),
        position = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      if (sprite.isHovered(position, gameWindow)) {
        callback();
      }
    });
  }
};