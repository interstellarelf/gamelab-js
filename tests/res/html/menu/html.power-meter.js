


function FixedStyle(object, x, y, w, h)
{
  object.style.position = 'fixed';
  object.style.zIndex = '9999';

  if(typeof x == 'string' && x.indexOf('%') >= 0)
  {
    object.style.left = x;
  }
  else{
    object.style.left = x + 'px';
  }

  if(typeof y == 'string' &&  y.indexOf('%') >= 0)
  {
    object.style.top = y;
  }
  else{
    object.style.top = y + 'px';
  }

  if(typeof w == 'string' &&  w.indexOf('%') >= 0)
  {
    object.style.width = w;
  }
  else{
    object.style.width = w + 'px';
  }

  if(typeof h == 'string' &&  h.indexOf('%') >= 0)
  {
    object.style.height = h;
  }
  else{
    object.style.height = h + 'px';
  }

}


class PowerMeter extends HTMLElement {
    constructor(){
      super();
      this.total = 0;
    }
    connectedCallback(){
      FixedStyle(this, 120, 55, 512, 10);
      this.style.borderRadius = '4px';
      this.style.background = 'rgba(50, 50, 50, 0.15)';
      this.style.border = '2px ridge #333';
      this.style.padding = '0px';
      this.style.padding = '0px';
      this.id = 'menu-shots';
      this.style.lineHeight = '0px';
    }

    Fill(totalUnits=40){

      var total = totalUnits, w = parseFloat(this.style.width) / totalUnits - 2;

      this.domBars = this.domBars || [];

      for(var x = 0; x < total; x++)
      {
        var power_src = 'power-0' +  (x % 3 + 1) + '.png';

        var domFill = document.createElement('SPAN');
        domFill.style.margin = '0px';
        domFill.style.marginTop = '-1px';
        domFill.style.lineHeight = '0px';
        domFill.style.display = 'inline-block';
        domFill.style.width = w + 'px';
        domFill.style.minHeight = '100%';

        domFill.style.background = 'url(./../../res/images/menu/'+power_src+')';

        if(x !== 0)
        {
            domFill.style.marginLeft = '2px';
        }

        domFill.style.background = 'url(./../../res/images/menu/'+power_src+')';
        domFill.style.backgroundSize =  '100% 80%';


        this.domBars.push(domFill);
        this.appendChild(domFill);
      }
    }

}


customElements.define('power-meter', PowerMeter);
