
/*
Framework-Init error-check:
*/

Larva.truthOrDie([Gamestack], "Gamestack-library is not initialized");

Larva.check(Gamestack, 'prefabs', {});

Larva.check(Gamestack.prefabs, 'interactive', {});

 (function(){

var ACTIONBLOCK = () => {

  var actionblock;

      return actionblock;
};

Gamestack.prefabs.interactive.collectible = ACTIONBLOCK();

})();
