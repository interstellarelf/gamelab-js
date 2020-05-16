


var module = module || {};

module.exports = {
  start:function(){

    var sprite = new Gamestack.Sprite();

    sprite.selected_animation = new Gamestack.Animation();

    sprite.selected_animation.addFrameFromFile = function (file, parent, callback) {

      var anime = this;

      callback = callback || function () {};

      callback.bind(anime);

      if (!FileReader) {
        return console.error('No support for FileReader');
      }

      var freader = new FileReader();
      freader.onload = function () {

        var frame = new Gamestack.Frame().Image(freader.result);

        frame.onLoad(function () {
          alert('image-frame loaded');
          this.Size(new Gamestack.Vector(this.image.domElement.width, this.image.domElement.height));
          anime.FrameSize(this.size);
          parent.Size(new Gamestack.Vector(this.size));
          console.log('X:' + parent.size.x + ':y:' + parent.size.y);
          this.Position(new Gamestack.Vector(0, 0));

          anime.FrameBounds(new Gamestack.Vector(0, 0), new Gamestack.Vector(0, 0));

          alert('adding to frames');

          anime.image = frame.image;

          callback.bind(this).call(anime, this);

          //  console.log(jstr(parent));

        });

        anime.frames.push(frame);

        parent.Anime(anime);

      }
      freader.readAsDataURL(file);

    };

            sprite.selected_animation.run = function () {

              console.log('Calling run():');
            };


    var imgInput = document.getElementById('image-input');

    imgInput.onchange = function (evt) {

      var target = evt.target;

      var files = new Array();

      for (var x in target.files) {
        if (target.files.hasOwnProperty(x))
          files.push(target.files[x]);
        }

        sprite.selected_animation.frames = [];

        files.forEach(function (f) {

          sprite.selected_animation.addFrameFromFile(f, sprite, function () {

            //    console.log("Anime::" + jstr(this)); console.log('selected_frame:' + jstr(sprite.selected_animation.selected_frame));
          });
      });

      var canvas = document.createElement('canvas'),
      context = canvas.getContext('2d');

                  var max_size = {
                    x:100,y:100,
                    set:function(key, value){
                      if(this[key] < value)
                      {
                        this[key] = value;
                        if(key == 'x' && canvas.width < this[key])
                        canvas.width = this[key];

                        if(key == 'y' && canvas.height < this[key])
                        canvas.height = this[key];
                      }
                    }
                  };


        canvas.width = max_size.x;
        canvas.height = max_size.y;

        (function(){

          gameWindow.onAfterDraw(function(){

            var frames = sprite.selected_animation.frames;

            var position = new Gamestack.Vector(0, 0);


            for(var x = 0; x < frames.length; x++)
            {

                if(!(frames[x].frameSize && frames[x].image && frames[x].image.domElement))
                {
                  continue;
                }

                var framesPerRow = Math.floor(OutputOptions.max_width / frames[x].frameSize.x),

                x_col = x % framesPerRow,
                y_row = Math.floor(x / framesPerRow);

                max_size.set('x', x_col *  frames[x].frameSize.x);
                max_size.set('y', y_row *  frames[x].frameSize.y);



                context.drawImage(frames[x].image.domElement,
                   x_col * frames[x].frameSize.x, y_row *  frames[x].frameSize.y,
                   frames[x].frameSize.x,
                   frames[x].frameSize.y);
          }

          });

        sprite.def_update = function () {};

        sprite.onUpdate(function () {

          console.log('sprite update w frames::' + this.selected_animation.frames.length);

          this.selected_animation.cix += 1;

          this.selected_animation.update();

        });

        gameWindow.add(sprite);

        })();



        if(!Rest)
        {
          return console.error('requires module Rest');
        }

        var OutputOptions = {
          max_width:1200,
          file_format:'image/png'
        };

        var outputGUI = new dat.GUI();

        outputGUI.add(OutputOptions, 'max_width');

        outputGUI.add(OutputOptions, 'file_format', ['image/png', 'image/jpg', 'image/gif']);

        var Texture = {

          Render:function(){

            console.log('Render():');

            Rest.post('http://localhost:4200/webfile/api/image/png', function(err, dataString){

              console.log('REST RESPONSE SUCCESS::' + JSON.stringify(dataString, null, 2));

              console.info('size::', {x:max_size.x, y:max_size.y});


            }, {filename:"image-test-02.png", content:canvas.toDataURL('image/png')});

          }
        };

        outputGUI.add(Texture, 'Render');

    };


  }
};
