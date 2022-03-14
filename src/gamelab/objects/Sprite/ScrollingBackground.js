class ScrollingBackground extends Sprite {

    constructor(arg1={}, size) {

        super(arg1, size);

        this.src = arg1;

        let args = typeof(arg1) == 'object' ? arg1 : {};

        this.size = size;

        this.type = args.type || "parallax" || "basic" || false;

        this.source_objects = args.objects || args.source_objects || [];

        this.members = [];

        this.rows = args.rows || 1;//The Y number of repititions

        this.cols = args.cols || 1; //The X number of repetitions of the images

        this.flip = args.flip || false;

        this.fill = args.fill || false;

        this.flip = args.flip || false;

    }

    Flip(value)
    {
        if(value == undefined)
        {
            this.flip = true;
        }
        else if (value == true || value == false) {
            this.flip = value;

        }

        return this;
    }

    Rows(r)
    {
        this.rows = r;
        return this;
    }

    Cols(c)
    {
        this.cols = c;
        return this;
    }

    Fill(approxRows, approxCols, gw)
    {

        approxRows = approxRows || this.rows || 1;

        approxCols = approxCols || this.cols || 1;

        gw = gw || Gamelab.game_windows[0];

        var w= gw.canvas.width, h = gw.canvas.height,
            xBacksTotal = Math.floor(approxRows / 2), yBacksTotal =  Math.floor(approxCols / 2);

        var __inst = this;

        //create first row:

        for(var y = -yBacksTotal; y <= yBacksTotal + 1; y++)
        {
            console.log('adding background:' + y);

            for(var x = -xBacksTotal; x <= xBacksTotal + 1; x++)
            {

                console.log('adding background');

                this.members.push(new Sprite(this.src));

                var b = this.members[this.members.length - 1];

                b.Size(this.size);

                console.info(this);

                var __inst = this;

                b.position.x = x * this.size.x;

                b.position.y = y * this.size.y;

                b.minX = -xBacksTotal * b.size.x + b.size.x;

                b.maxX = (xBacksTotal + 1) * b.size.x ;

                b.minY = -yBacksTotal * b.size.y + b.size.y;

                b.maxY = yBacksTotal * b.size.y ;


                if(x % 2 == 0)
                {
                    b.flipX = true;

                }

                if(y % 2 == 0)
                {
                    b.flipY = true;

                }


                b.onUpdate(function(spr){

                    spr.campos = gw.camera.position;

                    var cx = spr.campos.x - (spr.campos.x  % spr.size.x), cy = spr.campos.y - ( spr.campos.y % spr.size.y );

                    if(spr.position.x - cx < spr.minX)
                    {
                        spr.position.x = spr.maxX + cx;
                    }

                    if(spr.position.x - cx > spr.maxX)
                    {
                        spr.position.x = spr.minX + cx;
                    }

                    if(spr.position.y - cy < spr.minY)
                    {
                        spr.position.y = spr.maxY + cy;
                    }

                    if(spr.position.y - cy > spr.maxY)
                    {
                        spr.position.y = spr.minY + cy;
                    }

                });

                gw.add(b); //add to window

            }

        }

        return this;
    }

    add(object)
    {
        var cleanCheck = object instanceof Gamelab.Sprite || object instanceof Array && object[0] instanceof Gamelab.Sprite; //is Sprite

        if(!cleanCheck)
        {
            return console.error('Must have: valid contents (Gamelab.Sprite OR [] of Gamelab.Sprite())');
        }

        if(object instanceof Array)
        {
            this.source_objects.concat(object)
        }
        else
        {
            this.source_objects.push(object);
        }

        return this;
    }

}

Gamelab.ScrollingBackground = ScrollingBackground;