

var PostDefaults = {

  username:'--static-user',
  projectname:'--static-project'

};


var ServerSideFile = {

    defaultPostParams:function(params)
    {
      params.username = params.username || PostDefaults.username;
      params.projectname = params.projectname || PostDefaults.projectname;
      return params;
    },

    animationPreview: function (animation, effects) {

        effects = new EffectSequence();

        Canvas.__levelMaker = true;

        if (effects.sprite_object) {
            effects.sprite_object = false;

        }

        effects.sprite_object = new Sprite(animation);

        // alert(jstr(sprite_object.selected_animation));

        effects.canvas = document.getElementById('image-test-canvas');

        effects.ctx = effects.canvas.getContext('2d');

        effects.ctx.restore();

        effects.canvas.width = 180;
        effects.canvas.height = 180;

        effects.sprite_object.active = true;


        //  console.log(jstr(sprite_object));

        //  console.log(jstr(sprite_object.selected_animation));

        if (this.image_preview_interval) {
            window.clearInterval(this.image_preview_interval);

            this.image_preview_interval = false;

        }


        if (!this.image_preview_interval) {
            this.image_preview_interval = window.setInterval(function () {

                effects.ctx.clearRect(0, 0, effects.canvas.width, effects.canvas.height);

                if (effects) {

                    console.log('got effects');

                    effects.apply(effects.sprite_object, effects.canvas);

                }


                if (!effects.sprite_object.original_size) {
                    effects.sprite_object.original_size = new Vector(effects.sprite_object.size);
                }

                effects.sprite_object.size = effects.sprite_object.getCappedSizeXY(Math.round(effects.canvas.width * 0.8), Math.round(effects.canvas.height * 0.8));

                effects.sprite_object.position.x = effects.canvas.width / 2 - effects.sprite_object.size.x / 2;

                effects.sprite_object.position.y = effects.canvas.height / 2 - effects.sprite_object.size.y / 2;


                Canvas.draw(effects.sprite_object, effects.ctx);

            }, 20);

        }
    },

    getRawImageFile: function (input, callback) {

        var preview = document.createElement('img');
        var file = input.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {

            preview.src = reader.result;

            preview.onload = function () {

                if (typeof(callback) == 'function') {
                    callback(this);

                }

            };

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }


    },

    getAllImageFiles(input, callback){

      var files = input.files;

      for(var x = 0; x < files.length; x++)
      {

        var file = input.files[x];
        var reader = new FileReader();

        var NAME = file.name;

        reader.addEventListener("load", function () {

            var preview = document.createElement('img');

            preview.src = reader.result;

            preview.onload = function () {

                if (typeof(callback) == 'function') {
                    callback(this, NAME);

                }

            };

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }
      }

    },

    getRawFile: function (input, callback) {

        var file = input.files[0];
        var reader = new FileReader();

        reader.addEventListener("load", function () {

            if (typeof(callback) == 'function') {
                callback(reader.result);

            }

        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }


    },

    post:function(params, callback)
    {

      alert(typeof params);
        // console.log(content); //*Too much for logging at once
       // Assign handlers immediately after making the request,
       // and remember the jqxhr object for this request
       var jqxhr = $.post('http://localhost:4200/' + params.uri, params, function (data) {
           // console.log( "upload success:" + jstr(data) );
       })
           .done(function (data) {
               console.log("second ajax success");
               var d = JSON.parse(data);
               if (typeof(callback) == 'function') {
                   callback();
               }
           })
           .fail(function (e) {
               console.info("error:" + jstr(e));
           })
           .always(function () {
               console.log("ran ajax upload");
           });

// Perform other work here ...

// Set another completion function for the request above
       jqxhr.always(function () {
           console.log("always message");
       });

    },

    file_upload: function (filename, content, callback) {
        if (content instanceof Object && content.src) {

            content = content.src;

        }

        var cleanContent = function (c) {
            return c.replace('data:', '').replace('audio/mp3', '').replace(';base64,', '');

        };

        if (filename.indexOf('.mp3') >= 0) {

            content = cleanContent(content);
        }

        var uri_tail = 'image/png';

        if(filename.endsWith('.png'))
        {
          alert('applying png');
          uri_tail = 'image/png';
        }

        if(filename.endsWith('.jpg'))
        {
          alert('applying jpg');
          uri_tail = 'image/jpg';
        }

       // console.log(content); //*Too much for logging at once

        // Assign handlers immediately after making the request,
        // and remember the jqxhr object for this request
        var jqxhr = $.post('http://localhost:4200/webfile/api/' + uri_tail, {filename: filename, content: content}, function (data) {

            // console.log( "upload success:" + jstr(data) );


        })
            .done(function (data) {
                console.log("second ajax success");


                var d = JSON.parse(data);

                if (typeof(callback) == 'function') {

                    console.log('content len:' + content.length);

                    callback(d.relpath, content);

                }


            })
            .fail(function (e) {
                console.info("error:" + jstr(e));
            })
            .always(function () {
                console.log("ran ajax upload");
            });

// Perform other work here ...

// Set another completion function for the request above
        jqxhr.always(function () {
            console.log("always message");
        });

    }
};


let ServerClient = ServerSideFile;
