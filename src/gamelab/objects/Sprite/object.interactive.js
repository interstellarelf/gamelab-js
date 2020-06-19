/**
 * Creates a new Interactive.
 *
 * @param   {string} src the srcPath for the image of the Item
 * @param   {number} scale=1.0 the scale to be applied to size of each animation-frame
 *
 * @returns {Interactive} a Gamelab.Interactive object
 *
 */

class Interactive extends Sprite {
  constructor(src = {}, scale) {
    super(src, scale);
  }
}

Gamelab.Interactive = Interactive;