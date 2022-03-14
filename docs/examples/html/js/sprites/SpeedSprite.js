

class SpeedSprite extends Sprite {
  constructor(){
      super(...arguments);
  }

  /*****************************
   *  accelY
   *  -accelerate on Y-Axis with 'accel' and 'max' (speed) arguments
   *  -example-use: gravitation of sprite || up / down movement
   ***************************/
  /**
   * accelerate speed on the y-axis
   *
   * @function
   * @memberof Sprite
   * @param {number} accel the increment of acceleration
   * @param {number} max the maximum for speed
   *
   **********/

  accelY(accel, max) {
    accel = Math.abs(accel);

    if (typeof(max) == 'number') {
      max = {
        y: max
      };
    }

    this.assertSpeed();

    let diff = max.y - this.speed.y;

    if (diff > 0) {
      this.speed.y += Math.abs(diff) >= accel ? accel : diff;
    };

    if (diff < 0) {
      this.speed.y -= Math.abs(diff) >= accel ? accel : diff;
    };
  }

  /*****************************
   *  accelX
   *  -accelerate on x-Axis
   *  -example-use: running of sprite || left / right movement
   ***************************/
  /**
   * accelerate speed on the x-Axis
   *
   * @function
   * @memberof Sprite
   * @param {number} accel the increment of acceleration
   * @param {number} max the maximum for speed
   *
   **********/
  accelX(accel, max) {
    accel = Math.abs(accel);
    if (typeof(max) == 'number') {
      max = {
        x: max
      };
    }

    this.assertSpeed();

    let diff = max.x - this.speed.x;
    if (diff > 0) {
      this.speed.x += Math.abs(diff) >= accel ? accel : diff;
    };

    if (diff < 0) {
      this.speed.x -= Math.abs(diff) >= accel ? accel : diff;
    };
  }


  accelRX(accel, max) {
    accel = Math.abs(accel);

    if (typeof(max) == 'number') {
      max = {
        x: max
      };
    }

    if (!this.rspeed) {
      this.rspeed = new Gamelab.Vector(0, 0, 0);
    }

    let diff = max.x - this.speed.x;

    if (diff > 0) {
      this.rspeed.x += Math.abs(diff) >= accel ? accel : diff;
    };

    if (diff < 0) {
      this.rspeed.x -= Math.abs(diff) >= accel ? accel : diff;
    };
  }


  /*****************************
   *  accel
   *  -accelerate any acceleration -key
   ***************************/
  /**
   * decelerate speed on the x-Axis, toward zero
   * @function
   * @memberof Sprite
   * @param {number} amt the increment of deceleration, negatives ignored
   *
   **********/
  decelY(amt) {
    amt = Math.abs(amt);

    if (Math.abs(this.speed.y) <= amt) {
      this.speed.y = 0;
    } else if (this.speed.y > amt) {
      this.speed.y -= amt;
    } else if (this.speed.y < amt * -1) {
      this.speed.y += amt;
    }
  }

  /*****************************
   *  decelX
   *  -decelerate on the X axis
   *  -args: 1 float:amt
   ***************************/
  /**
   * decelerate speed on the x-Axis, toward zero
   * @function
   * @memberof Sprite
   * @param {number} amt the increment of deceleration, negatives ignored
   *
   **********/
  decelX(amt) {
    amt = Math.abs(amt);

    if (this.speed.x > amt) {
      this.speed.x -= amt;
    } else if (this.speed.x < amt * -1) {
      this.speed.x += amt;
    }
    if (Math.abs(this.speed.x) <= amt) {
      this.speed.x = 0;
    }
  }
  /**
   * decelerate rspeed on the x-Axis, toward zero
   * @function
   * @memberof Sprite
   * @param {number} amt the increment of deceleration, negatives ignored
   *
   **********/
  decelRX(amt) {
    amt = Math.abs(amt);

    if (this.rspeed.x > amt) {
      this.rspeed.x -= amt;
    } else if (this.rspeed.x < amt * -1) {
      this.rspeed.x += amt;
    }

    if (Math.abs(this.rspeed.x) <= amt) {
      this.rspeed.x = 0;
    }
  }
  /**
   * accelerate toward a max value on any object-property
   * @function
   * @memberof Sprite
   * @param {Object} prop The object to control
   * @param {string} key the target property-key for object argument
   * @param {number} accel the additive increase to the property on each call
   * @param {number} max the max value to accelerate towards
   **********/
  accel(object, key, accel, max) {
    var prop = object;
    accel = Math.abs(accel);

    if (typeof(max) == 'number') {
      max = {
        x: max
      };
    }

    let speed = prop[key];
    // this.assertSpeed();
    let diff = max.x - prop[key];

    if (diff > 0) {
      prop[key] += Math.abs(diff) >= accel ? accel : diff;
    };

    if (diff < 0) {
      prop[key] -= Math.abs(diff) >= accel ? accel : diff;
    };
  }


