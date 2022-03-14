

class MenuInterfaceArray {



}


class TitleScreen {


  constructor() {


  }

  Font() {


  }

  Title() {


  }

  InterfaceOptions() {


  }


}



Gamelab.flashTitleScreen = function(title, font, interfaceOptions) {

  var testWindow = new Gamelab.GameWindow().Background('black');

  var title = new Gamelab.Text('Descendent').Font(100, 'baumans').Color('rgba(40, 40, 40, 0.9)').Position(100, 300).Shadow('rgba(200, 200, 200, 1.0)', 7);

  var circleSprite = new Gamelab.Sprite('./images/shapes/generic-coin.png');

  var Menu = {
    ctrlup:false,
    ctrlY:0,
    timer:0,
    ix:0,
    marker:false,
    sprites:[],
    shiftSelect:function(amt=1.0){

        this.ix += amt;

        if(this.ix < 0)
        {
          this.ix = this.sprites.length - 1;
        }

        if(this.ix > this.sprites.length - 1)
        {
          this.ix = 0;
        }

        for(var x = 0; x < this.sprites.length; x++)
        {
          this.sprites[x].ColorEffect('transparent');
        }

        var s = this.sprites[this.ix % this.sprites.length];
        s.select();
    }
  };

  function menuParams(sprite, ix){
    sprite.Scale(0.5).Position(200, 400 + ix * 35);
  };

  function addStartMenu(){

    var start = new Gamelab.Sprite('./images/menu/start-01.png'),

    options = new Gamelab.Sprite('./images/menu/options-01.png'),

    lab = new Gamelab.Sprite('./images/menu/lab-01.png');

    var marker =new Gamelab.Sprite('./images/shapes/circle-ripple-white.png');

    marker.Scale(0.25);

    marker.Position(150, 400);

    start.onLoad(function(){
      menuParams(this, 1);
    });
    options.onLoad(function(){
      menuParams(this, 2);

    });
    lab.onLoad(function(){
      menuParams(this, 3);
    });

    start.select = function(){
      Menu.marker.Position(this.position.add(-30, this.size.y / 2).sub(Menu.marker.size.div(2)));
      this.ColorEffect('#004d99');
    };

    options.select = function(){
      Menu.marker.Position(this.position.add(-30, this.size.y / 2).sub(Menu.marker.size.div(2)));
      this.ColorEffect('#004d99');
    };

    lab.select = function(){
      Menu.marker.Position(this.position.add(-30, this.size.y / 2).sub(Menu.marker.size.div(2)));
      this.ColorEffect('#004d99');
    };

    Menu.marker = marker;

    Menu.sprites = [start, options, lab];
    testWindow.add([start, options, lab, marker]);

    marker.onLoad(function(){

      Menu.shiftSelect(1);

    });


  };

  new Gamelab.GamepadEvent().Gamepads(1).Keys('stick_left').Call(function(x, y){

    if(Math.abs(x) > 0.2 || Math.abs(y) >= 0.2)
    console.log(x + ":" + y);

    if(Math.abs(y) >= 0.2)
    {
      Menu.timer += 1;

      if(Menu.timer >= 5)
      {
        Menu.shiftSelect(y > 0 ? 1 : -1);
        Menu.timer = 0;
      }

    }
    else{
      Menu.timer =  0;
    }

    Menu.ctrlY = y;

  });


  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_13').Call(function(pressed){

    if(pressed && !Menu.ctrldown)
    {
      Menu.shiftSelect(1);
    }

    Menu.ctrldown = pressed;

  });

  new Gamelab.GamepadEvent().Gamepads(1).Keys('button_12').Call(function(pressed){

    if(pressed && !Menu.ctrlup)
    {
      Menu.shiftSelect(-1);
    }



    Menu.ctrlup = pressed;
  });

  testWindow.ctx.imageSmoothingEnabled = true;

  Gamelab.ready(function () {

  testWindow.add(title);

  addStartMenu();

  testWindow.run();

  //gameWindow.start();



  });


};