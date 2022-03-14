var module = module || {};

module.exports = function(object, siblings) {

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_0').Call(function (pressed) {

    if(pressed)
    console.log('button_0::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_1').Call(function (pressed) {

    if(pressed)
    console.log('button_1::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_2').Call(function (pressed) {

    if(pressed)
    console.log('button_2::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_3').Call(function (pressed) {

    if(pressed)
    console.log('button_3::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_4').Call(function (pressed) {

    if(pressed)
    console.log('button_4::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_5').Call(function (pressed) {

    if(pressed)
    console.log('button_5::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_6').Call(function (pressed) {

    if(pressed)
    console.log('button_6::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_7').Call(function (pressed) {

    if(pressed)
    console.log('button_7::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_8').Call(function (pressed) {

    if(pressed)
    console.log('button_8::pressed');

  });

  new Gamestack.GamepadEvent().Gamepads(1).Keys('button_9').Call(function (pressed) {

    if(pressed)
    console.log('button_9::pressed');

  });


    new Gamestack.GamepadEvent().Gamepads(1).Keys('button_10').Call(function (pressed) {

      if(pressed)
      console.log('button_10::pressed');

    });


      new Gamestack.GamepadEvent().Gamepads(1).Keys('button_11').Call(function (pressed) {

        if(pressed)
        console.log('button_11::pressed');

      });


        new Gamestack.GamepadEvent().Gamepads(1).Keys('button_12').Call(function (pressed) {

          if(pressed)
          console.log('button_12::pressed');

        });


        new Gamestack.GamepadEvent().Gamepads(1).Keys('button_13').Call(function (pressed) {

          if(pressed)
          console.log('button_13::pressed');

        });


        new Gamestack.GamepadEvent().Gamepads(1).Keys('button_14').Call(function (pressed) {

          if(pressed)
          {
            player.runLeft();
            player.runSwitch.LEFT = true;
          }
          else {
            player.runSwitch.LEFT = false;
          }


        });

        new Gamestack.GamepadEvent().Gamepads(1).Keys('button_15').Call(function (pressed) {

          if(pressed)
          {
            player.runRight();
            player.runSwitch.RIGHT = true;
          }
          else{
            player.runSwitch.RIGHT = false;
          }


        });

};
