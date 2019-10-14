


  var linkedCurves = {

    quadratic: function(t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    },

    cubic: function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    },

    quartic: function(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
    },

    quintic: function(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    },

    linear: function(t) {
      return t;
    } //provided for consistency / in case 'linear' is needed

  };


let Twix = {

  Curves:{
    //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
      // no easing, no acceleration
      Linear: {
        None: function(t) {
          return t;
        }
      },

      Quadratic: {
        In: function(t) {
          return t * t;
        },
        Out: function(t) {
          return t * (2 - t);
        },
        Seamless: function(t) {
          return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
      },

      Cubic: {
        In: function(t) {
          return t * t * t;
        },
        Out: function(t) {
          return (--t) * t * t + 1;
        },
        Seamless: function(t) {
          return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
      },

      Quartic: {
        In: function(t) { return t * t * t * t; },
        Out: function(t) { return 1 - (--t) * t * t * t; },
        Seamless: function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t; }
      },

      Quintic: {
        In: function(t) { return t * t * t * t * t; },
        Out: function(t) { return 1 + (--t) * t * t * t * t; },
        Seamless: function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t; }
      }
  },

  LinkedCurves:linkedCurves

};



const TranceCurves = {};

TranceCurves.Exponential = (value, power, min, max) => {

};

TranceCurves.Power = (value, power, min, max) => {

};


const TrigFunctions = {};

TrigFunctions.Sine = {};

TrigFunctions.Cosine = {};

TrigFunctions.Tangent = {};


const SpecialFunctions = {};

SpecialFunctions.Sawtooth = (t) => { return t <= 1.0 ? t : 0; };

SpecialFunctions.Square = () => {};

SpecialFunctions.Triangle = () => {};

SpecialFunctions.Floor = () => {};

SpecialFunctions.Sign = () => {};

Gamelab.core = Gamelab.core || {};

Gamelab.core.XYFunctions = {};

Gamelab.core.XYFunctions.SpecialFunctions = SpecialFunctions;



const SigmaFunctions = {};

const GammaFunctions = {};
