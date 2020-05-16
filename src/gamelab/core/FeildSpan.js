






class FeildSpan {
  constructor(a, b, transition = 'linear', duration = 500) {
    //console.log('FeildSpan(a, b, transition) :: transition may be the key-name of a curve or "random"');

    if(typeof a == 'number' && b == undefined)
      transition = 'fixed';

    this.a = a;
    this.b = b;
    this.transition = transition;
    this.duration = duration;
    this.ticker = 0;

    this.Duration = function(d) {
      this.duration = d;
      return this;
    };

    this.Clone = function() {
      return new FeildSpan(this.a, this.b, this.transition, this.duration);
    };

    this.max = function(){
      if(typeof this.a == 'number' && typeof this.b !== 'number')
      return this.a;
      else
      return this.a >= this.b ? this.a : this.b;
    };

    this.Reset = function() {
      this.ticker = 0;
      return this;
    };

    this.getValue = function() {

      if(this.transition == 'fixed')
      return this.a;

      var option = this,

        value = 0,

        diff = option.a - option.b;
        option.duration = option.duration || 500;
        var tvalue = option.transition;

        var curveMethod;

      for (var x in Twix.Curves) {
        if (x.toLowerCase() == option.transition.toLowerCase())
          curveMethod = Twix.Curves[x].None || Twix.Curves[x].In;
      }

      if(tvalue == 'random-once' && this.testValue !== undefined)
      {
        return this.testValue;
      }

      else if (tvalue == 'random-once' || tvalue == 'random') {

        option.ticker += 1;

        var finalValue = option.a;

        if (option.a <= option.b) {
          return option.a + Math.abs((Math.random() * diff));
        } else {
          return option.a - Math.abs((Math.random() * diff));
        }


      } else if (curveMethod) {

        var portion = Math.round((option.ticker / option.duration) * 100) / 100;

        option.ticker += 1;

        diff = Math.abs(diff);

        var curveStep = Math.abs(curveMethod(portion) * diff);

        var finalValue = option.a;

        finalValue += option.a > option.b ? curveStep * -1 : curveStep;

        if (option.ticker >= option.duration) {
          return option.b;
        }

        return Math.round(finalValue * 100) / 100;
      }
    };


    this.testValue = this.getValue();

  }
}



class ColorFeildSpan {

  constructor(a, b, transition = 'linear', duration = 500, colors=[]) {

    if(typeof a == 'string' && b == undefined)
      transition = 'fixed';

    this.a = a;
    this.b = b;
    this.transition = transition;
    this.duration = duration;
    this.ticker = 0;
    this.colors = colors;

    this.Duration = function(d) {
      this.duration = d;
      return this;
    };

    this.Clone = function() {
      return new ColorFeildSpan(this.a, this.b, this.transition, this.duration, this.colors);
    };

    this.hasVariance = function(){
        return this.transition !== 'fixed';
    };

    this.PrepareColors = function(){
      //runs 100 X , creates set of differential colors on the specified scale

      for (var x = 0.0; x <= 1.0; x += 0.01) {
        //use the x value to get the set of y values for this transition | curve (ex 'cubic')
        var tvalue = this.transition !== 'random' ? this.transition : 'linear';
        var option = this,
          value = 0;

        var curveMethod;

        option.duration = option.duration || 500;

        //if 'random' then create a linear scale to select from
        if (this.transition == 'random') {
          tvalue = 'linear';
        }

        if(this.transition == 'fixed')
        {
        this.colors.push(Gamelab.ColorCalculator.scaledRGBAFromHex(option.a, option.a, 0));
        continue;
        }

        var portion = x;

        this.colors.push(Gamelab.ColorCalculator.scaledRGBAFromHex(option.a, option.b, portion));
      };

      return this;
    };

    this.Reset = function() {
      this.ticker = 0;
      return this;
    };

    this.min = function(){

      if(typeof this.a == 'number' && this.b == undefined)
      return this.a;

      if(this.a <= this.b)
      return this.a;
      else{
        return this.b;
      }
    };

    this.max = function(){

      if(typeof this.a == 'number' && this.b == undefined)
      return this.a;

      if(this.a >= this.b)
      return this.a;
      else{
        return this.b;
      }
    };

    this.getPortion = function(){
      return this.ticker / this.duration;
    };


    //getValue :: returns the color for current step
    this.getValue = function() {
      //calculate portion as step 0.0 - 1.0
      var portion = this.ticker / this.duration;

      //increment ticker
      this.ticker += 1;

      //handle random transition
      if (this.transition == 'random') {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
      }

      if(this.transition == 'fixed')
      return this.colors[0];

      //get the correct array-member of index 0-99 using portion
      return this.colors[Math.floor(portion * 100)];
    };

  }

}

Gamelab.FeildSpan = FeildSpan;
Gamelab.ColorFeildSpan = ColorFeildSpan;
