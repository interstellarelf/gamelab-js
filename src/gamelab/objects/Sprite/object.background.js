class Background extends Sprite {
  constructor() {
    super(...arguments);
    this.backgroundTextureArrays = [];
  }
  Repeat(x, y) {
    this.repeat = new Gamelab.Vector(x, y);
    return this;
  }
  OverlayImage(src, scale, asBorder, asBorderPadding) {

  }
  ScrollCycle(value) {
    this.scrollCycle = value;
    return this;
  }
  appendBackgroundTextureArray(backgroundTextures, params) {
    for (var x in params) {
      backgroundTextures[x] = params[x];
    }
    this.backgroundTextureArrays.push(backgroundTextures);
  }
  draw(ctx, camera) {
    var sprite;
    if (this.constructor.name == 'SpriteBrush') {
      sprite = this.selected_sprite;
    } else {
      sprite = this;
    }
    camera = camera || false;

    if (!camera && Gamelab.game_windows[0] && Gamelab.game_windows[0].camera) {
      camera = Gamelab.game_windows[0].camera;
    } else if (!camera) {
      camera = {
        position: new Gamelab.Vector(0, 0, 0)
      };
    }

    if (sprite.invisible)
      return;

    if (sprite.active && (this.DRAWOFFSCREEN || sprite.onScreen(Gamelab.WIDTH, Gamelab.HEIGHT))) {
      this.draw_current_frame(ctx, camera);
    }
  }


  draw_current_frame(ctx, camera) {

    var sprite;

    if (this.constructor.name == 'SpriteBrush') {
      sprite = this.selected_sprite;
    } else {
      sprite = this;
    }

    var frame = false,
      frameList = [];


    if (sprite.active) {

      if (sprite.selected_animation instanceof Array && sprite.selected_animation.length >= 1) {
        sprite.selected_animation.forEach(function(anime) {
          frameList.push(anime.selected_frame);
        });
      }

      if (sprite.selected_animation instanceof Object && sprite.selected_animation.hasOwnProperty('selected_frame')) {
        frame = sprite.selected_animation.selected_frame;
      }

      var p = sprite.position;

      var camera_pos = camera.position || {
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


      //optional animation : gameSize

      var targetSize = sprite.size || sprite.selected_animation.size;

      var realWidth = targetSize.x;
      var realHeight = targetSize.y;


      var origin = sprite.origin || new Gamelab.Vector(realWidth / 2, realHeight / 2);

      //optional animation : offset

      var rotation;

      if (typeof(sprite.rotation) == 'object') {
        rotation = sprite.rotation.x;

      } else {
        rotation = sprite.rotation;
      }


      if (this.image && this.image.domElement instanceof HTMLCanvasElement) {
        var x = this.position.x,
          y = this.position.y;

        x -= camera_pos.x * scrollFactor || 0;
        y -= camera_pos.y * scrollFactor || 0;
        //  console.log('sprite:: canvas draw!! ');

        let imageFrameArgs = {
          image: sprite.image.domElement,
          framePos: frame.framePos || new Gamelab.Vector(0, 0),
          frameSize: frame.frameSize || sprite.size,
          position: new Gamelab.Vector2D(Math.round(x + (origin.x)), Math.round(y + (origin.y))),
          size: new Gamelab.Vector2D(realWidth, realHeight),
          rotation: rotation % 360,
          canvasContext: ctx,
          flipX: sprite.flipX,
          flipY: sprite.flipY,
          origin: origin,
          globalAlpha: sprite.opacity,
          globalComposite: sprite.globalCompositeOperation || false
        };

        return Gamelab.Canvas.draw_image_frame(imageFrameArgs);
      }


      if (!(sprite.selected_animation && sprite.selected_animation.selected_frame)) {
        return;
      }

      var frame = sprite.selected_animation.selected_frame;

      if (frame && frame.image && frame.image.data) {

        ctx.putImageData(frame.image.data, x, y, 0, 0, sprite.size.x, sprite.size.y);

      } else {

        if (frameList.length >= 1) {

          frameList.forEach(function(frame) {

            var realWidth = frame.size.x;
            var realHeight = frame.size.y;

            var xpos = frame.position.x,
              ypos = frame.position.y;

            x += sprite.position.x;
            y += sprite.position.y;

            x -= camera_pos.x * scrollFactor || 0;
            y -= camera_pos.y * scrollFactor || 0;

            sprite.realPosition = new Gamelab.Vector(x, y);

            if (frame.rotation && typeof frame.rotation.x == 'number') {
              rotation = frame.rotation.x;
            }

            if (frame.origin) {
              origin = frame.origin;
              //console.log('drawing with origin:' + origin.x + ':' + origin.y);
            }

            if (frame && frame.image) {

              let imageFrameArgs = {
                image: sprite.effectCanvas ? sprite.effectCanvas : frame.image.domElement,
                framePos: frame.framePos || new Gamelab.Vector(0, 0),
                frameSize: frame.frameSize || sprite.size,
                position: new Gamelab.Vector2D(Math.round(xpos + (origin.x)), Math.round(ypos + (origin.y))),
                size: new Gamelab.Vector2D(realWidth, realHeight),
                rotation: rotation % 360,
                canvasContext: ctx,
                flipX: sprite.flipX,
                flipY: sprite.flipY,
                origin: origin,
                globalAlpha: sprite.opacity,
                globalComposite: sprite.globalCompositeOperation || false
              };

              Gamelab.Canvas.draw_image_frame(imageFrameArgs);
            }

          });

        } else {
          var fx = frame.position.x,
            fy = frame.position.y,
            pos = new Gamelab.Vector(x + fx, y + fy);

          pos.x -= camera_pos.x * scrollFactor || 0;
          pos.y -= camera_pos.y * scrollFactor || 0;
          sprite.realPosition = pos;
          if (frame.image.domElement instanceof HTMLImageElement || frame.image.domElement instanceof HTMLCanvasElement) {

            let imageFrameArgs = {
              image: sprite.effectCanvas ? sprite.effectCanvas : frame.image.domElement,
              framePos: frame.framePos || new Gamelab.Vector(0, 0),
              frameSize: frame.frameSize || sprite.size,
              position: new Gamelab.Vector2D(Math.round(pos.x + (origin.x)), Math.round(pos.y + (origin.y))),
              size: new Gamelab.Vector2D(realWidth, realHeight),
              rotation: rotation % 360,
              canvasContext: ctx,
              flipX: sprite.flipX,
              flipY: sprite.flipY,
              origin: origin,
              globalAlpha: sprite.opacity,
              globalComposite: sprite.globalCompositeOperation || false
            };

            Gamelab.Canvas.draw_image_frame(imageFrameArgs);
          }
        }
      }
    }
  }
}


Gamelab.Background = Background;