module.exports = function(config={}){
  alert('block-builder.config --module running');
  config.name = 'square-terrain-builder';
  config.fullFrameSize = false;
  config.borderColor = '#555555';
  config.surfaceFontValue = '>><<';
  config.surfaceImageFile = undefined;
  return config;
};
