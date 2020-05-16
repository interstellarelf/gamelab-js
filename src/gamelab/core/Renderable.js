/**
 * Renderable : consistent base-type for graphic-objects
 * @param   {Object} args the object of arguments
 * @returns {Renderable} a Gamelab.Renderable object.
 * */

class Renderable {
  constructor(args = {}) {
    //  Gamelab.FeatureInject(this, args);
  }
}


/**
 * A game-image object based on HTMLImage element. Creates GameImage, attaches gameImage.domElement --an instance of HTMLImageElement
 * @param   {string} src the sourcePath of the image-file.
 * @returns {GameImage} a Gamelab.GameImage object.
 * */

class GameImage extends Renderable {

  constructor(src = {}, onCreate = function() {
    I('image: used default fxn argument:');
  }) {

    super(src);

    if (typeof src == 'object' && !(src instanceof HTMLCanvasElement)) {
      return src;
    }

    if (typeof src == 'string') {
      this.domElement = document.createElement('IMG');
      this.domElement.src = src;
    } else if (src instanceof HTMLCanvasElement) {
      this.domElement = src;
    }


    this.domElement.onerror = function() {
      this.__error = true;
      //console.dev('--image error');
    };

  }
};

Gamelab.GameImage = GameImage;
