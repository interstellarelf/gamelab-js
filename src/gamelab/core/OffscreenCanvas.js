
(function(){

  class OffscreenCanvas {

    constructor(canvas, x, y){
      this.canvas = canvas;
      this.x = x;
      this.y = y;

      this.ctx = this.canvas.getContext('2d');
    }
    draw(ctx)
    {
      ctx.draw(this.canvas, this.x, this.y);
    }

  }

  Gamelab.OffscreenCanvas = OffscreenCanvas;


})();
