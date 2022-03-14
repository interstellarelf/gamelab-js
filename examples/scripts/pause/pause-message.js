Gamelab.isPaused = function() {

  return this.PAUSED || this.paused || false;

};

Gamelab.unpause = function() {

  Gamelab.PAUSED = false;

  if (Gamelab.pauseMessage) {
    Gamelab.gameWindow.style.opacity = 1.0;
    Gamelab.body.removeChild(Gamelab.pauseMessage);
  }

  Gamelab.pauseMessage = undefined;

};

Gamelab.pause = function(text = 'paused', fontSize = '30px', fontFamily = 'monospace') {

  Gamelab.PAUSED = true;

  Gamelab.pauseMessage = document.createElement('SPAN');

  Gamelab.pauseMessage.style.position = 'fixed';

  Gamelab.pauseMessage.style.left = '50%';

  Gamelab.pauseMessage.style.top = '55%';

  Gamelab.pauseMessage.style.width = '200px';

  Gamelab.pauseMessage.style.overflow = 'visible';

  Gamelab.pauseMessage.style.marginLeft = '-100px';

  Gamelab.pauseMessage.style.fontSize = fontSize.replace('px', '') + 'px';

  Gamelab.pauseMessage.style.fontFamily = fontFamily;

  Gamelab.pauseMessage.style.letterSpacing = '5px';

  Gamelab.pauseMessage.style.color = 'lightgrey';

  Gamelab.pauseMessage.innerText = text;

  Gamelab.canDepause = false;

  Gamelab.gameWindow = document.querySelector('canvas#gamewindow');

  Gamelab.body = document.getElementById('gamewindow').parentElement;

  Gamelab.body.appendChild(Gamelab.pauseMessage);

  Gamelab.gameWindow.style.opacity = 0.3;

};


Gamelab.togglePause = function() {

  if (!Program.started) {
    return;
  }

  if (Gamelab.PAUSED) {
    Gamelab.unpause();
  } else {
    Gamelab.pause();
  }

};

setInterval(function() {

  Gamelab.pauseTimer += 1;

}, 20);
