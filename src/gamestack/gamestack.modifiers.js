class FeatureSymbol {
  constructor(key) {
    this.key = key || "@NONE";
    this.symbol = Symbol(key);
  }
}

Gamestack.FeatureSymbol = FeatureSymbol;

Gamestack.FeatureInjectors = Gamestack.FeatureInjectors || {};

Gamestack.FeatureInject = function(constructor, args) {

  //console.log('Gamestack.FeatureInject()');

  var GClassFeatures = {};


  for (var y in Gamestack.ObjectFeatureMap) {

    if (Gamestack[y] && typeof Gamestack[y] == 'function') {

      var constructor = Gamestack[y];

      GClassFeatures[y] = {};

      //  console.log('Feature Symbol-key:' + Gamestack.ObjectFeatureMap[x][y]);

      GClassFeatures[y].featureSymbols = GClassFeatures[y].featureSymbols || [];

      for (var z in Gamestack.ObjectFeatureMap[y]) {

        GClassFeatures[y].featureSymbols.push(new Gamestack.FeatureSymbol(Gamestack.ObjectFeatureMap[y][z]));

        GClassFeatures[y].featureSymbols.hasKey = function(key) {

          for (var x = 0; x < this.length; x++) {
            if (typeof this[x].key !== 'string')
              continue;

            if (this[x].key.indexOf('@') == -1)
              console.error('feature-keys must contain @');

            //  console.log('eval key:' + this[x].key.split('@')[1]);

            if (this[x].key.split('@')[1] == key)
              return true;
          }

          return false;
        };

        GClassFeatures[y].featureSymbols.hasSymbol = function(symbol) {
          for (var x in this) {
            if (this[x].symbol == symbol)
              return true;
          }

          return false;
        };

        //  console.info('adding feature-symbol:' + Gamestack.ObjectFeatureMap[x][y]);
      }
    } else {
      console.error('Gamestack.ObjectFeatureMap: member by name of ' + x + ' does not exist as member of Gamestack');
    }
  }


  console.info('FEATURES:', GClassFeatures);


  for (var x in Gamestack.FeatureInjectors) {

    //  console.log(Gamestack.FeatureInjectors[x]);

    var props = Larva.getProtoFuncs(Gamestack.FeatureInjectors[x]);

    for (var y = 0; y < props.length; y++) {

      console.log(x + ":" + props[y]);

      for (var z in GClassFeatures)
        if (GClassFeatures[z] && GClassFeatures[z].featureSymbols.hasKey(props[y])) {

          Gamestack.FeatureInjectors[x][props[y]](Gamestack[z].prototype, args);

        }
    }
  }

};


class CssFeatures {

  colored(obj){
    obj.Color = function(c)
    {
      this.color = c;
      return this;
    }
  }

  color_transition(min_color, max_color){
    this.min_color = min_color;
    this.max_color = max_color;
    return this;
  }

  text(obj){
    obj.Text = function(value)
    {
      this.text = value;
      return this;
    }
  }

  opaque(obj){
    obj.Opacity = function(o){
      this.opacity = o;
      return this;
    }
  }
};


class DataFunctions {

  data(obj){

    obj.Name = function(n) {
      this.name = n;
      return this;
    };

    obj.Description = function(d){
      this.description = d;
      return this;
    };

    obj.Context = function(c) {
      this.context = c;
      return this;
    };
  }
}


/***************************
GeometryFeatures:
  A functional dependency injector
  injects properties and functions according to Symbols
**************************/
class VectorFunctions {
  constructor() {

    this.name = 'VectorFunctionals';

  }

  collideable(obj) {
    obj.collision_callback = function() {};
    obj.onCollide = args.onCollide || function(collideables, callback) {
      if (typeof(collideables) == 'function') {
        callback = collideables;
      }
      this.collision_callback = callback || function() {};
    };
  }

