/**
 * Creates a new SpriteGroup.
 *
 * <info-bit>Gamelab.SpriteGroup is a container for RELATIVE-POSITIONED 2D Animations.
 * -apply Sprite class to create a 2D game-object.
 */

class SpriteGroup {
  constructor(src = {}, scale = 1.0) {
    this.sprites = [];
    this.mainSprite = new Gamelab.Sprite(src, scale);
  }

  BasePosition(px, py){
    this.basePosition = new Gamelab.Vector(px, py);
    return this;
  }

  add(sprite){
    this.sprites.push(sprite);
    return this;
  }
};

Gamelab.SpriteGroup = SpriteGroup;
