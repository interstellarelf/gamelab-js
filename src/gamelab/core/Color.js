
//RGBColor:: Color object
class RGBColor {
  constructor(r = 0, g = 0, b = 0, a = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  //Create color from string (rgba-string or hex-string to RGBAColor{})
  fromString(str) {
    if(str.indexOf('#') >= 0) //color-string is hex-color-string
    {
      str = Gamelab.ColorCalc.hexToRgba(str);
    }

    str = str.replace(/^\s*#|\s*$/g, '');
    str = str.toLowerCase();
    if (ColorStrings[str]) str = ColorStrings[str];

    var match;
    // RGB(A)
    if ((match = str.match(/\d+/g))) {

      return new Gamelab.RGBColor(
        parseInt(match[0], 10),
        parseInt(match[1], 10),
        parseInt(match[2], 10),
        1.0
      );
    }
  }

  //Create color from pixel-data
  fromData(data) {
    return new Gamelab.RGBColor(
      parseInt(data[0], 10),
      parseInt(data[1], 10),
      parseInt(data[2], 10),
      1.0
    );

  }

  //Distance between two colors (a 3d distance fxn)
  distance(color) {
    var sumOfSquares = 0;
    sumOfSquares += Math.pow(this.r - color.r, 2);
    sumOfSquares += Math.pow(this.g - color.g, 2);
    sumOfSquares += Math.pow(this.b - color.b, 2);
    return Math.sqrt(sumOfSquares);
  }

  //Fuzzy Match with tolerance for distance
  match_by_tolerance(color, tolerance) {

    var matches = {
      r: color.r,
      g: color.g,
      b: color.b
    };

    var total_diff = 0;

    for (var x in matches) {
      var diff = Math.abs(color[x] - this[x]);

      //console.log('COLOR-DIFF: --1::' + jstr(this) + ':: --2::' + jstr(color));

      total_diff += diff;
    }

    return total_diff <= tolerance;

  }

};


Gamelab.RGBColor = RGBColor;

//Color calculations::
Gamelab.ColorCalculator = {

  hexToRgbArray(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
  },

  rgbFromString: function(rgba_string) {
    return new Gamelab.RGBColor(rgba_string);
  },

  hexToRgba: function(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
  },

  scaledRGBAFromHex:function(hexcolor_a, hexcolor_b, scalePoint){

    //get the point between color_a and color_b using value of 0-1 ::
    //scalePoint of 0 = color_a as rgba & scalePoint of 1.0 will return color_b as rgba

    var rgba_a = this.hexToRgbArray(hexcolor_a),
    rgba_b = this.hexToRgbArray(hexcolor_b);


    var finalRgba={
      0:rgba_a[0] + ((rgba_a[0] - rgba_b[0]) * scalePoint * -1.0),
      1:rgba_a[1] + ((rgba_a[1] - rgba_b[1]) * scalePoint * -1.0),
      2:rgba_a[2] + ((rgba_a[2] - rgba_b[2]) * scalePoint * -1.0),
      3:1.0
    };

    //first 3 values are rounded / whole number
    [0, 1, 2].forEach(function(x){
      if(finalRgba[x] >= 255)
      {
        finalRgba[x] = 255
      }
      finalRgba[x] = Math.round(finalRgba[x]);
    });

    return "rgba("+ finalRgba[0] +  "," + finalRgba[1] + "," + finalRgba[2] + ", 1.0)" ;
  }

};

//Css Colors by name::
var ColorStrings = {
  aliceblue: 'rgb(240, 248, 255)',
  antiquewhite: 'rgb(250, 235, 215)',
  aqua: 'rgb(0, 255, 255)',
  aquamarine: 'rgb(127, 255, 212)',
  azure: 'rgb(240, 255, 255)',
  beige: 'rgb(245, 245, 220)',
  bisque: 'rgb(255, 228, 196)',
  black: 'rgb(0, 0, 0)',
  blanchedalmond: 'rgb(255, 235, 205)',
  blue: 'rgb(0, 0, 255)',
  blueviolet: 'rgb(138, 43, 226)',
  brown: 'rgb(165, 42, 42)',
  burlywood: 'rgb(222, 184, 135)',
  cadetblue: 'rgb(95, 158, 160)',
  chartreuse: 'rgb(127, 255, 0)',
  chocolate: 'rgb(210, 105, 30)',
  coral: 'rgb(255, 127, 80)',
  cornflowerblue: 'rgb(100, 149, 237)',
  cornsilk: 'rgb(255, 248, 220)',
  crimson: 'rgb(220, 20, 60)',
  cyan: 'rgb(0, 255, 255)',
  darkblue: 'rgb(0, 0, 139)',
  darkcyan: 'rgb(0, 139, 139)',
  darkgoldenrod: 'rgb(184, 134, 11)',
  darkgray: 'rgb(169, 169, 169)',
  darkgreen: 'rgb(0, 100, 0)',
  darkgrey: 'rgb(169, 169, 169)',
  darkkhaki: 'rgb(189, 183, 107)',
  darkmagenta: 'rgb(139, 0, 139)',
  darkolivegreen: 'rgb(85, 107, 47)',
  darkorange: 'rgb(255, 140, 0)',
  darkorchid: 'rgb(153, 50, 204)',
  darkred: 'rgb(139, 0, 0)',
  darksalmon: 'rgb(233, 150, 122)',
  darkseagreen: 'rgb(143, 188, 143)',
  darkslateblue: 'rgb(72, 61, 139)',
  darkslategray: 'rgb(47, 79, 79)',
  darkslategrey: 'rgb(47, 79, 79)',
  darkturquoise: 'rgb(0, 206, 209)',
  darkviolet: 'rgb(148, 0, 211)',
  deeppink: 'rgb(255, 20, 147)',
  deepskyblue: 'rgb(0, 191, 255)',
  dimgray: 'rgb(105, 105, 105)',
  dimgrey: 'rgb(105, 105, 105)',
  dodgerblue: 'rgb(30, 144, 255)',
  firebrick: 'rgb(178, 34, 34)',
  floralwhite: 'rgb(255, 250, 240)',
  forestgreen: 'rgb(34, 139, 34)',
  fuchsia: 'rgb(255, 0, 255)',
  gainsboro: 'rgb(220, 220, 220)',
  ghostwhite: 'rgb(248, 248, 255)',
  gold: 'rgb(255, 215, 0)',
  goldenrod: 'rgb(218, 165, 32)',
  gray: 'rgb(128, 128, 128)',
  green: 'rgb(0, 128, 0)',
  greenyellow: 'rgb(173, 255, 47)',
  grey: 'rgb(128, 128, 128)',
  honeydew: 'rgb(240, 255, 240)',
  hotpink: 'rgb(255, 105, 180)',
  indianred: 'rgb(205, 92, 92)',
  indigo: 'rgb(75, 0, 130)',
  ivory: 'rgb(255, 255, 240)',
  khaki: 'rgb(240, 230, 140)',
  lavender: 'rgb(230, 230, 250)',
  lavenderblush: 'rgb(255, 240, 245)',
  lawngreen: 'rgb(124, 252, 0)',
  lemonchiffon: 'rgb(255, 250, 205)',
  lightblue: 'rgb(173, 216, 230)',
  lightcoral: 'rgb(240, 128, 128)',
  lightcyan: 'rgb(224, 255, 255)',
  lightgoldenrodyellow: 'rgb(250, 250, 210)',
  lightgray: 'rgb(211, 211, 211)',
  lightgreen: 'rgb(144, 238, 144)',
  lightgrey: 'rgb(211, 211, 211)',
  lightpink: 'rgb(255, 182, 193)',
  lightsalmon: 'rgb(255, 160, 122)',
  lightseagreen: 'rgb(32, 178, 170)',
  lightskyblue: 'rgb(135, 206, 250)',
  lightslategray: 'rgb(119, 136, 153)',
  lightslategrey: 'rgb(119, 136, 153)',
  lightsteelblue: 'rgb(176, 196, 222)',
  lightyellow: 'rgb(255, 255, 224)',
  lime: 'rgb(0, 255, 0)',
  limegreen: 'rgb(50, 205, 50)',
  linen: 'rgb(250, 240, 230)',
  magenta: 'rgb(255, 0, 255)',
  maroon: 'rgb(128, 0, 0)',
  mediumaquamarine: 'rgb(102, 205, 170)',
  mediumblue: 'rgb(0, 0, 205)',
  mediumorchid: 'rgb(186, 85, 211)',
  mediumpurple: 'rgb(147, 112, 219)',
  mediumseagreen: 'rgb(60, 179, 113)',
  mediumslateblue: 'rgb(123, 104, 238)',
  mediumspringgreen: 'rgb(0, 250, 154)',
  mediumturquoise: 'rgb(72, 209, 204)',
  mediumvioletred: 'rgb(199, 21, 133)',
  midnightblue: 'rgb(25, 25, 112)',
  mintcream: 'rgb(245, 255, 250)',
  mistyrose: 'rgb(255, 228, 225)',
  moccasin: 'rgb(255, 228, 181)',
  navajowhite: 'rgb(255, 222, 173)',
  navy: 'rgb(0, 0, 128)',
  oldlace: 'rgb(253, 245, 230)',
  olive: 'rgb(128, 128, 0)',
  olivedrab: 'rgb(107, 142, 35)',
  orange: 'rgb(255, 165, 0)',
  orangered: 'rgb(255, 69, 0)',
  orchid: 'rgb(218, 112, 214)',
  palegoldenrod: 'rgb(238, 232, 170)',
  palegreen: 'rgb(152, 251, 152)',
  paleturquoise: 'rgb(175, 238, 238)',
  palevioletred: 'rgb(219, 112, 147)',
  papayawhip: 'rgb(255, 239, 213)',
  peachpuff: 'rgb(255, 218, 185)',
  peru: 'rgb(205, 133, 63)',
  pink: 'rgb(255, 192, 203)',
  plum: 'rgb(221, 160, 221)',
  powderblue: 'rgb(176, 224, 230)',
  purple: 'rgb(128, 0, 128)',
  red: 'rgb(255, 0, 0)',
  rosybrown: 'rgb(188, 143, 143)',
  royalblue: 'rgb(65, 105, 225)',
  saddlebrown: 'rgb(139, 69, 19)',
  salmon: 'rgb(250, 128, 114)',
  sandybrown: 'rgb(244, 164, 96)',
  seagreen: 'rgb(46, 139, 87)',
  seashell: 'rgb(255, 245, 238)',
  sienna: 'rgb(160, 82, 45)',
  silver: 'rgb(192, 192, 192)',
  skyblue: 'rgb(135, 206, 235)',
  slateblue: 'rgb(106, 90, 205)',
  slategray: 'rgb(112, 128, 144)',
  slategrey: 'rgb(112, 128, 144)',
  snow: 'rgb(255, 250, 250)',
  springgreen: 'rgb(0, 255, 127)',
  steelblue: 'rgb(70, 130, 180)',
  tan: 'rgb(210, 180, 140)',
  teal: 'rgb(0, 128, 128)',
  thistle: 'rgb(216, 191, 216)',
  tomato: 'rgb(255, 99, 71)',
  turquoise: 'rgb(64, 224, 208)',
  violet: 'rgb(238, 130, 238)',
  wheat: 'rgb(245, 222, 179)',
  white: 'rgb(255, 255, 255)',
  whitesmoke: 'rgb(245, 245, 245)',
  yellow: 'rgb(255, 255, 0)',
  yellowgreen: 'rgb(154, 205, 50)',


  //special map Colors
  map_orange: 'rgb(255, 106, 0)',
  map_green: 'rgb(76, 255, 0)',
  map_red: 'rgb(255, 0, 0)',
  map_blue: 'rgb(0, 38, 255)',
  map_darkgreen: 'rgb(38, 127, 0)',
  map_yellow: 'rgb(255, 216, 0)',
  map_aqua: 'rgb(0, 255, 255)',
  map_grey: 'rgb(128, 128, 128)',
  map_gray: 'rgb(128, 128, 128)',
  map_darkgrey: 'rgb(64, 64, 64)',
  map_darkgray: 'rgb(64, 64, 64)',
  map_black: 'rgb(0, 0, 0)',
};

var RE_RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;

Gamelab.Colors = {};

for (var x in ColorStrings) {
  if (ColorStrings.hasOwnProperty(x)) {
    Gamelab.Colors[x] = new Gamelab.RGBColor().fromString(x);
  }
}
