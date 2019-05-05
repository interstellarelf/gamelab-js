


/**
 * Creates an instance of Shot.
 * <info-bit>Shot object fires a moving-animation from a sprite </info-bit>
 *
 * @param   {string} name the name of this Shot
 * @param   {GameImage | Animation} imageOrAnimation the GameImage or Animation to apply for this Shot
 * @returns {Shot} a Gamestack.Shot object
 */

class Shot
{
    constructor(name, imageOrAnimation)
    {
        this.name = name || 'No-Name';

        if(imageOrAnimation instanceof Gamestack.GameImage)
        {
            this.anime = new Animation(imageOrAnimation);
        }
        else if(imageOrAnimation instanceof Gamestack.Animation)
        {
            this.anime = imageOrAnimation;

        }

        this.rotation = 0;

        this.rot_disp = 0;


        var args = name instanceof Object ? name : {};

        //is name / first arg an entire instance of shot?

        this.init(args);

    }

    init(args)
    {
        if(args instanceof Object) {

            for (var x in args) {

                this[x] = args[x];

                if(args[x] instanceof Object && args[x].hasOwnProperty('x'))//process as Vector
                {
                    this[x] = new Vector(args[x]);
                }

            }

        }
    }

    Image(image)
    {

        this.anime = new Animation(image);

    }

    Animation(anime)
    {
        this.anime = anime;
        return this;
    }

    Total(total, rot_disp_per_unit)
    {

        this.total =total;

        this.rot_disp = rot_disp_per_unit;

        return this;

    }

    WaveGrowth(growth)
    {
        if(growth > 0)
            this.curve_growth = growth;
    }

    CurveMode(key, size, growth)
    {
        this.curve = Gamestack.Curves.InOut[key.toLowerCase()];

        this.curve_key = key.toLowerCase();

        this.curve_size = size;

        if(growth > 0)
        this.curve_growth = growth;

        if(typeof(this.curve_size)=='number')
            this.curve_size = new Gamestack.Vector(this.curve_size, this.curve_size);

        return this;

    }

    RotDisp( rot_disp)
    {
        this.rot_disp = rot_disp;

        return this;
    }

    Velocity(v)
    {
        this.velocity = v;

        return this;
    }

  
    onCollide(collideables, callback)
    {


    }

}


Gamestack.Shot = Shot;
