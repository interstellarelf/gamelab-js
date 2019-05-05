/*
Framework-Init error-check:
*/

Larva.truthOrDie([Gamestack], "Gamestack-library is not initialized");

Larva.check(Gamestack, 'prefabs', {});

Larva.check(Gamestack.prefabs, 'interactive', {});

 (function(){

var SPRINGBOOSTER = () => {

    var springbooster;

    SpringBooster.options = {

        target:new VectorOption(),

        timeLimit:new TimeLimitOption(),

        animation:new AnimationOption()

    };


    SpringBooster.trigger = function(){

      //the sprite jumps up, into the air
      //jump is interrupted by touching any platform
      //gravity then takes over
    };

        return springbooster;
  };

  Gamestack.prefabs.interactive.springbooster = SPRINGBOOSTER();

  })();
