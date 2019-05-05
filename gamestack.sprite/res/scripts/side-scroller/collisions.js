function boxCollideAll(object, siblings) {

  [object].forEach(function(itemx) {

    var GROUNDED = false;

    siblings.forEach(function(itemy) {

      GROUNDED = topCollision(itemx, itemy) ? true : GROUNDED;

      headBunk(itemx, itemy);


      leftRightCollision(itemx, itemy);


      if (itemx.hasBoxCollision(itemy))
        itemx.jumping = false;


    });

    //set GROUNDED

    itemx.GROUNDED = GROUNDED;

    //set JUMPING=false only if GROUNDED
    if(itemx.GROUNDED)
    {

      itemx.speed.y = 0;

      itemx.JUMPING = false;
      //never both GROUNDED and HEADBUNK
      itemx.HEADBUNK = false;
    }


  });

}


function leftRightCollision(obj1, obj2) {


  if (obj1.overlap_y(obj2, 0.2) && obj1.center().x > obj2.center().x) {
    //do left side collision of obj1

    if (obj1.position.x <= obj2.position.x + obj2.size.x) {
      obj1.position.x = obj2.position.x + obj2.size.x;
      return 'left';
    }
  }


  if (obj1.overlap_y(obj2, 0.2) && obj1.center().x < obj2.center().x) {
    //do left side collision of obj1

    if (obj1.position.x + obj1.size.x >= obj2.position.x) {
      obj1.position.x = obj2.position.x - obj1.size.x;
      return 'right';
    }
  }


  return false;

};


function leftRightCollideAll() {

  var value = false;

  [object].forEach(function(obj1) {

    siblings.forEach(function(obj2) {

      var c = leftRightCollision(obj1, obj2);

      if (c)
        value = c;

    });

  });

  return value;


}


function topCollision(obj1, obj2) {

  var GROUNDED = false;

  if (obj1.overlap_x(obj2, 0.2) && obj1.center().y < obj2.center().y) {
    //do left side collision of obj1

    if (obj1.position.y + obj1.size.y >= obj2.position.y) {
      obj1.position.y = obj2.position.y - obj1.size.y;

      GROUNDED = true;
    }
  }

  return GROUNDED;

}


function headBunk(obj1, obj2) {

  if (obj1.overlap_x(obj2, 0.2) && obj2.center().y < obj1.center().y) {
    //do left side collision of obj1

    if (obj1.position.y <= obj2.position.y + obj2.size.y) {
      obj1.position.y = obj2.position.y + obj2.size.y;
      obj1.HEADBUNK = true;
    }
  }


}


function protectLeftRightCollision() {

  [object].forEach(function(obj1) {

    siblings.forEach(function(obj2) {

      leftRightCollision(obj1, obj2);

    });

  });

};


var module = module || {};

module.exports = function(object, siblings) {

  console.info('module-exports function(){}');

  console.log('object::' + jstr(object));

  object.onUpdate(function() {

    boxCollideAll(object, siblings);

  });


};
