var module = window.module || {};

module.exports = function(sprite) {

  let player = sprite;

  player.stats = player.stats || {};
  player.stats.speed = 4.0;

  player.gameOptions = {
    bulletSpread: 30
  };

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('stick_left').Call(function(x, y) {
    sprite.position.x += Math.round(x * player.stats.speed * 10) / 10;
    sprite.position.y += Math.round(y * player.stats.speed * 10) / 10;
  });

  player.weapons = [];


  let weaponOneTimer = 0;

  player.weapons.push(new Gamelab.Shooter.BulletWeapon(0, {
    fire: function(spr) {
      spr.life = 200;
      spr.Pos(player.position.x + player.size.x / 2.0 - spr.size.x / 2.0, player.position.y - 15);
      spr.speed.y = -12.0;
      spr.globalCompositeOperation = 'lighter';
    },
    update: function() {
      this.life -= 1.0;
      this.ticker += 1;

      let vibranceFactor = (player.position.x + player.size.x / 2.0 - this.size.x / 2.0 - this.position.x);

     if(!this.hasOwnProperty('pSpeedTrack'))
     {
       this.pSpeedTrack = player.speed.x >= 0 ? 1 : -1;
     }

      if(Math.abs(vibranceFactor) < 2.0)
      {
        vibranceFactor = 2.0;
        if(Math.random() * 1.0 >= 0.5)
        {
          vibranceFactor *= -1.0;
        }
      }

      this.speed.x += vibranceFactor * 0.4;

      this.position.y += this.speed.y;
      this.position.x += this.speed.x;
    }
  }).Name('blaster'));


  player.getWeapon = function(name) {

    for (var x = 0; x < this.weapons.length; x++) {
      if (this.weapons[x].name == name) {
        return this.weapons[x];
      }
    }
  };


  gameWindow.onBeforeDraw(function(){
      gameWindow.removeDeadObjects();
  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_0').Call(function(pressed) {

    if (pressed) {
      player.getWeapon('blaster').fire(Gamelab.game_windows[0]);
    }

  });

};
