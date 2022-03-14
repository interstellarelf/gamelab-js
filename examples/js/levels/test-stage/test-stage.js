module.exports = {

  load: function(texelMap, gameWindow) {


    //correct size (missing value)
    texelMap.size = new Gamelab.Vector(20000, 6000);

    let Vector = Gamelab.Vector;

    var terrains = [], enemies = [], items = [];

    new Gamelab.Module().load('./js/texels/texel-api.js', function(TexelApi) {

      let $texelApi = new TexelApi(texelMap, gameWindow);

      let circleSprite = new Gamelab.Sprite('./images/test-stage/circle.png');

      circleSprite.Position(200, 200);

      gameWindow.add(circleSprite);

      $texelApi.onTexels(['g1', 'g2', 'g3'], new Vector(1, 1), function() {

        //return the terrain sprite

      console.log('g1 g2 g3 --triggered');

      var sprite = new Gamelab.Sprite('./images/test-stage/G/g1-1x1.png');

      sprite.draw = function (ctx, camera) {

        var sprite = this;

        camera = gameWindow.camera;

        if(sprite.DRAWOFFSCREEN)
        {
          console.log('DRAW OFFSCREEN=true');
        }

        if (sprite.active && (sprite.DRAWOFFSCREEN || sprite.onScreen(Gamelab.WIDTH, Gamelab.HEIGHT))) {
          this.draw_current_frame(ctx, camera);
        }
      }


      sprite.onScreen = function(w, h, gw) {

        w = w || Gamelab.WIDTH;
        h = h || Gamelab.HEIGHT;
        gw = gw || Gamelab.game_windows[0];

        var camera = gameWindow.camera,
          scrollFactor = this.noScroll ? 0 : this.scrollFactor;

        var sprite = this,
          p = sprite.position,
          camera_pos = camera.position || {
            x: 0,
            y: 0,
            z: 0
          };

        if (!sprite.hasOwnProperty('scrollFactor')) {
          sprite.scrollFactor = 1.0;
        }

        var x = p.x,
          y = p.y,
          scrollFactor = sprite.scrollFactor >= -1.0 && sprite.scrollFactor <= 1.0 ? sprite.scrollFactor : 1.0;

        if (sprite.noScroll) {
          scrollFactor = 0;
        }

        x -= camera_pos.x * scrollFactor || 0;
        y -= camera_pos.y * scrollFactor || 0;

        return x + sprite.size.x > 0 && x < w &&
          y + sprite.size.y > 0 && y < h;
      }

      terrains.push(sprite);

      return sprite;


      });


      $texelApi.onTexels(['g2'], new Vector(1, 1), function() {

        //return the terrain sprite
        console.log('g2 --triggered');

        var sprite = new Gamelab.Sprite('./images/test-stage/G/g2-1x1.png');

        terrains.push(sprite);

        return sprite;

      });



      //Wall : W1 to W3


      $texelApi.onTexels(['w1'], new Vector(1, 1), function() {

        //select single sprite
        //return the terrain sprite
        console.log('w1 --triggered');

        var sprites = [new Gamelab.Sprite('./images/test-stage/W/w1-1x1.png')];

        sprites.getRandom = function() {

          return this[Math.ceil(Math.random() * 1.0) - 1.0];

        };


        let sprite = sprites.getRandom();

        sprite.draw = function (ctx, camera) {

          var sprite = this;

          camera = gameWindow.camera;

          if(sprite.DRAWOFFSCREEN)
          {
            console.log('DRAW OFFSCREEN=true');
          }

          if (sprite.active && (sprite.DRAWOFFSCREEN || sprite.onScreen(Gamelab.WIDTH, Gamelab.HEIGHT))) {
            this.draw_current_frame(ctx, camera);
          }
        }


        sprite.onScreen = function(w, h, gw) {

          w = w || Gamelab.WIDTH;
          h = h || Gamelab.HEIGHT;
          gw = gw || Gamelab.game_windows[0];

          var camera = gameWindow.camera,
            scrollFactor = this.noScroll ? 0 : this.scrollFactor;

          var sprite = this,
            p = sprite.position,
            camera_pos = camera.position || {
              x: 0,
              y: 0,
              z: 0
            };

          if (!sprite.hasOwnProperty('scrollFactor')) {
            sprite.scrollFactor = 1.0;
          }

          var x = p.x,
            y = p.y,
            scrollFactor = sprite.scrollFactor >= -1.0 && sprite.scrollFactor <= 1.0 ? sprite.scrollFactor : 1.0;

          if (sprite.noScroll) {
            scrollFactor = 0;
          }

          x -= camera_pos.x * scrollFactor || 0;
          y -= camera_pos.y * scrollFactor || 0;

          return x + sprite.size.x > 0 && x < w &&
            y + sprite.size.y > 0 && y < h;
        }

        terrains.push(sprite);

        return sprite;

      });



      //Ceiling C1
      $texelApi.onTexels(['c1', 'c2', 'c3'], new Vector(2, 1), function() {

        //select ceiling sprite
        //return the terrain sprite
        console.log('c1, c2, c3 --triggered');

        var sprites = [new Gamelab.Sprite('./images/test-stage/C/c1-2x1.png')];

        sprites.getRandom = function() {

          return this[Math.ceil(Math.random() * 1.0) - 1.0];

        };

        var sprite = sprites.getRandom();

        terrains.push(sprite);

        return sprite;

      });


      let keyboardEvent = new Gamelab.KeyboardEvent(['w', 's', 'a', 'd'], function(value){

        switch(value.toLowerCase())
        {
          case 'w':

          gameWindow.camera.position.y -= 100;

          break;

          case 's':

          gameWindow.camera.position.y += 100;

          break;

          case 'a':

          gameWindow.camera.position.x -= 100;

          break;

          case 'd':

          gameWindow.camera.position.x += 100;

          break;

        }

      });

      keyboardEvent.init();




      function random_ceil(number) {
        return Math.ceil(Math.random() * number);
      }

      function sprite_list(srcList) {
        let sprites = [];
        srcList.forEach((src) => {
          sprites.push(new Gamelab.Sprite(src));
        });
        return sprites;
      }

      function random_sprite(spriteList) {
        return spriteList[random_ceil(spriteList.length) - 1];
      }


      function completeTexels() {
        //MPX, MPY
        $texelApi.onTexels(['mpx'], new Vector(3, 1), function() {

          //return the doorway-sprite
          console.log('mpx --triggered');

          return new Gamelab.Sprite('./images/test-stage/MP/mpx.png');

        });

        $texelApi.onTexels(['mpy'], new Vector(3, 1), function() {

          //return the doorway-sprite
          console.log('mpy --triggered');

          return new Gamelab.Sprite('./images/MP/mpy.png');

        });

        //Platforms
        $texelApi.onTexels(['p1'], new Vector(3, 3), function() {

          //return the platform-sprite
          console.log('p1 --triggered');

          return new Gamelab.Sprite('./images/test-stage/P/p1-3x3.png');

        });

        $texelApi.onTexels(['p1'], new Vector(3, 4), function() {

          //return the platform-sprite
          console.log('p1 --triggered');

          return new Gamelab.Sprite('./images/test-stage/P/p1-3x4.png');

        });

        $texelApi.onTexels(['p1'], new Vector(3, 5), function() {

          //return the platform-sprite
          console.log('p1 --triggered');

          return new Gamelab.Sprite('./images/test-stage/P/p1-3x5.png');

        });

        //P2

        $texelApi.onTexels(['p2'], new Vector(3, 1), function() {

          //return the platform-sprite

          console.log('p2 --triggered');

          return new Gamelab.Sprite('./images/test-stage/P/p2-3x1.png');

        });

        $texelApi.onTexels(['p2'], new Vector(4, 2), function() {

          //return the platform-sprite
          console.log('p2 --triggered');

          return new Gamelab.Sprite('./images/test-stage/P/p2-4x2.png');

        });


        //Switch
        $texelApi.onTexels(['sfb'], new Vector(1, 1), function() {

          //return the platform-sprite

          return new Gamelab.Sprite('./images/test-stage/S/sfb.png');

        });

        $texelApi.onTexels(['sfl'], new Vector(1, 1), function() {

          //return the platform-sprite

          return new Gamelab.Sprite('./images/test-stage/S/sfl.png');

        });

        $texelApi.onTexels(['sfr'], new Vector(1, 1), function() {

          //return the platform-sprite

          return new Gamelab.Sprite('./images/test-stage/S/sfr.png');

        });

        $texelApi.onTexels(['t1'], new Vector(4, 1), function() {

          //return the platform-sprite

          return new Gamelab.Sprite('./images/test-stage/T/t1-4x1.png');

        });



        //Doorways DW1 DW2
        $texelApi.onTexels(['dw1'], new Vector(1, 3), function() {

          //return the doorway-sprite
          console.log('dw1 --triggered');

          return new Gamelab.Sprite('./images/test-stage/DW/dw1.png');

        });

        $texelApi.onTexels(['dw2'], new Vector(1, 3), function() {

          //return the doorway-sprite
          console.log('dw2 --triggered');

          return new Gamelab.Sprite('./images/test-stage/DW/dw2.png');

        });

      }





    });


    return {
        terrains: terrains,
        items: items,
        enemies: enemies
    }
  }
};