  /*****************************
   *  decel
   *  -deceleration -key
   ***************************/

  /**
   * decelerate toward a max value on any object-property
   * @function
   * @memberof Sprite
   * @param {Object} prop the object to control
   * @param {string} key the property-key for targeted property of prop argument
   *
   * @param {number} decel the increment of deceleration
   *
   * @param {number} max the max value to decelerate towards
   *
   *
   **********/
  decel(prop, key, rate) {
    if (typeof(rate) == 'object') {
      rate = rate.rate;
    }
    rate = Math.abs(rate);
    if (Math.abs(prop[key]) <= rate) {
      prop[key] = 0;
    } else if (prop[key] > 0) {
      prop[key] -= rate;
    } else if (prop[key] < 0) {
      prop[key] += rate;
    } else {
      prop[key] = 0;
    }
  }

  seekPosition(target_Position, differential_SpeedMultiple) {
    var target = {};
    //always positive:
    differential_SpeedMultiple = Math.abs(differential_SpeedMultiple);

    if (target_Position.hasOwnProperty('position')) {
      console.log('1st argument had its own position property. Using this property now:');
      target = target_Position.position;
    } else {
      target = target_Position;
    }

    let diff = this.position.sub(target).mult(-1);
    this.speed = diff.mult(differential_SpeedMultiple);
  }

  /*****************************
   *  decelY
   *  -decelerate on the Y axis
   *  -args: 1 float:amt
   ***************************/

  /**
   * A generic 'smooth motion', adds to position.x and position.y with smooth acceleration and deceleration
   * --uses quadratic-easing of the TWEEN.js library
   * @function
   * @memberof Sprite
   * @param {number} x The x to be added to Sprite().positon.x over the course of the SmoothMotion --use negative for subtractive motion
   * @param {number} y The y to be added to Sprite().positon.y over the course of the SmoothMotion- -use negative for subtractive motion
   * @param {number} duration the amount of time taken to complete this motion
   *
   **********/

  SlideToPosition(x, y, duration, cb) {
    if (typeof(x) == 'object') //argument coercion: x is a vector, y is duration
    {
      duration = y;
      y = x.y;
      x = x.x;
    }

    if (!TWEEN instanceof Object) {
      return console.error('TWEEN.js required for SmoothMotion();');
    }

    var t = new TWEEN.Tween(this.position)
      .easing(TWEEN.Easing.Quadratic.InOut)

      .to(new Gamelab.Vector(x, y), duration)
      .onUpdate(function() {
        //console.log(objects[0].position.x,objects[0].position.y);


      })
      .onComplete(function() {
        //console.log(objects[0].position.x, objects[0].position.y);

        if(cb)
        cb();

      });

    t.start();

  }

  /**
   * A generic 'smooth rotate', adds to rotation.x with smooth acceleration and deceleration
   * --uses quadratic-easing of the TWEEN.js library
   * @function
   * @memberof Sprite
   * @param {number} r The numeric value to be added to Sprite().rotation.x over the course of the SmoothRotate --use negative for subtractive rotation
   * @param {number} duration the amount of time taken to complete this rotation
   **********/

  SmoothRotate(r, duration) {
    if (!TWEEN instanceof Object) {
      return console.error('TWEEN.js required for SmoothRotate();');
    }
    r = r + this.rotation.x;
    var t = new TWEEN.Tween(this.rotation)
      .easing(TWEEN.Easing.Quadratic.InOut)

      .to(new Gamelab.Vector(r), duration)
      .onUpdate(function() {
        //console.log(objects[0].position.x,objects[0].position.y);

      })
      .onComplete(function() {
        //console.log(objects[0].position.x, objects[0].position.y);

      });
    t.start();
  }
}

Gamelab.SpeedSprite = SpeedSprite;
