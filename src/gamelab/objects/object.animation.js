(function() {
  console.log('Animation class... creating');

  /**
   *
   * Creates an instance of Animation with one or more Frames.
   *
   * <example-marker data-class='Animation' data-info='Use JQuery fnxs to load content into the div outside of this p-element. Do not use iframe' > </example-marker>
   *
   * @param   {string=} [src] the src-image-path for this Animation
   * @returns {Animation} an Animation object
   *
   * @example
   *
   * //constructor call: Creates a single-frame Animation from src
   * var singleFrameAnime = new Animation('directory/myFile.png');
   *
   * @example
   * //constructor call with chainable function-calls: Creates multi-frame Animation from src, then sets properties with chainable-function-calls.
   * var multiFrameAnime = new Gamelab.GridAnimation('../images/characters/full/spaceman1.png') //constructor is called
   * .FrameSize(130, 130)
   * .FrameBounds(new Gamelab.Vector(9, 0), new Gamelab.Vector(23, 0), new Gamelab.Vector(23, 0))
   * .Seesaw() //The Animation will play back-and-forth repeatedly (cycle through frames forwards, then backwards and so on.
   * .Duration(900); //Animation lasts 900 millis OR just under 1 second
   *
   *  @design
   *
   * //single-responsibility : to define a list of frames, then progress that list of frames with a 'selected_frame' property
   * var singleFrameAnime = new Animation('directory/myFile.png');
   */

  class GridAnimation {
    constructor(src = {}) {
      var args = typeof(src) == 'object' ? src : {};
      //Gamelab.Modifiers.informable(this, args);
      /**
       * @property {Vector} frameSize the frameSize of the Animation
       * @memberof Animation
       **********/

      this.frameSize = this.frameSize || new Gamelab.Vector(args.frameSize || new Gamelab.Vector(0, 0));
      this.size = this.size || new Gamelab.Vector(args.size || new Gamelab.Vector(0, 0));

      this.type = 'Animation';

      if (typeof src == 'string' || src instanceof HTMLCanvasElement) {
        this.src = src;
        this.image = new Gamelab.GameImage(src);
        this.init_singleFrame();
      } else if (args instanceof Gamelab.GameImage) {
        //console.log('Animation(): args are an instance of GameImage');
        this.image = args;
      } else if (args instanceof HTMLImageElement) {
        //console.log('Animation(): args was an instance of HTMLImageElement');
        this.image = new Gamelab.GameImage(args);
      } else if (args instanceof Gamelab.GridAnimation) {
        this.image = args.image;
      } else if (typeof(args) == 'object' && args.src) {
        this.src = args.src;
        this.image = new Gamelab.GameImage(args.src);
      }

      this.min_cix = 0;

      this.visible = args.visible || true;

      if (args.frameBounds && args.frameBounds.min && args.frameBounds.max) {
        /**
         * @property {VectorFrameBounds} frameBounds the frameBounds of the Animation, has three Vectors
         * @memberof Animation
         **********/
        this.frameBounds = new Gamelab.VectorFrameBounds(args.frameBounds.min, args.frameBounds.max, args.frameBounds.termPoint);

      } else {
        this.frameBounds = new Gamelab.VectorFrameBounds(new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0), new Gamelab.Vector(0, 0, 0));
      }

      this.scale = 1.0;

      this.origin = new Gamelab.Vector(0, 0, 0);

      this.position = new Gamelab.Vector(0, 0);

      this.rotation = new Gamelab.Vector(0, 0, 0);

      this.frameOffset = this.getArg(args, 'frameOffset', new Gamelab.Vector(0, 0, 0));

      this.apply2DFrames();

      this.flipX = this.getArg(args, 'flipX', false);

      this.cix = 0;

      /**
       * @property {Frame} selected_frame the selected_frame of the Animation, a Gamelab.Frame
       * @memberof Animation
       **********/

      this.selected_frame = this.frames[0] || false;
      this.timer = 0;
      this.duration = args.duration || 2000;
      this.seesaw_mode = args.seesaw_mode || false;
      this.reverse_frames = args.reverse_frames || false;
      this.run_ext = args.run_ext || [];
      this.complete_ext = args.complete_ext || [];

      this.Scale(this.scale);
      // this.colorMap = this.createColorMap(5);
    }

    set img_src(value) {
      this.src = value;
    }

    get img_src() {
      return this.src;
    }

    Origin(x, y, z) {
      this.origin = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function($f) {
        $f.origin = new Gamelab.Vector(x, y, z);
      });
      if (this.selected_frame) {
        this.selected_frame.origin = new Gamelab.Vector(x, y, z);
      }
      return this;
    }

    Position(x, y, z) {
      this.position = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function($f) {
        $f.position = new Gamelab.Vector(x, y, z);
      });

      return this;
    }

    Size(x, y) {

      this.size = new Gamelab.Vector(x, y);
      this.frames.forEach(function(f) {

        f.Size(x, y);

      });
      return this;
    }

    Bone(b) {
      this.bone = b;
      return this;
    }

    ParentBone(b) {
      this.parentBone = b;
      return this;
    }

    Rotation(x, y, z) {

      this.rotation = new Gamelab.Vector(x, y, z);

      this.frames.forEach(function($frame) {
        $frame.Rotation(x, y, z);
      });

      return this;
    }

    add(frame) {
      this.frames.push(frame);
    }

    Src(src, options = {}) {
      if (typeof src == 'string') {
        console.log('setting GameImage with string:' + src);
        this.src = src;
        this.image = new Gamelab.GameImage(src);
      } else if (src instanceof GameImage) {
        //console.log('Animation(): args are an instance of GameImage');
        this.image = src;
      } else if (src instanceof HTMLImageElement) {
        //console.log('Animation(): args are an instance of HTMLImageElement');
        this.image = new Gamelab.GameImage(src);
      }

      if (!options.frameBounds)
        this.init_singleFrame();

      return this;
    }

    Scale(s) {
      this.scale = s;
      if (this.image && this.image.domElement && this.image.domElement.width > 0) {
        this.size = new Gamelab.Vector(this.image.domElement.width * s, this.image.domElement.height * s).round();
        this.Size(this.size);
      }
      if (this.frames instanceof Array)
        this.frames.forEach(function(f) {
          f.Scale(s);
        });
      return this;
    }

    Size(x, y, z) {
      this.size = new Gamelab.Vector(x, y, z);
      this.frames.forEach(function(f) {
        f.size = new Gamelab.Vector(x, y, z);
      });
      return this;
    }

    Image(src) {

      if (typeof(src) == 'string') {
        //console.log('setting GameImage with string:' + src);
        this.src = src;
        this.image = new Gamelab.GameImage(src);
      } else if (src instanceof Gamelab.GameImage) {
        //console.log('Animation(): args are an instance of GameImage');
        this.image = src;
      } else if (src instanceof HTMLImageElement) {
        console.log('Animation(): args was an instance of HTMLImageElement');

        this.image = new Gamelab.GameImage(src);
      }
      this.init_singleFrame();
      return this;
    }


    /**
     * sets this Animation to a single-frame-animation, from existing image
     * @function
     * @memberof Animation
     **********/

    init_singleFrame() {

      var $anime = this;

      $anime.load_call = $anime.load_call || function() {};

      this.image.domElement.onload = function() {

        //alert('Anime loaded');

        //first run callback assigned by the api-fxns
        $anime.load_call();

        if ($anime.frameSize.x == 0 && !$anime.__isInit) //indicates zero frame size
          $anime.FrameSize($anime.image.domElement.width, $anime.image.domElement.height)
          .FrameBounds(new Gamelab.Vector(0, 0), new Gamelab.Vector(0, 0));

        if ($anime.size.x == 0 && !$anime.__isInit) //indicates zero size
          $anime.Size($anime.frameSize.mult(new Gamelab.Vector($anime.scale, $anime.scale)));

        if (!$anime.__isInit)
          $anime.apply2DFrames();

      };
      Gamelab.log('Animation():set single-frame animation');
      return this;
    }

    /*****
     * Overridable / Extendable functions
     * -allows stacking of external object-function calls
     ******/


    /**
     * Provides a function to be called when this Animation.image loads.
     *
     * @function
     * @params {Function} call the function to be called on load
     * @memberof Animation
     **********/

    onLoad(call) {

      var $anime = this;
      call = call || function() {};

      this.load_call = call;

      this.image.domElement.onload = function() {

        call.bind($anime).call();

      };

    }

    /**
     * Provides a function to be called whenever this Animation starts. Function should run every time the Animation reaches frame-index 0
     *
     * @function
     * @params {Function} call the function to be called on start
     * @memberof Animation
     **********/

    onRun(call) {

      if (this.run_ext.indexOf(call) == -1) {
        this.run_ext.push(call.bind(this));
      }
    }


    /**
     * Provides a function to be called whenever this Animation completes. Function should run every time the Animation reaches it's last frame-index.
     *
     * @function
     * @params {Function} call the function to be called on complete
     * @memberof Animation
     **********/

    onComplete(call) {

      if (this.complete_ext.indexOf(call) == -1) {
        this.complete_ext.push(call.bind(this));
      }
    }


    /**
     * Provides a single and only function to be called whenever this Animation completes. Function should run every time the Animation reaches it's last frame-index.
     *
     * @function
     * @params {Function} call the function to be called on complete
     * @memberof Animation
     **********/

    soleComplete(call) {
      this.complete_ext = [];
      if (this.complete_ext.indexOf(call) == -1) {
        this.complete_ext.push(call.bind(this));
      }
    }

    call_on_run() {
      //call any function extension that is present
      for (var x = 0; x < this.run_ext.length; x++) {
        this.run_ext[x](this);
      }
    }

    call_on_complete() {
      //call any function extension that is present
      for (var x = 0; x < this.complete_ext.length; x++) {
        this.complete_ext[x](this);
      }
    }


    Visible(v) {
      this.visible = v;
      return this;
    }


    FrameSize(w, h) {
      this.frameSize = new Gamelab.Vector(w, h);
      this.__isInit = true;
      this.apply2DFrames();
      return this;
    }

    Hang() {
      this._hang = true;
      return this;
    }

    ResetHang() {
      this._hang = false;
      this.cix = this.min_cix;
    }

    FrameBounds(min, max, termPoint) {
      if (max && !termPoint) {
        termPoint = max;
      }
      this.frameBounds = new Gamelab.VectorFrameBounds(
        new Gamelab.Vector(min), new Gamelab.Vector(max), termPoint);
      this.__isInit = true;
      this.apply2DFrames();
      return this;
    }

    DefineGridFrames(x1, y1, x2, y2, xFinal, yFinal) {
      var maxFrame;

      if (typeof xFinal == 'number' && typeof yFinal == 'number')
        maxFrame = new Gamelab.Vector(xFinal, yFinal);

      this.frameBounds = new Gamelab.VectorFrameBounds(
        new Gamelab.Vector(x1, y1), new Gamelab.Vector(x2, y2), maxFrame);
      this.__isInit = true;
      this.apply2DFrames();
      return this;
    }

    FrameOffset(x, y) {
      this.frameOffset = new Gamelab.Vector(x, y);
      return this;
    }

    Seesaw() {
      if (!this.seesaw_mode) {
        this.seesaw_mode = true;
      }
      return this;
    }

    Duration(millis) {
      this.duration = millis;
      return this;
    }


    /**
     * Reverses all frames of the animation. Frames are then expected to run backwards.
     *
     * @function
     * @memberof Animation
     **********/

    ReverseFrames() {

      this.reverse_frames = true;
      return this;
    }

    /**
     * Sets the animation a a single frame / full-image. Use before img is loaded
     *
     * @function
     * @param {Vector} frameSize optional size param
     * @memberof Animation
     **********/

    SingleFrame() {
      this.init_singleFrame();
      return this;
    }

    getArg(args, key, fallback) {

      if (args.hasOwnProperty(key)) {
        return args[key];
      } else {
        return fallback;
      }
    }

    init() {
      this.apply2DFrames();
      return this;
    }


    apply2DFrames() {
      this.frames = [];

      if (!this.size) {
        this.Size(this.frameSize.x, this.frameSize.y);
      }

      var fcount = 0;
      var quitLoop = false;

      for (let y = this.frameBounds.min.y; y <= this.frameBounds.max.y; y++) {
        for (let x = this.frameBounds.min.x; x <= this.frameBounds.max.x; x++) {

          let framePos = {
            x: x * this.frameSize.x + this.frameOffset.x,
            y: y * this.frameSize.y + this.frameOffset.y
          };

          var f = new Gamelab.Frame().Image(this.image).FramePos(framePos).FrameSize(this.frameSize).Origin(this.origin).Size(this.size || this.frameSize).Position(this.position || framePos);
          f.Rotation(this.rotation);

          this.frames.push(f);

          if (x >= this.frameBounds.termPoint.x && y >= this.frameBounds.termPoint.y) {
            quitLoop = true;
            break;
          }

          fcount += 1;

          if (quitLoop)
            break;

        }

      }

      this.frames[0] = this.selected_frame = this.frames[0] || new Gamelab.Frame().Image(this.image).FrameSize(this.frameSize).Size(this.frameSize);

      if (this.seesaw_mode) {

        // console.log('Animation: applying seesaw');

        var frames_reversed = this.frames.slice().reverse();

        this.frames.pop();

        this.frames = this.frames.concat(frames_reversed);

      }
      if (this.reverse_frames) {
        this.frames.reverse();
      }
    }

    scaleOf(sized_Object) {

      var s = TypeCode.getPreferredPropertyByKey(sized_Object, 'size', 'argument had nested size variable. Using this instead.');

      return s.div(this.frameSize);

    }

    init_colorMap(spatialDiv) {
      TypeCode.info('init_colorMap()');

      if (!TypeCode.allDefined([this.image, this.image.domElement]))
        return [];

      this.canvasObject = this.canvasObject || new Gamelab.OffscreenCanvasRendering(this.image);

      this.colorMap = this.colorMap || this.ColoredPixelGrid(spatialDiv);

      return this.colorMap;
    }


    ColoredPixelGrid(spatialDiv = 5.0) {

      var image = this.image.domElement,

        ctx = this.canvasObject.ctx,

        grid = [],

        frameSizeDiv = this.selected_frame.frameSize.div(spatialDiv).round();


      for (var x = 0; x <= image.width; x += frameSizeDiv.x) {
        for (var y = 0; y <= image.height; y += frameSizeDiv.y) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero
          if (pixel.data[3] != 0) {
            var vector = new Gamelab.Vector(x, y),
              gridObject = {
                position: vector.sub(frameSizeDiv.div(2.0)),
                size: frameSizeDiv
              };

            grid.push(gridObject);
          }
        }
      }

      return grid;
    }


    /**
     * Returns the existing ColorMap for this animation.
     *
     * @function
     * @memberof Animation
     **********/

    getCurrentPixelMap(spatialDiv) {

      TypeCode.info('getCurrentPixelMap()');
      var map = [];
      var frame = this.selected_frame;
      let __inst = this;

      this.colorMap = this.init_colorMap(spatialDiv);

      for (var x in this.colorMap) {
        var c = this.colorMap[x];

        if (Gamelab.Collision.boxCollide(frame.framePos, frame.frameSize, c.position, c.size)) {
          map.push(c);
        }
      }

      return map;

    }

    /**
     * Sets the frame to a specific array-index.
     *
     * @function
     * @param {number} ix the frame-index to apply.
     * @memberof Animation
     **********/

    setFrame(ix) {
      this.selected_frame = this.frames[ix];
    }


    /**
     * extends the update of this animation with a new function to be called during the update
     * --repeated calls will extend, (not replace) the update --Allows multiple extensions of the update
     * @function
     * @memberof Animation
     * @param {function} fun the function to be appended to sprite.update
     *
     *  * @example
     * // extend the behavior of your animation
     * myAnime.onUpdate(function(spr)
     *
     *                    console.log('extended update'); //runs automatically whenever animation.update runs
     *
     *                   });
     *
     **********/
    onUpdate(fun) {
      fun = fun.bind(this);
      let update = this.update_frame.bind(this);
      let __inst = this;
      this.update_frame = function(__inst) {
        update(__inst);
        fun(__inst);
      };
    }
    soleUpdate(fun) {
      fun = fun.bind(this);
      let __inst = this;
      this.update_frame = function(__inst) {
        fun(__inst);
      };
    }
    update_frame() {
      this.selected_frame = this.frames[Math.round(this.cix) % this.frames.length];
    }
    reset() {
      this.apply2DFrames();
      this.cix = 0;
    }
    /**
     * Applies a continuous animation. Use this in parent-sprite's update if continuous animation is required.
     * Also works as a single call at any time during game-update.
     *
     * @function
     * @memberof Animation
     **********/
    run() {
      if (this.__frametype == 'single') {
        return 0;
      }
      this.apply2DFrames();
      this.cix += 1;
      this.update_frame();
    }
    /**
     * animate():: same as run()
     *
     * @function
     * @memberof Animation
     **********/
    animate() {

      if (this.__frametype == 'single') {
        return 0;
      }

      if (!this.applied) {
        this.apply2DFrames();
        this.applied = true;
      }

      if (this.cix % this.frames.length == 0) {
        this.engage();
      }
    }

    /**
     * Engages, or updates the animation for a one full frame-cycle.
     *
     * @function
     * @param {number} duration the number of milliseconds the animation should take.
     * @memberof Animation
     **********/

    engage(duration) {
      this.call_on_run();
      duration = duration || this.duration || this.frames.length * 20;
      if (this.__frametype == 'single') {
        return 0;
      }

      //note support of min_cix (eg: min_cix of 1 if top-row starts 1 frame later than bottom)
      if (this.cix >= this.frames.length - 1 || this.cix < this.min_cix && !this._hang) {
        this.cix = this.min_cix;
      }
      let __inst = this;

      //we have a target
      this.tween = new TWEEN.Tween(this)
        .easing(__inst.curve || TWEEN.Easing.Linear.None)
        .to({
          cix: this.min_cix + (this.frames.length - 1)
        }, duration)
        .onUpdate(function() {
          //console.log(objects[0].position.x,objects[0].position.y);
          //__inst.cix = Math.ceil(__inst.cix);
          __inst.update_frame();
        })
        .onComplete(function() {
          //console.log(objects[0].position.x, objects[0].position.y);
          if (!__inst._hang)
            __inst.cix = __inst.min_cix;
          __inst.call_on_complete();
          __inst.isComplete = true;
          __inst.apply2DFrames();
        });

      if (this.cix == this.min_cix)
        this.tween.start();

    }
  };

  /** @memberof Gamelab */

  Gamelab.GridAnimation = GridAnimation;

  Gamelab.Animation = GridAnimation;

  Gamelab.GridAnimation.continuous = Gamelab.GridAnimation.run; //'continuous is an alternate reference to 'run'.'

  Gamelab.GridAnimation.update = Gamelab.GridAnimation.update_frame; //alt ref

  Gamelab.GridAnimation.continue = Gamelab.GridAnimation.run; //'continue is an alternate reference to 'run'.'

})();