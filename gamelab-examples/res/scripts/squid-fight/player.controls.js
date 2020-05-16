module.exports = function() {

  new Gamelab.GamepadEvent().Gamepads([0]).Keys(['start']).Call(function(pressed) {

    if (pressed) {
      GameDemo.Pause();
    } else {
      pauseClock.Reset();
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_1').Call(function(pressed) {

    if (pressed) {
      Xbox_buttons.b += 1;
    } else {
      Xbox_buttons.b = 0;
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_0').Call(function(pressed) {

    if (pressed && Xbox_buttons.a == 0 && ['idle', 'run', 'crouch', 'crouch_throw_to_crouch', 'throw'].indexOf(player.nextEvent) >= 0 && !player.__inAir) {

      player.nextEvent = 'jump';
      player.jumping = true;
      player.jumpTimer = 6;

      //  console.log('reg jump');
    } else if (pressed && Xbox_buttons.a == 0 && player.__inAir && player.anime !== PlayerAnimations.double_jump && !player.doubleJumpDone) {

      //  console.log('dub jump');

      player.nextEvent = 'double-jump';
      player.jumping = false;
      player.double_jumping = true;
      player.jumpTimer = 6;

    }

    if (pressed) {
      Xbox_buttons.a += 1;
    } else {
      Xbox_buttons.a = 0;
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_2').Call(function(pressed) {});

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('stick_left').Call(function(x, y) {

    //always runs if controller is plugged in

    var roundX = Math.round(x * 10) / 10,
      roundY = Math.round(y * 10) / 10;

    if (roundY > 0.5) {

      if (Xbox_buttons.b > 0 && Xbox_buttons.b < BUTTONTIME) {
        player.nextEvent = 'crouch_throw';
        player.crouch_throw();
      } else {
        if (['fall', 'crouch', 'idle'].indexOf(player.nextEvent) >= 0 && !player.__inAir) {
          player.nextEvent = 'crouch';
          player.crouch();
        }

      }

    } else if (roundX >= 0.5) {

      if (Xbox_buttons.b > 0 && Xbox_buttons.b < BUTTONTIME) {
        player.nextEvent = 'throw';
        player.throw();
      } else if (['jump', 'double-jump', 'throw'].indexOf(player.nextEvent) == -1) {
        player.nextEvent = 'run';
        player.runForward(Math.round(x * 8.0 * 10) / 10.0, false);
      }

    } else if (roundX <= -0.5) {

      if (Xbox_buttons.b > 0 && Xbox_buttons.b < BUTTONTIME) {
        player.nextEvent = 'throw';
        player.throw();
      } else if (['jump', 'double-jump', 'throw'].indexOf(player.nextEvent) == -1) {
        player.nextEvent = 'run';
        player.runForward(Math.round(x * 8.0 * 10) / 10.0, true);
      }

    } else {

      if (Xbox_buttons.b > 0 && Xbox_buttons.b < BUTTONTIME) {
        player.nextEvent = 'throw';
        player.throw();
      } else {
        if (player.nextEvent !== 'throw') {
          player.nextEvent = 'idle';
          player.doIdle();
        }
      }

    }

  });


};
