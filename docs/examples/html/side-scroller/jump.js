var module = module || {};

module.exports = function(object, onComplete) {
  //create jump sound

  var jump_sound = new Sound("res/sounds/jump_sound_deep.mp3").Volume(0.1);

  object.jump = function(x, height) {

    function iterate(complete) {

      if (!complete()) {

        setTimeout(function() {

          iterate(complete);

        }, 20)

      }

    };


    if (x) {

      if (this.GROUNDED && this.Controller.button_0.timer < 12) {

        //start new jump
        //  alert('jumpi9ng');

        this.JUMPING = true;


        this.Animation(GameAssets.player_jump);

        var jump_height = height ||  64 * 3.5;

        this.jumpTimer = jump_height;

        this.GROUNDED = false;

        jump_sound.Play();

        var __object = this;

        iterate(function() {

          __object.animation.animate();

          if (__object.jumpTimer > 0) {

            var jump_speed = Math.ceil(__object.jumpTimer * 0.25);

            __object.position.y -= jump_speed;

            __object.speed.y = 0;

            __object.jumpTimer -= jump_speed;

          }

          if(__object.HEADBUNK)
          {
            __object.jumpTimer = 0;
            __object.HEADBUNK = false;
          }

          if(__object.jumpTimer <= 0)
          __object.JUMPING = false


          return __object.jumpTimer <= 0;

        });


      }


    }


  }


};
