/**
 * Creates a new Terrain.
 *
 * @param   {string} src the srcPath for the image of the Terrain
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Terrain} a Gamelab.Terrain object
 *
 */

class Terrain extends Sprite {
  constructor(src = {}, scale) {
    super(src, scale);
    this.imageOptions = [];
    //1. Terrain can draw from a set of optional source images
    //2. Terrain has values for collision
    //3. Terrain can quickly instantiate objects for running, jumping, climbing
    this.collisionObjects = [];
    this.collisionBehavior = 'STOP';
  }
  multiply(top, left, skipTop, skipLeft) {

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

Gamelab.Terrain = Terrain;