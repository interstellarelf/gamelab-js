


class RenderStack {

  constructor(canvas, duration)
  {
    this.settings = {
      canvas:canvas || undefined,
      output:'image/png',
      width:500,
      height:500,
      frames:[],
      duration:duration || 1000,
      totalFrames:totalFrames || 1
    };
  }
  Duration(d){
    this.settings.duration = d;
    return this;
  }
  Canvas(c){
    this.settings.canvas = c;
    return this;
  }
  Width(w){
    this.settings.width = w || this.settings.width;
    return this;
   }
   Height(h){
     this.settings.height = h || this.settings.height;
     return this;
   }
   Size(w, h)
   {
    this.Width(w);
    this.Height(h);
    return this;
   }
  getRenderedImages(){

  }
  getRenderedVideo(){

  }

}


class RenderedPixelEffect {

  constructor(canvas, duration, total_time, callback){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.duration = duration;
    this.total_time = total_time;
    this.callback = callback;
    this.pixels = [];
  }

  TotalTime(t){
    this.total_time = t;
    return this;
  }

  Every(duration){

    this.duration = duration;
    return this;
  }

  Do(callback)
  {
    this.callback = callback;
    return this;
  }

  start(){

    this.callback.bind(this);

    var __this = this, c = this.callback;

    setInterval(function(){

      c(__this.pixels, );

    }, this.duration);

  }
}






class EffectModule {

  constructor(canvas){
    this.canvas =canvas;
  }


  load(url, callback){

    var __object = this;

    callback = callback || function(){};

    callback = callback.bind(this);

    var script = document.createElement('SCRIPT');
    script.src = url;

    //define onload fxn
    script.onload = function(){

      var construct = window.module.exports;

    var props = construct(__object.canvas);

    for(var x in props)
    {
      __object[x] = props[x];
    }

      callback.bind(__object).call();

    };

    //append to the document
    document.head.appendChild(script);

    return this;

  }

};
