

(function() {


  function FrogRunnerSprite(){

      let filePath = 'images/sprites/run-gun-frog.png';

      let animations = {
        idle: new Gamelab.Animation(filePath),
        run_gun_up: new Gamelab.Animation(filePath),
        run_gun_down: new Gamelab.Animation(filePath),
        run_gun_straight: new Gamelab.Animation(filePath),
        gun_up: new Gamelab.Animation(filePath),
        gun_down: new Gamelab.Animation(filePath),
        gun_straight: new Gamelab.Animation(filePath),
      };

      let $actionSprite;

      $actionSprite = new Gamelab.Sprite('images/sprites/run-gun-frog.png');


      $actionSprite.controls = {
        ticker: 0,
        gun_button: false
      };

      $actionSprite.guns = {
        firering: new Gamelab.Particle({}, gameWindow).Src('images/particles/white-ring.png').Life(20, 20, 'random')
      };

      let $testTerrainArray = [];

      for(var x = 0; x < 10000; x++)
      {
        var terrainSprite = new Gamelab.Sprite('images/terrain.png');
        $testTerrainArray.push(terrainSprite);
      }

      //*multiplied Sound object can fire more often
      $actionSprite.guns.firering.sound = new Gamelab.Sound(
        './res/sounds/shot.mp3'
      ).Multiply(30).Volume(0.3);

      $actionSprite.guns.firering.center_position_right = new Gamelab.Vector(168, 55);
      $actionSprite.guns.firering.center_position_left = new Gamelab.Vector(16, 55);
      $actionSprite.guns.firering.center_position_top_right = new Gamelab.Vector(155, 0);
      $actionSprite.guns.firering.center_position_top_left = new Gamelab.Vector(19, 0);

      $actionSprite.guns.firering.center_position_bottom_right = new Gamelab.Vector(143, 102);
      $actionSprite.guns.firering.center_position_bottom_left = new Gamelab.Vector(41, 102);

      $actionSprite.animeBusy = function () {
        return this.controls.gun_button;
      };

      $actionSprite.cubic_jump = function (height = 200, totalSteps) {

        var CubicIn = Gamelab.Curves.Cubic.In;

        var step = 1.0 / totalSteps,
          vpoints = [],
          tracker = 0;

        for (var x = 0; x <= 1.0; x += step) {
          var pct = CubicIn(x);
          vpoints.push((pct * height));
        }

        this.jumpPoints = vpoints;
        this.inJump = true;
      };

      $actionSprite.shoot = function () {

        if (this.controls.ticker % 10 == 0) {
          $actionSprite.guns.firering.sound.play();
        }

        this.controls.ticker += 1;

        //apply center pos
        if (!this.flipX)
          this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_right));
        else {
          this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_left));
        }

        this.guns.firering.FlipX(this.flipX).OffsetAllByX(this.speed.x);

        if (this.selected_animation == animations.idle) {
          this.selected_animation = animations.gun;
        }

        if (this.selected_animation == animations.gun || this.selected_animation == animations.run_gun) {

          if (this.flipX) {
            this.guns.firering.Angle(-2, 2, 'random');
            this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_left));
          } else {
            this.guns.firering.Angle(-2, 2, 'random');
            this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_right));
          }
        }

        if (this.selected_animation == animations.run_gun_up || this.selected_animation == animations.gun_up) {

          if (this.flipX) {
            this.guns.firering.Angle(27, 29, 'random');
            this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_top_left));
          } else {
            this.guns.firering.Angle(-27, -29, 'random');
            this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_top_right));
          }
        }

        if (this.selected_animation == animations.run_gun_down || this.selected_animation == animations.gun_down) {

          if (this.flipX) {
            this.guns.firering.Angle(-45, -45, 'random');
            this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_bottom_left));
          } else {
            this.guns.firering.Angle(45, 45, 'random');
            this.guns.firering.Pos(this.position.add($actionSprite.guns.firering.center_position_bottom_right));
          }
        }

        this.guns.firering.shoot();

      };

      $actionSprite.onUpdate(function () {

        if (this.inJump) {

          if (this.jumpPoints.length >= 1) {
            this.position.y = this.jumpPoints.pop();
          } else {
            this.inJump = false;
          }

        }

      });

      new Gamelab.CollisionEvent().OnCollision([$actionSprite], $testTerrainArray).Call(function (obj1, obj2) {

        if (obj2.active) {}

      });

      //gameWindow.add(new Gamelab.GravityForce({subjects: [$actionSprite], topClastics: $testTerrainArray, max: 9.0, accel: 0.4}));

      for (var x in animations) {

        animations[x].key_name = x;

        animations[x].onLoad(function (anime) {

          if (this.key_name == 'idle') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(0, 0), new Gamelab.Vector(0, 0), new Gamelab.Vector(0, 0));
            this.Size(200, 160);
          }

          if (this.key_name == 'run_gun_up') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(1, 0), new Gamelab.Vector(4, 0), new Gamelab.Vector(4, 0))
            this.Size(200, 160);
            this.Position(0, -5);
          }

          if (this.key_name == 'gun_up') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(1, 0), new Gamelab.Vector(1, 0), new Gamelab.Vector(1, 0))
            this.Size(200, 160);
            this.Position(0, -5);
          }

          if (this.key_name == 'run_gun_down') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(1, 2), new Gamelab.Vector(4, 2), new Gamelab.Vector(4, 2))
            this.Size(200, 160);
            this.Position(3, 16);
          }

          if (this.key_name == 'gun_down') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(1, 2), new Gamelab.Vector(1, 2), new Gamelab.Vector(1, 2))
            this.Size(200, 160);
            this.Position(3, 16);
          }

          if (this.key_name == 'run_gun') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(1, 1), new Gamelab.Vector(4, 1), new Gamelab.Vector(4, 1))
            this.Size(200, 160);
            this.Position(0, 9);
          }

          if (this.key_name == 'gun') {
            this.FrameSize(200, 160);
            this.FrameOffset(90, 0).FrameBounds(new Gamelab.Vector(1, 1), new Gamelab.Vector(1, 1), new Gamelab.Vector(1, 1))
            this.Size(200, 160);
            this.Position(0, 9);
          }

          console.info(this);
        });

        $actionSprite.animations.push(animations[x]);
      }

      $actionSprite.onLoad(function () {

        this.selected_animation = animations.idle;

        console.info(this.selected_animation);

        this.onUpdate(function () {
          this.Size(this.selected_animation.selected_frame.size);
          //console.log('updating');
          if (this.selected_animation) {
            //  console.log('GOT ANIME');
            this.selected_animation.engage(300);
          }

        });

      });


      return $actionSprite;

  }

  if('Gamelab' in window)
  {

    Gamelab.FrogRunnerSprite = FrogRunnerSprite;
  }

})();
