/**
 * Creates a new SpriteBrush.
 */

class SpriteBrush{
  constructor(onCreate, mode = 'random') {
    this.sprites = [];
    this.overlaySprites = [];
    this.mode = mode;
    this.index = -1;
    this.total = 0;
    this.selected_sprite = {};
    this.id = Gamelab.create_id();
    onCreate = onCreate || function(){};
    onCreate.bind(this);
  }

  addSprite(src, scale, callback) {
    this.sprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }
  addOverlaySprite(src, scale, callback) {
    console.info(`SpriteFill().addOverlay(): --adds an overlay.
      Every overlay must fit with every sourceSprite, matching non-transparent pixels only`);
    this.overlaySprites.push(new Gamelab.Sprite(src, scale));
    if(callback) callback.bind(this).call();
  }

  removeAll(){
    this.sprites = [];
    this.overlaySprites = [];
  }

  next(){
    this.index += 1;
    switch(this.mode.toLowerCase())
    {
        case 'random':
        var index = Math.floor(Math.random() * this.sprites.length);
        this.selected_sprite = this.sprites[index];
        return this.selected_sprite;
        break;

        case 'consecutive':
        this.selected_sprite = this.sprites[this.index % this.sprites.length];
        return this.selected_sprite;
        break;
    }
  }

  Clone(spritebrush)
  {
    var outputSprite = new Gamelab.SpriteBrush();
    outputSprite.id = spritebrush.id;
    var oix = 0;

    spritebrush.sprites.forEach(function(sprite){
        outputSprite.addSprite(sprite.src, sprite.size);
        oix += 1;
    });

    spritebrush.overlaySprites.forEach(function(sprite){
        outputSprite.addOverlaySprite(sprite.src, sprite.size);
        oix += 1;
    });
    return outputSprite;
  }

  FromData(spritebrush)
  {
    var outputSprite = new Gamelab.SpriteBrush();

    outputSprite.id = spritebrush.id;

    var oix = 0;

    spritebrush.sprites.forEach(function(sprite){

        outputSprite.addSprite(sprite.src, sprite.size);

        oix += 1;
    });

    spritebrush.overlaySprites.forEach(function(sprite){

        outputSprite.addOverlaySprite(sprite.src, sprite.size);

        oix += 1;
    });

    return outputSprite;
  }
};

Gamelab.SpriteBrush = SpriteBrush;
