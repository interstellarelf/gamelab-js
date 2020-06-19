var module = module || {};

module.exports = function(nameKey) {
  let sprites = [];
  var skeletonSources = ['./res/humanoid-skeleton.resources/head/head.png',
    './res/humanoid-skeleton.resources/arms/arm-top.png',
    './res/humanoid-skeleton.resources/arms/arm-bottom.png',
    './res/humanoid-skeleton.resources/center/torso.png',
    './res/humanoid-skeleton.resources/center/hip.png',
    './res/humanoid-skeleton.resources/legs/leg-top.png',
    './res/humanoid-skeleton.resources/legs/leg-bottom.png',
    './res/humanoid-skeleton.resources/legs/foot.png',
  ];
  skeletonSources.forEach(function(src) {
    let sprite = new Gamelab.Sprite(src);

    //if this is 'dual' appendage
    if (['arm-top', 'arm-bottom', 'leg-top', 'leg-bottom', 'foot']
      .indexOf(src.split('/').pop().split('.')[0]) >= 0) {
      //add left or right to tail of src, use altSprite for right appendage
      let altSprite = new Gamelab.Sprite(src);
      sprite.name = nameKey + '-' +
        src.split('/').pop().split('.')[0] + '-left';
      //alert(sprite.name);
      altSprite.name = nameKey + '-' +
        src.split('/').pop().split('.')[0] + '-right';
      //alert(altSprite.name);
      sprites.push(altSprite);
    } else {
      //add nothing to the tail of src
      sprite.name = nameKey + '-' +
        src.split('/').pop().split('.')[0] + '';
    }

    sprite.builderGroup = 'skeleton';
    sprites.push(sprite);
  });
  return sprites;
};

window.module = module;