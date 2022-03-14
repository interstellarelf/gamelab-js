module.exports = function(player) {

  new Gamelab.GamepadEvent().Gamepads([0]).Keys(['start']).Call(function(pressed) {

    if (pressed) {
      GameDemo.Pause();
    } else {
      pauseClock.Reset();
    }

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_0').Call(function(pressed) {

    if(pressed)
    {
      player.jump(200);
    }

    if (pressed) {
      Xbox_buttons.a += 1;
    } else {
      Xbox_buttons.a = 0;
    }

  });


  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_1').Call(function(pressed) {

    if(pressed)
    {
      player.shoot();
    }

    if (pressed) {
      Xbox_buttons.b += 1;
    } else {
      Xbox_buttons.b = 0;
    }

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_2').Call(function(pressed) {



  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('stick_left').Call(function(x, y) {

    if(player.__inAir) {
      player.show_jump();
    }

    if(x >= 0.2)
    {
      if(!player.clippedRight)
      player.runRight(Math.ceil(x * 7.0));
    }
    else if(x <= -0.2)
    {
      if(!player.clippedLeft)
      player.runLeft(Math.ceil(x * 7.0));
    }
    else {

      if(player.__inAir && player.speed.x > 0)
      {
        player.speed.x -= 0.1;
      }

      if(player.__inAir && player.speed.x < 0)
      {
        player.speed.x += 0.1;
      }

      if(!player.__inAir && player.speed.x > 0)
      {
        player.speed.x -= 0.4;
      }

      if(!player.__inAir && player.speed.x < 0)
      {
        player.speed.x += 0.4;
      }

      if(player.speed.x > -0.5 && player.speed.x < 0.5)
      {
        player.speed.x = 0;
      }

      if(!player.__inAir)
      {
        player.show_idle();
      }

    }


  });


};