  spatial(obj) {

    obj.Size = function(x, y, z) {

      if (typeof(x) == 'object')
        this.size = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.size = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.size = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Pos = function(x, y, z) {

      if (typeof(x) == 'object')
        this.position = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.position = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.position = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Rot = function(x, y, z) {

      if (typeof(x) == 'object')
        this.rotation = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.rotation = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.rotation = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

    obj.Rotate = obj.Rot;

    obj.Rotation = obj.Rot;

  }

  posable(obj) {

    obj.Pos = function(x, y, z) {

      if (typeof(x) == 'object')
        this.position = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.position = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.position = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

  }

  sizeable(obj) {

    obj.Size = function(x, y, z) {

      if (typeof(x) == 'object')
        this.size = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.size = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.size = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

  }

  rotable(obj) {
    obj.Rot = function(x, y, z) {

      if (typeof(x) == 'object')
        this.rotation = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.rotation = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.rotation = new Gamestack.Vector(x, x, x);

      if (typeof this.Transpose == 'function') {
        this.Transpose();
      }

      return this;
    };

    obj.Rotate = obj.Rot;

    obj.Rotation = obj.Rot;

  }

  minable(obj) {
    obj.Min = function(x, y, z) {

      if (typeof(x) == 'object')
        this.min = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.min = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.min = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Minimum = obj.Min;

  }

  maxable(obj) {
    obj.Max = function(x, y, z) {

      if (typeof(x) == 'object')
        this.max = new Gamestack.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.max = new Gamestack.Vector(x, y, z);

      else //use x accross the vector
        this.max = new Gamestack.Vector(x, x, x);

      return this;
    };

    obj.Maximum = obj.Max;

  }

  boundable(obj) {
    this.minable(obj);

    this.maxable(obj);
  }

  selftransposable(obj) {
    //apply the transposition
    obj.Transpose = function(rotation, position) {

      this.rotation = new Gamestack.Vector(rotation || this.rotation);

      this.position = new Gamestack.Vector(position || this.position);

      //TODO: Modify this trig function and its call below to an optional 3D rotation

      for (var x = 0; x < this.points.length; x++) {

        var p = this.points[x];

        var np = Gamestack.Trig.rotate_from_xy(0, 0, p.x, p.y, this.rotation.x);

        this.points[x] = this.position.add(np);

      }
      return this;
    };

  }

  pointarrayflippable(obj) {
    //apply the transposition
    obj.FlipX = function() {

      var middle = Math.floor(this.points.length / 2); //account for FlipX with length of --odd number

      var x, y;

      for (x = this.points.length - 1, y = 0; x > middle, y < middle; x--, y++) {

        var p1 = this.points[x],
          p2 = this.points[y];

        [p1.x, p2.x] = [p2.x, p1.x];

      }

      return this;
    };


    //apply the transposition
    obj.FlipY = function() {

      var middle = Math.floor(this.points.length / 2); //account for FlipX with length of --odd number

      var x, y;

      for (x = this.points.length - 1, y = 0; x > middle, y < middle; x--, y++) {

        var p1 = this.points[x],
          p2 = this.points[y];

        [p1.y, p2.y] = [p2.y, p1.y];

      }

      return this;
    };

  }

  informable(obj, args) {
    obj.name = Gamestack.getArg(args, 'name', "__ObjectName");

    obj.description = Gamestack.getArg(args, 'description', false);

    obj.group = Gamestack.getArg(args, 'group', 'one');
  }

  tweenable(obj) {

    obj.curve_string = obj.curve_string || "linearNone";

    obj.setTweenCurve = function(c) {

      c = c || "linear_none";

      var cps = c.split('_');

      //alert(cps);

      var s1 = cps[0].toLowerCase(),
        s2 = cps[1].toLowerCase();

      var curve = TWEEN.Easing.Linear.None;

      obj.curve_string = 'linear_none'

      Gamestack.each(TWEEN.Easing, function(ix, easing) {

        Gamestack.each(TWEEN.Easing[ix], function(iy, easeType) {

          if (ix == s1 && iy == s2) {

            // alert('setting curve');

            curve = TWEEN.Easing[ix][iy];

            obj.curve_string = ix + '_' + iy;

          }

        });

      });

      obj.curve = curve;

      return curve;

    };

    obj.curvesToArray = function() {

      var c = [];

      Gamestack.each(TWEEN.Easing, function(ix, easing) {

        Gamestack.each(easing, function(iy, easeType) {

          if (['in', 'out', 'inout', 'none'].indexOf(iy.toLowerCase()) >= 0) {

            c.push(ix + "_" + iy);

          }

        });

      });

      return c;

    }
  }

};

Gamestack.FeatureInjectors.CssFeatures = new CssFeatures();

Gamestack.FeatureInjectors.VectorFunctions = new VectorFunctions();

Gamestack.FeatureInjectors.DataFunctions = new DataFunctions();
