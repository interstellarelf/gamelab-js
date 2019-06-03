(function () {
    console.log('Frame class... creating');

    /**
     * Creates an instance of Frame
     *
     * <info-bit>Gamestack.Frame is called automatically by Gamestack.Sprite and Gamestack.Animation.
     * Gamestack.Frame does not take arguments.
     * It is instantiated, then initilized with chainable function-calls.</info-bit>
     *
     * @returns {Frame}
     *
     * @example
     *
     * var selected_frame = new Gamestack.Frame().Image(gameImage).Size(frameSizeVector);
     */


    class Frame {
        constructor() {
            var __inst = this;
            this.framePos = new Gamestack.Vector(0, 0);
            this.origin = new Gamestack.Vector(0, 0);
        }

        Image(src) {
            this.image = new Gamestack.GameImage(src);
            return this;
        }

        onLoad(fxn){

          fxn = fxn || function(){};
          fxn = fxn.bind(this);
          this.image.domElement.onload = function(){
            fxn();
          };

        }

        Origin(x, y, z)
        {
          this.origin = new Gamestack.Vector(x, y, z);
          return this;
        }

        Rotation(x, y, z)
        {
          this.rotation = new Gamestack.Vector(x, y, z);
          return this;
        }

        FramePos(p) {
            this.position = new Gamestack.Vector(p, p, p);

            this.framePos = new Gamestack.Vector(p, p, p);

            return this;
        }

        FrameSize(x, y, z)
        {
          this.frameSize = new Gamestack.Vector(x, y, z);
          return this;
        }

        StoreOffscreen(){

          this.offscreen = new Gamestack.OffscreenCanvasRendering(this.image);

                      for(var x in this.offscreen)
                      {
                        if(x == 'ctx' || x == 'canvas')
                        this[x] = this.offscreen[x];
                      }


          return this;

        }

        getURL(){
          this.StoreOffscreen();
          return this.offscreen.canvas.toDataURL();
        }

        getColoredPixelGrid(unitSize=5) {

            var grid = [];

            let min = this.framePos, max = this.framePos.add(this.frameSize);

            for (var x = min.x; x <= max.x; x += unitSize) {
                for (var y = min.y; y <= max.y; y += unitSize) {
                    // Fetch pixel at current position
                    var pixel = this.ctx.getImageData(x, y, 1, 1);
                    // Check that opacity is above zero
                    if (pixel.data[3] != 0) {

                        var vector = new Gamestack.Vector(x, y),

                            gridObject = {

                                position: vector,

                                size: new Gamestack.Vector(unitSize, unitSize),

                                pixel:pixel

                            };

                        grid.push(gridObject);
                    }
                }
            }

            return grid;
        }

        getFullPixelGrid(unitSize=5) {

            var grid = [];

            let min = this.framePos, max = this.framePos.add(this.frameSize);

            for (var x = min.x; x <= max.x; x += unitSize) {
                for (var y = min.y; y <= max.y; y += unitSize) {
                    // Fetch pixel at current position
                    var pixel = this.ctx.getImageData(x, y, 1, 1);
                    // Check that opacity is above zero


                        var vector = new Gamestack.Vector(x, y),

                            gridObject = {

                                position: vector,

                                size: new Gamestack.Vector(unitSize, unitSize),

                                pixel:pixel

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

        createColorMap(size, altImage) {

            if (!(altImage || this.image && this.image.domElement))
                return this;

            this.StoreOffscreen();

            this.colorMap = this.getColoredPixelGrid(size, this.testCtx);

            return this.colorMap;
        }



        createFullPixelMap(size, altImage) {

            if (!(altImage || this.image && this.image.domElement))
                return this;

            this.StoreOffscreen();

            this.fullPixelMap = this.getFullPixelGrid(size, this.testCtx);

            return this.fullPixelMap;
        }

    }

    Gamestack.Frame = Frame;

})();
