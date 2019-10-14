
/**************************
  EventInterfaceMap: StringKeys:

    * (must implement without option)
    @ (may implement optional)
*****************************/


let EventInterfaceMap = {  //className / must have named functions whyen carrying Symbol of className

  Sprite: ['@onUpdate', '@onDestroy'],

  Animation: ['@onRun', '@onComplete', '*onCollide'],

  Motion: ['@onCommit', '@onComplete', '*onCollide'],

  Shot: ['@onShoot', '*onCollide', '*onCollide'],

  Terrain: ['@onCollide'],

  Interactive: ['@onCollide'],

  Global: ['@onUpdate'],

  check: function(instance) {
    for (var x in this) {
      if (x == 'check')
        continue;
      else {
        if (this[x] instanceof Array) {
          this[x].forEach(function(f) {
            var fkey = f.replace('@', '');
            if (!instance.getOwnPropertyNames.indexOf(fkey) >= 0)
              throw new Error('Object must implement function by name of:' + fkey);

          });
        }
      }
    };
  }
}

/**************************
  ObjectFeatureInterfaceMap:
      Indicates classNames, and what they must carry as functions
*****************************/

let ObjectFeatureMap = { //className / must have named function properties when carrying Symbol of className

  Sprite: ['@spatial', '@data'],

  SpriteBrush: ['@spatial', '@data'],

  Elipse:['@spatial'],

  Frame:['@spatial'],

  Particle:['@spatial'],

  Animation: ['@anchored', '@framedriven', '@effectdriven', '@data'],

  Line2d:['@spatial', '@pointarrayflippable', '@selftransposable',  '@data'],

  Text:['@spatial', '@text', '@colored'],

};

Gamelab.ObjectFeatureMap = ObjectFeatureMap;


let InputIFM = {

  GamepadButtons: ['@onButton'],

  GamepadSticks: ['@onStick'],

  Keyboard: ['@onKey'],

  MouseMove: ['@onMouseMove'],

  MouseButton: ['@onMouseButton'],

  MouseWheel: ['@onMouseWheel'],

  LeapMotion: ['@onLeapMotion']

};


let UIEditables = {

  Sprite: ['size', 'position', 'rotation'],

  Animation: ['frameBounds', 'etc']

};


let UIOption = function(name, hint, script) {
  return {
    name,
    hint,
    script
  }
};

let UIPrefab = {

  MainSelect: {
    Interactive: {

      name: 'FourwayClasticRect',

      hint: 'Object is collideable on four rectangular sides',

      script: '#MY-SCRIPT-PATH'
    }
  },

  FormEditables: {

    Interactive: []
  }
};



let UIPrefabMainSelect = {

  Background: ['Bound']

};


let getCustomPrefabMeta = function() { //get name and file/data resources for each custom prefab

};

/**********************************

  UIObjectSelectMap:

    -Just the system default options

*********************************/

let UIObjectPrefabs = {

  Sprite: ['Side-Scroll-Player', 'Collider', 'Spaceship', 'Robot'],

};
