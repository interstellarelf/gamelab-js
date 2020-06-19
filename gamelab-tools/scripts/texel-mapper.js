var module = module || {};


module.exports = function(gameWindow, texelGuide, map = {}) {

  this.name = map.name || "TexelArray";
  this.TexelGuide = texelGuide || {};


  this.groupFilter = '*';

  let $OPTIONS = this.options,
    $DATA = this.data;

  this.order = map.order || false;


  window.keys = {};


  let StringValues = ['player', 'little-enemy', 'medium-enemy', 'big-enemy', 'food', 'money', 'weapon', 'armor'];

  var square = new Gamelab.Sprite('./images/texel-builder/texel2d.png'),
    selector = new Gamelab.Sprite('./images/texel-builder/texel2d-selector.png'),
    gridUnit = new Gamelab.Sprite('./images/texel-builder/texel2d-grid-unit.png'),
    gridFilledUnit = new Gamelab.Sprite('./images/texel-builder/texel2d-filled.png');
  this.sourceTexels = [];
  this.sourceTexels.last = function() {
    return this[this.length - 1];
  }
  this.sourceTexels.do = function(fxn) {
    fxn.bind(this).call();
  };
  var $MOD = this;
  new Gamelab.Module().load('./scripts/texel-mapper-level-packs/town-style-01.pack.js', function(construct){
  new construct($MOD.sourceTexels);
  });


  this.globalSourceTexels = [];

  this.globalSourceTexels.last = function() {
    return this[this.length - 1];
  }

  this.globalSourceTexels.do = function(fxn) {
    fxn.bind(this).call();
  };



  this.sourceTexels.getSourceByName = function(name){

    var src = false;

    this.forEach(function(item){

      if(item.name == name)
      {

        src = item.src;

      }

    });

    return src;

  };


  this.globalSourceTexels.do(function() {

    this.push(new Gamelab.Sprite('./images/texel-builder/texel2d-00.png'));

    this.last().name = '0';

    this.last().describe = 'An empty texel, zeroth texel in stack.';


  });


  this.globalSourceTexels.do(function() {
    this.push(new Gamelab.Sprite('./images/texel-builder/texel2d-global-weather.png'));
    this.last().name = 'global-weather';
    this.last().describe = 'weather texel : signals a global weather for the level';
  });



  this.sourceTexels.makeGuide = function() {

    var guide = [];

    this.forEach(function(o) {
      guide.push({
        name: o.name,
        describe: o.describe,
        index: o.index,
        src: o.image.domElement.src
      });
    });
    return guide;
  };


  this.sourceTexels.sortByNames = function(names) {

    $data.texels.texels.forEach(function(tex) {

      tex.index = names.indexOf(tex.name) || 0;

      if(tex.subTexels && tex.subTexels[0])
      tex.subTexels[0].ix = names.indexOf(tex.subTexels[0].name) || 0

    });

    this.sort((a, b) => (names.indexOf(a.name) !== -1 && names.indexOf(a.name) < names.indexOf(b.name)) ? -1 : 1);

  };


  this.sourceTexels.getNameOrder = function() {

    var names = [];

    this.forEach(function(a) {

      names.push(a.name);

    });

    return names;

  };


  this.bringGroupToFront=function(group){

    var names = [];

    if(group == '*')
    {
      return;
    }

    else{

      names.push('0');

      for(var x = 0; x < this.sourceTexels.length; x++)
      {

        var texel =  this.sourceTexels[x];

        if(texel.group && texel.group.toLowerCase() == group.toLowerCase())
        {
          names.push(texel.name);
        }

      }

      for(var x = 0; x < this.sourceTexels.length; x++)
      {

        var texel =  this.sourceTexels[x];

        if(texel.name && names.indexOf(texel.name) == -1)
        {
          names.push(texel.name);
        }

      }

      this.sourceTexels.sortByNames(names);
    }

  };


  document.body.onkeydown = function(e) {
    console.log(e.shiftKey);
    window.keys.shift = e.shiftKey;
  };

  document.body.onkeyup = function(e) {
    console.log(e.shiftKey);
    window.keys.shift = e.shiftKey;
  };


  this.TexelGuide = this.sourceTexels.makeGuide();

  this.data = {
    unit_size: map.unit_size || new Gamelab.Vector(20, 20),
    sourceSprites: [],
    selected_texel: map.selected_texel || {},
    texels: map.texels || new Gamelab.TexelArray(),
    globalTexels: map.globalTexels || new Gamelab.TexelArray(),
    order: this.order
  };


  this.onHoverTexel = function(callback) {
    this._hoverTexel = callback;
  };


  var MAKE = true;

  if (this.data.texels.texels.length >= 1 && this.data.texels && this.data.texels instanceof Object) {
    console.info(map);
    this.data.texels = new Gamelab.TexelArray(this.data.texels.texels);
    MAKE = false;
  }

  console.info(this.data);


  this.data.unit_size.min = 1;
  this.data.unit_size.max = 4000;


  this.data.unit_size.step = 1.0;

  var $data = this.data,
    $texelData = $data.texels;


  if (this.order) {
    this.sourceTexels.sortByNames(this.order);
  }


  var $texel_module = this;

  this.Texel = function(name, src, index, subTexels = [{name:false, ix:0}]) {

    return {
      name: name,
      src: src,
      index: index,
      subTexels: subTexels
    }
  };


  this.texelByIndex = function(index, subTexels) {

    if (index == 0)
      return 0;

    var spr = this.sourceTexels[index % this.sourceTexels.length],
      src = spr.src,
      name = spr.name;

    return new this.Texel(name, src, index, subTexels);
  };


  this.makeTexels = function(canvasWidth, canvasHeight) {

    var ct = 0;

    for (var y = 0; y <= canvasHeight; y += $data.unit_size.y) {
      for (var x = 0; x <= canvasWidth; x += $data.unit_size.x) {
        $data.texels.add(this.texelByIndex(0));
        ct += 1;
      }
    }

    console.log(JSON.stringify($data.texels));

  };

  this.makeGlobalTexels = function(canvasWidth, canvasHeight) {

    var ct = 0;

    for (var y = 0; y <= canvasHeight; y += $data.unit_size.y) {
      for (var x = 0; x <= canvasWidth; x += $data.unit_size.x) {
        $data.globalTexels.add(this.texelByIndex(0));
        ct += 1;
      }
    }

    console.log(JSON.stringify($data.globalTexels));

  };

  this.download = function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };


  this.globalTexels = [];


  this.globalGameWindow = false;

  var appendedGlobals = false;

  this.OpenGlobalWindow = function() {

    this.globalWindow = !this.globalWindow;

    if (!this.globalWindow)
      return;

    var $controller = this;

    var container = document.createElement('DIV');

    container.style.position = 'fixed';
    container.style.zIndex = '9999';

    container.style.left = '20%';
    container.style.top = '20%';
    container.style.width = '60%';
    container.style.height = '60%';
    container.style.background = '#111';
    container.style.border = '1px solid grey';
    container.style.paddingTop = '0px';

    var closeButton = document.createElement('BUTTON');
    closeButton.innerText = 'x';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '2px';
    closeButton.style.right = '2px';
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.fontSize = '14px';
    closeButton.style.background = '#111';
    closeButton.style.border = '1px inset grey';
    closeButton.style.color = 'lightgrey';
    closeButton.style.padding = '1px';

    closeButton.onclick = function() {

      container.remove();
      $controller.globalWindow = false;

    };

    var heading = document.createElement('H4');
    heading.innerText = 'Set Globals';

    heading.style.color = 'lightgrey';
    heading.style.padding = '3px';
    heading.style.position = 'absolute';
    heading.style.top = '2px';
    heading.style.left = '4px';
    heading.style.margin = '0px';
    heading.style.fontSize = '16px';
    heading.style.width = '97%';
    heading.style.borderBottom = '1px solid grey';


    var addButton = document.createElement('BUTTON');


    addButton.innerText = '+';
    addButton.style.position = 'absolute';
    addButton.style.top = '25px';
    addButton.style.left = '6px';
    addButton.style.width = '20px';
    addButton.style.height = '20px';
    addButton.style.fontSize = '14px';
    addButton.style.background = '#111';
    addButton.style.border = '1px inset darkorange';
    addButton.style.color = 'darkorange';
    addButton.style.padding = '1px';

    addButton.onclick = function() {

      $controller.data.globalTexels.push(new Gamelab.Texel());

    };


    var globalCanvas = document.createElement('CANVAS');

    var unit = $MOD.data.unit_size.x;

    globalCanvas.width = (unit * 10.0);
    globalCanvas.height = (unit * 2.0);

    globalCanvas.style.width = (unit * 10.0) + 'px';
    globalCanvas.style.height = (unit * 2.0) + 'px';
    globalCanvas.style.background = 'black';
    globalCanvas.style.border = '1px solid teal';
    globalCanvas.style.position = 'absolute';

    globalCanvas.style.left = '6px';
    globalCanvas.style.top = '35px';


    container.appendChild(heading);
    container.appendChild(closeButton);

    container.appendChild(globalCanvas);


    var globalGameWindow = new Gamelab.GameWindow(globalCanvas).Size(unit * 10.0, unit * 2.0);

    globalGameWindow.animate();

    globalGameWindow.onBeforeDraw(function() {

      globalGameWindowUpdate();

    });

    $MOD.globalGameWindow = globalGameWindow;


    globalGameWindow.onMouseClick(function(xpos, ypos, e) {

      var gameWindow = $MOD.globalGameWindow,
        $texelData = $MOD.data.globalTexels;

      console.log('clicked');

      var ct = 0;

      for (var y = 0; y <= gameWindow.canvas.height; y += $data.unit_size.y) {
        for (var x = 0; x <= gameWindow.canvas.width; x += $data.unit_size.x) {

          var pos = new Gamelab.Vector(x, y),
            size = new Gamelab.Vector($data.unit_size);

          if (xpos >= pos.x && xpos <= pos.x + size.x &&
            ypos >= pos.y && ypos <= pos.y + size.y) {

            selector.Size($data.unit_size.x, $data.unit_size.y);
            selector.Position(pos.x, pos.y);


            if ($texelData.texels[ct] == 0) {
              $texelData.texels[ct] = $texel_module.texelByIndex(1, $texelData.texels[ct].subTexels);
            } else {
              $texelData.texels[ct].index += 1;
            }


            if ($texelData.texels[ct] == 0) {
              gameWindow.selectedTexelIndex = 0;
            } else {
              if ($texelData.texels[ct].index > $texel_module.globalSourceTexels.length) {
                $texelData.texels[ct] = 0;
              }

              $texelData.texels[ct] = $texel_module.texelByIndex($texelData.texels[ct].index, $texelData.texels[ct].subTexels);


              gameWindow.selectedTexelIndex = $texelData.texels[ct].index; //minus 1 accounts for the blank (zero texel)
              gameWindow.selectedTexelPosition = pos;

            }


            var audio = audio || new Gamelab.SoundList([
              './sounds/click.mp3',
              './sounds/click.mp3',
              './sounds/click.mp3',
              './sounds/click.mp3'
            ]);


            audio.play();

            if ($MODULE._hoverTexel) {
              $MODULE._hoverTexel($texelData.texels[ct], pos);
            }


          }

          ct += 1;
        }
      }

      console.info($texelData.texels);


    });

    document.body.appendChild(container);


  };


  this.OpenObjectWindow = function() {

    this.objectWindow = !this.objectWindow;

    var objectContent = document.querySelector('#object-content');

    if (objectContent)
      objectContent.innerHTML = '';

    if (!this.objectWindow)
      return;

    var $controller = this;

    var container = document.createElement('DIV'),

      content = document.createElement('DIV');

    content.style.marginTop = '25px';

    content.setAttribute('id', 'object-content');


    content.style.display = 'block';
    content.style.position = 'relative';

    content.style.height = '100%';
    content.style.overflowY = 'scroll';

    container.style.position = 'fixed';
    container.style.zIndex = '9999';

    container.style.left = '20%';
    container.style.top = '10%';
    container.style.width = '60%';
    container.style.height = '80%';
    container.style.background = '#111';
    container.style.border = '1px solid grey';
    container.style.paddingTop = '0px';


    var closeButton = document.createElement('BUTTON');
    closeButton.innerText = 'x';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '2px';
    closeButton.style.right = '2px';
    closeButton.style.width = '20px';
    closeButton.style.height = '20px';
    closeButton.style.fontSize = '14px';
    closeButton.style.background = '#111';
    closeButton.style.border = '1px inset grey';
    closeButton.style.color = 'lightgrey';
    closeButton.style.padding = '1px';

    closeButton.onclick = function() {

      container.remove();
      $controller.objectWindow = false;

    };

    var heading = document.createElement('H4');
    heading.innerText = 'Set Objects';

    heading.style.color = 'lightgrey';
    heading.style.padding = '3px';
    heading.style.position = 'absolute';
    heading.style.top = '2px';
    heading.style.left = '4px';
    heading.style.margin = '0px';
    heading.style.fontSize = '16px';
    heading.style.width = '97%';
    heading.style.borderBottom = '1px solid grey';


    var addButton = document.createElement('BUTTON');


    addButton.innerText = '+';
    addButton.style.position = 'absolute';
    addButton.style.top = '25px';
    addButton.style.left = '6px';
    addButton.style.width = '20px';
    addButton.style.height = '20px';
    addButton.style.fontSize = '14px';
    addButton.style.background = '#111';
    addButton.style.border = '1px inset darkorange';
    addButton.style.color = 'darkorange';
    addButton.style.padding = '1px';

    addButton.onclick = function() {

      $controller.data.globalTexels.push(new Gamelab.Texel());

    };

    container.appendChild(heading);


    container.appendChild(closeButton);
    container.appendChild(content);
    document.body.appendChild(container);
  };


  var ticker = ticker || 0;


  this.exportTexels = function() {

    var texels = this.data;

    var jsonString = JSON.stringify(texels, null, 2);

    this.download('TexelMap.json', jsonString);

  };

  this.importTexels = function() {

    $('#texel-file-input').unbind().on('change', function(evt) {

      var file = evt.target.files[0];

      var reader = new FileReader();
      reader.onload = function(event) {
        var jsonObject = JSON.parse(event.target.result);

        WebClient.startModule('texelarray.module.js', {
          object: jsonObject
        });

      };

      reader.onerror = function(event) {
        console.error("File could not be read! Code " + event.target.error.code);
      };

      reader.readAsText(file);

      evt.preventDefault();

      return false;

    });

    $('#texel-file-input').trigger('click');

  };


  this.maxTexelNumber = function() {

    var max = 0;

    $texelData.texels.forEach(function(v) {
      if (v.index > max) {
        max = v.index;
      }
    });
    return max;
  };


  this.refreshSources = function() {

    for (var x = 0; x < $texel_module.maxTexelNumber(); x++) {
      if (x > $data.sourceSprites.length - 1) {
        $data.sourceSprites.push({});
        $data.sourceSprites[x] = new Gamelab.Sprite('./images/texel-builder/texel2d.png');
      }
    }
  };

  function gameWindowUpdate() {

    var ct = 0;

    if (selector.position.x < 0) {
      selector.position.x = 0;
    }

    if (selector.position.y < 0) {
      selector.position.y = 0;
    }

    var mainWindow = document.querySelector('div.main');


    Gamelab.visibleScreen = {

      size: new Gamelab.Vector(document.body.clientWidth, document.body.clientHeight),

      position: new Gamelab.Vector(mainWindow.scrollLeft, mainWindow.scrollTop)

    };

    var drawSelector = true;




    for (var y = 0; y <= gameWindow.canvas.height; y += $data.unit_size.y) {
      for (var x = 0; x <= gameWindow.canvas.width; x += $data.unit_size.x) {

        var SIZE = Gamelab.visibleScreen.size,
          POS = Gamelab.visibleScreen.position;

        var pos = new Gamelab.Vector(x, y),
          size = new Gamelab.Vector($data.unit_size);


        if (pos.x > POS.x - 100 &&
          pos.y > POS.y - 100 &&
          pos.x + size.x < POS.x + SIZE.x + 100 &&
          pos.y + size.y < POS.y + SIZE.y + 100) {

          gridUnit.Size($data.unit_size);
          gridUnit.Position(pos);
          gridUnit.draw(gameWindow.ctx);

          if ($texelData.texels[ct] == 0) {
            $texel_module.sourceTexels[0].Opacity(1.0);
            $texel_module.sourceTexels[0].Size($data.unit_size);
            $texel_module.sourceTexels[0].Position(pos);
            $texel_module.sourceTexels[0].draw(gameWindow.ctx);
          } else if ($texelData.texels[ct] && $texel_module.sourceTexels[$texelData.texels[ct].index] && $texelData.texels[ct].index >= 1) {

            $texel_module.sourceTexels[$texelData.texels[ct].index].Opacity(1.0);
            $texel_module.sourceTexels[$texelData.texels[ct].index].Size($data.unit_size);
            $texel_module.sourceTexels[$texelData.texels[ct].index].Position(pos);
            $texel_module.sourceTexels[$texelData.texels[ct].index].draw(gameWindow.ctx);
          }

          if ($texelData.texels[ct] !== 0 && $texelData.texels[ct].subTexels.length >= 1) {

            var subIndex = $texelData.texels[ct].subTexels[0].ix;


            if(subIndex == 0)
            {

            }
            else{

                          //Draw the zeroth overlay texel

                          var isSprite = $texel_module.sourceTexels[subIndex ] &&  $texel_module.sourceTexels[subIndex ].constructor.name == 'Sprite';

                          if(isSprite)
                          {
                            console.log('got sprite');
                            $texel_module.sourceTexels[subIndex ].Opacity(0.9);

                            $texel_module.sourceTexels[subIndex].Size(new Gamelab.Vector($data.unit_size).div(1.5));
                            $texel_module.sourceTexels[subIndex].Position(new Gamelab.Vector(pos).sub($data.unit_size.x / 4, $data.unit_size.y / 4));
                            $texel_module.sourceTexels[subIndex].draw(gameWindow.ctx);
                            drawSelector = false;
                          }

            }


          }


        }


        ct += 1;
      }
    }

    if(drawSelector)
    selector.draw(gameWindow.ctx);

  };


  function globalGameWindowUpdate() {

    var $texelData = $MOD.data.globalTexels;

    var ct = 0;

    if (selector.position.x < 0) {
      selector.position.x = 0;
    }

    if (selector.position.y < 0) {
      selector.position.y = 0;
    }



    selector.draw($MOD.globalGameWindow.ctx);



    for (var y = 0; y <= $MOD.globalGameWindow.canvas.height; y += $data.unit_size.y) {
      for (var x = 0; x <= $MOD.globalGameWindow.canvas.width; x += $data.unit_size.x) {

        var pos = new Gamelab.Vector(x, y),
          size = new Gamelab.Vector($data.unit_size);

        gridUnit.Size($data.unit_size);
        gridUnit.Position(pos);
        gridUnit.draw($MOD.globalGameWindow.ctx);

        if ($texelData.texels[ct] && $texel_module.globalSourceTexels[$texelData.texels[ct].index] && $texelData.texels[ct].index >= 1) {
          $texel_module.globalSourceTexels[$texelData.texels[ct].index].Size($data.unit_size);
          $texel_module.globalSourceTexels[$texelData.texels[ct].index].Position(pos);
          $texel_module.globalSourceTexels[$texelData.texels[ct].index].draw($MOD.globalGameWindow.ctx);
        }
        ct += 1;
      }
    }

  };


  console.log('gameWindow width + height ...');

  console.log(gameWindow.canvas.width);
  console.log(gameWindow.canvas.height);


  gameWindow.canvas.parentNode.classList.add('window-scroll');
  gameWindow.canvas.parentNode.classList.add('window');

  gameWindow.canvas.addEventListener('mouseout', function() {

    var hoverTexelDom = document.querySelector('span#gui-texel-display');

    hoverTexelDom.style.visibility = 'hidden';


  });


  var stats = document.querySelectorAll('div.stat');

  for (var x = 1; x <= stats.length; x++) {
    stats[x - 1].style.marginLeft = (x * 100) + 'px';
  }


  function setMouseEvents() {

    var $mouse = new Gamelab.Mouse(gameWindow);

    $mouse.onRightClick(function(xpos, ypos) {

      //reset to zeroth-texel
      $texelData.texels[gameWindow.selectedTexelIndex] = $MODULE.texelByIndex(0, []);

      if ($MODULE._hoverTexel) {
        $MODULE._hoverTexel($texelData.texels[gameWindow.selectedTexelIndex], new Gamelab.Vector(xpos, ypos));
      }

    });

    gameWindow.onMouseMove(function(xpos, ypos) {
      console.log('mousemove @:' + xpos + ':' + ypos);

      var ct = 0;

      for (var y = 0; y <= gameWindow.canvas.height; y += $data.unit_size.y) {
        for (var x = 0; x <= gameWindow.canvas.width; x += $data.unit_size.x) {


          var pos = new Gamelab.Vector(x, y),
            size = new Gamelab.Vector($data.unit_size);

          if (xpos >= pos.x && xpos <= pos.x + size.x &&
            ypos >= pos.y && ypos <= pos.y + size.y) {

            selector.Size($data.unit_size.x, $data.unit_size.y);
            selector.Position(pos.x, pos.y);

            gameWindow.selectedTexelPosition = pos;
            gameWindow.selectedTexelIndex = ct;

            if ($MODULE._hoverTexel) {
              $MODULE._hoverTexel($texelData.texels[ct], pos);
            }

          }

          ct += 1;
        }
      }

    });


    var ticker = ticker || 0;

    //wheelDelta_Multiple = 1 || -1
    gameWindow.onMouseWheel(function(xpos, ypos, wheelDelta_Multiple) {

      ticker += 1;

      if (ticker % 2 !== 0)
        return;


      console.log('mousewheel @:' + xpos + ':' + ypos);

      var ct = 0;

      for (var y = 0; y <= gameWindow.canvas.height; y += $data.unit_size.y) {
        for (var x = 0; x <= gameWindow.canvas.width; x += $data.unit_size.x) {

          var pos = new Gamelab.Vector(x, y),
            size = new Gamelab.Vector($data.unit_size);

          if (xpos >= pos.x && xpos <= pos.x + size.x &&
            ypos >= pos.y && ypos <= pos.y + size.y) {

            selector.Size($data.unit_size.x, $data.unit_size.y);
            selector.Position(pos.x, pos.y);


            $texelData.texels[ct].index += 1 * wheelDelta_Multiple;


            if ($texelData.texels[ct] == 0) {
              $texelData.texels[ct] = $texel_module.texelByIndex(0 + (1 * wheelDelta_Multiple), $texelData.texels[ct].subTexels);
            } else {
              $texelData.texels[ct].index += (1 * wheelDelta_Multiple);
            }

            if ($texelData.texels[ct].index > $texel_module.globalSourceTexels.length) {
              $texelData.texels[ct] = 0;
            }


            if ($texelData.texels[ct] == 0) {
              gameWindow.selectedTexelIndex = 0;
            } else {

              gameWindow.selectedTexelIndex = $texelData.texels[ct].index; //minus 1 accounts for the blank (zero texel)

            }

            gameWindow.selectedTexelPosition = pos;


            var audio = audio || new Gamelab.SoundList([
              './sounds/click.mp3',
              './sounds/click.mp3',
              './sounds/click.mp3',
              './sounds/click.mp3'
            ]);


            audio.play();


          }

          ct += 1;
        }
      }

      console.info($texelData.texels);


    }, true);

    gameWindow.onMouseClick(function(xpos, ypos, e) {

      console.log('clicked');

      var ct = 0;

      for (var y = 0; y <= gameWindow.canvas.height; y += $data.unit_size.y) {
        for (var x = 0; x <= gameWindow.canvas.width; x += $data.unit_size.x) {

          var pos = new Gamelab.Vector(x, y),
            size = new Gamelab.Vector($data.unit_size);

          if (xpos >= pos.x && xpos <= pos.x + size.x &&
            ypos >= pos.y && ypos <= pos.y + size.y) {

            selector.Size($data.unit_size.x, $data.unit_size.y);
            selector.Position(pos.x, pos.y);


            if ($texelData.texels[ct] == 0) {
                $texelData.texels[ct] = $texel_module.texelByIndex(1, $texelData.texels[ct].subTexels);
              gameWindow.selectedTexelIndex = 0;
            } else if (!(e.shiftKey)) {


                $texelData.texels[ct].index += 1;

              if ($texelData.texels[ct].index > $texel_module.sourceTexels.length) {
                $texelData.texels[ct] = 0;
                gameWindow.selectedTexelIndex = 0;
              } else {
                var texel = $texelData.texels[ct];
                console.info('texel', texel);

                $texelData.texels[ct] = $texel_module.texelByIndex($texelData.texels[ct].index, $texelData.texels[ct].subTexels);

                gameWindow.selectedTexelIndex = $texelData.texels[ct].index;


              }
            } else {


              $texelData.texels[ct].subTexels[0].ix += 1;
              $texelData.texels[ct].subTexels[0].name = $texel_module.sourceTexels[$texelData.texels[ct].subTexels[0].ix].name;

              if ($texelData.texels[ct].subTexels[0].ix > $texel_module.sourceTexels.length) {
                $texelData.texels[ct].subTexels[0].ix = 0;
                $texelData.texels[ct].subTexels[0].name = '';
              }

              //selected texel is the base-texel index
              gameWindow.selectedTexelIndex = $texelData.texels[ct].index;


            }


            gameWindow.selectedTexelPosition = pos;


            var audio = audio || new Gamelab.SoundList([
              './sounds/click.mp3',
              './sounds/click.mp3',
              './sounds/click.mp3',
              './sounds/click.mp3'
            ]);


            audio.play();

            if ($MODULE._hoverTexel) {
              $MODULE._hoverTexel($texelData.texels[ct], pos);
            }


          }

          ct += 1;
        }
      }

      console.info($texelData.texels);

    });

  };


  var $MOD = this,
    $MODULE = this,
    unit = $MOD.data.unit_size.x;

  setTimeout(function() {


    if (MAKE) {
      $MOD.makeTexels(gameWindow.canvas.width, gameWindow.canvas.height);
      $MOD.makeGlobalTexels(unit * 10.0, unit * 2.0);
    }

    gameWindow.onBeforeDraw(function() {

      gameWindowUpdate();

    });

    gameWindow.selectedTexelIndex = 0;

    setMouseEvents();


  }, 1000);

};
