/**
 * Creates a new Sprite.
 *
 * <info-bit>Gamelab.Sprite is a container for 2D Animations.
 * -apply Sprite class to create a 2D game-object.
 *
 * Sprites hold reference to their-own Animations and Sounds.</info-bit>
 * <iframe style='width:400px; height:450px; overflow:hidden;' src='../client/examples/js-class/Sprite.html'> </iframe>

 * @param   {string} src the srcPath for the image of the Sprite
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Sprite} a Gamelab.Sprite object
 *
 */


class Sprite {
  constructor(src = {}, scale) {
    var args = typeof src == 'object' ? src : {};

    this.handleAnimationArgs(args);
    this.animations = [];
    this.layer = 0;
    this.type = 'Sprite';

    //create size property
    this.size = new Gamelab.Vector(0, 0);
    this.active = true; //defaults to active or visible
    this.ticker = 0;

    this.scale = scale || 1.0;

    //apply canvas-src if passed
    this.handleCanvasArgs(src);

    //apply remaining args
    this.apply_args(args);

    if (!this.selected_animation)
      this.SingleFrame();
  }

  handleCanvasArgs(src) {
    if (src instanceof HTMLCanvasElement) {
      this.src = src;
      this.selected_animation = new Gamelab.Animation(src);
      this.image = this.selected_animation.image;
      this.animations = [];
      this.animations.push(this.selected_animation);
      this.SingleFrame();
    } else if (typeof src == 'string') {
      this.src = src;

      var srcTail = this.src.split('/').pop();
      //set name to part of file-name, if name falsy
      if (srcTail) {
        this.name = this.name || srcTail.split('.')[0];
      }

      this.selected_animation = new Gamelab.Animation(src);
      this.image = this.selected_animation.image;
      this.animations = [];
      this.animations.push(this.selected_animation);
      this.SingleFrame();
    }
  }

  handleAnimationArgs(args) {
    if (args instanceof Gamelab.Animation) //instantiate from animation
    {
      console.info('args was Gamelab.Animation', args);
      args = {
        selected_animation: args,
        image: args.image,
        size: new Gamelab.Vector(args.frameSize)
      };
    }
  }

  Origin(o) {
    this.origin = new Gamelab.Vector(o);
    if (this.anime) {
      this.anime.origin = new Gamelab.Vector(o);
    }
    return this;
  }

  Layer(l) {
    this.layer = l;
    return this;
  }

  Size(x, y, z) {
    this.size = new Gamelab.Vector(x, y, z);
    if (this.selected_animation && this.selected_animation.frames instanceof Array) {
      this.selected_animation.Size(vector);
    }
    return this.size;
  }

  static_image_load(img) {
    this.size = new Gamelab.Vector(img.width * this.scale, img.height * this.scale).round();
  }

  pushColorEffectCanvas(color) {
    this.effectCanvasList = this.effectCanvasList || [];

    var canvas = document.createElement('CANVAS');
    var img = this.image.domElement;

    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.67;
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.globalCompositeOperation = "source-over";

    this.effectCanvasList.push(canvas);

    return this;
  }

  GlobalComposite(g) {
    this.globalCompositeOperation = g;
    return this;
  }

  ColorEffect(color, opacity = 0.666) {
    this.clearEffects();
    this.effectCanvas = this.effectCanvas || document.createElement('CANVAS');

    var img = this.image.domElement;
    this.effectCanvas.width = img.width;
    this.effectCanvas.height = img.height;

    this.effectCtx = this.effectCtx || this.effectCanvas.getContext('2d');
    this.effectCtx.drawImage(img, 0, 0, img.width * this.scale, img.height * this.scale);

    this.effectCtx.fillStyle = color;
    this.effectCtx.globalAlpha = opacity;
    this.effectCtx.globalCompositeOperation = "source-atop";
    this.effectCtx.fillRect(0, 0, img.width, img.height);
    this.effectCtx.globalCompositeOperation = "source-over";
    this.data = this.effectCtx.getImageData(0, 0, this.effectCanvas.width, this.effectCanvas.height);
    return this;
  }

  DrawToCanvas() {
    this.clearEffects();
    this.effectCanvas = this.effectCanvas || document.createElement('CANVAS');
    var img = this.image.domElement;
    this.effectCanvas.width = img.width;
    this.effectCanvas.height = img.height;
    this.effectCtx = this.effectCtx || this.effectCanvas.getContext('2d');
    this.effectCtx.drawImage(img, 0, 0, img.width, img.height);
    this.image.domElement = this.effectCanvas;
    return this;
  }

  doCanvasEffects() {

    if (!this.stored) {
      this.clearEffects();
    }

    this.effectCanvas = this.effectCanvas || document.createElement('CANVAS');
    this.effectCanvasList = this.effectCanvasList || [];

    var img = this.image.domElement;

    this.img = img;
    this.effectCanvas.width = img.width;
    this.effectCanvas.height = img.height;
    this.effectCtx = this.effectCtx || this.effectCanvas.getContext('2d');
    this.effectCtx.drawImage(img, 0, 0, img.width, img.height);

    this.data = this.effectCtx.getImageData(0, 0, this.effectCanvas.width, this.effectCanvas.height);
    this.effectCanvasList.push(this.effectCanvas);

    this.stored = true;
    this.effectFrames = [];
  }

