/***************************************
 * LayerSplit
 *  speeds up + improves framerate by splitting up an entire frame
 *  of sprites. Many sprites become a lesser quantity of sprites, drawn
 *  as a batch.
 *  --assumes that all the sprites on x-layer behave in the same way
 *****************************************/

//Provide a gameWindow plus all the sprites to be split up

function getSpritesByLayer(spriteArray, minLayer, maxLayer) {

  let sprites = [];

  spriteArray.forEach(function(spr) {

    if (typeof spr == 'object' && spr.constructor.name == 'Sprite' &&
      spr.layer >= minLayer && spr.layer <= maxLayer) {
      sprites.push(spr);
    }

  });

  return sprites;

}

module.exports = function(gameWindow, minLayer, maxLayer) {

  //First pause the gameWindow
  gameWindow.pause();

  //Empty all drawables
  gameWindow.removeAll();

  //Extract all sprites between minLayer and maxLayer
  var layerSprites = getSpritesByLayer(gameWindow.drawables, minLayer, maxLayer);

  //Next draw all the sprites
  gameWindow.batchDraw(layerSprites);

  //Then split the entire set into splotches of 256x256
  var vectorSize = new Gamelab.Vector(256, 256);

  var sprites = gameWindow.splitCurrentWindowToSpriteArray(vectorSize.x, vectorSize.y, 20000, 6000);

  console.log('completed --gameWindow.splitCurrentWindowToSpriteArray()');

  console.log('sprites (input) len=' + layerSprites.length);

  console.log('sprites (output) len=' + sprites.length);

  return sprites;

};
