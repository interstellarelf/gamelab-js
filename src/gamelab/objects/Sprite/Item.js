/**
 * Creates a new Item.
 *
 * @param   {string} src the srcPath for the image of the Item
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Item} a Gamelab.Item object
 *
 */

class Item extends Sprite {
  constructor(src = {}, scale) {
    super(src, scale);
    this.imageOptions = [];
    this.collisionObjects = [];
    this.collisionBehavior = 'COLLECT';
    this.collectionAnimation = undefined;
  }
  appendImageOption(src, scale) {
    this.imageProfiles.push({
      src,
      scale
    });
  }
  appendCollisionProfile(collisionObjects, collisionBehavior) {
    this.collisionObjects = collisionObjects;
    this.collisionBehavior = collisionBehavior;
  }
}

Gamelab.Item = Item;
