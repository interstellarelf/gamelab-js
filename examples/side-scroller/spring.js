var module = module || {};

module.exports = function(object, siblings) {

  object.onUpdate(function(){

    var obj1 = this;

    siblings.forEach(function(obj2){


        if (obj1.overlap_x(obj2, 0.2) && obj1.center().y < obj2.center().y) {
          //do left side collision of obj1

          if (obj1.position.y + obj1.size.y >= obj2.position.y) {
            obj1.position.y = obj2.position.y - obj1.size.y;

            obj1.jump(true, 64 * 10);

          }
        }
    });

  });
};