  resetEffectFrames() {
    this.effectFrames = [];
    return this;
  }

  addFilterFrame(api, callback) {

    this.effectCanvasList = this.effectCanvasList || [];
    this.effectFrames = this.effectFrames || [];
    this.effectCanvasTimer = 0;

    if (api.timer == 0) {
      //    alert('doing effects');
      this.doCanvasEffects();
    }

    var data = this.effectCtx.getImageData(0, 0, this.effectCanvas.width, this.effectCanvas.height);
    api.next(data);
    this.effectFrames.push(data);
    //    console.log('added effect data');
  }

  DoubleBackFilterFrames() {
    this.effectFrames = this.effectFrames.concat(this.effectFrames.slice().reverse());
    return;
  }

  addImageFrame(image, callback) {
    this.effectCanvasTimer = 0;
    this.effectCanvas.width = this.size.x;
    this.effectCanvas.height = this.size.y;
    this.effectCtx.drawImage(image, 0, 0, this.size.x, this.size.y);
    var data = this.effectCtx.getImageData(0, 0, this.effectCanvas.width, this.effectCanvas.height);
    console.info('effect', data);
    this.effectFrames.push(data);
    console.log('added effect data');
  }

  clearEffects() {
    if (this.effectCanvas && this.effectCtx)
      this.effectCtx.clearRect(0, 0, this.effectCanvas.width, this.effectCanvas.height);
    return this;
  }

  /**
   * runs a function for the onload event of this sprite's image
   *
   * @function
   * @param {Function} f the function to be called on load
   * @memberof Sprite
   **********/

  onLoad(f) {

    if (this.src instanceof HTMLCanvasElement) {
      var f = f || function() {};
      f.bind(this).call(false);
    }

    if (this.image && this.image.domElement) {
      var img = this.image.domElement,
        load = img.onload;
      f = f || function() {};
      f.bind(this);
      this.load_call = f;
      var $sprite = this;
      img.onload = function() {

        $sprite.load_total += 1;

        load.bind($sprite).call(false, $sprite);
        //  $sprite.static_image_load(img);
        $sprite.load_call(false, $sprite);
      };

      img.onerror = function(err) {
        $sprite.load_call(true, $sprite);
      }
    } else if (this.anime && this.anime.frames instanceof Array) {
      this.load_call = f;
      f.bind(this).call();
    }

    return this;
  }

  Opacity(o) {

    this.opacity = o;
    return this;
  }


  /**********
   * @ignore
   **********/

  apply_args(args = {}) {

    this.FromData(args, true); //Using a FUNCTIONAL COPY --heavy to process

    function array_instance(list) {
      return list.slice(0);
    };

    if (args.image instanceof Gamelab.GameImage && !this.image) {
      this.image = args.image;
    }

    if (typeof args.name == 'string')
      this.name = args.name;

    //life is either provided or assumed to be approx 4 seconds
    this.life = args.life || 4000 / 50;

    this.description = args.description || "__spriteDesc";

    this.opacity = args.opacity || 1.0;

    this.color = args.color || '#ffffff';


    /**
     * @property {String} id the unique identifier of the Sprite --called automatically on constructor.
     * @memberof Sprite
     **********/

    this.id = this.create_id();


    /**
     * @property {Array} animations the array of animations attached to the Sprite
     * @memberof Sprite
     **********/

    var listnames = ['animations', 'bones', 'meshes', 'scripts', 'events', 'sounds'];

    var $object = this;

    listnames.forEach(function(ln) {

      $object[ln] = array_instance(Gamelab.getArg(args, ln, []));

    });


    /**
     * @property {Array} scripts the array of scripts attached to the Sprite
     * @memberof Sprite
     **********/

    this.motions = Gamelab.getArg(args, 'motions', []);
    this.particles = Gamelab.getArg(args, 'particles', []);
    this.shots = Gamelab.getArg(args, 'shots', []);
    this.init_ext = Gamelab.getArg(args, 'init_ext', []);
    this.group = Gamelab.getArg(args, 'group', 'one');
    this.scrollFactor = args.scrollFactor || 1.0;
    this.noScroll = args.noScroll || false;

    if (this.noScroll) {
      this.scrollFactor = 0;
    }


    /**
     * @property {Vector} speed the speed of the Sprite
     * @memberof Sprite
     **********/

    this.speed = new Gamelab.Vector(Gamelab.getArg(args, 'speed', new Gamelab.Vector(0, 0)));

    /**
     * @property {Vector} size the vector-size of the Sprite
     * @memberof Sprite
     **********/

    this.size = new Gamelab.Vector(Gamelab.getArg(args, 'size', new Gamelab.Vector(0, 0)));


    /**
     * @property {Vector} position the position of the Sprite
     * @memberof Sprite
     **********/

    this.position = new Gamelab.Vector(Gamelab.getArg(args, 'position', new Gamelab.Vector(0, 0, 0)));
    this.realPosition = new Gamelab.Vector(Gamelab.getArg(args, 'realPosition', new Gamelab.Vector(0, 0, 0)));
    this.collision_bounds = Gamelab.getArg(args, 'collision_bounds', new Gamelab.VectorBounds(new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0)));


