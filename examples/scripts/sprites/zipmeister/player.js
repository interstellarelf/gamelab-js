module.exports = function() {

  var V = Gamelab.Vector;

  var player = new Gamelab.Sprite('./images/shapes/player.svg');

  player.Layer(200);

  player.shapeChargers = [];

  player.gridIndexVector = new Gamelab.Vector(0, 0);

  player.shapeChargers.push(new Gamelab.Sprite('./images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./images/effects/chargeup_strip.png'));
  player.shapeChargers.push(new Gamelab.Sprite('./images/effects/chargeup_strip.png'));

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

      if (Gamelab.isPaused()) {
        return;
      }

      this.anime.engage();

      this.rotation.x += 2.0;

    });


    gameWindow.add(item);

  });


  player.onLoad(function() {

    this.anime.FrameSize(64, 64).Size(64, 64).FrameBounds(new V(0, 0), new V(0, 0), new V(0, 0));

    this.colorAnimations = this.colorAnimations || {};

    this.colorAnimations.green = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(0, 0), new V(0, 0), new V(0, 0));
    this.colorAnimations.yellow = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(1, 0), new V(1, 0), new V(1, 0));
    this.colorAnimations.red = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(2, 0), new V(2, 0), new V(2, 0));

    this.colorAnimations.red = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(3, 0), new V(3, 0), new V(3, 0));
    this.colorAnimations.yellow = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(4, 0), new V(4, 0), new V(4, 0));
    this.colorAnimations.green = new Gamelab.Animation(this.src).FrameSize(64, 64).Size(64, 64).FrameBounds(new V(5, 0), new V(5, 0), new V(5, 0));

    this.colorKey = 'green';

    var ix = Math.floor(Math.random() * 6.0);

    if (ix == 0) {
      this.Anime(this.colorAnimations.green);
      this.colorKey = 'green';
    }

    if (ix == 1) {
      this.Anime(this.colorAnimations.yellow);
      this.colorKey = 'yellow';
    }
    if (ix == 2) {
      this.Anime(this.colorAnimations.red);
      this.colorKey = 'red';
    }
    if (ix == 3) {
      this.Anime(this.colorAnimations.red);
      this.colorKey = 'red';
    }
    if (ix == 4) {
      this.Anime(this.colorAnimations.yellow);
      this.colorKey = 'yellow';
    }
    if (ix == 5) {
      this.Anime(this.colorAnimations.green);
      this.colorKey = 'green';
    }


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

    buttonTimers.pause -= 1;

    if (Gamelab.isPaused()) {
      return;
    }

    buttonTimers.button_0 -= 1;


    this.gridLockout -= 1;

    //console.log(this.gridLockout);

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

    if (!this.zipping) {

      if (!this.sliding && (this.position.x !== this.nextGridTarget.x || this.position.y !== this.nextGridTarget.y)) {

        this.sliding = true;

        if (this.gridIndexVector.x <= Gamelab.maxCenterGrid.x && this.gridIndexVector.y <= Gamelab.maxCenterGrid.y) {
          this.SlideToPosition(this.nextGridTarget.x, this.nextGridTarget.y, 120, function() {

            player.sliding = false;

          });
        }


      }

    }


    if (this.targetShape && this.targetShape.position && !this.sliding)
      this.alignTargetShape();


    this.zipline.GlobalComposite('lighter');

    this.zipline.AnimateShadowBlur(18, 0, 'snow', function(portion, ONE) {

      return Gamelab.Curves.InOut.Quadratic(portion, ONE);

    });

    for (var x in this.altZiplines) {


      this.altZiplines[x].GlobalComposite('lighter');
      this.altZiplines[x].AnimateShadowBlur(18, 0, 'snow', function(portion, ONE) {

        return Gamelab.Curves.InOut.Quadratic(portion, ONE);

      });

    }

    this.calczipline();

    //  console.info(this.size);
  });


  Program.enforceColorKey = function(SHAPE){

    if(player.colorKey == undefined)
    {
      for(var x in player.colorAnimations)
      {
        if(player.colorAnimations[x] == player.selected_animation)
        {
          player.colorKey = x;
        }
      }
    }

    if(SHAPE.colorKey == undefined)
    {
      for(var x in SHAPE.colorAnimations)
      {
        if(SHAPE.colorAnimations[x] == SHAPE.selected_animation)
        {
          SHAPE.colorKey = x;
        }
      }
    }

  };


  Program.shapeCheck = function(SHAPE){

    Program.enforceColorKey(SHAPE);

    //if shape is undefined we cannot address this shape
    if(SHAPE == undefined)
    {
      console.error('shape was undefined');
      return false;
    }

    //now if SHAPE || player .colorKey is undefined, we have level 2 error.
    else if([player.colorKey, SHAPE.colorKey].indexOf(undefined) >= 0)
    {
      console.error('there are players and/or shapes with colorKey undefined');
      return false;
    }

    return true;

  }



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

    var specifiedShape = false;

    var collidedShapes = [];


    Program.shapes.forEach(function(SHAPE) {

      if(!SHAPE.alive)
      {
        return;
      }

      zipline.collide(SHAPE, function(cPoint, points) {

        Program.shapeCheck(SHAPE);

        collidedShapes.push(SHAPE);

      });

    });

    collidedShapes.sort((a, b) => Math.abs(a.position.distance(player.position)) <=
      Math.abs(b.position.distance(player.position)) ? 1 : -1);

    var lastShape = false;

    var index = 0;

    collidedShapes.forEach(function(SHAPE) {

      specifiedShape = SHAPE;

      index += 1;

    });


    if (specifiedShape && specifiedShape.constructor.name == 'Sprite') {
      zipline.Opacity(0.5);
      zipline.shapeCharger = player.shapeChargers[ix];
      player.shapeChargers[ix].Pos(specifiedShape.position.add(specifiedShape.size.div(2)).sub(player.shapeChargers[ix].size.div(2)));
      player.shapeChargers[ix].Layer(-1);
      player.shapeChargers[ix].invisible = false;
      specifiedShape.rotation.x += 4.0;


    } else {
      zipline.Opacity(0);
    }

    return specifiedShape;

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

  Gamelab.maxCenterGrid = new Gamelab.Vector(5, 5);

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


  player.gridLockout = 0;

  player.gridTimer = 0;



  function bossIndexVector() {

    if (player.gridIndexVector.x < 0) {
      player.gridIndexVector.x = 0;
    }

    if (player.gridIndexVector.x > Gamelab.maxCenterGrid.x) {
      player.gridIndexVector.x = Gamelab.maxCenterGrid.x;
    }

    if (player.gridIndexVector.y < 0) {
      player.gridIndexVector.y = 0;
    }

    if (player.gridIndexVector.y > Gamelab.maxCenterGrid.y) {
      player.gridIndexVector.y = Gamelab.maxCenterGrid.y;
    }
  }


  player.moveGrid = function(x, y) {

    if (!Program.started) {
      return;
    }

    if (Math.abs(x) <= 0.25 && Math.abs(y) <= 0.25) {
      return;
    }

    if (player.zipping)
      return;

    if (this.gridLockout <= 0 && buttonTimers.stick_left == 0) {

      this.gridLockout = 10;

      var rx = Math.round(x * 100) / 100,
        ry = Math.round(y * 100) / 100;

      if (Math.abs(rx) >= 0.5 || Math.abs(ry) >= 0.5) {
        //  console.log('stick_left');

        var sfx = false;

        if (Math.abs(rx >= 0.5 || Math.abs(ry) >= 0.5)) {
          Program.Sounds.gridMove.play();
        }

        if (rx >= 0.5 && player.gridIndexVector.x >= 0 && player.gridIndexVector.x < Gamelab.maxCenterGrid.x) {
          player.targetPosition = player.targetPosition.add(player.gridUnit, 0);
          player.gridIndexVector.x += 1;

        }

        if (rx <= -0.5 && player.gridIndexVector.x >= 1 && player.gridIndexVector.x <= Gamelab.maxCenterGrid.x) {
          player.targetPosition = player.targetPosition.add(-player.gridUnit, 0);
          player.gridIndexVector.x += -1;

        }

        if (ry >= 0.5 && player.gridIndexVector.y >= 0 && player.gridIndexVector.y < Gamelab.maxCenterGrid.y) {
          player.targetPosition = player.targetPosition.add(0, player.gridUnit);
          player.gridIndexVector.y += 1;

        }

        if (ry <= -0.5 && player.gridIndexVector.y >= 1 && player.gridIndexVector.y <= Gamelab.maxCenterGrid.y) {
          player.targetPosition = player.targetPosition.add(0, -player.gridUnit);
          player.gridIndexVector.y += -1;

        }

        bossIndexVector();


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


    }




  };

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('stick_left').Call(function(x, y) {

    //  console.log('stick_left');

    if (!Program.started) {
      return;
    }

    player.moveGrid(x, y);

  });

  Gamelab.pauseTimer = 0;

  Gamelab.pauseButton = false;

  //Gamepad input

  //select-button
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_8').Call(function(pressed) {

    //  console.log('select-button');

    if (pressed) {
      //showMenu();
    }

  });

  var musicVolume = 0.7;

  //pause button
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_9').Call(function(pressed) {

    //  console.log('start button');
    if (pressed && buttonTimers.pause <= 0) {
      buttonTimers.pause = 10;
      Gamelab.togglePause();
      musicVolume = musicVolume >= 0.5 ? 0.3 : musicVolume;
      Program.MusicPlayers.Funk.volume(musicVolume);
    }

  });



  //dir pad
  //up
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_12').Call(function(pressed) {


    if (pressed) {
      //console.log('arrow-button 01');
      player.moveGrid(0, -1);
    }

  });

  //down
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_13').Call(function(pressed) {

    if (pressed) {
      //console.log('arrow-button 02');
      player.moveGrid(0, 1);
    }

  });

  //left
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_14').Call(function(pressed) {

    if (pressed) {
      //console.log('arrow-button 03');
      player.moveGrid(-1, 0);
    }

  });

  //right
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_15').Call(function(pressed) {

    if (pressed) {
      //console.log('arrow-button 04');
      player.moveGrid(1, 0);
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
    button_15: 0,
    pause: 0,

  };



  new Gamelab.KeyboardEvent().Keys([
    "A",
    "W",
    "S",
    "D"
  ]).Call(function(key) {

    //runs when key is down

    key = key.toLowerCase();

    buttonTimers.stick_left = 0;

    if (key == 'a') {
      player.moveGrid(-1, 0);
    }

    if (key == 'w') {
      player.moveGrid(0, -1);
    }

    if (key == 's') {
      player.moveGrid(0, 1);
    }

    if (key == 'd') {
      player.moveGrid(1, 0);
    }


  });


  new Gamelab.KeyboardEvent().Keys([
    "UP",
    "DOWN",
    "LEFT",
    "RIGHT"
  ]).Call(function(key) {

    //runs when key is down

    key = key.toLowerCase();

    if (key == 'left') {
      commitZipAction(true, 180);
    }

    if (key == 'right') {
      commitZipAction(true, 0);
    }

    if (key == 'up') {
      commitZipAction(true, -90);
    }

    if (key == 'down') {
      commitZipAction(true, 90);
    }


  });


  function commitZipAction(pressed, rotationDegrees) {

    if (!Program.started) {
      return;
    }

    if (pressed && buttonTimers.button_0 <= 0) {

      player.rotation.x = rotationDegrees;
      //  player.targetPosition = player.targetPosition.add(0, player.gridUnit);

      player.zip();

      buttonTimers.button_0 = 10;

    } else {

    }



  }


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_0').Call(function(pressed) {

    commitZipAction(pressed, 90);

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_1').Call(function(pressed) {

    commitZipAction(pressed, 0);

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_2').Call(function(pressed) {

    commitZipAction(pressed, 180);


  });

  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_3').Call(function(pressed) {

    commitZipAction(pressed, -90);

  });


  //Gamepad input
  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_5').Call(function(pressed) {

    if (!Program.started) {
      return;
    }


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

    if (!Program.started) {
      return;
    }


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

    shape.active = false;

    gameWindow.remove(shape);

    Program.shapes.splice(Program.shapes.indexOf(shape), 1);

    this.targetShape = ProcessZipline(this.zipline, 0);

    if(Program.shapeCheck(this.targetShape))
    {
      if (this.targetShape && this.colorKey == this.targetShape.colorKey) {
        Program.CollectCash(this.targetShape.cashValue);
        this.takeShape(this.targetShape);
      } else if (this.targetShape) {
        this.swapColors(this.targetShape);
      }
    }


    this.zipline.points = [];

    if (this.zipline.shapeCharger) {
      this.zipline.shapeCharger.invisible = true;
    }

    return shape;
  };

  player.swapColors = function(shape) {

    //alert(shape.colorKey + ":" + this.colorKey);

    if(shape == undefined)
    {
      return console.error('undefined shape');
    }

    Program.Sounds.bounce.play();

    var key = this.colorKey;

    this.colorKey = shape.colorKey;

    shape.colorKey = key;

    //  console.log('swaping colors:' + key);

    shape.Anime(shape.colorAnimations[shape.colorKey]);

    this.setColorAnimation(this.colorKey);

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

        if(!player.targetShape)
        {
          player.SlideToPosition(player.zipStart.x, player.zipStart.y, 100, function() {

            player.zipping = false;

          });
          return;
        }

        Program.enforceColorKey(player.targetShape);

        if (player.colorKey == player.targetShape.colorKey) {

          Program.CollectCash(player.targetShape.cashValue);
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

  return player;

};
