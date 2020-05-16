

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


class ShotMenu extends HTMLElement {

    constructor(){
      super();
      this.total = 0;
      this.switchSound = new Gamelab.Sound('./../../res/sounds/menu/menu-click.mp3').Multiply(4);
    }

    connectedCallback(){
      FixedStyle(this, 4, 54, 130, '15%');

        this.id = 'menu-shots';
    }

    playSwitchSound()
    {
                this.switchSound.play();
    }

    loadObjects(fxObjects, key){

      var spanZoomWrapper = spanZoomWrapper || document.createElement('SPAN');

      var obj = fxObjects;

      for (var x in obj) {

        if (this.total % 2 == 0) {
          spanZoomWrapper = document.createElement('span');
          spanZoomWrapper.classList.add('zoomwrap');
        }

        var canvas = document.createElement('canvas');
        canvas.style.width = '30px';
        canvas.style.height = '30px';

        canvas.width = 30;
        canvas.height = 30;

        canvas.classList.add('fx-button');

        var ctx = canvas.getContext('2d');

        if (obj[x].shot && obj[x].shot instanceof Gamelab.Particle)
          ctx.drawImage(obj[x].shot.presprite.effectCanvasList[0], 0, 0, 30, 30);

    else if (obj[x].shot && obj[x].shot instanceof Gamelab.SpriteFactory) {
          if (obj[x].shot.menu_sprite) {

            obj[x].shot.menu_sprite.Position(0, 0);
            obj[x].shot.menu_sprite.Size(30, 30);
            obj[x].shot.menu_sprite.draw(ctx);
          } else {
            ctx.drawImage(obj[x].shot.sprites[0].anime.image.domElement, 0, 0, 30, 30);
          }
        } else if (obj[x].shot && obj[x].shot instanceof Gamelab.SpriteFactory) {

          var sprite = obj[x].shot.MenuSprite();

          if (sprite) {
            if (sprite.menuSpriteInit) {
              sprite.menuSpriteInit();
              sprite.anime.run();
            }
            sprite.Size(30, 30);
            sprite.draw(ctx);
          }

        }

        canvas.setAttribute('data-fx-key', x);

        spanZoomWrapper.appendChild(canvas);
        if (this.total % 2 == 0) {
        this.appendChild(spanZoomWrapper);
        }
        this.total += 1;
      }


    }


}



class FxMenu extends HTMLElement {

    constructor(){
        super();
        this.total = 0;
          this.switchSound = new Gamelab.Sound('./../../res/sounds/menu/menu-click.mp3').Multiply(4);
    }

    connectedCallback(){
        FixedStyle(this, 4, '25%', 130, '15%');

        this.id = 'menu-fx';
    }

    playSwitchSound()
    {
                this.switchSound.play();
    }

    loadObjects(fxObjects, key){

              var spanZoomWrapper = spanZoomWrapper || document.createElement('SPAN');

              var obj = fxObjects;

              for (var x in obj) {

                if (this.total % 2 == 0) {
                  spanZoomWrapper = document.createElement('span');
                  spanZoomWrapper.classList.add('zoomwrap');
                }

                var canvas = document.createElement('canvas');
                canvas.style.width = '30px';
                canvas.style.height = '30px';

                canvas.width = 30;
                canvas.height = 30;

                canvas.classList.add('fx-button');

                var ctx = canvas.getContext('2d');

                if (obj[x] instanceof Gamelab.SpriteFactory) {} else {

                  if (obj[x] && obj[x] instanceof Gamelab.Particle) {
                    if (obj[x].presprite && obj[x].presprite.effectCanvasList) {
                      ctx.drawImage(obj[x].presprite.effectCanvasList[0], 0, 0, 30, 30);
                    } else {

                      alert(obj[x].constructor.name);

                      ctx.drawImage(obj[x].sourceSprites[0].image.domElement, 0, 0, 30, 30);
                    }

                  }
                }

                canvas.setAttribute('data-fx-key', x);

                spanZoomWrapper.appendChild(canvas);
                if (this.total % 2 == 0) {
                  this.appendChild(spanZoomWrapper);
                }
                this.total += 1;
              }

    }
}


customElements.define('shot-menu', ShotMenu);

customElements.define('fx-menu', FxMenu);
