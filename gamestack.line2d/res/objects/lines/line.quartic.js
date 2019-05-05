
var module = module || {};

module.exports = function(object){

  object.StepFunction(function(PORTION, ONE){

    var t = PORTION;

    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t

    });

};
