

/**
 * Renderable : consistent base-type for graphic-objects
 * @param   {Object} args the object of arguments
 * @returns {Renderable} a Gamestack.Renderable object.
 * */

class Renderable
{
    constructor(args={})
    {
      //  Gamestack.FeatureInject(this, args);
    }
}


/**
 * A game-image object based on HTMLImage element. Creates GameImage, attaches gameImage.domElement --an instance of HTMLImageElement
 * @param   {string} src the sourcePath of the image-file.
 * @returns {GameImage} a Gamestack.GameImage object.
 * */

class GameImage extends Renderable {

    constructor(src={}, onCreate=function(){I('image: applied default arg to onCreate():');}) {

        super(src);

        if(typeof src == 'object') {

          return src;

        }


                    console.dev('GameImage--', this);

                                this.domElement = document.createElement('IMG');

                                this.domElement.src = src;


            this.domElement.onerror = function () {
                this.__error = true;
                console.dev('--image error');
            };

    }
};

Gamestack.GameImage = GameImage;
