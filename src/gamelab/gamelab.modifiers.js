class FeatureSymbol {
  constructor(key) {
    this.key = key || "@NONE";
    this.symbol = Symbol(key);
  }
}

Gamelab.FeatureSymbol = FeatureSymbol;

Gamelab.FeatureInjectors = Gamelab.FeatureInjectors || {};

Gamelab.FeatureInject = function(constructor, args) {

  //console.log('Gamelab.FeatureInject()');

  var GClassFeatures = {};


  for (var y in Gamelab.ObjectFeatureMap) {

    if (Gamelab[y] && typeof Gamelab[y] == 'function') {

      var constructor = Gamelab[y];

      GClassFeatures[y] = {};

      //  console.log('Feature Symbol-key:' + Gamelab.ObjectFeatureMap[x][y]);

      GClassFeatures[y].featureSymbols = GClassFeatures[y].featureSymbols || [];

      for (var z in Gamelab.ObjectFeatureMap[y]) {

        GClassFeatures[y].featureSymbols.push(new Gamelab.FeatureSymbol(Gamelab.ObjectFeatureMap[y][z]));

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

        //  console.info('adding feature-symbol:' + Gamelab.ObjectFeatureMap[x][y]);
      }
    } else {
      console.error('Gamelab.ObjectFeatureMap: member by name of ' + x + ' does not exist as member of Gamelab');
    }
  }


  console.info('FEATURES:', GClassFeatures);


  for (var x in Gamelab.FeatureInjectors) {

    //  console.log(Gamelab.FeatureInjectors[x]);

    var props = TypeCode.getProtoFuncs(Gamelab.FeatureInjectors[x]);

    for (var y = 0; y < props.length; y++) {
      console.log(x + ":" + props[y]);
      for (var z in GClassFeatures)
        if (GClassFeatures[z] && GClassFeatures[z].featureSymbols.hasKey(props[y])) {
          Gamelab.FeatureInjectors[x][props[y]](Gamelab[z].prototype, args);
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

    obj.create_id = function(){
      return Gamelab.create_id();
    }
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
        this.size = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.size = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.size = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Pos = function(x, y, z) {

      if (typeof(x) == 'object')
        this.position = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.position = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.position = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Rot = function(x, y, z) {

      if (typeof(x) == 'object')
        this.rotation = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.rotation = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.rotation = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

    obj.Rotate = obj.Rot;

    obj.Rotation = obj.Rot;

  }

  relative_spatial(obj){


        obj.Size = function(x, y, z) {

          if (typeof(x) == 'object')
            this.size = new Gamelab.Vector(x);

          else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
            this.size = new Gamelab.Vector(x, y, z);

          else //use x accross the vector
            this.size = new Gamelab.Vector(x, x, x);

          return this;
        };

        obj.Pos = function(x, y, z) {

          var bpx = 0;
          if(this.basePosition &&  this.basePosition.x)
          bpx = this.basePosition.x;

          if (typeof(x) == 'object')
            this.position = new Gamelab.Vector(bpx + x);

          else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
            this.position = new Gamelab.Vector(bpx + x, y, z);

          else //use x accross the vector
            this.position = new Gamelab.Vector(bpx + x, x, x);

          return this;
        };

        obj.Rot = function(x, y, z) {

          var bx = 0;
          if(this.baseRotation &&  this.baseRotation.x)
          bx = this.baseRotation.x;

          if (typeof(x) == 'object')
            this.rotation = new Gamelab.Vector(bx + x);

          else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
            this.rotation = new Gamelab.Vector(bx + x, y, z);

          else //use x accross the vector
            this.rotation = new Gamelab.Vector(bx + x, x, x);

          return this;
        };

        obj.Position = obj.Pos;

        obj.Rotate = obj.Rot;

        obj.Rotation = obj.Rot;

  }

  posable(obj) {

    obj.Pos = function(x, y, z) {

      if (typeof(x) == 'object')
        this.position = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.position = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.position = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

  }

  sizeable(obj) {

    obj.Size = function(x, y, z) {

      if (typeof(x) == 'object')
        this.size = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.size = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.size = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Position = obj.Pos;

  }

  rotable(obj) {
    obj.Rot = function(x, y, z) {

      if (typeof(x) == 'object')
        this.rotation = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.rotation = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.rotation = new Gamelab.Vector(x, x, x);

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
        this.min = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.min = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.min = new Gamelab.Vector(x, x, x);

      return this;
    };

    obj.Minimum = obj.Min;

  }

  maxable(obj) {
    obj.Max = function(x, y, z) {

      if (typeof(x) == 'object')
        this.max = new Gamelab.Vector(x);

      else if (!isNaN(x) && !isNaN(y)) //has minimum of numeric x and y
        this.max = new Gamelab.Vector(x, y, z);

      else //use x accross the vector
        this.max = new Gamelab.Vector(x, x, x);

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

      this.rotation = new Gamelab.Vector(rotation || this.rotation);

      this.position = new Gamelab.Vector(position || this.position);

      //TODO: Modify this trig function and its call below to an optional 3D rotation

      for (var x = 0; x < this.points.length; x++) {

        var p = this.points[x];

        var np = Gamelab.Trig.rotate_from_xy(0, 0, p.x, p.y, this.rotation.x);

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
    obj.name = Gamelab.getArg(args, 'name', "__ObjectName");

    obj.description = Gamelab.getArg(args, 'description', false);

    obj.group = Gamelab.getArg(args, 'group', 'one');
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

      Gamelab.each(TWEEN.Easing, function(ix, easing) {

        Gamelab.each(TWEEN.Easing[ix], function(iy, easeType) {

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

      Gamelab.each(TWEEN.Easing, function(ix, easing) {

        Gamelab.each(easing, function(iy, easeType) {

          if (['in', 'out', 'inout', 'none'].indexOf(iy.toLowerCase()) >= 0) {

            c.push(ix + "_" + iy);

          }

        });

      });

      return c;

    }
  }

};

Gamelab.FeatureInjectors.CssFeatures = new CssFeatures();

Gamelab.FeatureInjectors.VectorFunctions = new VectorFunctions();

Gamelab.FeatureInjectors.DataFunctions = new DataFunctions();
