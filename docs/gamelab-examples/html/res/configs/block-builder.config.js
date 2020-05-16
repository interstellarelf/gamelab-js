

module.exports = function(config={}){
  alert('block-builder.config --module running');
  config.name = 'block-builder';
  config.maxWidth = config.maxWidth || 32;
  config.minWidth = config.minWidth || 32;
  config.maxHeight = config.maxHeight || 32;
  config.minHeight = config.maxHeight || 32;
  return config;
};
