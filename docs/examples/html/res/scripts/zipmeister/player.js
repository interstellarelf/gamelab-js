module.exports = function() {

  var V = Gamelab.Vector;

  var player = new Gamelab.Sprite('./res/images/shapes/player.png');

  player.shapeChargers = [];

  player.shapeChargers.push(new Gamelab.Sprite('./res/images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./res/images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./res/images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./res/images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./res/images/effects/chargeup_strip.png'));

  player.shapeChargers.forEach(function(item) {

    item.onLoad(function() {

      this.Pos(0, 0);

      this.Size(108, 108);

      this.anime.FrameSize(108, 108).Size(108, 108).FrameBounds(new V(0, 0), new V(11, 0), new V(11, 0));

      this.anime.Seesaw();

      this.anime.Duration(1200);

      this.invisible = true;

    });


    item.onUpdate(function() {

      this.anime.engage();

      this.rotation.x += 2.0;

    });


    gameWindow.add(item);

  });


  player.onLoad(function() {

    this.anime.FrameSize(64, 64).Size(64, 64).FrameBounds(new V(0, 0), new V(0, 0), new V(0, 0));

    this.colorAnimations = this.colorAnimations || {};

    this.colorAnimations.orange = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(0, 0), new V(0, 0), new V(0, 0));
    this.colorAnimations.skyblue = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(1, 0), new V(1, 0), new V(1, 0));
    this.colorAnimations.blue = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(2, 0), new V(2, 0), new V(2, 0));

    this.colorAnimations.red = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(3, 0), new V(3, 0), new V(3, 0));
    this.colorAnimations.green = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(4, 0), new V(4, 0), new V(4, 0));
    this.colorAnimations.purple = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(5, 0), new V(5, 0), new V(5, 0));


    this.colorKey = 'orange';

    this.Size(Program.unitSize / 6, Program.unitSize / 6);
    this.Position(gameWindow.center());
  });

  player.zipline = new Gamelab.Line2d().Size(500, 500).Color('orange').LineWidth(3);


  player.altZiplines = {
    a: new Gamelab.Line2d().Size(500, 500).Color('blue').LineWidth(3),
    b: new Gamelab.Line2d().Size(500, 500).Color('red').LineWidth(3),
    c: new Gamelab.Line2d().Size(500, 500).Color('green').LineWidth(3)
  };

  player.zipline.Layer(-2);

  player.altZiplines.a.Layer(-2);
  player.altZiplines.b.Layer(-2);
  player.altZiplines.c.Layer(-2);

  player.zipline.Opacity(0.5);

  player.altZiplines.a.Opacity(0.5);
  player.altZiplines.b.Opacity(0.5);
  player.altZiplines.c.Opacity(0.5);

  player.zipline.StepFunction(function(portion, ONE) {
    return portion;
  });


  player.altZiplines.a.StepFunction(function(portion, ONE) {
    return portion;
  });

  player.altZiplines.b.StepFunction(function(portion, ONE) {
    return portion;
  });

  player.altZiplines.c.StepFunction(function(portion, ONE) {
    return portion;
  });

  player.altZiplines.a.Fill();

  player.altZiplines.b.Fill();

  player.altZiplines.c.Fill();


  player.zipline.Fill();

  gameWindow.add(player.zipline);
  gameWindow.add(player.altZiplines.a);
  gameWindow.add(player.altZiplines.b);
  gameWindow.add(player.altZiplines.c);


  player.onUpdate(function() {

    this.origin = this.size.div(2);

    this.Size(Program.unitSize / 7, Program.unitSize / 7);

    var centerSprite = Program.Regions.center;

    if (isNaN(Program.shapeSize.x))
      return;

    var GRIDSIZE = Program.shapeSize.x;


    //  console.log(GRIDSIZE);

    this.gridUnit = GRIDSIZE;


    if (this.targetPosition.x + this.size.x > centerSprite.position.x + centerSprite.size.x) {
      this.targetPosition.x = centerSprite.position.x + centerSprite.size.x - this.size.x;
    }

    if (this.targetPosition.x < centerSprite.position.x) {
      this.targetPosition.x = centerSprite.position.x;
    }

    if (this.targetPosition.y + this.size.y > centerSprite.position.y + centerSprite.size.y) {
      this.targetPosition.y = centerSprite.position.y + centerSprite.size.y - this.size.y;
    }

    if (this.targetPosition.y < centerSprite.position.y) {
      this.targetPosition.y = centerSprite.position.y;
    }


    this.gridPosition = new Gamelab.Vector(this.targetPosition.x,
      this.targetPosition.y);


    this.nextGridTarget = this.gridPosition.add(GRIDSIZE / 2, GRIDSIZE / 2).sub(this.size.div(2));

    //console.info(this.gridPosition);

    if (!this.zipping)
    {

        if(!this.sliding && (this.position.x !== this.nextGridTarget.x || this.position.y !== this.nextGridTarget.y))
        {
          this.sliding = true;
          this.SlideToPosition(this.nextGridTarget.x, this.nextGridTarget.y, 120, function(){

              player.sliding = false;


          });
        }

    }


    if (this.targetShape && this.targetShape.position && !this.sliding)
      this.alignTargetShape();


    this.zipline.GlobalComposite('lighter');

    this.zipline.AnimateShadowBlur(18, 0, 'snow', function(portion, ONE) {

      return Gamelab.Curves.easeInOutQuadratic(portion, ONE);

    });

    for (var x in this.altZiplines) {


      this.altZiplines[x].GlobalComposite('lighter');
      this.altZiplines[x].AnimateShadowBlur(18, 0, 'snow', function(portion, ONE) {

        return Gamelab.Curves.easeInOutQuadratic(portion, ONE);

      });

    }

    this.calczipline();

    //  console.info(this.size);
  });


  function ProcessZipline(zipline, ix = 0) {

    zipline.sharedVectorKey = function() {

      var key = 'x';

      var lastY = false;

      for (var x = 0; x < this.points.length; x++) {
        if (lastY !== false && this.points[x].y == lastY) {
          return 'y';
        }

        lastY = this.points[x].y;

      }

      return 'x';

    };

    var lastContactShape = false;

    var collidedShapes = [];


    Program.shapes.forEach(function(SHAPE) {

      zipline.collide(SHAPE, function(cPoint, points) {


        collidedShapes.push(SHAPE);


      });

    });

    collidedShapes.sort((a, b) => Math.abs(a.position.distance(player.position)) <
      Math.abs(b.position.distance(player.position)) ? 1 : -1)


    var lastShape = false;

    var index = 0;

    collidedShapes.forEach(function(SHAPE) {

      lastContactShape = SHAPE;

      index += 1;
    });


    if (lastContactShape && lastContactShape.constructor.name == 'Sprite') {
      zipline.Opacity(0.5);
      zipline.shapeCharger = player.shapeChargers[ix];
      player.shapeChargers[ix].Pos(lastContactShape.position.add(lastContactShape.size.div(2)).sub(player.shapeChargers[ix].size.div(2)));
      player.shapeChargers[ix].Layer(-1);
      player.shapeChargers[ix].invisible = false;
      lastContactShape.rotation.x += 4.0;


    } else {
      zipline.Opacity(0);
    }


    return lastContactShape;

  };

  player.alignTarget = function(target) {
    if (!target || !target.position) {
      return;
    }

    var diff = target.position.sub(this.position),
      greaterDist = Math.abs(diff.x) > Math.abs(diff.y) ? 'x' : 'y';

    if (greaterDist == 'x') {
      this.position.y += diff.y;
    }

    if (greaterDist == 'y') {
      this.position.x += diff.x;
    }

  }


  player.alignTargetShape = function() {

    var diff = this.targetShape.position.sub(this.position),
      greaterDist = Math.abs(diff.x) > Math.abs(diff.y) ? 'x' : 'y';

    if (greaterDist == 'x') {
      this.position.y += diff.y;
    }

    if (greaterDist == 'y') {
      this.position.x += diff.x;
    }

  };

  player.calczipline = function() {


    this.zipline.Position(this.position.add(new Gamelab.Vector(this.size.div(2))));


    this.zipline.points = [];
    this.zipline.Rotation(this.rotation.sub(45));
    this.zipline.Fill();

    var zipline = this.zipline;

    player.targetShape = ProcessZipline(this.zipline);

    player.altTargetShapes = player.altTargetShapes || {
      a: false,
      b: false,
      c: false
    };


    player.alignTarget(player.targetShape);

    var ct = 0;

    var lastTarget = false;

    ['a', 'b', 'c'].forEach(function(x) {


      player.altZiplines[x].offset = new Gamelab.Vector(0, 0);

      player.altZiplines[x].Rotation(player.rotation.add(0 + 45 + (ct * 90)));

      player.altZiplines[x].Position(player.position.add(player.size.div(2)).add(player.altZiplines[x].offset));
      player.altZiplines[x].points = [];


      player.altZiplines[x].Fill();

      //console.log(player.altZiplines[x]);

      player.altTargetShapes[x] = ProcessZipline(player.altZiplines[x], ct + 1);

      if (!player.altTargetShapes[x]) {
        //  console.log('ERROR --' + x);
      }


      lastTarget = player.altTargetShapes[x];

      player.alignTarget(player.altTargetShapes[x]);

      if (x) {
        //process again
        player.altZiplines[x].Rotation(player.rotation.add(0 + 45 + (ct * 90)));

        player.altZiplines[x].Position(player.position.add(player.size.div(2)).add(player.altZiplines[x].offset));
        player.altZiplines[x].points = [];


        player.altZiplines[x].Fill();


        //  console.log(player.altZiplines[x]);

        player.altTargetShapes[x] = ProcessZipline(player.altZiplines[x], ct + 1);


        player.alignTarget(player.altTargetShapes[x]);


      }

      ct += 1;

    });
  }


  player.targetPosition = new Gamelab.Vector(Program.Regions.center.position.add(Program.shapeSize.div(2.0)));

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('stick_left').Call(function(x, y) {

    //  console.log('stick_left');

    if (player.zipping)
      return;

    var rx = Math.round(x * 100) / 100,
      ry = Math.round(y * 100) / 100;

    if (Math.abs(rx) >= 0.5 || Math.abs(ry) >= 0.5) {
      //  console.log('stick_left');

      var sfx = false;

      if (buttonTimers.stick_left == 0) {

        if (Math.abs(rx >= 0.5 || Math.abs(ry) >= 0.5)) {
          Program.Sounds.gridMove.play();
        }

        if (Math.abs(rx) >= 0.5) {
          player.targetPosition = player.targetPosition.add(rx > 0 ? player.gridUnit : -player.gridUnit, 0);
        }
        if (Math.abs(ry) >= 0.5) {
          player.targetPosition = player.targetPosition.add(0, ry > 0 ? player.gridUnit : -player.gridUnit);
        }
      }

      buttonTimers.stick_left += 1;

      if (buttonTimers.stick_left > 5) {
        buttonTimers.stick_left = 0;
      }

    } else {
      buttonTimers.stick_left = 0;
    }

    if (rx < -0.5 && rx < ry) {
      player.zipline.offset = new Gamelab.Vector(0, 0);
      player.rotation.x = -180;
    } else if (rx > 0.5 && rx > ry) {
      player.zipline.offset = new Gamelab.Vector(0, 0);
      player.rotation.x = 0;
    }

    if (ry < -0.5 && ry < rx) {
      player.zipline.offset = new Gamelab.Vector(0, 0);
      player.rotation.x = -90;
    } else if (ry > 0.5 && ry > rx) {
      player.zipline.offset = new Gamelab.Vector(0, 0);
      player.rotation.x = 90;
    }

  });


  var buttonTimers = {

    stick_left: 0,
    button_0: 0,
    button_1: 0,
    button_2: 0,
    button_3: 0,
    button_4: 0,
    button_5: 0,
    button_6: 0,
    button_11: 0,
    button_12: 0,
    button_13: 0,
    button_14: 0,
    button_15: 0

  };

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_11').Call(function(pressed) {

    if (pressed) {
      alert('11 pressed');
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_0').Call(function(pressed) {

    if (pressed) {

      if (buttonTimers.button_0 == 0) {
        player.rotation.x = 90;
        //  player.targetPosition = player.targetPosition.add(0, player.gridUnit);

        player.zip();
      }
      buttonTimers.button_0 += 1;
    } else {
      buttonTimers.button_0 = 0;
    }

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_1').Call(function(pressed) {

    if (pressed) {

      if (buttonTimers.button_1 == 0) {
        player.rotation.x = 0;
        //player.targetPosition = player.targetPosition.add(player.gridUnit, 0);
        player.zip();
      }
      buttonTimers.button_1 += 1;
    } else {
      buttonTimers.button_1 = 0;
    }

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_2').Call(function(pressed) {

    if (pressed) {

      if (buttonTimers.button_2 == 0) {
        player.rotation.x = 180;
        //player.targetPosition = player.targetPosition.add(-player.gridUnit, 0);
        player.zip();
      }
      buttonTimers.button_2 += 1;
    } else {
      buttonTimers.button_2 = 0;
    }


  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_3').Call(function(pressed) {

    if (pressed) {

      if (buttonTimers.button_3 == 0) {
        player.rotation.x = -90;
        //player.targetPosition = player.targetPosition.add(0, -player.gridUnit);
        player.zip();
      }
      buttonTimers.button_3 += 1;
    } else {
      buttonTimers.button_3 = 0;
    }


  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_12').Call(function(pressed) {


    if (pressed) {
      if (buttonTimers.button_12 == 0) {
        player.rotation.x = -90;
        player.targetPosition = player.targetPosition.add(0, -player.gridUnit);
      }
      buttonTimers.button_12 += 1;
    } else {
      buttonTimers.button_12 = 0;
    }

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_13').Call(function(pressed) {


    if (pressed) {
      if (buttonTimers.button_13 == 0) {
        player.rotation.x = 90;
        player.targetPosition = player.targetPosition.add(0, player.gridUnit);
      }
      buttonTimers.button_13 += 1;
    } else {
      buttonTimers.button_13 = 0;
    }


  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_14').Call(function(pressed) {

    if (pressed) {
      if (buttonTimers.button_14 == 0) {
        player.rotation.x = 180;
        player.targetPosition = player.targetPosition.add(-player.gridUnit, 0);
      }
      buttonTimers.button_14 += 1;
    } else {
      buttonTimers.button_14 = 0;
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_15').Call(function(pressed) {

    if (pressed) {
      if (buttonTimers.button_15 == 0) {
        player.rotation.x = 0;
        player.targetPosition = player.targetPosition.add(player.gridUnit, 0);
      }
      buttonTimers.button_15 += 1;
    } else {
      buttonTimers.button_15 = 0;
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_5').Call(function(pressed) {

    if (pressed) {
      if (buttonTimers.button_5 == 0) {
        if (Math.abs(player.rotation.x % 360) == 0) {
          player.targetPosition = player.targetPosition.add(player.gridUnit, 0);
        }

        player.rotation.x = 0;
      }
      buttonTimers.button_5 += 1;
    } else {
      buttonTimers.button_5 = 0;
    }

  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_4').Call(function(pressed) {

    if (pressed) {
      if (buttonTimers.button_4 == 0) {

        if (Math.abs(player.rotation.x % 360) == 180) {
          player.targetPosition = player.targetPosition.add(-player.gridUnit, 0);
        }

        player.rotation.x = 180;
      }
      buttonTimers.button_4 += 1;
    } else {
      buttonTimers.button_4 = 0;
    }

  });


  player.setColorAnimation = function(key) {
    this.Anime(this.colorAnimations[key]);
    this.colorKey = key;
  };


  player.takeShape = function(shape) {
    shape.invisible = true;
    Program.shapes.splice(Program.shapes.indexOf(shape), 1);
    gameWindow.remove(shape);

    this.targetShape = ProcessZipline(this.zipline);

    if (this.targetShape && this.targetShape.colorKey) {

      if (this.colorKey == this.targetShape.colorKey) {
        this.takeShape(this.targetShape);
      } else {
        this.swapColors(this.targetShape);
      }

    } else {
      this.zipline.points = [];
    }

    if (this.zipline.shapeCharger) {
      this.zipline.shapeCharger.invisible = true;
    }

    return shape;
  };

  player.swapColors = function(shape) {


    var key = this.colorKey;
    this.setColorAnimation(shape.colorKey);


    //  console.log('swaping colors:' + key);

    shape.Anime(shape.colorAnimations[key]);
    shape.colorKey = key;

  };


  player.zip = function() {

    Program.Sounds.zip.play();

    this.calczipline();

    this.zipStart = new Gamelab.Vector(this.position);

    this.zipping = true;

    if (this.targetShape) {
      this.sliding = false;
      this.Pos(this.nextGridTarget);


      var slideTarget = new Gamelab.Vector(0, 0);

      var diff = this.targetShape.position.sub(this.position),
        greaterDist = Math.abs(diff.x) > Math.abs(diff.y) ? 'x' : 'y';

      if (greaterDist == 'x') {
        slideTarget = new Gamelab.Vector(this.targetShape.position.x, this.position.y);
        this.position.y += diff.y;
      }

      if (greaterDist == 'y') {
        slideTarget = new Gamelab.Vector(this.position.x, this.targetShape.position.y);
        this.position.x += diff.x;
      }


      this.SlideToPosition(slideTarget.x, slideTarget.y, 150, function() {

        if (player.colorKey == player.targetShape.colorKey) {
          player.takeShape(player.targetShape);

          if (player.targetShape.nextColorSprite) {
            console.log('SWAPPING @:' + player.targetShape.nextColorSprite.colorKey);
            player.swapColors(player.targetShape.nextColorSprite);
          }
        } else {
          player.swapColors(player.targetShape);
        }


        player.SlideToPosition(player.zipStart.x, player.zipStart.y, 100, function() {

          player.zipping = false;

        });
      });

    } else {
      this.zipping = false;
    }

  };


  gameWindow.add(player);

};
