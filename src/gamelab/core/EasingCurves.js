(function() {
  console.log('Line() class... creating');

  let cos = Math.cos,
    pow = Math.pow,
    sin = Math.sin,
    sqrt = Math.sqrt,
    PI = Math.PI;


  var Curves = { //ALL HAVE INPUT AND OUTPUT OF: 0-1.0
    None: {
      Linear: function(x) {
        return x;
      },
      Zero(x) {
        return 0;
      }
    },
    In: {
      Sine: function(x) {
        return 1 - cos((x * PI) / 2);
      },
      Cubic: function(x) {
        return x * x * x;
      },
      Quintic: function(x) {
        return x * x * x * x * x;
      },
      Circular: function(x) {
        return 1 - sqrt(1 - pow(x, 2));
      },
      Elastic: function(x) {
        const c4 = (2 * Math.PI) / 3;

        return x === 0 ?
          0 :
          x === 1 ?
          1 :
          -pow(2, 10 * x - 10) * sin((x * 10 - 10.75) * c4);
      },
      Quadratic: function(x) {
        return x * x;
      },
      Quartic: function(x) {
        return x * x * x * x;
      },
      Exponential: function(x) {
        return x === 0 ? 0 : pow(2, 10 * x - 10);
      },
      Back: function(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return c3 * x * x * x - c1 * x * x;
      },
      Bounce: function(x) {
        return 1 - Curves.Out.Bounce(1 - x);
      },
    },

    Out: {
      Sine: function(x) {
        return sin((x * PI) / 2);
      },
      Cubic: function(x) {
        return 1 - pow(1 - x, 3);
      },
      Quintic: function(x) {
        return 1 - pow(1 - x, 5);
      },
      Circular: function(x) {
        return sqrt(1 - pow(x - 1, 2));
      },
      Elastic: function(x) {
        const c4 = (2 * Math.PI) / 3;
        return x === 0 ?
          0 :
          x === 1 ?
          1 :
          pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
      },
      Quadratic: function(x) {
        return 1 - (1 - x) * (1 - x);
      },
      Quartic: function(x) {
        return 1 - pow(1 - x, 4);
      },
      Exponential: function(x) {
        return x === 1 ? 1 : 1 - pow(2, -10 * x);
      },
      Back: function(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
      },
      Bounce: function(x) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
          return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
          return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
      },
    },
    InOut: {
      Sine: function(x) {
        return -(cos(PI * x) - 1) / 2;
      },
      Cubic: function(x) {
        return x < 0.5 ? 4 * x * x * x : 1 - pow(-2 * x + 2, 3) / 2;
      },
      Quintic: function(x) {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - pow(-2 * x + 2, 5) / 2;
      },
      Circular: function(x) {
        return x < 0.5 ?
          (1 - sqrt(1 - pow(2 * x, 2))) / 2 :
          (sqrt(1 - pow(-2 * x + 2, 2)) + 1) / 2;
      },
      Elastic: function(x) {
        const c5 = (2 * Math.PI) / 4.5;

        return x === 0 ?
          0 :
          x === 1 ?
          1 :
          x < 0.5 ?
          -(pow(2, 20 * x - 10) * sin((20 * x - 11.125) * c5)) / 2 :
          (pow(2, -20 * x + 10) * sin((20 * x - 11.125) * c5)) / 2 + 1;
      },
      Quadratic: function(x) {
        return x < 0.5 ? 2 * x * x : 1 - pow(-2 * x + 2, 2) / 2;
      },
      Quartic: function(x) {
        return x < 0.5 ? 8 * x * x * x * x : 1 - pow(-2 * x + 2, 4) / 2;
      },
      Exponential: function(x) {
        return x === 0 ?
          0 :
          x === 1 ?
          1 :
          x < 0.5 ? pow(2, 20 * x - 10) / 2 :
          (2 - pow(2, -20 * x + 10)) / 2;
      },
      Back: function(x) {
        const c1 = 1.70158;
        const c2 = c1 * 1.525;

        return x < 0.5 ?
          (pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 :
          (pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
      },
      Bounce: function(x) {
        const n1 = 7.5625;
        const d1 = 2.75;

        if (x < 1 / d1) {
          return n1 * x * x;
        } else if (x < 2 / d1) {
          return n1 * (x -= 1.5 / d1) * x + 0.75;
        } else if (x < 2.5 / d1) {
          return n1 * (x -= 2.25 / d1) * x + 0.9375;
        } else {
          return n1 * (x -= 2.625 / d1) * x + 0.984375;
        }
      }
    }
  };

  Gamelab.Curves = Curves;
  Gamelab.EasingCurves = Gamelab.Curves;

  var inOutCurves = {
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

  Gamelab.UI = Gamelab.UI || {};

  let getCurveCanvasList = function() {
    var canvases = [];
    for (var q in Gamelab.Curves) {
      for (var t in Gamelab.Curves[q]) {
        if (typeof Gamelab.Curves[q][t] == 'function') {
          let c = document.createElement('canvas');
          let ckey = q + '.' + t;
          c.width = 170;
          c.height = 100;
          c.style.width = '170px';
          c.style.height = '100px';
          c.fillStyle = 'rgba(0, 0, 0, 0.6)';

          c.setAttribute('data-curve-keys', q + '.' + t);

          let ctx = c.getContext('2d');
          ctx.fillRect(0, 0, 170, 100);
          ctx.lineWidth = 1;
          ctx.shadowBlur = 2;
          ctx.shadowColor = 'teal';

          let padding = 40;

          ctx.beginPath();

          for (var x = padding / 2.0; x < c.width - padding / 2.0; x += 1.0) {
            let calcHeight = c.height - padding;
            let calcWidth = c.width - padding;
            let p2 = new Gamelab.Vector(x, padding / 2.0 + calcHeight * Gamelab.Curves[q][t](x / calcWidth));
            if (x > 0) {

              let p1 = new Gamelab.Vector(x - 1, padding / 2.0 + calcHeight * Gamelab.Curves[q][t]((x - 1) / calcWidth));
              ctx.strokeStyle = 'limegreen';

              if (ckey.indexOf('In.Elastic') >= 0) {
                p1.y += 20;
                p2.y += 20;
              }

              if (ckey.indexOf('Out.Elastic') >= 0) {
                p1.y -= 20;
                p2.y -= 20;
              }

              ctx.moveTo(p1.x, 100 - p1.y);
              ctx.lineTo(p2.x, 100 - p2.y);
              ctx.stroke();
            };
          }
          canvases.push(c);
        }
      }
    }
    return canvases;
  };

  let getCurveImageList = function() {
    var images = [],
      canvases = this.getCurveCanvasList();
    canvases.forEach(function(c) {

      let image = document.createElement('img');

      image.style.display = 'none';
      image.style.position = 'absolute';
      image.style.zIndex = '9999';

      image.style.width = 'auto';
      image.style.height = 'auto';

      image.style.background = 'transparent';
      image.style.border = '1px inset #444';

      image.setAttribute('data-curve-keys', c.getAttribute('data-curve-keys'));
      image.style.opacity = 0.8;
      image.src = c.toDataURL();
      image.onload = function() {


      };

      image.show = function(topLeftElement) {
        var rect = topLeftElement.getBoundingClientRect();
        this.style.top = $(topLeftElement).position().top - 6 + 'px';
        this.style.left = 5 + 120 + 'px';
        this.style.display = 'block';
      };

      image.hide = function() {
        this.style.display = 'none';
      };
      images.push(image);
    });
    return images;
  };

  Gamelab.UI.getCurveCanvasList = getCurveCanvasList;
  Gamelab.UI.getCurveImageList = getCurveImageList;


})();