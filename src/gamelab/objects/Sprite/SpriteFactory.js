class SpriteFactory {

  constructor(onCreate) {

    this.sprites = [];
    this.livingTotal = 0;
    this.livingSprites = [];

    this.lockoutTime = 0;

    this.livingSprites.oldest = function() {
      var maxTicker = 0,
        nextObjectIndex = 0;
      for (var x = 0; x < this.length; x++) {
        if (typeof this[x] == 'object' && this[x].ticker >= maxTicker) {
          maxTicker = this[x].ticker;
          nextObjectIndex = x;
        }
      }
      return this[nextObjectIndex];
    };

    this.livingSprites.countLiving = function() {
      var total = 0;
      for (var x = 0; x < this.length; x++) {
        if (this[x].ticker > 0) {
          total++;
        }
      }
      return total;
    };

    this.sprites.oldest = function() {
      var maxTicker = 0,
        nextObjectIndex = 0;
      for (var x = 0; x < this.length; x++) {
        if (typeof this[x] == 'object' && this[x].ticker >= maxTicker) {
          maxTicker = this[x].ticker;
          nextObjectIndex = x;
        }
      }
      return this[nextObjectIndex];
    };

    this.sprites.countLiving = function() {
      var total = 0;
      for (var x = 0; x < this.length; x++) {
        if (this[x].ticker >= 1) {
          total++;
        }
      }
      console.log('TOTAL LIVING blts::' + total);
      return total;
    };

    if (typeof onCreate == 'function')
      onCreate.bind(this).call();

  }

  Frequency(f) {
    this.frequency = f;
    return this;
  }

  MenuSprite(sprite) {

    if (sprite)
      this.menu_sprite = sprite;

    return this.menu_sprite;
  }

  PrepareSprites(total = 1, exampleSprite, onCreateSprite) {
    for (var x = 0; x < total; x++) {
      var s = new Gamelab.Sprite().FromData(exampleSprite);
      this.sprites.push(s);
    }
    this.createSprite = onCreateSprite;
    return this;
  }

  PrepareSpritesByArrayOrder(total = 1, exampleSprites, loadFxn) {

    if (!exampleSprites instanceof Array)
      exampleSprites = [exampleSprites];

    for (var x = 0; x < total; x++) {
      var s = new Gamelab.Sprite().FromData(exampleSprites[x % exampleSprites.length]);
      s.onLoad(loadFxn || function() {});
      this.sprites.push(s);
    }

    return this;
  }

  lockout(numberUpdates) {
    if (this.lockoutTime <= 0) {
      this.lockoutTime = numberUpdates;
    }
  }

  Life(l) {
    this.life = l;
    return this;
  }

  enter(number = 1, gameWindow) {
    var $controller = this;

    if (this.lockoutTime > 0) {
      this.lockoutTime -= 1.0;

      if (this.lockoutTime >= 1.0) {
        return;
      }
      //continue to with enter() fxn
    }

    for (var x = 0; x < number; x++) {
      //get next in stock::
      var livingCount = this.sprites.countLiving();

      var s = new Gamelab.Sprite().Clone(this.sprites[0]);

      s.Life(this.life);

      if (this.createSprite) {
        this.createSprite.bind(s).call();
      }

      this.livingSprites.push(s);

      gameWindow.add(s);
      this.livingTotal += 1;

      if (this.onfire)
        this.onfire(s);

    }

    return {

      assignTrackableSpeed: function(speed) {

        $p.trackableSpeed = speed;
        return this;
      },

      assignLinesAndSelector: function(lineList, lineSelector) {
        $p.lines = lines;
        return this;
      }

    }

  }

  onUpdate(update) {
    this.onupdate = update;
    return this;
  }

  onFire(callback) {

    this.onfire = callback;
    return this;
  }

  fire(gameWindow) {
    this.enter(1, gameWindow);
  }

}

Gamelab.SpriteFactory = SpriteFactory;