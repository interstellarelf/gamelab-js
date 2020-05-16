function V(x, y, z) {
  return new Gamelab.Vector(x, y, z);
}


module.exports = function(playerSprite) {

  playerSprite.weapons = playerSprite.weapons || {};


  //star_shot

  var star_shots = new Gamelab.SpriteFactory(),

    star_shot_sprite = new Gamelab.Sprite('./res/images/effects/shots/starshot.png');


  function loadStarshotSprite() {

    this.anime.FrameSize(49, 49).FrameBounds(V(0, 0), V(12, 0), V(12, 0)).Size(35, 35).Duration(300);

    this.anime.run();

    this.update = function() {
      console.log('UPDATE WEAPON --starshot');
      this.anime.run();
      this.position = this.position.add(this.speed);
      this.speed.x += this.directionX * 0.15;
      this.life -= 1;
    };

  };

  star_shots.onFire(function(sprite) {

    sprite.Life(120);

    sprite.Size(30, 30);

    if (player.flipX) {
      sprite.speed = new Gamelab.Vector(-8, 0);
      sprite.Position(player.position.add(player.size.x * 0.6, 0));
      sprite.directionX = -1;
    } else {
      sprite.speed = new Gamelab.Vector(8, 0);
      sprite.Position(player.position);
      sprite.directionX = 1;
    }


    console.info(sprite);

    console.info(sprite.anime);

  });

  star_shots.PrepareSprites(2000, star_shot_sprite, loadStarshotSprite);

  playerSprite.weapons.star_shot = star_shots;


  var beamer = new Gamelab.SpriteFactory(),

    beamer_sprite = new Gamelab.Sprite('./res/images/effects/shots/beamer.png');


  function loadBeamerSprite() {

    this.anime.FrameSize(65, 65).FrameBounds(V(0, 0), V(11, 0), V(11, 0)).Size(65, 65).Duration(300);

    this.anime.run();


    this.update = function() {

      console.log('UPDATE WEAPON --starshot');

      this.anime.run();

      this.position = this.position.add(this.speed);

      this.speed.x += this.directionX * 0.15;

      this.life -= 1;

    };
  };



  beamer.onFire(function(sprite) {

    sprite.scale = 0.4;

    sprite.Life(120);

    sprite.Size(sprite.anime.size.mult(sprite.scale));

    if (player.flipX) {
      sprite.speed = new Gamelab.Vector(-8, 0);
      sprite.Position(player.position.add(player.size.x * 0.6, 0));
      sprite.directionX = -1;
    } else {
      sprite.speed = new Gamelab.Vector(8, 0);
      sprite.Position(player.position);
      sprite.directionX = 1;
    }


    console.info(sprite);

    console.info(sprite.anime);

  });

  beamer.PrepareSprites(2000, beamer_sprite, loadBeamerSprite);










    //lightning



    var lightning = new Gamelab.SpriteFactory();

    var lightningSprite;
    new Gamelab.Module().load('./res/scripts/sprite/multi.image.sprite.js', function(C){

        lightningSprite = new Gamelab.Sprite('./res/images/effects/shots/electroshot/spritesheet.png');

          lightning.onFire(function(sprite) {




            sprite.Life(120);

            var p1 = player.position.add(10, -sprite.size.y / 2),

            p2 = player.position.add(0, -sprite.size.y / 2);

            if (player.flipX) {
              sprite.speed = new Gamelab.Vector(-4, 0);
              sprite.Position(p1);
              sprite.directionX = -1;
            } else {
              sprite.speed = new Gamelab.Vector(4, 0);
              sprite.Position(p2);
              sprite.directionX = 1;
            }



                  sprite.update = function() {

                    this.size = this.size.seek(100, 100, 0.1);

                    this.life -= 1;

                    this.anime.run();

                    this.speed.x *= 1.05;

                    this.position = this.position.add(this.speed);

                    console.log('UPDATE WEAPON --starshot');

                  };


            console.info(sprite);

            console.info(sprite.anime);

          });

          lightning.PrepareSprites(2000, lightningSprite, loadLightningSprite);

    });



    function loadLightningSprite() {

      this.Size(24, 24);


      this.anime.FrameSize(256, 256).FrameBounds(V(0, 0), V(13, 0), V(13, 0)).Size(24, 24).Duration(1000);



    };


  playerSprite.weapons.lightning = lightning;


};
