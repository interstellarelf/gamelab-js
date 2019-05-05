var EasingCurves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0

  match: function(string_one, string_two) {
    if (string_one == 'match')
      return console.error('cannot refer to match function within match function.')

    if (!string_two && typeof this[string_one] == 'function')
      return this[string_one];

    let fc_upper = function(string) {
      var s = string.toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    };

    let lc_match = function(s1, s2) {
      return s1.toLowerCase() == s2.toLowerCase();
    };

    let uc_two = fc_upper(string_two);

    for (var x in this) {

      if (typeof this[x] == 'object') {
        if (lc_match(x, string_one) && string_two && typeof this[x][uc_two] == 'function')
          return this[x][uc_two];
      }
    }
    return false;

  },

  get: function(string_one, string_two) {

    var $CURVES = this;

    return this.match(string_one, string_two);
  },

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
    InOut: function(t) {
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
    InOut: function(t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
  },

  Quartic: {
    In: function(t) {
      return t * t * t * t;
    },
    Out: function(t) {
      return 1 - (--t) * t * t * t;
    },
    InOut: function(t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
    }
  },

  Quintic: {
    In: function(t) {
      return t * t * t * t * t;
    },
    Out: function(t) {
      return 1 + (--t) * t * t * t * t;
    },
    InOut: function(t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
    }
  }

  ,

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
