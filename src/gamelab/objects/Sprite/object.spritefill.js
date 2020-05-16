/**
 * Creates a new SpriteFill.
 */

class SpriteFill extends Sprite {
  constructor(src = {}, scale = 1.0) {
    super(src, scale);
    this.sourceSprites = [];
    this.overlaySprites = [];
    this.shape = [];
  }
  //draw function is overwritten to nothing. --limits console errors --todo --complete
  draw() {
    return 0;
  }
  addSprite(src, scale, callback) {
    this.sourceSprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }
  addOverlaySprite(src, scale, callback) {
    console.info(`SpriteFill().addOverlay(): --adds an overlay.
      Every overlay must fit with every sourceSprite, matching non-transparent pixels only`);
    this.overlaySprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }
  SelectionMode(mode) {
    this.selection_mode = mode || this.selected_mode || 'random';
    return this.selection_mode;
  }
  BuildShape(onCreateShape) {
    if(onCreateShape) onCreateShape.bind(this).call();
    return this.shape;
  }
  enclose_rectangle() {
    var rect = new Gamelab.Rectangle(Infinity, Infinity, -Infinity, -Infinity);
    this.shape.forEach(function(point) {
      if (point.x < rect.min.x) {
        rect.min.x = point.x;
      }
      if (point.y < rect.min.y) {
        rect.min.y = point.y;
      }
      if (point.x > rect.max.x) {
        rect.max.x = point.x;
      }
      if (point.y > rect.max.y) {
        rect.max.y = point.y;
      }
    });
    return rect;
  }

  Fill() {

    var bounds = this.enclose_rectangle();

    //step 1: fill the shape with rectangles:

    var tracker = new Gamelab.Vector(),
      sprite = this.sourceSprites[0],
      currentSize = new Gamelab.Vector(sprite.size),
      currentIndex = 0;

    this.offscreenCanvas = new Gamelab.OffscreenCanvas(document.createElement('CANVAS'), bounds.min.x, bounds.min.y);

    var ctx = this.offscreenCanvas.ctx;

    //apply loop through x, y bounds, fill with sprites
    for (var x = bounds.min.x; x < bounds.max.x; x += currentSize.x) {
      for (var y = bounds.min.y; y < bounds.max.y; y += currentSize.y) {
        var nextSprite = new Gamelab.Sprite().FromData(this.sourceSprites[currentIndex]);
        this.sprites.push(nextSprite);
        currentSize = new Gamelab.Vector(nextSprite.size);
        currentIndex += 1;
        nextSprite.onLoad(function() {
          this.draw(ctx);
        });
      }
    }

    return this.offscreenCanvas;

  }

};

Gamelab.SpriteFill = SpriteFill;
