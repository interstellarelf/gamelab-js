

var module = module || {};

module.exports = function(object){

  object.StepFunction(function(PORTION, ONE){

    var t = PORTION;

    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1

    });

};
