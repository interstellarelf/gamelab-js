
  /**
   * Creates a new WebGl.
   *
   * @param   {Object} canvas the canvas element.
    * @param   {Object} drawables the drawable objects to be drawn.
   * @returns {WebGL} a 2d/3d game-window object
   * */

  class WebGL {
    constructor(canvas = false, drawables = []) {

      if(!THREE)
      {
        return console.error('THREE.js required in window');
      }


      document.body.style.position = "absolute";

      document.body.style.width = "100%";

      document.body.style.height = "100%";



      var camera = new THREE.PerspectiveCamera();

      var container = document.querySelector('#game-window');

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( container.clientWidth, container.clientHeight );


      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 1000 ); //was 1000 last arg


  container.append( this.renderer.domElement );


        this.scene.add(this.camera);

        this.light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( this.light );

            this.drawables = drawables;

            this.bool_events = Gamestack.bool_events || [];

            this.canvas = this.renderer.domElement;

      this.camera.target = false;

      var __inst = this;

      this.update_ext = [];

      Gamestack.game_windows.push(this);

      window.onerror = function(){

        Gamestack.errors += 1;

        console.log('Canvas Error --');

        if (Gamestack.errors > Gamestack.settings.errorLimit) {
          Gamestack.stopDraw = true;

        var call = call ||  window.setTimeout(function(){

          if(call)
          {
            window.clearTimeout(call);
          }
            console.log('%cDraw stopped at errorLimit:' + Gamestack.settings.errorLimit, 'color:darkorange;');

          }, 200);

        }

      }


    }


      /**
       * returns the gameWindow.canvas property, an HTMLCanvasElement
       *
       * @function
       * @memberof WebGL
       **********/

    getCanvas(){
      return this.canvas;
    }


      /**
       * returns a vector(x, y) of the center of the WebGL
       *
       * @function
       * @memberof WebGL
       **********/


    center() {

      return new Gamestack.Vector(Math.round(this.canvas.width / 2), Math.round(this.canvas.height / 2));

    }


    /**
     * creates an array of gridUnits
     *
     * @function
     * @memberof WebGL
     **********/

     GridStyle(total_x, total_y, w, h, srcImage_Path)
     {

       if(!(this.grid instanceof Array))
       {
         this.grid = [];
       }

       function GridUnit(x, y, w, h, srcImage_Path){

         var size = new Gamestack.Vector(w, h),
         position = new Gamestack.Vector(x, y);

         var sprite;

         if(srcImage_Path)
         {
           sprite = new Gamestack.Sprite(srcImage_Path);
           sprite.Size(size);
           sprite.Pos(position);

           Gamestack.game_windows[0].add(sprite);
         }

         return {
           size:size,
           position:position
         };
       };

       for(var y = 0; y < total_y; y++)
       {

         for(var x = 0; x < total_x; x++)
         {

           this.grid.push(new GridUnit(x * w, y * h, w, h, srcImage_Path));

         }

       }
       return this;
     }

  getCanvas(){
    return this.canvas;
  }



    /**
     * adds an update to the WebGL:: update to be called every 20 milliseconds
     *
     * @function
     * @memberof WebGL
     **********/


    onUpdate(f) {

      this.update_ext.push(f);

    }

        /**
         * the main update for the WebGL:: called automatically after call of GameWindow.start() or WebGL.animate()
         *
         * @function
         * @memberof GameWindow
         **********/

    update() {

      Gamestack.each(this.drawables, function(ix, item) {

        if (item && typeof(item.def_update) == 'function') {

          item.def_update(item);

        }

        if (item && typeof(item.update) == 'function') {
          item.update(item);

        }


                if (item && ['SpriteArray', 'RobotixArray', 'RobotixVerticalChain'].indexOf(item.constructor.name) >= 0  &&
                   typeof item.each  == 'function') {

                  item.each(function(ix, graphic){

                    graphic.update(graphic);

                  });

                }

      });

      Gamestack.each(this.bool_events, function(ix, item) {

        if (item && item.bool()) {
          item.callback();
        }

      });


      for (var x in this.update_ext) {
        this.update_ext[x]();
      }
    }

    draw() {

      var __gameWindow = this;

      if (this.before_draw_ext) {
        this.before_draw_ext();
      }

      Gamestack.each(this.drawables, function(ix, item) {

        if(typeof item.draw == 'function')
        {
          item.draw(__gameWindow.ctx, __gameWindow.camera);
        }

      });


      if (this.after_draw_ext) {
        this.after_draw_ext();
      }

    }


        /**
         * adds a call before the WebGL draw()
         *
         * @function
         * @memberof WebGL
         **********/

    onBeforeDraw(f) {

      var boundCall = f.bind(this);

      if(!this.before_draw_ext)
      this.before_draw_ext = function(){};

      var beforeDraw = this.before_draw_ext.bind(this);

      this.before_draw_ext = function() {
        beforeDraw();
        boundCall();
      };

    }

    /**
     * adds a call after the WebGL draw()
     *
     * @function
     * @memberof WebGL
     **********/


    onAfterDraw(f) {

      var boundCall = f.bind(this);

      if(!this.after_draw_ext)
      this.after_draw_ext = function(){};


      var afterDraw = this.after_draw_ext.bind(this);

      this.after_draw_ext = function() {
        afterDraw();
        boundCall();
      };

    }

    /**
     * sets the size of the WebGL
     *
     * @function
     * @param {integer} w the width of the WebGL
     * @param {integer} h the HEIGHT of the WebGL
     * @memberof WebGL
     **********/

    Size(w, h, isAbsoluteSize) { //call with no args to fill to browser-window-size;

      w = w || this.canvas.parentNode.clientWidth;

      h = h || this.canvas.parentNode.clientHeight;

      var c = this.canvas;

      if (c) {
        c.setAttribute('width', w)
      };

      if (c) {
        c.setAttribute('height', h)
      };

      Gamestack.WIDTH = w;

      Gamestack.HEIGHT = h;

      this.canvas.width = w;

      this.canvas.height = h;

      this.size = new Gamestack.Vector(w, h);

      this.isAbsoluteSize = isAbsoluteSize || false;

      return this;

    }

    /**
     * adds an object to the WebGL
     *
     * @function
     * @param {Object} obj the object to be added (Sprite)
     * @param {Boolean} onBottom if true, adds to the bottom of layer-stack in WebGL
     * @memberof WebGL
     **********/

    add(obj, options={}) {

      var optionsGuide = {
        obj:'The Object{} being added into play',
        options:{
          position:'The Vector(x, y) offset to use when drawing the obj'
        }
      };

      console.info('GameWindow.add() --2nd argument options is object of arguments >>>', optionsGuide);

      var layer = options.layer || this.drawables.length - 1;

      if(!(typeof layer == 'number' && layer >= 0))
      layer = this.drawables.length;

      var offset = new Gamestack.Vector(0, 0);

      if(options.position)
      offset = options.position;

      obj.window_offset = offset;

      //1: if Sprite(), Add object to the existing __gameWindow

      var __inst = this;

      if (obj instanceof Gamestack.Camera) {

        this.camera = obj;

      } else if (obj instanceof Gamestack.GSEvent) {

        if (Gamestack.__running) {

          return console.error('Events can only be added before Gamstack.animate() is called::aka before the main update / loop begins');
        } else {

          obj.apply();

        }
      } else {

        this.drawables.splice(layer, 0, obj);

      };

      return obj;

    }

    /**
     * set background-color of WebGL
     *
     * @function
     * @param {string} c the new background-color for WebGL
     * @memberof WebGL
     **********/

    Background(c) {
      this.canvas.style.background = c;

      this.canvas.style.backgroundColor = c;

      return this;

    }

    /**
     * removes an object from the WebGL
     *
     * @function
     * @param {Object} obj the object to be removed (Sprite)
     * @memberof WebGL
     **********/

    remove(obj) {

      var ix = this.drawables.indexOf(obj);

      if (ix >= 0) {
        this.drawables.splice(ix, 1);
      }
    }

    /**
     * begins the animation-loop of WebGL.
     *
     * @function
     * @param {number} time optional time parameter for usage with Tween
     * @memberof WebGL
     **********/


    animate(time) {

      var __inst = this;

      requestAnimationFrame(function() {

        __inst.animate();

      });


      if (Gamestack.__stats) {
        Gamestack.__stats.begin();
        Gamestack.__statsMS.begin();
        Gamestack.__statsMB.update();
      }

      Gamestack.isAtPlay = true;

      if (window.TWEEN)
        TWEEN.update(time);

      __inst.update();

      console.log('Rendering');
      this.renderer.render(this.scene, this.camera);

      this.draw();

      if (Gamestack.__stats) {
        Gamestack.__stats.end();
        Gamestack.__statsMS.end();
      }

    }

    /**
     * begins the animation-loop of WebGL, with performance Stats shown on-screen
     *
     * @function
     * @memberof WebGL
     **********/


    start() {

      if (typeof(Stats) == 'function') //Stats library exists
      {
        //basic stat animation
        Gamestack.__stats = new Stats();
        Gamestack.__stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

        Gamestack.__stats.dom.style.left = '10%';

        Gamestack.__stats.dom.setAttribute('class', 'stat');

        this.canvas.parentNode.appendChild(Gamestack.__stats.dom);

        //basic stat animation
        Gamestack.__statsMS = new Stats();
        Gamestack.__statsMS.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom

        Gamestack.__statsMS.dom.style.left = '10%';

        Gamestack.__statsMS.dom.style.marginLeft = '90px';

        Gamestack.__statsMS.dom.setAttribute('class', 'stat');

        this.canvas.parentNode.appendChild(Gamestack.__statsMS.dom);

        //basic stat animation
        Gamestack.__statsMB = new Stats();
        Gamestack.__statsMB.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom

        Gamestack.__statsMB.dom.style.left = '10%';

        Gamestack.__statsMB.dom.setAttribute('class', 'stat');

        Gamestack.__statsMB.dom.style.marginLeft = '180px';

        this.canvas.parentNode.appendChild(Gamestack.__statsMB.dom);
      }

      this.animate();
    }
  }

  Gamestack.WebGL = WebGL;

  Gamestack.WebGl = WebGL;
