Gamelab.Shooter = Gamelab.Shooter || {};

class BulletWeapon {

  constructor(index, options)
  {

    var sources = ['./images/shots/shot_blue.png',
  './images/shots/shot_orange.png',
'./images/shots/shot_red.png'];

  var total = 20;

    var fire = options.fire || function(){};

    this.factory = new Gamelab.SpriteFactory(function(){

      let bulletSprite = new Gamelab.Sprite(sources[index], 0.25);

      this.PrepareSprites(total, bulletSprite, function load(){

        var load = options.load || function(){};

        load.bind(this).call();

        this.anime.FrameSize(65, 65);
        this.Size(65, 65);

        var update = options.update || function(){};

        this.onUpdate(function(){
            update.bind(this).call();
        });

      });
    });

    this.factory.onFire(fire);
  }

  Name(name){
    this.name = name;
    return this;
  }

  fire(){
    this.factory.enter(1, Gamelab.game_windows[0]);
  }

  TotalBullets(totalBullets){
    this.totalBullets = totalBullets;
    return this;
  }
  TotalDegrees(totalDegrees){
    this.totalDegrees = totalDegrees;
    return this;
  }


  shoot()
  {



  }

}


Gamelab.Shooter.BulletWeapon = BulletWeapon;
