/*
Framework-Init error-check:
*/

Larva.truthOrDie([Gamestack], "Gamestack-library is not initialized");


Larva.check(Gamestack, 'prefabs', {});

Larva.check(Gamestack.prefabs, 'being', {});

(function() {

    var SIDE_SCROLLER_HUMANOID = () => {

      var player, Animation = Gamestack.Animation,
        GameImage = Gamestack.GameImage,
        Vector = Gamestack.Vector,
        Sprite = Gamestack.Sprite,

        ImageStatDisplay = Gamestack.ImageStatDisplay,
        Force = Gamestack.Force;

      var Sound = Gamestack.Sound;

      var GameAssets = {

        character: {

          player_run: new Animation({
            src: "images/characters/full/spaceman1.png",

            frameSize: new Vector(130, 130, 0),
            frameBounds: new VectorFrameBounds(new Vector(0, 0), new Vector(23, 0))
          }),

          player_jump: new Animation({
            src: "../assets/game/images/characters/full/spaceman1.png",

            duration: 400,
            frameSize: new Vector(130, 130, 0),
            frameBounds: new VectorFrameBounds(new Vector(5, 3), new Vector(36, 3))

            /*Use the extras variable to pass any Sound() to be played when the animation runs. The sound will start playing on first frame*/

          }),

          player_fall: new Animation({
            src: "../assets/game/images/characters/full/spaceman1.png",

            frameSize: new Vector(130, 130, 0),
            frameBounds: new VectorFrameBounds(new Vector(36, 3), new Vector(36, 3))
          }),

          player_flip: new Animation({
            src: "../assets/game/images/characters/full/spaceman1.png",

            duration: 700,

            frameSize: new Vector(130, 130, 0),
            frameBounds: new VectorFrameBounds(new Vector(7, 2), new Vector(28, 2))
          })
        },

        Sound: {

          collect_item: new Sound('../assets/game/sounds/collect_item.mp3').Volume(0.3)

        }

      };

      //create jump sound

      var jump_sound = new Sound("../assets/game/sounds/jump_sound.mp3");

      //override the onRun() of the jump to play a sound

      GameAssets.character.player_jump.onRun(function() {

        jump_sound.Play();

      });

      //set the frame speed for custom player_run.animate()

      GameAssets.character.player_run.fspeed = 1;

      //custom animate function:

      GameAssets.character.player_run.animate = function() {

        if (Math.abs(Math.floor(player.speed.x)) > 0) {

          //console.log('UPDATING');

          this.cix += this.fspeed;

          if (this.cix > 22) {

            //cause looping back and forth behavior

            this.fspeed = -1;

            this.cix = 22;

          } else if (this.cix < 11) {

            //cause looping back and forth behavior

            this.fspeed = 1;

            this.cix = 11;

          }

        } else {

          this.fspeed = 1;
          this.cix = 0;

        }

        this.update();

      };

      //Add the player Sprite()

      player = new Sprite();

      //Set the size{} of player

      player.setSize(new Vector(75, 75));

      //set player.type for later reference (see $Q() queries to reference multiple collections of Sprite() and rig events, etc.. )

      player.type = "player";

      player.position.x = 300;

      player.traction = {

        go_x: 1.5,

        stop_x: 1.5,

        air_x: 8

      };

      //set player animation

      player.setAnimation(GameAssets.character.player_run);

        //call Q().on() for the button 0, controller 0

        $Q().on('button_0', 0, function(x, y) {

          //Control player state and movements (jump)

          if (x == false && player.jump_tween && player.state == 'jumping') //cancel the jump when colliding with overhead basic_block
          {

            player.jump_tween.stop();

            player.speed.y = -3;

            player.setState('falling');

            player.jump_tween = false;

          }

          if (x) {

            var targetJumpY = Math.round(player.position.y - __gameStack.HEIGHT / 2.5);

            if (player.state !== 'jumping' && !player.__inAir) {

              player.__inAir = true;

              player.setState('jumping');

              player.speed_tracker = new Vector(0, 0, 0);

              player.pos_tracker = new Vector(player.position);

              GameAssets.character.player_jump.onComplete(function(anime) {

                //  alert('flip complete');

                GameAssets.character.player_flip.cix = 0;

                player.setState('falling');

              });

              player.jump_tween = new TWEEN.Tween(player.position).to({
                y: targetJumpY
              }, 700).easing(TWEEN.Easing.Circular.Out).onUpdate(function() {


                player.speed_tracker.y = player.position.y - player.pos_tracker.y;

                player.pos_tracker.y = player.position.y;

              }).onComplete(function() {

              }).start();

            }

          }

        });

        player.total_apples = 0;

        //Show applies as an item display

        var items = new ImageStatDisplay({
          size: new Vector(25, 25),
          fontSize: "18px",
          src: "../assets/game/images/items/apple_blue.png",
          top: 0.04,
          left: 0.03,
          text: "Item Count"
        });


        //Show the item display::

        items.show();

        //Update value of item display::

        items.update(0);


        //functions for player state

        player.setState = function(state) //control the state of the player
        {
          this.state = state;

          if (this.state == 'idle') {
            this.setAnimation(GameAssets.character.player_run);
          }

          if (this.state == 'falling') {
            this.setAnimation(GameAssets.character.player_fall);

            if (this.speed.y < 0) {

              this.decel(player.speed, 'y', 0.5);

            }


            if (!this.__inAir) {

              this.setState('idle');
            }

          }

          if (this.state == 'running') {
            this.setAnimation(GameAssets.character.player_run);

          }

          if (this.state == 'jumping') {
            this.setAnimation(GameAssets.character.player_jump);

            this.selected_animation.engage();

          }


        };

        //player.onUpdate: run code every .update() of the player




                      player.onUpdate(function(sprite) {


                                    sprite.selected_animation.animate();

                                    if (player.state == 'running') {

                                      player.rotation.x = 0;

                                      player.rot_speed.x = 0;

                                    }


                                    if (!player.__inAir) {
                                      player.speed.y = 0;

                                      player.rotation.x = 0;

                                      player.rot_speed.x = 0;

                                    }
                                    else
                                    {

                                      if(player.state !== 'jumping' && Math.abs(player.speed.y) > 2)
                                        player.setState('falling');

                                    }

                        });


            //add a second player update:

            player.onUpdate(function(sprite) {

              //control the __gameStack Camera, with player-sprite as focus

              var target = sprite.position.sub(new Gamestack.Vector(gameWindow.canvas.width / 2, gameWindow.canvas.height / 2));

              camera = gameWindow.camera;


              var diff = camera.position.sub(target);

              //camera follows player

              var speedX = Math.ceil(diff.x * -0.3),
                speedY = Math.ceil(diff.y * -0.3);

              camera.position.x += speedX;

              camera.position.y += speedY;

                          });


          //Add a gravity/force to the player

          var gravity = gameWindow.add(new Force({
            name: "medium_grav",
            accel: 0.4,
            max: new Vector(0, 9, 0),
            subjects: [player], //provide subjects inside an array, player is the subject of this Force, player is pulled by this force
            clasticObjects: levelTiles //an array of collideable objects

          }));

          player.padding = new Vector(0.2, 0.1); //vector of 0-1 values for collision padding (transparency of sprite-images calls for padding in collision-processing)

          return player;

        };

        Gamestack.prefabs.being.sidescrollerHumanoid = SIDE_SCROLLER_HUMANOID();

      })();
