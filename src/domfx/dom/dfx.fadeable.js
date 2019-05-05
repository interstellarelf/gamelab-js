class MagicDomFadeable extends MagicDom //to do apply a super object 'Extra'
{
  constructor(tagName) {
    super(tagName || 'SPAN');
    this.domElement = document.createElement(tagName);
    this.default();
    this.TransitionCurve('linear', 'none');
    this.callerKey = undefined; //track the last called function


    this.fadeTime = {in:2500, out:2500, remain:0};
    this.fadeValues = { in:[], out:[] };
  }

  TransitionCurve(easingArg_One, easingArg_Two) {
    this.transitionCurve = typeof easingArg_One == 'function' ? easingArg_One :
      EasingCurves.get(easingArg_One, easingArg_Two);
    return this;
  }

  FadeTiming(_in, _out, _remain) {
    this.fadeTime = { in: _in || 2500,
      out: _out || _in || 2500,
      remain: _remain || 0
    }

    this.ComputeFade();

    return this;
  }

  DelayFade(timing, in_out_phase) {
    console.dev('FadeDelay() in_out_phase = "in" || "out"');

    this.fadeDelays = { in: in_out_phase == 'in' ? timing : 0,
      out: in_out_phase == 'out' ? timing : 0
    }
    return this;
  }

  ComputeFade() {

    //create an html element
    var $magicDom = this;

    let computeValue = function(step_Index, stepLimit) {
      var floatPortionTotal =
        $magicDom.transitionCurve(step_Index / stepLimit);
      //x / totalSteps be the float-time-portion 0-1.0 of the transition in linear time

      return floatPortionTotal * 1.0;
      //1.0 --opacity 1.0 be the total
    };

    ['in', 'out'].forEach(function(key) {

      var totalSteps = Math.ceil($magicDom.fadeTime[key] / 10); //total # of steps

      var values = [];

      for (var x = 0; x < totalSteps; x+= 1) {
        values.push(computeValue(x, totalSteps));

        if(key == 'out')
        {
          var v = values[values.length - 1];
          values[values.length - 1] = 1.0 - v;
        }
      }

      console.log(values.length);

      $magicDom.fadeValues[key] = values.reverse(); //fadeValues[in || out] is set to the result--array
    });

    return this;
  }

  seesaw(){

    var $magicDom = this;

    $magicDom.show().then(function() {

      $magicDom.hide().then(function() {

        $magicDom.seesaw();

      })
    })
  }

  show(duration, callback) {

    var $magicDom = this;

    this.callerKey = 'show';

    this['show_complete'] = function(){};

    callback = callback || function() {};

    var copy_values_in = $magicDom.fadeValues.in.slice();

    function go() {
      if (copy_values_in.length > 1) {
        $magicDom.Css('opacity', copy_values_in.pop());
        setTimeout(function() {
          go();
        }, 10);
      } else {
        callback();
        if ($magicDom[$magicDom.callerKey + '_' + 'complete'])
          $magicDom[$magicDom.callerKey + '_' + 'complete']();
      }
    }

    go();
    return this;
  }

  hide(duration, callback) {
    var $magicDom = this;
    this.callerKey = 'hide';

    callback = callback || function() {};

      this['hide_complete'] = function(){};

    var copy_values_out = $magicDom.fadeValues.out.slice();

    function go() {
      if (copy_values_out.length > 1) {
        $magicDom.Css('opacity', copy_values_out.pop());
        setTimeout(function() {
          go();
        }, 10);
      } else {
        callback();
        if ($magicDom[$magicDom.callerKey + '_' + 'complete'])
          $magicDom[$magicDom.callerKey + '_' + 'complete']();
      }
    }

    delay(go, this.fadeTime.remain);

    return this;
  }

  then(f) {
    this[this.callerKey + '_' + 'complete'] = f;
    return this;
  }
}