    this.GROUNDED = false;

    /**
     *
     *
     * @property {Vector} rotation the rotation of the Sprite
     * @memberof Sprite
     **********/

    this.rotation = new Gamelab.Vector(Gamelab.getArg(args, 'rotation', new Gamelab.Vector(0, 0, 0)));


    /**
     * @property {number} scale the scale of the Sprite, controls draw-size
     * @memberof Sprite
     **********/

    this.scale = args.scale || 1.0;
    this.acceleration = Gamelab.getArg(args, 'acceleration', new Gamelab.Vector(0, 0, 0));
    this.rot_speed = new Gamelab.Vector(Gamelab.getArg(args, 'rot_speed', new Gamelab.Vector(0, 0)));
    this.rot_accel = new Gamelab.Vector(Gamelab.getArg(args, 'rot_accel', new Gamelab.Vector(0, 0)));
    this.padding = Gamelab.getArg(args, 'padding', new Gamelab.Vector(0, 0, 0));


    var __inst = this;

    //Apply / instantiate Sound(), Gamelab.Motion(), and Gamelab.Animation() args...


    Gamelab.each(this.shots, function(ix, item) {
      __inst.shots[ix] = new Gamelab.Shot(item);
    });

    Gamelab.each(this.sounds, function(ix, item) {
      __inst.sounds[ix] = new Gamelab.Sound(item);
    });

    Gamelab.each(this.motions, function(ix, item) {
      __inst.motions[ix] = new Gamelab.TweenMotion(item);
    });

    Gamelab.each(this.animations, function(ix, item) {
      __inst.animations[ix] = new Gamelab.Animation(item);
    });

    Gamelab.each(this.particles, function(ix, item) {
      __inst.particles[ix] = new Gamelab.GSProton(item);
    });

    //Apply initializers:

    Gamelab.each(this.init_ext, function(ix, item) {
      __inst.addInitializer(item);
    });

