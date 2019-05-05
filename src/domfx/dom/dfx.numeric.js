
/**
 * Creates an instance of ...

 * */

class Numeric extends DomHtml {

  constructor() {
    super();
    this.domElement = document.createElement('SPAN');
    document.body.appendChild(this.domElement);
    this.default();
  }

  Duration(d) {
    this.duration = d;
    return this;
  }

  FadeTime(fadeInTime, fadeOutTime) {
    this.fadeTime = { in: fadeInTime || 250,
      out: fadeOutTime || 250
    }
    return this;
  }

  Visible(){

    this.style.opacity = 1.0;
    return this;

  }

  get_float_pixels(float, dimen) {
    return Math.round(dimen * float) + 'px';
  }

  onComplete(fun) {
    this.complete = fun;
    return this;
  }

  Number(n){

    this.domElement.innerText = n;
    return this;
  }

  Countdown(mode){

    var dom = this;

    if(mode == 'seconds')
    window.setInterval(function(){

        var number = parseFloat(dom.domElement.innerText);

        number -= 1;

        dom.domElement.innerText = number;

    }, 1000);

    return this;

  }

  show(text, duration) {

    //create an html element
    var __inst = this;
    if (this.show_interval) {
      clearInterval(this.show_interval);
    }

    this.show_interval = setInterval(function() {
      var o = parseFloat(__inst.domElement.style.opacity);
      if (o < 1.0) {
        o += 1.0 * (20 / __inst.fadeTime.in);
        __inst.domElement.style.opacity = o;
      }

    }, 20);

    setTimeout(function() {

      clearInterval(__inst.show_interval);

      __inst.hide_interval = setInterval(function() {
        var o = parseFloat(__inst.domElement.style.opacity);

        if (o > 0) {
          o -= 1.0 * (20 / __inst.fadeTime.out);

          __inst.domElement.style.opacity = o;
        } else {

          __inst.domElement.style.opacity = o;

          if (typeof(__inst.complete) == 'function') {
            __inst.complete();
          }

          clearInterval(__inst.hide_interval);
        }
      }, 20);
    }, __inst.duration);
    return this;
  }

  then(cb) {
    this.complete = cb || function() {};
  }

}
