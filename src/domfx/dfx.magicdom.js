

class MagicDom extends DomHtml //to do apply a super object 'Extra'
{
  constructor(tagName) {
    super(tagName || 'SPAN');
    this.styleTargets = {};
    this.callerKey = undefined; //track the last called function
  }
    Css(key, value) {
      for (var x in this.style()) {
        if (x.toLowerCase() == key.toLowerCase())
          this.style()[key] = value;
      }
      return this;
    }
      StyleTarget(key, value) {
        this.styleTargets[key] = value;
        return this;
      }
  TransitionCurve(easingArg_One, easingArg_Two) {
    this.transitionCurve = typeof easingArg_One == 'function' ? easingArg_One :
      EasingCurves.get(easingArg_One, easingArg_Two);
    return this;
  }

  then(f) {
    this[this.callerKey + '_' + 'complete'] = f;
    return this;
  }

  onComplete(fun) {
    this.complete = fun;
    return this;
  }



      ScaleTop(t) {
        this.targetTop = this.get_float_pixels(t, document.body.clientHeight);
        this.domElement.style.bottom = 'auto';
        this.domElement.style.top = this.targetTop;
        return this;
      }

      ScaleLeft(l) {
        this.targetLeft = this.get_float_pixels(l, document.body.clientWidth);
        this.domElement.style.right = 'auto';
        this.domElement.style.left = this.targetLeft;
        return this;
      }


    ScaleBottom(v) {
      this.targetBottom = this.get_float_pixels(v, document.body.clientHeight);
      this.domElement.style.top = 'auto';
      this.domElement.style.bottom = this.targetBottom;
      return this;
    }

    ScaleRight(v) {
      this.targetRight = this.get_float_pixels(v, document.body.clientWidth);
      this.domElement.style.left = 'auto';
      this.domElement.style.right = this.targetRight;
      return this;
    }


}
