/*
Framework-Init error-check:
*/

Larva.truthOrDie([Gamestack], "Gamestack-library is not initialized");

Larva.check(Gamestack, 'prefabs', {});

Larva.check(Gamestack.prefabs, 'interactive', {});

(function(){

var COLLECTIBLE = () => {

  var collectible;

  return collectible;

};

Gamestack.prefabs.interactive.collectible = COLLECTIBLE();

})();
