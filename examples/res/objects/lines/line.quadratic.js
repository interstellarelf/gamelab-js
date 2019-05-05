
var module = module || {};

module.exports = function(object){

  object.StepFunction(function(PORTION, ONE){

    var t = PORTION;

    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    });

};
