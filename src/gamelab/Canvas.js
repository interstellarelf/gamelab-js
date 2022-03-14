/**
 * Creates Gamelab.js Canvas: The canvas-renderer for Gamelab games.

 @description
 This Canvas library handles the low-level drawing of Gamelab.Animation objects on HTML5Canvas.
 -Draws Sprites according to their rotation, size, and properties.
 * @returns {CanvasLib} a CanvasLib object.
 */

(function() {

  console.log('CanvasStack class... creating');

  class GamelabCanvas {

    constructor() {
      this.__levelMaker = false;
      //draw is synonymous w/ drawSprite
      this.draw = this.draw_object;
    }

    isStopped() {
      return Gamelab.stopDraw || false;
    }

    drawLine(a, b, strokeStyle){

      if (this.isStopped())
        return;

      var ctx = Gamelab.game_windows[0].ctx;
      ctx.strokeStyle = strokeStyle || 'aqua';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    arc(p1, p2, strokeStyle) {

      if (this.isStopped())
        return;

      var ctx = Gamelab.game_windows[0].ctx;

      ctx.strokeStyle = options.strokeStyle || 'aqua';

      ctx.beginPath();
      ctx.arc(p1.x, p1.y, p2.x, p2.y, Math.PI * 2, true);
      ctx.stroke();
    }

    draw_image_frame(imageFrameOptions) {

      var {
        image,
        framePos,
        frameSize,
        position,
        size,
        rotation,
        canvasContext,
        flipX,
        flipY,
        origin,
        globalAlpha,
        globalComposite
        }
        =
        imageFrameOptions;

      if (this.isStopped())
        return;

      var fx = framePos.x,
        fy = framePos.y,
        fw = frameSize.x,
        fh = frameSize.y,
        x = position.x,
        y = position.y,
        width = size.x,
        height = size.y;

      //save canvas state before draw
      canvasContext.save();

      origin = origin || new Gamelab.Vector(width / 2, height / 2);

      //degrees rotation:
      var deg = rotation;
      deg = deg % 360;
      var rad = Math.floor((deg * Math.PI * 1000) / 180) / 1000;
      //Set the origin to the center of the image
      canvasContext.translate(x, y);
      canvasContext.rotate(rad);
      //Rotate the canvas around the origin


      canvasContext.translate(0, canvasContext.width);

      if (flipX) {
        canvasContext.scale(-1, 1);
      } else {

      }

      if (flipY) {
        canvasContext.scale(1, -1);
      } else {

      }
      canvasContext.globalAlpha = globalAlpha || 1.0;

      if(globalComposite)
      {
        //canvasContext.globalCompositeOperation = globalComposite;
      }
      //draw the image
      canvasContext.drawImage(image, fx, fy, fw, fh, -origin.x, -origin.y, width, height);
      //reset the canvas
      canvasContext.globalAlpha = 1.0;
      canvasContext.restore();
    }

    draw_data(x, y, w, h, data, ctx) {
      if (this.isStopped())
        return;

      ctx.putImageData(data, x, y, 0, 0, w, h);
    }
  }


  Gamelab.Canvas = new GamelabCanvas();

  Gamelab.GamelabCanvas = GamelabCanvas;

  class OffscreenCanvasRendering {
    constructor(psuedoImage) {
      this.htmlImage = psuedoImage.domElement || psuedoImage;
      this.testCanvas = document.createElement("CANVAS");
      this.testCtx = this.testCanvas.getContext("2d");
      this.testCanvas.width = this.htmlImage.width;
      this.testCanvas.height = this.htmlImage.height;
      this.testCanvas.style.zIndex = '9999';
      this.testCtx.drawImage(this.htmlImage, 0, 0);
      return {
        canvas: this.testCanvas,
        ctx: this.testCtx
      }
    }

  };

  Gamelab.OffscreenCanvasRendering = OffscreenCanvasRendering;

})();
