

var module = module || {};

module.exports = function(canvas){

  var increase = Math.PI * 2 / (canvas.width / 2), counter = 0;

var Curve = new Gamestack.Line2d().Color('aqua').Size(canvas.width, canvas.height / 10)
                                  .StepFunction(function(PORTION, ONE){

                                        var value = Math.sin(counter) / 2 + 0.5;
                                        counter += increase;

                                        return  value;

                                  });


                                  Curve.Fill();


var DRAW = function(ctx){

  Curve.draw(ctx);

};

return {

  draw:DRAW

}

};
