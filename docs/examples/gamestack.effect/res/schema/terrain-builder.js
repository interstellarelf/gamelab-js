


var module = module || {};

function arg(object, key, fallback)
{
  return object[key] || fallback;
}

module.exports = function(options){

  var baseSprite = arg(options, 'base_texture', console.error('missing options.base_texture --Gamestack.Sprite()::'));

  var scatterTextures = arg(options, 'scatter_textures', console.error('missing options.scatter_textures --[] of Gamestack.Sprite()::'))

  var edgeTextures = arg(options, 'edge_textures', console.error('missing options.edge_textures --[] of Gamestack.Sprite()::'))

  //expect edge_textures.order (random, consecutive)
  //expect edge_textures.placement (top, left, bottom, right)
  //expect scatter_textures.color_distribution
  //expect scatter_textures.size_distribution

}
