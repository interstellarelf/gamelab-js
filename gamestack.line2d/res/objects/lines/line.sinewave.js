

var module = module || {};

module.exports = function(object){

var increase = Math.PI * 2 / 100, counter = 0;

  object.StepFunction(function(PORTION, ONE){

    var value = Math.sin(counter) / 2 + 0.5;
    counter += increase;

    return  value;

    });

};
