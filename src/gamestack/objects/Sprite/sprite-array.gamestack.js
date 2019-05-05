class SpriteArray {

  constructor() {

    this.sprites = [];

    this.update = [];

    this.moves = {};

    this.load = function() {};

    this.update = function() {};

  }

  each(f) {

    var ix = 0;

    this.sprites.forEach(function(spr) {

      f(ix, spr);

      ix += 1;

    });

  }

  add(sprite) {
    this.sprites.push(sprite);
    return this;
  }


  /**
   * runs a function when the sprite's image has loaded
   *
   * @function
   * @params {Function} f the function to be called on load
   * @memberof Sprite
   **********/

  onLoadSprites(f) {

    var sprites = this.sprites,
      len = this.sprites.length,
      ix = 0;

    var __spriteList = this;

    __spriteList.load = f.bind(this);

    sprites.forEach(function(spr) {

      spr.onLoad(function() {

        ix += 1;

        if (ix == len) {
          __spriteList.load(__spriteList.sprites);
        }

      });

    });

  }

}

Gamestack.SpriteArray = SpriteArray;


class SpriteVerticalChain extends SpriteArray {

  constructor() {
    super();
  }

  add(sprite) {

    sprite.parent = this.sprites.length >= 1 ? this.sprites[this.sprites.length - 1] : false;

    sprite.onUpdate(function() {

      this.origin = this.origin || new Gamestack.Vector(this.size.x / 2, 0);

      if (this.parent) {


        this.offset = this.offset || new Gamestack.Vector(0, 0);


        var extremity = new Gamestack.Vector(0, this.parent.size.y);

        var p = this.parent.position.add(this.parent.origin);

        //  p = p.sub(this.origin);

        //  p = p.add(parent.origin);

        var np = new Gamestack.Vector(Gamestack.GeoMath.rotatePointsXY(extremity.x, extremity.y, this.parent.rotation.x));

        this.position = p.add(np).add(this.offset);

      }


    });

    this.sprites.push(sprite);

    return this;
  }

}

Gamestack.SpriteVerticalChain = SpriteVerticalChain;
