'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderStack = function () {
  function RenderStack(canvas, duration) {
    _classCallCheck(this, RenderStack);

    this.settings = {
      canvas: canvas || undefined,
      output: 'image/png',
      width: 500,
      height: 500,
      frames: [],
      duration: duration || 1000,
      totalFrames: totalFrames || 1
    };
  }

  _createClass(RenderStack, [{
    key: 'Duration',
    value: function Duration(d) {
      this.settings.duration = d;
      return this;
    }
  }, {
    key: 'Canvas',
    value: function Canvas(c) {
      this.settings.canvas = c;
      return this;
    }
  }, {
    key: 'Width',
    value: function Width(w) {
      this.settings.width = w || this.settings.width;
      return this;
    }
  }, {
    key: 'Height',
    value: function Height(h) {
      this.settings.height = h || this.settings.height;
      return this;
    }
  }, {
    key: 'Size',
    value: function Size(w, h) {
      this.Width(w);
      this.Height(h);
      return this;
    }
  }, {
    key: 'getRenderedImages',
    value: function getRenderedImages() {}
  }, {
    key: 'getRenderedVideo',
    value: function getRenderedVideo() {}
  }]);

  return RenderStack;
}();

var RenderedPixelEffect = function () {
  function RenderedPixelEffect(canvas, duration, total_time, callback) {
    _classCallCheck(this, RenderedPixelEffect);

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.duration = duration;
    this.total_time = total_time;
    this.callback = callback;
    this.pixels = [];
  }

  _createClass(RenderedPixelEffect, [{
    key: 'TotalTime',
    value: function TotalTime(t) {
      this.total_time = t;
      return this;
    }
  }, {
    key: 'Every',
    value: function Every(duration) {

      this.duration = duration;
      return this;
    }
  }, {
    key: 'Do',
    value: function Do(callback) {
      this.callback = callback;
      return this;
    }
  }, {
    key: 'start',
    value: function start() {

      this.callback.bind(this);

      var __this = this,
          c = this.callback;

      setInterval(function () {

        c(__this.pixels);
      }, this.duration);
    }
  }]);

  return RenderedPixelEffect;
}();

var EffectModule = function () {
  function EffectModule(canvas) {
    _classCallCheck(this, EffectModule);

    this.canvas = canvas;
  }

  _createClass(EffectModule, [{
    key: 'load',
    value: function load(url, callback) {

      var __object = this;

      callback = callback || function () {};

      callback = callback.bind(this);

      var script = document.createElement('SCRIPT');
      script.src = url;

      //define onload fxn
      script.onload = function () {

        var construct = window.module.exports;

        var props = construct(__object.canvas);

        for (var x in props) {
          __object[x] = props[x];
        }

        callback.bind(__object).call();
      };

      //append to the document
      document.head.appendChild(script);

      return this;
    }
  }]);

  return EffectModule;
}();

;
//# sourceMappingURL=renderstack.js.map
