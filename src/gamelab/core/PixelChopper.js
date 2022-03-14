
class PixelChopper {

  constructor(src) {
   this.chop = new Gamelab.GameImage(src);
   this.canvasChop = this.canvasChop || new Gamelab.OffscreenCanvasRendering(this.chop);
  }
  chop(src) {

    this.sourceImage =  new Gamelab.GameImage(src);
    this.canvasSourceImage = this.canvasSourceImage ||
     new Gamelab.OffscreenCanvasRendering(this.sourceImage);

  }
}
