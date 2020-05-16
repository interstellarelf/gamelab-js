var module = module || {};


function FireArray (object){

  var array;

  if(!object)
  return;

  if(!(object instanceof Array))
  array = [object];
  else{
    array = object;
  }

  array.forEach(function(o){

    if(o.fire && typeof o.fire == 'function')
    o.fire(Gamelab.game_windows[0]);

  });
}


class GameResourceCaller {

  constructor() {
    this.isInit = true;
    this.shotResources = {};
  }

  fireShotResource(resource)
  {

    FireArray(resource.muzzle);

    FireArray(resource.shot);

    FireArray(resource.strike);

  }

  defineShotResource(name, options) {

    function normal_key(x) {

      while (x.indexOf(' ') >= 0) {
        x = x.trim();
      }
      return x.toLowerCase().replace(' ', '-').replace('_', '-');
    }

    for (var x in options) {

        var key = normal_key(x);

        if(x == 'particle') //nothing more than a particle effect
        {

        }

        if(x == 'muzzle') //may be sprite or particle
        {

        }

        if(x == 'shot') //may be sprite or particle
        {

        }

        //bullet flash from impact of energy-weapon: may be sprite or particle
        if(x == 'flash')
        {

        }

    }

    this.shotResources[name] = options;

  }

}

module.exports = function(gameWindow) {

  var spaceQuest = new GameResourceCaller();
  return spaceQuest;
};
