

function MouseActionSprite(sprite){

  Object.keys(MouseActionSpriteFxns).forEach(function(key){
    sprite[key] = MouseActionSpriteFxns[key];
  });

  return sprite;
};

let MouseActionSpriteFxns = {
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
      if(mouse.x && mouse.y)
      {
        mouseObject.position = mouse;
      }
      else if(mouse.position)
      {
        mouseObject.position = mouse.position;
      }
      mouseObject.size = new Gamelab.Vector(1, 1);
      if(Gamelab.Collision.pointInBox(mouseObject.position, this, gameWindow))
      {
        return true;
      }
      return false;
    }
    ,



    onHoverUpdate:function(gameWindow, callback){

      let sprite = this;
      let canvas = gameWindow.canvas;

      canvas.addEventListener('mousemove', function(evt){

        console.info('hover::', evt);

        var rect = canvas.getBoundingClientRect(),
        position = {
             x: evt.clientX - rect.left,
             y: evt.clientY - rect.top
           };

        if(sprite.isHovered(position, gameWindow))
        {
          callback(true, position);
        }
        else{
          callback(false, position);
        }

      });

    },

    onClick:function(gameWindow, callback){

      let sprite = this;
      let canvas = gameWindow.canvas;

      canvas.addEventListener('click', function(evt){
        //console.info('click::', evt);

        var rect = canvas.getBoundingClientRect(),
        position = {
             x: evt.clientX - rect.left,
             y: evt.clientY - rect.top
           };

        if(sprite.isHovered(position, gameWindow))
        {
          callback();
        }
      });
    }
};
