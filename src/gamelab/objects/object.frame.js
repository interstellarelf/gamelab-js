(function() {
  console.log('Frame class... creating');

  /**
   * Creates an instance of Frame
   *
   * <info-bit>Gamelab.Frame is called automatically by Gamelab.Sprite and Gamelab.Animation.
   * Gamelab.Frame does not take arguments.
   * It is instantiated, then initilized with chainable function-calls.</info-bit>
   *
   * @returns {Frame}
   *
   * @example
   *
   * var selected_frame = new Gamelab.Frame().Image(gameImage).Size(frameSizeVector);
   */


  class Frame {
    constructor() {
      var __inst = this;
      this.framePos = new Gamelab.Vector(0, 0, 0);
      this.frameSize = new Gamelab.Vector(0, 0, 0);
      this.origin = new Gamelab.Vector(0, 0, 0);
      this.position = new Gamelab.Vector(0, 0, 0);
      this.rotation = new Gamelab.Vector(0, 0, 0);
    }

    Image(src) {
      this.image = new Gamelab.GameImage(src);
      return this;
    }

    onLoad(fxn) {

      fxn = fxn || function() {};
      fxn = fxn.bind(this);
      this.image.domElement.onload = function() {
        fxn();
      };

    }

    Origin(x, y, z) {
      this.origin = new Gamelab.Vector(x, y, z);
      return this;
    }

    Rotation(x, y, z) {
      this.rotation = new Gamelab.Vector(x, y, z);
      return this;
    }

    FramePos(x, y, z) {
      this.framePos = new Gamelab.Vector(x, y, z);
      return this;
    }

    FrameSize(x, y, z) {
      this.frameSize = new Gamelab.Vector(x, y, z);
      return this;
    }

    Scale(s) {
      if (this.image && this.image.domElement) {
        this.size = new Gamelab.Vector(Math.round(this.image.domElement.width * s), Math.round(this.image.domElement.height * s));
      }
    }

    StoreOffscreen() {

      this.offscreen = this.offscreen || new Gamelab.OffscreenCanvasRendering(this.image);

      for (var x in this.offscreen) {
        if (x == 'ctx' || x == 'canvas')
          this[x] = this.offscreen[x];
      }

      return this;

    }

    getURL() {
      this.StoreOffscreen();
      return this.offscreen.canvas.toDataURL();
    }

    getColoredPixelGrid(unitSize = 5, ctx) {

      var grid = [];

      ctx = ctx || this.ctx;

      let min = this.framePos,
        max = this.framePos.add(this.frameSize);


      for (var x = min.x; x <= max.x; x += unitSize) {
        for (var y = min.y; y <= max.y; y += unitSize) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero
          if (pixel.data[3] != 0) {

            var vector = new Gamelab.Vector(x, y),

              gridObject = {

                position: vector,

                x: x,
                y: y,

                size: new Gamelab.Vector(unitSize, unitSize),

                pixel: pixel,

                rotation: this.rotation

              };

            grid.push(gridObject);
          }
        }
      }

      return grid;
    }

    getNonColoredPixelGrid(unitSize = 5, ctx) {

      var grid = [];

      ctx = ctx || this.ctx;

      let min = this.framePos,
        max = this.framePos.add(this.frameSize);


      for (var x = min.x; x <= max.x; x += unitSize) {
        for (var y = min.y; y <= max.y; y += unitSize) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero
          if (pixel.data[3] == 0) {

            var vector = new Gamelab.Vector(x, y),

              gridObject = {

                position: vector,

                x: x,
                y: y,

                size: new Gamelab.Vector(unitSize, unitSize),

                pixel: pixel,

                rotation: this.rotation

              };

            grid.push(gridObject);
          }
        }
      }

      return grid;
    }

    getFullPixelGrid(unitSize = 5, ctx) {

      ctx = ctx || this.ctx;

      var grid = [];

      let min = this.framePos,
        max = this.framePos.add(this.frameSize);

      for (var x = min.x; x <= max.x; x += unitSize) {
        for (var y = min.y; y <= max.y; y += unitSize) {
          // Fetch pixel at current position
          var pixel = ctx.getImageData(x, y, 1, 1);
          // Check that opacity is above zero


          var vector = new Gamelab.Vector(x, y),

            gridObject = {

              position: vector,

              x: x,
              y: y,

              size: new Gamelab.Vector(unitSize, unitSize),

              pixel: pixel,

              rotation: this.rotation

            };

          grid.push(gridObject);
        }
      }

      return grid;
    }


    /**
     * Creates and returns a ColorMap for this animation, allowing opacity-based pixel-collision.
     *
     * @function
     * @param {number} unitDimen a Colormap grid-unit-size --A larger unitDimen decreases accuracy, and results in faster-processing.
     * @memberof Animation
     **********/

    createColorMap(size, ctx) {

      this.StoreOffscreen();

      ctx = ctx || this.ctx;

      this.colorMap = this.colorMap || this.getColoredPixelGrid(size, ctx);

      return this.colorMap;
    }

    createNonColorMap(size, ctx) {
      this.StoreOffscreen();
      ctx = ctx || this.ctx;
      this.nonColorMap = this.nonColorMap || this.getNonColoredPixelGrid(size, ctx);
      return this.nonColorMap;
    }


    createPixelMap(size, altImage) {
      if (this.image.domElement instanceof HTMLCanvasElement) {
        this.canvas = this.image.domElement;
        ctx = this.ctx = this.canvas.getContext('2d');
      } else {
        this.StoreOffscreen();
        ctx = ctx || this.ctx;
      }

      this.pixelMap = this.pixelMap || this.getFullPixelGrid(size, this.testCtx);
      return this.fullPixelMap;
    }

  }

  Gamelab.Frame = Frame;

})();