    if (!this.selected_animation && args.selected_animation) {

      //console.dev('applying animation:' + jstr(args.selected_animation));
      this.selected_animation = new Gamelab.Animation(args.selected_animation);

      this.animations = [];
      if (this.animations.indexOf(this.selected_animation) == -1)
        this.animations.push(this.selected_animation);
    }
  }

  RealPosition() {
    return this.realPosition;
  }

  Origin(x, y) {
    this.origin = new Gamelab.Vector(x, y);
    var sprite = this;
    this.animations.forEach(function($anime) {
      $anime.Origin(sprite.origin);
    });
  }


  /**
   * Clones a sprite from existing data
   *
   * @function
   * @param {Object} object the data to be cloned
   * @memberof Sprite
   **********/

  Clone(sprite) {
    console.log('using Clone() function');
    var clone = new Gamelab.Sprite(sprite.src);
    clone.Anime(new Gamelab.Animation(sprite.anime));
    clone.apply_args(sprite);
    return clone;
  }

  draw(ctx, camera) {

    var sprite;

    if (this.constructor.name == 'SpriteBrush') {
      sprite = this.selected_sprite;
    } else {
      sprite = this;
    }

    camera = camera || false;

    if (!camera && Gamelab.game_windows[0] && Gamelab.game_windows[0].camera)
      camera = Gamelab.game_windows[0].camera;

    else if (!camera) {
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

  setSoleUpdate(callback) {
    this.update = function() {
      callback.bind(this).call();
    };
  }

  onCollision(object, callback) {
    this.onUpdate(function() {
      var collisions = Gamelab.Collision.spriteCollideArray([this], object);
      collisions.forEach(function(c) {
        callback(c.object, c.collider);
      });
    });
  }

  onListCollision(object, callback) {
    this.onUpdate(function() {
      callback(Gamelab.Collision.spriteCollideArray([this], object));
    });
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

    if (this.effectCanvas) {
      this.size = new Gamelab.Vector(this.effectCanvas.width * this.scale, this.effectCanvas.height * this.scale),
        this.Origin(this.size.div(2.0));

      console.log('drawing effect canvas');

      let imageFrameArgs = {
        image: this.effectCanvas,
        framePos: new Gamelab.Vector(0, 0),
        frameSize: this.size,
        position: new Gamelab.Vector2D(Math.round(this.position.x + (this.origin.x)), Math.round(this.position.y + (this.origin.y))),
        size: this.size,
        rotation: this.rotation.x,
        canvasContext: ctx,
        flipX: this.flipX,
        flipY: this.flipY,
        origin: this.origin,
        globalAlpha: this.opacity,
        globalComposite: this.globalCompositeOperation || false
      };

      return Gamelab.Canvas.draw_image_frame(imageFrameArgs);
    }

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
          image: this.image.domElement,
          framePos: new Gamelab.Vector(0, 0),
          frameSize: this.size,
          position: new Gamelab.Vector2D(Math.round(x + (origin.x)), Math.round(y + (origin.y))),
          size: new Gamelab.Vector2D(realWidth, realHeight),
          rotation: rotation % 360,
          canvasContext: ctx,
          flipX: sprite.flipX,
          flipY: sprite.flipY,
          origin: origin,
          globalAlpha: this.opacity,
          globalComposite: this.globalCompositeOperation || false
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
                framePos: frame.framePos,
                frameSize: frame.frameSize,
                position: new Gamelab.Vector2D(Math.round(xpos + (origin.x)), Math.round(ypos + (origin.y))),
                size: new Gamelab.Vector2D(realWidth, realHeight),
                rotation: rotation % 360,
                canvasContext: ctx,
                flipX: sprite.flipX,
                flipY: sprite.flipY,
                origin: origin,
                globalAlpha: this.opacity,
                globalComposite: this.globalCompositeOperation || false
              };

              return Gamelab.Canvas.draw_image_frame(imageFrameArgs);
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
              image: this.effectCanvas ? this.effectCanvas : frame.image.domElement,
              framePos: frame.framePos,
              frameSize: frame.frameSize,
              position: new Gamelab.Vector2D(Math.round(pos.x + (origin.x)), Math.round(pos.y + (origin.y))),
              size: new Gamelab.Vector2D(realWidth, realHeight),
              rotation: rotation % 360,
              canvasContext: ctx,
              flipX: sprite.flipX,
              flipY: sprite.flipY,
              origin: origin,
              globalAlpha: this.opacity,
              globalComposite: this.globalCompositeOperation || false
            };

            return Gamelab.Canvas.draw_image_frame(imageFrameArgs);
          }
        }
      }
    }

  }

  /**
   * adds an animation to the sprites
   *
   * @function
   * @param {Object} object the animation to be added
   * @memberof Sprite
   **********/


  Add(object) {

    if (object instanceof Gamelab.Animation) {
      this.animations.add(object);
    }

    return this;
  }

  get animation() {
    return this.selected_animation;
  }

  get anime() {
    return this.selected_animation;
  }

  Anime(anime) {
    if (anime)
      this.selected_animation = anime;
    return this;
  }


  Animation(anime) {
    if (anime)
      this.selected_animation = anime;
    return this;
  }


  FromData(data = {}, fxlCopy = false) {
    for (var x in data) {
      if (fxlCopy || typeof(data[x]) !== 'function')
        this[x] = data[x];
    }

    if (data.update) {
      this.update = data.update;
    }
    return this;
  }

  FromSourceImage(src) {
    return new this.constructor(src);
  }

  /**************************************************************
   * scales the sprite.size property according to image-size.
   * @param {number} scaleFloat a 0-1+ value
   *
   * @function
   * @memberof Sprite
   **************************************************************/

  Scale(scaleFloat, frameSize = {}) {

    this.scale = scaleFloat;

    if (this.anime && this.anime.frameSize && this.anime.frameSize.above_zero_xy()) {
      frameSize = this.anime.frameSize;
    }

    var size_x = frameSize.x || this.image.domElement.width,
      size_y = frameSize.y || this.image.domElement.height;

    var size = new Gamelab.Vector(size_x * scaleFloat, size_y * scaleFloat);


    if (!this.size || isNaN(this.size.x) || isNaN(this.size.y))
      this.size = new Gamelab.Vector(0, 0);


    var diffpos = size.sub(this.size).half();

    this.position.x -= diffpos.x;
    this.position.y -= diffpos.y;
    this.size = size;

    return this;
  }

  /**************************************************************
   * applies a float value arg to Sprite.scrollFactor
   * @param {number} s a 0-1+ value
   *
   * @function
   * @memberof Sprite
   **************************************************************/


  ScrollFactor(s) {
    this.scrollFactor = s;
    return this;
  }

  engage(obj) //engages an object having an engage function
  {
    obj.parent = this;
    if (obj.engage) {
      obj.engage();
    }
  }

  /**
   * pass argument v to the sprite.life property.
   * @function
   * @memberof Sprite
   * @param {number} v number of render-updates that this Sprite will last. --update occurs 60+ times per second, or less, depending on performance
   * @returns {Sprite} the sprite object --enables chainable function calls
   **********/

  Life(v) {
    this.life = v;
    return this;
  }

  /**
   * initializes sprites. triggers all functions previously passed to the addInitializer function.
   * Use this function when a sprite, instantiated from json-data, carries initializers.
   * --This feature is built for the purpose of data-persistence. --sprites from json-file may carry behaviors onto the scene.
   *
   * @function
   * @memberof Sprite
   **********/

  init() {


  }

  /**
   * extends the init function.
   * @function
   * @memberof Sprite
   * @param {function} fun the function to be passed into the init function of the sprite
   **********/

  addInitializer(fun) {
    let boundFun = fun.bind(this)
    if (this.init_ext.indexOf(boundFun) < 0) {
      this.init_ext.push(boundFun)
    };
  }

  /*****************************
   * Getters
   ***************************/

  /**
   * returns the 'id' property of the sprite
   * @function
   * @memberof Sprite
   * @returns {string}
   **********/

  get_id() {
    return this.id;
  }

  /**********
   * @ignore
   **********/

  to_map_object(size, framesize) {

    this.__mapSize = new Gamelab.Vector(size || this.size);

    this.frameSize = new Gamelab.Vector(framesize || this.size);

    return this;

  }

  /*****************************
   * Setters and Creators
   ***************************/

  /**
   * creates a unique string id property for the sprite.
   * @function
   * @memberof Sprite
   * @returns {string}
   **********/

  create_id() {

    return Gamelab.create_id();

  }

  /**
   * returns a maximum scaled size, according to max dimensions of width and height
   * @param {number} mx the maximum size.x for the returned size
   * @param {number} my the maximum size.y for the returned size
   * @function
   * @memberof Sprite
   * @returns {Vector} a vector of x,y,z? values
   **********/

  getSizeByMax(mx, my) {

    var size = new Gamelab.Vector(this.size);
    var wth = size.y / size.x;
    var htw = size.x / size.y;

    if (size.x > mx) {
      size.x = mx;
      size.y = size.x * wth;
    }

    if (size.y > my) {
      size.y = my;
      size.x = size.y * htw;
    }

    return size;
  }

  /*****************************
   *  assert the existence of a speed{} property
   *  sprite.speed (vector) is created if not existing in sprite
   *  @memberof Sprite
   ***************************/

  assertSpeed() {
    if (!this.speed) {
      this.speed = new Gamelab.Vector(0, 0, 0);
    }
  }


  /**
   * set the 'selected_animation' property to a single-frame-animation
   * @function
   * @memberof Sprite
   **********/

  SingleFrame() {

    if (!this.image || !this.image.domElement) {
      return this;
    }

    var __inst = this,
      load = this.image.domElement.onload || function() {};

    if (this.size && this.size.x !== 0 && this.size.y !== 0)
      return;

    var _obj = this;

    if (this.image.domElement instanceof HTMLCanvasElement) {
      if (_obj.size && _obj.size.x !== 0 && _obj.size.y !== 0) {

      } else {
        __inst.size = new Gamelab.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
        __inst.selected_animation = new Gamelab.Animation(this.image.domElement).FrameSize(__inst.size);
        __inst.animations = [];
        __inst.animations.push(__inst.selected_animation);
        __inst.Scale(__inst.scale || 1.0);
      }

      return this;

    }

    this.image.domElement.onload = function() {

      load(false, __inst);

      if (_obj.size && _obj.size.x !== 0 && _obj.size.y !== 0) {

      } else {
        __inst.size = new Gamelab.Vector(__inst.image.domElement.width, __inst.image.domElement.height);
        __inst.selected_animation = new Gamelab.Animation(__inst.image).FrameSize(__inst.size);
        __inst.animations = [];
        __inst.animations.push(__inst.selected_animation);
        __inst.Scale(__inst.scale || 1.0);
      }

    };

    Gamelab.log('set single-frame animation');

    return this;

  }


  /**
   * set the 'life' property to a specified integer
   * @function
   * @memberof Sprite
   **********/

  LifeSpan(value) {
    this.life = value;
  }

  /**
   * set the 'life' property to a specified integer
   * @function
   * @memberof Sprite
   **********/

  Life(value) //same as LifeSpan
  {
    this.life = value;
  }

  /**
   * tells if sprite has been taken out of game
   * @function
   * @memberof Sprite
   **********/

  isDead(gw) {
    gw = gw || Gamelab.game_windows[0];
    return this.hasOwnProperty('life') && this.life <= 0;
  }

  /**
   * sets life to 0, then ending the sprite
   * @function
   * @memberof Sprite
   **********/

  die(gw) {
    this.life = 0;
    return this;
  }

  /**
   * indicates if any portion of the sprite is within screen bounds --uses Gamelab.WIDTH, Gamelab.HEIGHT OR any w,h arguments passed to this method
   * @function
   * @memberof Sprite
   * @param {number} w optional screen-width argument, defaults to Gamelab.WIDTH
   * @param {number} h optional screen-height argument, defaults to Gamelab.HEIGHT
   * @returns {boolean} a true or false value to show if any part of the sprite is on-screen
   **********/

  onScreen(w, h, gw) {

    w = w || Gamelab.WIDTH;
    h = h || Gamelab.HEIGHT;
    gw = gw || Gamelab.game_windows[0];

    var camera = gw && gw.camera ? gw.camera : Gamelab && Gamelab.camera ? Gamelab.camera : {
        position: new Gamelab.Vector(0, 0, 0)
      },
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

    return x + sprite.size.x > -1000 - w && x < w + 1000 &&
      y + sprite.size.y > 0 - 1000 - h && y < h + 1000;
  }

  /*****************************
   * Updates
   ***************************/

  /*****************************
   * update()
   * -starts empty:: is applied recursively by Gamelab.js as the main sprite-update
   ***************************/

  /**
   * the main update for the sprite --applied recursively by GameWindow
   * @function
   * @memberof Sprite
   **********/

  update(sprite) {}


  updateBySpeed() {
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
  }

  /*****************************
   *  onUpdate(fun)
   * -args: 1 function(sprite){ } //the self-instance/sprite is passed into the function()
   * -overrides and maintains existing code for update(){} function
   ***************************/


  /**
   * extends the update of this sprite with a new function to be called during the update
   * --repeated calls will extend, (not replace) the update --Allows multiple extensions of the update
   * @function
   * @memberof Sprite
   * @param {function} fun the function to be appended to sprite.update
   *
   *  * @example
   * // extend the behavior of your sprite
   * mySprite.onUpdate(function(spr)
   *
   *                    console.log('extended update'); //runs automatically whenever sprite.update runs
   *
   *                   });
   *
   **********/


  onUpdate(fun) {

    fun = fun.bind(this);

    let update = this.update.bind(this);

    let __inst = this;

    this.update = function(__inst) {

      update(__inst);

      fun(__inst);

    };
  }

  /*****************************
   *  travelLineTwoWay()
   *  -sprite travels line: any Line() or object with property of line
   ***************************/

  /********************************************************************************
   * sprite travels on a line in a back-and-forth motion --to the end of the line, and back.
   * #Dev-todo:MORE ON THIS
   * @function
   * @memberof Sprite
   *********************************************************************************/

  travelLineTwoWay(lineObject, speed, curveKey, offset) {

    speed = speed || 1;

    var motionCurveOptions = ["linear", "quadratic", "cubic"];
    curveKey = curveKey || "linear";
    var line = lineObject;

    if (lineObject.line) {
      line = lineObject.line;
    }

    this.__crtLineIx = this.__crtLineIx || 0;

    var __inst = this,
      pctFloat = __inst.__crtLineIx % ((line.points.length - 1) / 2) / ((line.points.length - 1) / 2);

    if (__inst.__crtLineIx >= ((line.points.length - 1) / 2)) {
      pctFloat = 1.0 - pctFloat;
    }

    var ixChange = Gamelab.Curves.InOut[curveKey](pctFloat) * speed * 0.5;

    if (curveKey == 'linear') {
      ixChange = speed;
    }

    ixChange = Math.ceil(ixChange);

    if (ixChange < 1) {
      ixChange = 1;
    }

    __inst.position = new Gamelab.Vector(line.points[__inst.__crtLineIx]);

    //console.log(ixChange);

    __inst.__crtLineIx += ixChange;

    if (__inst.__crtLineIx >= line.points.length) {
      line.points = line.points.reverse();
      __inst.__crtLineIx = 0;
    }

    if (offset instanceof Gamelab.Vector) {
      this.position = this.position.add(offset);
    }
  }


  /*****************************
   *  travelLineOnLoop()
   *  -sprite travels line: any Line() or object with property of line
   ***************************/

  /**
   * the sprite travels one line in a looping motion --useful for traveling Square, Circle, or other enclosed Lines.
   * #Dev-todo:MORE ON THIS
   * @function
   * @memberof Sprite
   **********/

  travelLineOnLoop(lineObject, speed, curveKey, offset) {

    speed = speed || 1;

    var motionCurveOptions = ["linear", "quadratic", "cubic"];

    curveKey = curveKey || "linear";

    var line = lineObject;

    if (lineObject.line) {
      line = lineObject.line;
    }

    this.__crtLineIx = this.__crtLineIx || 0;

    var __inst = this,

      pctFloat = __inst.__crtLineIx % ((line.points.length - 1) / 2) / ((line.points.length - 1) / 2);

    if (__inst.__crtLineIx >= ((line.points.length - 1) / 2)) {
      pctFloat = 1.0 - pctFloat;

    }

    var ixChange = Gamelab.Curves.InOut[curveKey](pctFloat) * speed * 0.5;

    if (curveKey == 'linear') {
      ixChange = speed;
    }

    ixChange = Math.ceil(ixChange);

    if (ixChange < 1) {
      ixChange = 1;
    }

    __inst.position = new Gamelab.Vector(line.points[__inst.__crtLineIx]);

    // console.log(ixChange);

    __inst.__crtLineIx += ixChange;

    if (__inst.__crtLineIx >= line.points.length) {
      __inst.__crtLineIx = 0;
    }

    if (offset instanceof Gamelab.Vector) {
      this.position = this.position.add(offset);
    }
  }

  /*****************************
   *  shoot(sprite)
   *  -fire a shot from the sprite:: as in a firing gun or spaceship
   *  -takes options{} for number of shots anglePerShot etc...
   *  -TODO: complete and test this code
   ***************************/


  /**
   * fire a Shot, or bullet-Sprite from the Sprite
   * @function
   * @memberof Sprite
   * @param {Object} options an object of arguments
   * @param {Gamelab.Animation} animation the animation to fire from the Sprite
   * @param {number} speed the speed of the shot that is projected
   * @param {Gamelab.Vector} position the initial position of the shot: defaults to current Sprite position
   * @param {Gamelab.Vector} size the Vector size of the shot
   * @param {Gamelab.Vector} rot_offset the rotational offset to apply: controls direction of the shot
   **********/

  shoot(options, gw) {
    //character shoots an animation
    gw = gw || Gamelab.game_windows[0];
    this.prep_key = 'shoot';

    let animation = options.bullet || options.animation || options.anime || new Gamelab.Animation();
    let speed = options.speed || options.velocity || 1;


    let size = options.size || new Gamelab.Vector(10, 10, 0);
    let position = new Gamelab.Vector(options.position) || new Gamelab.Vector(this.position);


    let rot_offset = options.rot_offset || options.rotation || 0;
    let total = options.total || 1;
    let rot_disp = options.rot_disp || 0; //the full rotational-dispersion of the bullets

    let life = options.life || 900;
    let shots = [];
    for (var x = 0; x < total; x++) {

      var __playerInst = this;
      if (Gamelab.isAtPlay) {
        var bx = position.x,
          by = position.y,
          bw = size.x,
          bh = size.y;

        var shot = new Gamelab.Sprite().FromData({
          active: true,
          position: new Gamelab.Vector(position),
          size: new Gamelab.Vector(size),
          speed: speed,
          image: animation.image,
          rotation: new Gamelab.Vector(0, 0, 0),
          flipX: false,
          life: options.life,
          noScroll: true
        });


        shot.Animation(animation);

        rot_offset = new Gamelab.Vector(rot_offset, 0, 0);
        shot.position.x = bx, shot.position.y = by;

        //Danger On this line: annoying math --dispersing rotation of bullets by rot_disp

        var div = rot_disp / total;
        var rotPlus = div * x + div / 2 - rot_disp / 2;

        shot.rotation.x = rot_offset.x + rotPlus;
        //  shot.origin = new Gamelab.Vector(position);

        shot.speed = new Gamelab.Vector(Math.cos((shot.rotation.x) * 3.14 / 180) * speed, Math.sin((shot.rotation.x) * 3.14 / 180) * speed);
        shots.push(shot);

        shot.onUpdate(function(spr) {
          // console.log('update:rotation:' + shot.rotation.x);
        });
        gw.add(shot);
      }
    }
    return shots;
  }

  /**
   * create a sub-sprite belonging to the current sprite
   * @function
   * @memberof Sprite
   * @param {Object} options an object of arguments
   * @param {Animation} animation the animation to fire from the Sprite
   * @param {number} speed the speed of the shot that is projected
   * @param {Vector} position the initial position of the shot: defaults to current Sprite position
   * @param {Vector} size the Vector size of the shot
   * @param {Vector} offset the positional offset to apply
   * @returns {Sprite} a Gamelab.Sprite object
   **********/

  subsprite(options, gw) {

    gw = gw || Gamelab.game_windows[0];

    let animation = options.animation || new Gamelab.Animation();
    let position = options.position || new Gamelab.Vector(this.position);
    let offset = options.offset || new Gamelab.Vector(0, 0, 0);
    let size = new Gamelab.Vector(options.size || this.size);

    if (Gamelab.isAtPlay) {

      var subsprite = gw.add(new Gamelab.Sprite().FromData({
        active: true,
        position: position,
        size: size,
        offset: offset,
        image: animation.image,
        rotation: new Gamelab.Vector(0, 0, 0),
        flipX: false,
        scrollFactor: this.scrollFactor,
        noScroll: this.noScroll
      }));

      subsprite.Animation(animation);

      return subsprite;

    } else {
      console.error('No subsprite when not at play');
    }
  }


  /**
   * switch to the next frame on sprite.selected_animation
   * @function
   * @memberof Sprite
   * @param {Animation} animation the optional animation to switch to before animate is called, defaults to the existing sprite.selected_animation
   **********/

  animate(animation) {
    if (Gamelab.isAtPlay) {
      if (animation) {
        this.Animation(animation)
      }

      if (this.effectFrames instanceof Array && this.effectFrames.length && this.effectFrames.length >= 1) {
        this.effectCanvasTimer += 1;

        console.log('drawing from effect');

        var data = this.effectFrames[this.effectCanvasTimer % this.effectFrames.length];
        //  this.clearEffects();
        this.effectCtx.putImageData(data, 0, 0);
        console.log('animated data');
      } else if (this.effectCanvas) {
        this.effectCanvasTimer += 1;
        //do nothing
      } else if (this.selected_animation) {
        this.selected_animation.run();
      }
    }
  }

  /**
   * run a function when the sprite.selected_animation is complete
   *
   * @function
   * @memberof Sprite
   * @param {Function} fun the function to call when the animation is complete
   *
   **********/
  onAnimationComplete(fun) {
    this.selected_animation.onComplete(fun);
  }

  grounded(value) {
    if (value)
      this.GROUNDED = value;
    return this.GROUNDED;
  }


  /**
   * get the vector-position at the center of the sprite, based on its current position and size
   * @function
   * @memberof Sprite
   *
   * @returns (Vector) a vector-position pinpointing the current-center of the sprite
   *
   **********/
  center() {
    return new Gamelab.Vector(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, 0);
  }


  /*****************************
   *  System Use / Collision
   ***************************/


  /*****************************
   * @ignore
   ***************************/

  shortest_stop(item, callback) {
    var diff_min_y = item.min ? item.min.y : Math.abs(item.position.y - this.position.y + this.size.y);
    var diff_min_x = item.min ? item.min.x : Math.abs(item.position.x - this.position.x + this.size.x);
    var diff_max_y = item.max ? item.max.y : Math.abs(item.position.y + item.size.y - this.position.y);
    var diff_max_x = item.max ? item.max.x : Math.abs(item.position.x + item.size.x - this.position.y);

    var dimens = {
      top: diff_min_y,
      left: diff_min_x,
      bottom: diff_max_y,
      right: diff_max_x
    };

    var minkey = "",
      min = 10000000;

    for (var x in dimens) {
      if (dimens[x] < min) {
        min = dimens[x];
        minkey = x; // a key of top left bottom or right
      }
    }

    callback(minkey);
  }

  /*************
   * #BE CAREFUL
   * -with this function :: change sensitive / tricky / 4 way collision
   * *************/

  /**
   * determine if sprite overlaps on x-axis with another sprite
   *
   * @function
   * @memberof Sprite
   * @param {Sprite} item the Sprite to compare with
   * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
   * @returns {boolean} a true || false var showing if overlap has occured
   *
   **********/

  overlap_x(item, padding) {
    if (!padding) {
      padding = 0;
    }

    var p1 = this.position,
      p2 = item.position;
    var paddingX = Math.round(padding * this.size.x),

      paddingY = Math.round(padding * this.size.y),
      left = p2.x + paddingX,
      right = p2.x + this.size.x - paddingX;

    return right > p1.x && left < p1.x + item.size.x;
  }

  /*************
   * #BE CAREFUL
   * -with this function :: change sensitive / tricky / 4 way collision
   * *************/

  /**
   * determine if sprite overlaps on y-axis with another sprite
   * @function
   * @memberof Sprite
   * @param {Sprite} item the Sprite to compare with
   * @param {number} padding the 0-1.0 float value of padding to use on self when testing overlap
   * @returns {boolean} a true || false var showing if overlap has occured
   *
   **********/

  overlap_y(item, padding) {
    if (!padding) {
      padding = 0;
    }

    var p1 = this.position,
      p2 = item.position;

    var paddingX = Math.round(padding * this.size.x),
      paddingY = Math.round(padding * this.size.y),

      top = p2.y + paddingY,
      bottom = p2.y + this.size.y - paddingY;

    return bottom > p1.y && top < p1.y + item.size.x;

  }


  /*************
   * #BE CAREFUL
   * -with this function :: change sensitive / tricky / 4 way collision
   * *************/


  /**
   * stop collision on x-axis with another sprite
   * @function
   * @memberof Sprite
   * @param {Sprite} item the Sprite with which to collide-stop on the x-axis
   **********/

  collide_stop_x(item) {

    var apart = false;
    var ct = 500;

    while (!apart && ct > 0) {
      ct--;

      var diffX = this.center().sub(item.center()).x;
      var distX = Math.abs(this.size.x / 2 + item.size.x / 2 - Math.round(this.size.x * this.padding.x));

      if (Math.abs(diffX) < distX) {
        this.position.x -= diffX > 0 ? -1 : 1;
      } else {
        this.speed.x = 0;
        apart = true;
      }
    }
  }


  /**
   * restore a sprite from existing json-data --applies to data-persistence
   *
   * @function
   * @memberof Sprite
   *
   * @returns (Sprite)
   **********/

  restoreFrom(data) {
    data.image = new GameImage(data.src || data.image.src);
    return new Gamelab.Sprite(data);
  }

  ColoredRect(color, w, h) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    this.canvas = canvas;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    this.image = new Gamelab.GameImage(canvas);
    this.ctx = ctx;
    this.size = new Gamelab.Vector(w, h);
    return this;
  }

  AsCanvasTiles(tilesX, tilesY, unitWidth, unitHeight) {

    var canvas = document.createElement('canvas');

    var width = unitWidth * tilesX + unitWidth,
      height = unitHeight * tilesY + unitHeight;

    canvas.width = width;
    canvas.height = height;

    this.size = new Gamelab.Vector(w, h);

    var ctx = canvas.getContext('2d');

    this.canvas = canvas;
    this.srcImageSave = new Gamelab.GameImage(this.image.domElement.src);

    var $object = this;

    this.srcImageSave.domElement.onload = function() {

      for (var x = 0; x < tilesX; x++) {
        for (var y = 0; y < tilesY; y++) {
          ctx.drawImage(this, x * $object.size.x, y * $object.size.y, unitWidth, unitHeight);
        }
      }
    };


    this.image = new Gamelab.GameImage(canvas);
    this.ctx = ctx;
    return this;
  }


  /*****************************
   * @ignore
   * #IN-TESTING
   *  fromFile(file_path)
   *  -TODO : complete this function based on code to load Sprite() from file, located in the spritemaker.html file
   *  -TODO: test this function
   ***************************/

  fromFile(file_path) {
    if (typeof file_path == 'string') {
      var __inst = this;
      $.getJSON(file_path, function(data) {
        __inst = new Gamelab.Sprite(data);
      });
    }
  }

  /*****************************
   * return a decycled json-string for the sprite --without circular references
   * @returns {string} a json string
   ***************************/

  toJSONString() {
    return jstr(JSON.decycle(this));
  }

};

Gamelab.Sprite = Sprite;
