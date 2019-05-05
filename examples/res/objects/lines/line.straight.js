

var module = module || {};

module.exports = function(object){

  object.StepFunction(function(PORTION, ONE){

    return Math.round(ONE * PORTION * 1000) / 1000;

    });

};
