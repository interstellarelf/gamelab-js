let Arrow = {

  schemas: {},

  create_id: function() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },

  loadJavascript: function(file, message) {
    let script = document.createElement('SCRIPT');
    script.src = file;
    script.onload = function() {
      if (message) {
        console.log(message);
      }
    }
  }
};


let Argument = {

  isHexColor: function(value) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
  },

  boundCall: function(object, callee) {
    return callee.bind(object);
  },


  getByType: function(args, types) {
    //returns array or false
    var single = args[x];
    for (var x in args) {
      if (types.includes(args[x].constructor.name) || types.includes(typeof args[x]))
        return args[x];
    }
    return false;
  },

};


class FormRow {
  constructor() {
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';
    container.style.whiteSpace = 'pre-wrap';
    var sectionBox = document.createElement('div');
    sectionBox.classList.add('control');
    sectionBox.style.background = '#222222';
    sectionBox.style.whiteSpace = 'pre-wrap';
    container.appendChild(sectionBox);
    return container;
  }
}


class Controller {

  constructor(container) {

    if (container instanceof HTMLElement)
      this.domElement = container;

    else if (typeof container == 'string') {
      this.domElement = document.querySelector(container);
      this.selector = container;
    }

    if (this.domElement instanceof Array) {
      this.domElement = this.domElement[0];
    }

    if (!this.domElement) {
      console.info('container must be a valid selector on page');
    }

    this.watchKeyCalls = [];
    this.watchTypeCalls = [];
    this.tagged = false;
    this.object_keys = [];
    this.ignore_keys = [];
    this.html_key_insertions = [];
    this.html_dom_insertions = [];
    this.key_type_insertions = [];
    this.appendables = [];
    this.appended = [];
    this.parent_appendables = [];
    this.deepLimit = 3;
    console.log('Controller::' + 'constructor');
  }

  disableAuto() {
    this.autoDisabled = true;
  }

  Clear(selector) {
    if (selector instanceof HTMLElement) {
      selector.innerHTML = '';
    } else {
      selector = selector || this.selector;
      document.querySelector(selector).innerHTML = "";
      return this;
    }
  }
  isTagged() {
    return this.tagged;
  }
  setTagged(value) {
    this.tagged = value;
  }
  PropertyKeys(keys) {
    if (keys instanceof Array)
      this.object_keys = this.object_keys.concat(keys);
    else
      this.object_keys.push(keys);

    return this;
  }
  Schema(schema) {
    console.log(`Arrow.Controller().Schema(obj) -->> obj is an object of property-keys and
  values for type, min, max, etc...`);
  }
  setNumberLevels() {
    var sliders = document.querySelectorAll('.number-bar');
    sliders.forEach(function(sbar) {
      var inputNumber = sbar.parentNode.querySelector('input[type=number]');
      inputNumber.setAttribute('value', inputNumber.value);
      var max = inputNumber.getAttribute('max'),
        min = inputNumber.getAttribute('min'),
        value = inputNumber.getAttribute('value'),
        fill = sbar.querySelectorAll('.fill')[0],
        fullWidth = $(sbar).width();

      var w = parseFloat(value) / Math.abs(parseFloat(max)) * fullWidth;
      var fullDiff = Math.abs(parseFloat(min) - parseFloat(max));
      var negPortion = parseFloat(min),
        negOffset = -negPortion / fullDiff * fullWidth;


      if (negPortion < 0) {
        w += negOffset;
      }
      fill.style.width = w + 'px';
    });
  }

  setNumberDrag() {

    var $ctrl = this;
    setTimeout(function() {
      $ctrl.setNumberLevels();
    }, 500);

    var mouse_dragger = {
      set: false,
      down: false
    };

    if (!mouse_dragger.set) {
      document.addEventListener('mousedown', function() {
        mouse_dragger.down = true;
      });
      document.addEventListener('mouseup', function() {
        mouse_dragger.down = false;
      });
      mouse_dragger.set = true;
    }

    function plantWidth(evt, sbar, go) {
      if (mouse_dragger.down || go) {
        var inputNumber = evt.currentTarget.parentNode.querySelector('input[type=number]'),
          max = inputNumber.getAttribute('max'),
          min = inputNumber.getAttribute('min'),
          fullWidth = $(evt.target).width();

        var fill = sbar.querySelectorAll('.fill')[0];
        var rect = fill.getBoundingClientRect();
        var w = rect.right - rect.left,
          x = rect.left;

        if (evt.pageX > (x + w) || evt.pageX < (x + w)) {
          var numericX = evt.pageX - rect.left;
          if (numericX < w / 2) {
            numericX -= 2.0;
          }
          if (numericX > w / 2) {
            numericX += 2.0;
          }
          fill.style.width = numericX + 'px';
          var r1 = fill.getBoundingClientRect(),
            r2 = evt.currentTarget.getBoundingClientRect();
          var step_multiple = 1.0 / inputNumber.step;
          var fullDiff = Math.abs(parseFloat(max) - parseFloat(min)),
            minOffset = parseFloat(min);
          var value = Math.round((max * ((r1.right - r1.left) / (r2.right - r2.left))) * step_multiple) / step_multiple;

          inputNumber.value = value;
          inputNumber.setAttribute('value', value);

          if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            inputNumber.dispatchEvent(evt);
          } else
            inputNumber.fireEvent("onchange");
        }
      }
    };

    //UI Error: Does not accept negative values, does not accept zero
    var sliders = document.querySelectorAll('.number-bar');
    sliders.forEach(function(sbar) {
      sbar.addEventListener('mousemove', function(evt) {
        plantWidth(evt, this);
      });
      sbar.addEventListener('click', function(evt) {
        plantWidth(evt, this, true);
      });
    });
  }

  onMemberCallback(key, callback) {

    var ctrlBox = this.domElement.querySelector('.key-' + key),

      inputList = ctrlBox.querySelectorAll('input');

    inputList.forEach(function(input) {
      $(input).unbind().change(function(evt) {
        var key = this.getAttribute('data-key'),
          value = this.value;
        callback(key, value);
      });
    });
  }

  onMemberProperties(key, props) {
    var ctrlBox = this.domElement.querySelector('.key-' + key),
      inputList = ctrlBox.querySelectorAll('input');
    inputList.forEach(function(input) {
      for (var x in props) {
        if (props.hasOwnProperty(x)) {
          input.setAttribute(x, props[x]);
        }
      }
    });
  }

  onContinue(text, callback) {

    if (typeof text == 'function') {
      callback = text;
      text = 'continue';
    }

    if (this.cancel)
      this.domElement.parentNode.removeChild(this.cancel);

    if (this.confirm)
      this.domElement.parentNode.removeChild(this.confirm);

    if (!this.continue) {
      this.continue = document.createElement('button');
      this.continue.classList.add('modal-continue');
      this.continue.classList.add('modal-button-center');
      this.continue.textContent = text;
      this.domElement.parentNode.append(this.continue);
    }

    this.continueCallback = callback || this.continueCallback || function() {};

    var $c = this;

    this.continue.addEventListener('click', function() {
      $c.continueCallback($c);
    });

  }

  onConfirm(text, callback) {

    if (this.continue) {
      this.domElement.parentNode.removeChild(this.continue);
      this.continue = false;
    }


    if (typeof text == 'function') {
      callback = text;
      text = 'confirm';
    }

    this.confirm = document.createElement('button');
    this.confirm.classList.add('modal-confirm');
    this.confirm.textContent = text;

    this.domElement.parentNode.append(this.confirm);

    this.confirmCallback = callback || this.confirmCallback || function() {};

    var $c = this;

    this.confirm.addEventListener('click', function() {
      $c.confirmCallback($c);
    });
  }

  onCancel(text, callback) {

    if (this.continue) {
      this.domElement.parentNode.removeChild(this.continue);
      this.continue = false;
    }

    if (typeof text == 'function') {
      callback = text;
      text = 'cancel';
    }

    this.cancel = document.createElement('button');
    this.cancel.classList.add('modal-cancel');
    this.cancel.textContent = text;

    this.domElement.parentNode.append(this.cancel);
    this.cancelCallback = callback || this.cancelCallback || function() {};

    var $c = this;

    this.cancel.addEventListener('click', function() {
      $c.cancelCallback($c);
    });
  }

  createSection(title) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';
    container.style.whiteSpace = 'pre-wrap';

    var sectionBox = document.createElement('div');
    sectionBox.classList.add('control');
    sectionBox.style.background = '#222222';
    sectionBox.style.whiteSpace = 'pre-wrap';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';

    label.innerText = title;

    container.appendChild(sectionBox);
    sectionBox.appendChild(label);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return container;
  }

  addButtonGroup(title, textList, callback) {
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    container.style.whiteSpace = 'pre-wrap';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = title;

    var buttonGroup = document.createElement('arrow-button-group');

    buttonGroup.classList.add('control');

    buttonGroup.appendChild(label);

    var buttonText = {
      up: '&#9650;',
      down: '&#9660;'
    };

    textList.forEach(function(text) {

      var helper = text;

      for (var x in buttonText) {
        if (buttonText[x].toLowerCase() == text.toLowerCase()) {
          helper = x;
        }
      }

      buttonGroup.addButton(text, helper, callback);
    });

    container.appendChild(buttonGroup);


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addHiddenFile(id) {
    var input = document.createElement('INPUT');
    input.type = 'file';
    input.id = id;
    input.style.display = 'none';
    if (this.__rendered) {
      this.domElement.append(input);
    } else {
      this.appendables.push(input);
    }
  }

  addFileImporter(options) {

    var span = document.createElement('SPAN'),
      button = document.createElement('BUTTON');

    var hiddenInput = document.createElement('input');
    hiddenInput.type = 'file';
    hiddenInput.style.display = 'none';
    hiddenInput.setAttribute('id', 'upload');

    span.style.position = 'relative';
    span.style.display = 'block';
    span.setAttribute('for', 'upload');
    span.appendChild(hiddenInput);

    if (options.w) {
      options.width = options.w;
    }
    if (options.h) {
      options.height = options.h;
    }

    if (!options.width) {
      options.width = 30;
    }
    if (!options.height) {
      options.height = 30;
    }

    options.width += '';
    options.height += '';

    span.setAttribute('data-hint', options.hint || '');
    span.setAttribute('data-tooltip', options.hint || '');
    span.setAttribute('data-tooltip-position', 'right');

    var change = options.change || options.onChange || options.onchange;

    if (change) {
      hiddenInput.onchange = function() {
        change.bind(this).call();
      };
      span.addEventListener('click', function() {
        $(hiddenInput).click();
      });
    }

    if (options.openView) {
      span.setAttribute('data-view', options.openView);
      span.addEventListener('click', function() {
        WebClient.fetch_View(this.getAttribute('data-view'), function(err, viewMarkup) {
          BuilderData.ObjectGroups = WebClient.ObjectGroups;
          var dom = ejs.render(viewMarkup, BuilderData);
          $('.modals').html(dom);
          $('.modals').show();
          $('multi-menu-modal').show('fast');
          $('.modal-window button[role=close]').click(function(e) {
            $('.modal-window').hide('fast');
          });
        });
      });
    }
    button.style.background = `url(${options.src || '../assets/images/braces.png'})`;
    button.style.backgroundSize = '100% auto';
    button.classList.add('button');

    button.style.width = options.width.replace('px', '') + 'px';
    button.style.height = options.height.replace('px', '') + 'px';

    button.style.marginLeft = '25px';

    span.appendChild(button);

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';
    container.style.whiteSpace = 'pre-wrap';

    var sectionBox = document.createElement('div');
    sectionBox.classList.add('control');
    sectionBox.style.background = '#222222';
    sectionBox.style.whiteSpace = 'pre-wrap';


    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = options.name || '*UNLABELLED';

    sectionBox.appendChild(label);
    sectionBox.appendChild(span);
    container.appendChild(sectionBox);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

  }

  addImageButton(options) {
    var span = document.createElement('SPAN'),
      button = document.createElement('BUTTON');

    span.style.position = 'relative';
    span.style.display = 'block';

    if (options.w) {
      options.width = options.w;
    }
    if (options.h) {
      options.height = options.h;
    }

    if (!options.width) {
      options.width = 30;
    }
    if (!options.height) {
      options.height = 30;
    }

    options.width += '';
    options.height += '';

    span.setAttribute('data-hint', options.hint || '');
    span.setAttribute('data-tooltip', options.hint || '');
    span.setAttribute('data-tooltip-position', 'right');

    var click = options.click || options.onClick || options.onclick;

    if (click) {
      span.addEventListener('click', function() {
        click.bind(this).call();
      });
    }

    button.style.background = `url(${options.src || '../assets/images/braces.png'})`;
    button.style.backgroundSize = '100% auto';
    button.classList.add('button');
    button.style.width = options.width.replace('px', '') + 'px';
    button.style.height = options.height.replace('px', '') + 'px';
    button.style.marginLeft = '25px';

    span.appendChild(button);

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';
    container.style.whiteSpace = 'pre-wrap';

    var sectionBox = document.createElement('div');
    sectionBox.classList.add('control');
    sectionBox.style.background = '#222222';
    sectionBox.style.whiteSpace = 'pre-wrap';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = options.name || '*UNLABELLED';

    sectionBox.appendChild(label);
    sectionBox.appendChild(span);
    container.appendChild(sectionBox);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

  }

  addFlexButtons(title, buttonGroupList, callback) {
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    container.style.whiteSpace = 'pre-wrap';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = title;

    var buttonGroup = document.createElement('arrow-flex-buttons');

    buttonGroup.classList.add('control');

    buttonGroup.appendChild(label);

    buttonGroupList.forEach(function(btn) {
      buttonGroup.addButton(btn.text, btn.callback);
    });

    container.appendChild(buttonGroup);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }


  addImageFlexButtons(title, buttonGroupList, callback) {
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    container.style.whiteSpace = 'pre-wrap';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = title;

    var buttonGroup = document.createElement('arrow-flex-buttons');

    buttonGroup.classList.add('control');

    buttonGroup.appendChild(label);


    buttonGroupList.forEach(function(btn) {
      buttonGroup.addImageButton(btn.src, btn.key, btn.callback);
    });

    container.appendChild(buttonGroup);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }


  addRadioButtonGroup(title, textList, callback) {
    var container = document.createElement('div');
    container.classList.add('object-builder');

    container.classList.add('control');

    container.style.background = '#222222';

    var label = document.createElement('LABEL');
    label.style.width = '40%';
    label.innerText = title;

    var buttonGroup = document.createElement('div');
    buttonGroup.classList.add('control');
    buttonGroup.appendChild(label);

    var ix = 0;

    textList.forEach(function(text) {

      var radio = document.createElement('input'),
        label = document.createElement('label');

      label.innerText = text;
      label.for = 'anime-type-' + ix;

      radio.name = 'anime-type';

      radio.style.marginTop = '3px';
      radio.style.marginLeft = '12px';
      radio.id = 'anime-type-' + ix;
      radio.type = 'radio';
      radio.value = text;

      radio.onchange = function() {
        callback(this.value);
      };

      buttonGroup.appendChild(radio);
      buttonGroup.appendChild(label);
      ix += 1;
    });

    container.appendChild(buttonGroup);


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addButton(text, callback) {
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';
    container.style.whiteSpace = 'pre-wrap';

    var sectionBox = document.createElement('div');
    sectionBox.classList.add('control');
    sectionBox.style.background = '#222222';
    sectionBox.style.whiteSpace = 'pre-wrap';

    var button = document.createElement('BUTTON');
    button.innerText = text;
    button.style.width = 'auto';
    button.style.cursor = 'pointer';
    button.style.borderRadius = '7px';
    button.style.marginLeft = '25px';

    button.onclick = function() {
      if (callback) {
        callback();
      }
    };

    button.classList.add('control');

    sectionBox.appendChild(button);
    container.appendChild(sectionBox);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addMediaLinks(title, media) {

    console.log('addMediaSelectGroup(): media --has properties {src:"image-src", uri:"video-uri" }');

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = title;

    var $control = this;

    media.forEach(function($media) {
      if ($media.image && $media.text && $media.description && $media.file) {
        var mediaLink = document.createElement('media-link');
        mediaLink.setAttribute('image', $media.image);
        mediaLink.setAttribute('text', $media.text);
        mediaLink.setAttribute('class', $media.class || 'none');
        mediaLink.setAttribute('description', $media.description);
        mediaLink.setAttribute('file', $media.file);
        mediaLink.style.fontSize = '14px';
        container.appendChild(mediaLink);
      } else {
        console.error('media {} needs properties: --image --text --description --file');
      }
    });

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return container;
  }

  addImageButtonSwitch(title, media) {

    console.log('addMediaSelectGroup(): media --has properties {src:"image-src", uri:"video-uri" }');

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.style.fontSize = '14px';
    label.innerText = title;

    var $control = this;

    media.forEach(function($media) {
      if ($media.image && $media.text && $media.description && $media.file) {
        var mediaLink = document.createElement('media-link');
        mediaLink.setAttribute('image', $media.image);
        mediaLink.setAttribute('text', $media.text);
        mediaLink.setAttribute('class', $media.class || '');
        mediaLink.setAttribute('description', $media.description);
        mediaLink.onclick = $media.callback;
        mediaLink.style.fontSize = '14px';
        container.appendChild(mediaLink);
      } else {
        console.error('media {} needs properties: --image --text --description --file');
      }
    });

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addIFrameSelectorWindow(title, uri) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var iframe = document.createElement('iframe');
    iframe.classList.add('control');

    iframe.style.minHeight = '350px';

    iframe.src = uri;

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;
    label.classList.add('flex');

    label.style.position = "absolute";

    container.append(label);
    container.append(iframe);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addIFrameWindow(title, uri) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var iframe = document.createElement('iframe');
    iframe.classList.add('control');

    iframe.style.minHeight = '350px';

    iframe.src = uri;

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;
    label.classList.add('flex');

    label.style.position = "absolute";

    container.append(label);
    container.append(iframe);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }


  addCanvasWindow(title, update, w = 500, h = 500) {

    update = update || function() {};

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var canvasBox = document.createElement('div');
    canvasBox.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;
    label.classList.add('flex');

    label.style.position = "absolute";

    var canvas = document.createElement('CANVAS');

    canvas.style.position = 'relative';
    canvas.style.width = '500px';
    canvas.style.height = '500px';
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.marginTop = '30px';
    canvasBox.appendChild(label);
    canvasBox.appendChild(canvas);

    var gameWindow = new Gamelab.GameWindow(canvas).Background('black');

    gameWindow.ctx = gameWindow.canvas.getContext('2d');

    gameWindow.onBeforeDraw(function() {

      this.canvas.style.width = (w || $(gameWindow.canvas).parent().width()) + 'px';
      this.canvas.style.height = (h || $(gameWindow.canvas).parent().height()) + 'px';
      this.canvas.width = (w || $(gameWindow.canvas).parent().width());
      this.canvas.height = (h || $(gameWindow.canvas).parent().height());

      update(gameWindow);
    });

    setTimeout(function() {

    }, 500);

    gameWindow.animate();
    container.append(canvasBox);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return gameWindow;
  }

  addThreeJSWindow(title, update, w = 500, h = 500) {

    update = update || function() {};

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var canvasBox = document.createElement('div');
    canvasBox.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;
    label.classList.add('flex');

    label.style.position = "absolute";

    var canvas = document.createElement('CANVAS');

    canvas.style.position = 'relative';
    canvas.style.width = '500px';
    canvas.style.height = '500px';
    canvas.width = 500;
    canvas.height = 500;
    canvas.style.marginTop = '30px';
    canvasBox.appendChild(label);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, canvasBox.clientWidth / canvasBox.clientHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    canvasBox.appendChild(renderer.domElement);

    container.append(canvasBox);

    function animate() {
      update(scene, renderer);
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    animate();

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return scene;
  }

  addListBuilder(listTitle, listElement, listItems = [], callback = function() {}, useConstruct) {
    //argument swap / coercion
    if (typeof listItems == 'function') {
      callback = listItems;
      listItems = [];
    }
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    callback = callback || function() {};
    container.style.background = '#222222';
    container.id = listTitle;

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = listTitle;

    container.append(box);
    box.append(label);

    let addId = Arrow.create_id();
    box.innerHTML += `<i id="${addId}" class="icon-btn add List-Item-add">+</i>`;

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }


    setTimeout(function() {

      listItems.forEach(function(item) {
        let dom = new listElement(item);
        $('#' + addId).parent().append($(dom.domElement));
      });

    }, 400);

    setTimeout(function() {

      $('#' + addId).click(function() {
        let item = new listElement();
        if (item.domElement == undefined) {
          return;
        }
        this.parentElement.append(item.domElement);
      });

    }, 400);

    return container;
  }

  addFileList(title, callback) {

    var container = document.createElement('div');
    container.classList.add('object-builder');

    container.style.background = '#222222';

    callback = callback || function() {};

    var box = document.createElement('div');
    box.classList.add('control');


    let mainLabel = document.createElement('label');
    mainLabel.innerText = title;
    box.append(mainLabel);

    mainLabel.style.width = '100%';

    container.append(box);

    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = 'multiple';
    fileInput.classList.add('file-hidden');
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', callback);

    let label = document.createElement('label');
    label.innerText = title;
    label.classList.add('file-hidden');

    label.style.marginLeft = '20px';

    label.append(fileInput);

    box.append(label);


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addAnimationScale(title, sprite, anime, callback) {

    var $dom = this;

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    callback = callback || function() {};

    container.style.background = '#222222';

    var box = document.createElement('div');
    box.classList.add('control');

    container.append(box);

    box.innerHTML += `  <label >scale | ${anime.name}</label><div style="padding-left:33px;" class="control modal key-scale" data-type="number">
                            ${this.number(anime, 'scale', 0.1, 4.0, 0.05)}
                            </div>`;

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    var input_scale = box.querySelectorAll('input')[0];

    input_scale.addEventListener('change', function() {

      anime.scale = this.value;
      anime.Scale(anime.scale);
      sprite.Scale(anime.scale);
      callback(anime);

    });

    setTimeout(function() {

      $dom.set_events();

    }, 200);

    return container;
  }

  addFolder(title) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    container.append(box);
    box.append(label);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return container;
  }

  addVector2(title, vector, attributes = {}, callback) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    callback = callback || function() {};

    container.style.background = '#222222';

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    container.append(box);
    box.append(label);

    let min = attributes.min || {
        x: -1000,
        y: -1000
      },
      max = attributes.max || {
        x: 1000,
        y: 1000
      },
      step = attributes.step || 1.0;

    box.innerHTML += `<div class="control modal key-y " data-type="number">
                        <label >x</label>
                        ${this.number(vector, 'x', typeof(min) == 'object' ? min.x : min || -1000, typeof(max) == 'object' ? max.x : max || -1000, step || 1.0)}
                        </div>`;

    box.innerHTML += `<div class="control modal key-y " data-type="number">
                        <label >y</label>
                        ${this.number(vector, 'y', typeof(min) == 'object' ? min.y : min || -1000, typeof(max) == 'object' ? max.y : max || -1000, step || 1.0)}
                        </div>`;


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    var input_x = box.querySelectorAll('input')[0];
    var input_y = box.querySelectorAll('input')[1];

    input_x.addEventListener('change', function() {
      vector.x = this.value;
      callback(vector);
    });

    input_y.addEventListener('change', function() {
      vector.y = this.value;
      callback(vector);
    });

    this.setNumberDrag();

    return container;
  }

  addNumber(options = {}) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = options.title;

    container.append(box);

    box.append(label);

    box.innerHTML += `<div class="control modal key" data-type="number">
                        <label ></label>
                        ${this.number(options.object,
                                      options.key,
                                      options.min || -3000,
                                      options.max || 3000,
                                      options.step || 1.0)}
                        </div>`;


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    container.querySelector('input[type=number]').onchange = function() {

      if (options.onchange) {
        options.onchange(this.value);
      }

    };

    this.setNumberDrag();

    return container;
  }

  addText(title, object, key, callback) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    container.append(box);

    box.append(label);

    box.innerHTML += `<div class="control modal key" data-type="number">
                        <label ></label>
                        ${this.string(object[key],
                                      callback)}
                        </div>`;

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return container;
  }

  addCheck(title, object, key) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    container.append(box);

    box.innerHTML += `<div class="control modal key" data-type="checkbox">
                        <label >${key}</label>
                        ${this.check(object, key)}
                        </div>`;


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return container;
  }

  addMultiCheck(title, object, keys) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';

    var box = document.createElement('div');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    container.append(box);

    var $ctrl = this;

    keys.forEach(function(k) {

      box.innerHTML += `<div class="control modal key" data-type="checkbox">
                          <label >${k}</label>
                          ${$ctrl.check(object, k)}
                          </div>`;

    });


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

    return container;
  }

  addFrameWindow(title, url) {

    var container = document.createElement('div');

    container.style.background = '#222222';

    var label = document.createElement('LABEL');
    label.classList.add('flex');
    label.style.width = '100%';
    label.innerText = title;

    var $control = this;

    var webFrame = document.createElement('iframe');

    webFrame.style.height = '370px';
    webFrame.style.width = '100%';
    webFrame.setAttribute('src', url);

    container.appendChild(webFrame);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addClickOpen(title, onOpen) {

    onOpen = onOpen || function() {};

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';

    var box = document.createElement('DIV');
    box.classList.add('control');

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    var button = document.createElement('button');
    button.classList.add('control');

    var open = open || false;

    button.onclick = function() {
      open = !open;
      onOpen(open);
    };

    box.appendChild(label);
    box.appendChild(button);

    container.appendChild(box);
    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  addSelect(title, selectTextList, value, callback) {
    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');
    container.style.background = '#222222';

    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    var selectGroup = document.createElement('select');
    selectGroup.classList.add('control');
    selectGroup.appendChild(label);

    selectTextList.forEach(function(text) {
      var option = document.createElement('option');
      option.innerText = text;
      selectGroup.appendChild(option);
    });

    container.appendChild(selectGroup);

    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }

  }


  addImageSelect(title, selectTextList, callback) {

    var container = document.createElement('div');
    container.classList.add('object-builder');
    container.classList.add('control');

    container.style.background = '#222222';


    var label = document.createElement('LABEL');
    label.style.width = '100%';
    label.innerText = title;

    var div = document.createElement('div');
    div.classList.add('control');

    var selectGroup = document.createElement('image-select');

    selectGroup.Options(selectTextList);

    selectGroup.style.marginLeft = "200px";

    div.appendChild(label);
    div.appendChild(selectGroup)

    //  selectGroup.Options(selectTextList, callback);

    container.appendChild(div);


    if (this.__rendered) {
      this.domElement.append(container);
    } else {
      this.appendables.push(container);
    }
  }

  IgnoreKeys(keys) {

    if (keys instanceof Array)
      this.ignore_keys = this.ignore_keys.concat(keys);
    else
      this.ignore_keys.push(keys);

    return this;
  }

  hasObjectKey(k) {
    return k && this.object_keys.indexOf(k) >= 0;
  }

  hasIgnoredKey(k) {
    return k && this.ignore_keys.indexOf(k) >= 0;
  }

  getWatchKey(key) {

    var value = false;

    this.watchKeyCalls.forEach(function(wkey) {

      if (wkey.key == key) {
        value = wkey.callback();
      }

    });

    return value;

  }

  getWatchType(key) {

    var value = false;

    this.watchTypeCalls.forEach(function(wkey) {

      if (wkey.key == key) {
        value = wkey.callback();
      }

    });

    return value;

  }

  WatchAll(keys, callback) {
    if (keys instanceof Array) {
      var __inst = this;

      keys.forEach(function(k) {

        __inst.WatchKeyExtra(k, callback);

      });
    }

    return this;
  }

  render(object, append) {

    object = object || {
      id: Arrow.create_id()
    }

    this.__rendered = true;

    this.guid = object.id || Arrow.create_id();

    var $ctrl = this;

    this.object = object;


    var container = this.getContainer(object, false, 'Object');


    if (!append) {
      this.Clear(container);
    }


    this.html = '';

    for (var x in object) {
      if (this.hasObjectKey(x))
        this.applyPrimitives(object, x, container);
    }


    this.appendables.forEach(function(app) {

      $ctrl.domElement.appendChild(app);

    });


    this.domElement.appendChild(container);

    for (var x in object) {

      var container;

      if (object.hasOwnProperty(x)) {

        if (object[x] instanceof Array && this.hasObjectKey(x)) {

          container = this.getContainer(object[x], x, 'Array');

          this.domElement.appendChild(container);

        } else if (object[x] instanceof Object && this.hasObjectKey(x)) {

          container = this.getContainer(object[x], x, 'Object');

          var show_cl = JSON.stringify(object[x]) == '{}' ? '' : 'show-hide';

          var element = this.getElement(object[x], x, x, '<i class="ctrl ' + show_cl + '"></i>');

          if (element) {
            this.domElement.appendChild(container);
            container.innerHTML += element;
          }
        }
      }
    }

    this.runInsertions();
    this.set_events();
  }

  set_events() {

    var showhideList = document.querySelectorAll('i.show-hide');

    showhideList.forEach(function(element) {
      element.addEventListener('click', function(evt) {
        this.classList.toggle('closed');
        this.parentNode.querySelectorAll('.control').forEach(function(e) {
          e.classList.toggle('hidden');
        });
      });
    });

    this.setNumberDrag();
  }

  //adds html to identifier
  domHTMLInsertion(html, identifier) {

    this.html_dom_insertions.push({
      html,
      key: identifier
    });

  }

  onClassProperty(key, type, callback) {
    if (typeof type == 'function') {
      callback = type;
      type = false;
    }
    var object = {};

    object.key = key;
    if (type)
      object.type = type;

    object.callback = callback;

    this.key_type_insertions.push(object);
  }

  runInsertions() {

    var $ctrl = this;

    this.html_dom_insertions.reverse();

    this.html_dom_insertions.forEach(function(i) {

      var parent = document.querySelector($ctrl.selector),
        element = parent.querySelector(i.key);


      if (!element) {
        alert('missing element on identifier:' + i.key);
        return;
      } else {

        var value = i.html;

        if (typeof value == 'string') {
          element.innerHTML += value;
        }
      }
    });


    this.key_type_insertions.forEach(function(i) {

      var parent = document.querySelector($ctrl.selector),
        element = parent.querySelector(' .key-' + i.key);

      if (!element) {
        alert('missing element on identifier:' + i.key);
        return;
      } else {

        var value = i.callback();

        if (typeof value == 'string') {
          element.innerHTML += value;
        } else if (typeof value == 'object') {
          console.log('DEV-TODO:: --process attribute arguments');

        }
      }
    });

  }

  applyPrimitives(object, key, container) {

    var html = '';

    var __inst = this;

    var type = typeof object[key],
      obj = object[key],
      ref = object;


    switch (type) {

      case "string":

        var string_input;

        if (this.autoDisabled) {
          string_input = '';
        } else {
          string_input = Argument.isHexColor(obj) ? __inst.color(obj) : __inst.string(obj, function(el) {});
        }

        html += `<div class="control modal  key-${key} data-type="string">
                <label >${key}</label>
                  ${string_input}
                </div>`;
        break;

      case "number":

        var number_input;
        if (this.autoDisabled) {
          number_input = '';
        } else {
          number_input = __inst.number(obj, key, -3000, 3000, 1.0, function(el) {});
        }


        html += `<div class="control modal key-${key} " data-type="number">
                <label >${key}</label>
                ${number_input}

                </div>`;
        break;

      case "boolean":

        var boolean_input;
        if (this.autoDisabled) {
          boolean_input = '';
        } else {
          boolean_input = __inst.boolean(obj, function(el) {});
        }

        html += `<div class="control modal  key-${key} data-type="boolean">
              <label >${key}</label>

              ${boolean_input}

              </div>`;
        break;

      case "function":

        break;

      default:

    }

    container.innerHTML += html;

  }

  getElement(object, key, parent_Key, extraHTML) {


    if (!this.hasObjectKey(key, parent_Key)) {

      //alert('ignoring:' + key + '::' + parent_Key);

      return '';
    }

    var __inst = this;

    var html = '';

    var specialType = false;

    html += '<div class="object-builder"><div class="listbuilder control modal list parent-key-' + parent_Key + ' key-' + key + '">' +

      '<label>' + (key ? key : '::object-properties') + '</label>' + (extraHTML || '');


    function replaceLast(str, sub, replacement) {

      var output = '';

      var nix = str.lastIndexOf(sub);
      if (nix >= 0 && nix + sub.length >= str.length) {
        output = str.substring(0, nix) + replacement;

        output += str.substring(nix, str.length);
      }

      return output;
    };

    for (var x in object) {

      if (object.hasOwnProperty(x)) {

        if (this.hasIgnoredKey(x)) {
          continue;
        }

        var obj = object[x];

        var key_value = __inst.getWatchKey(x),

          key_html = typeof(key_value) == 'string' ? key_value : '';

        if (!object.hasOwnProperty(x)) {

          alert('continuing @:' + x);
          continue;
        }

        function KeyHTML() {
          return key_html || '';
        }

        var array_html_two = obj instanceof Array ? '<i class="icon-btn add">+</i><span class="control-contents">*</span>' :
          typeof(object[x]) == 'object' ? '<i class="icon-btn add" >+</i>' : '';

        var key = x,
          ref = object;

        var schema = {
          specialControlOne: {
            type: "Options",
            values: [1, 2, 3, 4, 5]
          }
        };


        console.log('Property Render --' + x);

        if (typeof object[x] == 'object') {

          //alert('Found sub-object in:' + x);

          var sub_type = ['string', 'number', 'boolean'].indexOf(typeof object[x]) >= 0 ? typeof object[x] : false;

          if (!sub_type && object[x] instanceof Object) {
            sub_type = object[x].constructor.name;
          }

          var sub_html = this.getElement(object[x], x, x, extraHTML);

          this.domHTMLInsertion(sub_html, '.parent-key-' + parent_Key);

          //  gatherHTML(object[x]);

          console.log('OBJECT-Key --' + x);
        }


        if (specialType) {
          switch (specialType) {

            case "option":

              html += `<div class="control modal key-${x} " data-type="string">
                          <label >${x}</label>

                          ${ __inst.option(schema.values, obj , function(el){



                          })}

                          ${array_html_two + KeyHTML() }
                          </div>`;


              break;


          }
        } else if (typeof obj !== 'object') //any except object
        {
          switch (typeof obj) {

            case "string":

              var string_input = Argument.isHexColor(obj) ? __inst.color(obj) : __inst.string(obj, function(el) {});

              html += `<div class="control modal  key-${x}" data-type="string">
                    <label >${x}</label>

                    ${string_input}

                    ${array_html_two + KeyHTML()}
                    </div>`;


              break;

            case "number":

              html += `<div class="control modal key-${x} " data-type="number">
                    <label >${x}</label>


                    ${ __inst.number(obj,  key_value, -3000, 3000,1.0,  function(el){


                    })}

                    ${array_html_two + KeyHTML()}
                    </div>`;

              break;

            case "boolean":

              html += `<div class="control modal  key-${x}" data-type="boolean">
                  <label >${x}</label>

                  ${ __inst.boolean(obj, function(el){


                  })}

                  ${array_html_two + KeyHTML()}
                  </div>`;
              break;

            case "function":

              break;

            default:

          }
        }
      }
    }

    return html + '</div></div>';
  }

  getContainer(object, key, type) {

    function emptyObject(obj) {
      return typeof obj == 'object' && JSON.stringify(obj) == JSON.stringify({});
    }

    function emptyArray(arr) {
      return arr === undefined || (arr instanceof Array && arr.length == 0);
    }

    var emptyClass = '';

    console.info('OBJECT-SHOWING');


    if (emptyObject(object) || emptyArray(object)) {

      console.log('FOUND-empty');
      emptyClass = 'empty';

    };

    var type_value = '';

    var type_html;

    var type_key = 'x-type';


    var id_tag = this.guid;

    if (object instanceof Object) {
      //alert(object.constructor.name);
      type_value = this.getWatchType(object.constructor.name);
      type_html = typeof(type_value) == 'string' ? type_value : '';

      type_key = object.constructor.name;
    }


    function TypeHTML() {
      return type_html || '';
    }


    var div = document.createElement('DIV');

    div.classList.add('object-builder');

    div.classList.add('object-key-' + key);

    div.classList.add('object-type-' + type);

    div.classList.add('guid-' + id_tag);

    if (id_tag) {

      div.setAttribute('data-constructor', this.object.constructor.name);

      div.setAttribute('data-guid', id_tag);

      this.setTagged(true);

    }


    var listbuilder = document.createElement('DIV');

    listbuilder.classList.add('control');

    listbuilder.classList.add('list');

    listbuilder.classList.add('listbuilder');

    listbuilder.classList.add(`key-${key}`);

    if (type_key)
      listbuilder.classList.add(type_key);

    var label = document.createElement('LABEL');

    label.textContent = `${key ? key : '::object-properties'}`;

    if (key) {
      listbuilder.appendChild(label);

      div.appendChild(listbuilder);
    }
    return div;

  }

  select() {}

  string(value, callback) {
    return `<input type="text" value="${value}" />`;
  }

  option(values, selected_value, callback) {

    var options;

    for (var x in values) {
      if (values[x] == selected_value) {
        options += `<option selected>${values[x]}</option>`;
      } else {
        options += `<option>${values[x]}</option>`;
      }

    }

    return `<select name="" id="">${options}</select>`;

  }

  number(object, key, min = 0, max = 0, step, callback) {

    step = step || 1.0;

    return `<input type="number" min="${min}" max="${max}" step="${step}" value="${object.value || object[key]}" /><span class="number-bar" > <span class="fill"></span>  </span> `;

  }

  check(object, key, callback) {

    var checked = object[key] || false;

    return `<input type="checkbox" checked=${checked} value="${object[key]}" />`;

  }

  boolean(checked, callback) {
    return `<input type="checkbox"   ${checked ? 'checked':''}>`;
  }
  color(value) {
    return `<color-picker-control>${value}</color-picker-control>`;
  }
};


class Form {

  constructor(onCreate, options) {

    this.domElement = document.createElement('DIV');

    this.domElement.classList.add('arrow-formal');

    this.domTitleSpan = document.createElement('SPAN');

    this.domTitleSpan.classList.add('top');

    this.domTitleSpan.innerHTML = "Form <button role='close'>X</button>";

    this.domElement.appendChild(this.domTitleSpan);

  }

  Title(title) {
    this.addTitle(title);
    return this;
  }

  addTitle(title) {

    this.title = title || "";

    this.domTitleSpan.innerHTML = this.title + "<button role='close'>X</button>";

    return this;

  }

  addSubmit(value, onclick) {

    onclick = onclick || function() {};

    onclick = onclick.bind(this);

    let btn = document.createElement('BUTTON');

    btn.classList.add('create');

    btn.value = value;

    btn.addEventListener('click', function() {

      onclick();

    });

    this.domElement.appendChild(btn);

  }

  addCancel(value, onclick) {

    onclick = onclick || function() {};

    onclick = onclick.bind(this);

    let btn = document.createElement('BUTTON');

    btn.classList.add('cancel');

    btn.value = value;

    btn.addEventListener('click', function() {

      onclick();

    });

    this.domElement.appendChild(btn);


  }

  addInput(arrowInputType) {

    this.allowed_input_types = ['text', 'textarea', 'number', 'color', 'select'];


  }

  dom() {

    return this.domElement;

  }

  render(container) {

    Domkit.nearest(container).appendChild(this.dom());

  }
};

Arrow.Form = Form;

Arrow.Controller = Controller;


class ArrowColorInput extends HTMLElement {

  constructor() {
    super();
    this.html = '';
  }
  connectedCallback() {

    this.classList.add('object-builder');

    this.domContainer = document.createElement('DIV');
    this.domContainer.classList.add('control');

    this.domColorInput = document.createElement('INPUT');
    this.domColorInput.type = 'color';

    this.domContainer.appendChild(this.domColorInput);
    this.appendChild(this.domContainer);

  }
}

class ArrowButtonGroup extends HTMLElement {
  constructor() {
    super();
    this.buttons = [];
  }

  addButton(text, helper, callback) {

    if (typeof helper == 'function') {
      callback = helper;
      helper = text;
    }

    this.buttons.push({
      text,
      helper,
      callback
    });
    return this;
  }

  connectedCallback() {

    var $dom = this;

    var $btnContainer = document.createElement('DIV');

    $btnContainer.classList.add('control');


    $btnContainer.style.whiteSpace = 'pre-wrap';

    this.buttons.forEach(function(btn) {
      btn.domButton = document.createElement('BUTTON');
      btn.domButton.style.position = "relative";
      btn.domButton.style.cursor = 'pointer';
      btn.domButton.style.color = '#dddddd';
      btn.domButton.style.display = 'inline-block';
      btn.domButton.style.border = '1px solid #555555';

      btn.domButton.style.background = "#111111";
      btn.domButton.style.marginLeft = "12px";
      btn.domButton.innerHTML = btn.helper || btn.text;
      btn.domButton.setAttribute('data-helper', btn.helper);
      btn.domButton.addEventListener('click', function() {
        btn.callback = btn.callback || function() {};
        btn.callback(btn.helper);
      });
      $btnContainer.appendChild(btn.domButton);
    });

    $dom.appendChild($btnContainer);
  }

}

class ArrowFlexButtons extends HTMLElement {
  constructor() {
    super();
    this.buttons = [];
  }

  addButton(text, callback) {

    this.buttons.push({
      text: text,
      callback: callback
    });
    return this;
  }

  addImageButton(src, key, callback) {

    this.buttons.push({
      src: src,
      key: key,
      callback: callback
    });
    return this;
  }

  connectedCallback() {

    var $dom = this;

    var $btnContainer = document.createElement('DIV');

    $btnContainer.classList.add('control');

    $btnContainer.style.display = 'flex';

    $btnContainer.style.flexFlow = 'row wrap';

    $btnContainer.style.justifyContent = 'space-evenly';
    $btnContainer.style.alignContent = 'center';

    $btnContainer.style.whiteSpace = 'pre-wrap';

    this.buttons.forEach(function(btn) {
      btn.domButton = document.createElement('span');
      btn.domButton.style.position = "relative";
      btn.domButton.style.cursor = 'pointer';
      btn.domButton.style.color = '#dddddd';
      btn.domButton.style.display = 'flex-item';
      btn.domButton.style.minWidth = '35px';
      btn.domButton.style.textAlign = 'center';

      btn.domButton.style.border = '1px solid #555555';
      btn.domButton.style.background = "#111111";

      var btnSpan = document.createElement('SPAN');
      btnSpan.style.fontSize = '0.7em';
      btnSpan.style.padding = '4px';
      btnSpan.innerText = btn.text || '';
      btnSpan.style.display = 'block';
      btnSpan.style.textAlign = 'center';


      if (btn.src) {
        btnSpan = document.createElement('IMG');
        btnSpan.src = btn.src;
        btnSpan.style.width = '100px';
        btnSpan.style.height = 'auto';
      }

      btn.domButton.addEventListener('click', function() {
        btn.callback = btn.callback || function() {};
        btn.callback(btn.key || btn.text);
      });
      $btnContainer.appendChild(btn.domButton);

      btn.domButton.appendChild(btnSpan);

    });

    $dom.appendChild($btnContainer);
  }

}

class NumberInputPair {
  constructor() {
    this.domLabel = document.createElement('LABEL');
    this.domNumber = document.createElement('INPUT');
    this.domNumber.type = 'number';
  }
  appendTo(container) {
    container.appendChild(this.domLabel);
    container.appendChild(this.domNumber);
  }
}

class Vector2Input extends HTMLElement {

  constructor() {
    super();
    this.x = new NumberInputPair();
    this.y = new NumberInputPair();
    this.domScale = document.createElement('BUTTON');
    this.domScale.innerText = 'scale';
  }
  connectedCallback() {

    alert('Vector Input:: connected');

    this.x.appendTo(this);
    this.y.appendTo(this);

    this.appendChild(this.domScale);

  }
  Object(vector) {

    this.x.domNumber.onchange(function() {
      vector.x = this.getAttribute('value');
    });

    this.y.domNumber.onchange(function() {
      vector.y = this.getAttribute('value');
    });

  }
}

customElements.define('vector-2-input', Vector2Input);


class SourceImageController extends HTMLElement {
  constructor() {
    super();
    this.x = new NumberInputPair();
    this.y = new NumberInputPair();
  }
  connectedCallback() {
    this.domBox = new FormRow();
    this.appendChild(this.domBox);
    if (this.domImageRow) {
      this.domBox.appendChild(this.domImageRow);
    }
    this.x.appendTo(this.domBox);
    this.y.appendTo(this.domBox);
  }
  DomImage(img, name) {
    this.domImageRow = document.createElement('DIV');
    this.domImage = img;
    this.domImage.style.position = 'relative';
    this.domImage.style.display = 'block';
    this.domImage.style.marginBottom = '7px';
    this.domImage.style.marginLeft = '22px';
    this.domImageLabel = document.createElement('LABEL');

    name = name || img.src.split('/').pop();

    if (name.length >= 21) {
      name = "..." + name.substring(name.length - 21, name.length - 1);
    }

    this.domImageLabel.innerText = 'image: ' + name;
    this.domImageRow.appendChild(this.domImageLabel);
    this.domImageRow.appendChild(this.domImage);
    return this;
  }
  Size(vector, min, max) {

    this.x.domNumber.setAttribute('value', vector.x);
    this.y.domNumber.setAttribute('value', vector.y);

    this.x.domNumber.setAttribute('min', min);
    this.x.domNumber.setAttribute('max', max);

    this.y.domNumber.setAttribute('min', min);
    this.y.domNumber.setAttribute('max', max);

    this.y.domNumber.setAttribute('step', 1.0);
    this.y.domNumber.setAttribute('step', 1.0);

    this.x.domNumber.onchange = function() {
      vector.x = this.getAttribute('value');
    };
    this.y.domNumber.onchange = function() {
      vector.y = this.getAttribute('value');
    };
  }
}


customElements.define('source-image-controller', SourceImageController);


class ImageController extends HTMLElement {
  constructor() {
    super();
    this.domImages = [];
    this.domVector = document.createElement('VECTOR-INPUT');
  }

  addImage(src) {
    var img = document.createElement('IMG');
    img.src = src;
    this.domImages.push(img);
    this.domVector
  }

  connectedCallback() {

    alert('image controller connected');

  }

}


class ArrowSelect extends HTMLElement {

  constructor() {
    super();
    this.options = [];
  }

  addOption(text, callback) {
    this.options.push({
      text,
      callback
    });
    return this;
  }

  Options(textList, value, callback) {
    var $ctrl = this;
    this.options = [];
    textList.forEach(function(text) {
      $ctrl.options.push({
        text: text,
        callback: callback
      });
    });
    this.callOnSelect = callback;
    this.showOptions();

    $ctrl.value = value;
  }

  open() {
    this.setAttribute('data-open', 1);
  }

  select(index) {

    let ix = 0;
    let $dom = this;

    if (index !== undefined) {
      $dom.selected_index = index;
    }

    var open = $dom.getAttribute('data-open');

    if (open == 1) {
      $dom.setAttribute('data-open', 0);
      this.callOnSelect(this.selected_index);
    } else {
      $dom.setAttribute('data-open', 1);
    }

    if ($dom.getAttribute('data-open') == 1) {
      $dom.options.forEach(function(opt) {
        opt.domOption.style.display = 'flex';
        opt.domOption.onclick = function() {
          $dom.select(this.getAttribute('data-index'));
        };
      });
    } else {
      this.options.forEach(function(opt) {
        if (ix == $dom.selected_index) {
          opt.domOption.style.display = 'flex';
          opt.domOption.setAttribute('data-selected', 1);
          opt.domOption.style.order = 0;
        } else {
          opt.domOption.style.display = 'none';
          opt.domOption.setAttribute('data-selected', 0);
          opt.domOption.style.order = ix + 1;
        }
        ix += 1;
      });
    }
  }

  shut() {
    this.setAttribute('data-open', 0);
    this.options.forEach(function(o) {
      if (o.domOption.getAttribute('data-selected') == 0) {
        o.domOption.style.display = 'none';
      }
    });
  }

  onSelect(cb) {
    this.callOnSelect = cb.bind(this);
  }

  showOptions() {
    if (!this.connected) {
      return;
    }
    var $dom = this;
    var $select = this.$select;

    $select.innerHTML = '';

    let ix = 0;
    this.options.forEach(function(opt) {
      opt.domOption = document.createElement('span');
      opt.domOption.setAttribute('data-selected', ix == 0 ? 1 : 0);
      opt.domOption.style.display = 'none';
      opt.domOption.style.background = '#222';
      opt.domOption.style.color = 'lightgrey';
      opt.domOption.style.minWidth = '105px';
      opt.domOption.setAttribute('data-index', ix);
      opt.domOption.style.fontSize = '12px';
      opt.domOption.style.padding = '2px';
      $dom.hoverSpan(opt.domOption);
      opt.domOption.value = opt.text;
      opt.domOption.innerText = opt.text;
      $select.appendChild(opt.domOption);
      ix += 1;
    });

    $dom.select(0);
    $dom.shut();
  }

  hoverSpan(span) {

    $(span).hover(function() {
      $(this).css('background', '#333');
    }, function() {
      $(this).css('background', '#222');
    });

  }

  connectedCallback() {

    var $dom = this;

    this.connected = true;

    this.setAttribute('data-open', false);

    var $select = document.createElement('span');

    this.$select = $select;

    $select.style.position = 'absolute';
    $select.style.zIndex = '9999';
    $select.style.display = 'flex';
    $select.style.flexDirection = 'column';
    $select.style.borderWidth = '0 2px 0 2px';
    $select.style.borderStyle = 'solid';
    $select.style.borderColor = '#111';
    $select.style.background = '#222';

    $select.style.paddingTop = '2px';

    var options_string = this.getAttribute('options');

    if (options_string) {
      this.Options(options_string.split('|'));
    }

    let ix = 0;

    this.options.forEach(function(opt) {
      opt.domOption = document.createElement('span');
      opt.domOption.setAttribute('data-selected', ix == 0 ? 1 : 0);
      opt.domOption.style.display = 'none';
      opt.domOption.style.background = '#222';
      opt.domOption.style.color = 'lightgrey';
      opt.domOption.style.minWidth = '105px';
      opt.domOption.style.fontSize = '12px';
      opt.domOption.style.padding = '2px';
      opt.domOption.setAttribute('data-index', ix);
      opt.domOption.value = opt.text;
      opt.domOption.innerText = opt.text;
      $dom.hoverSpan(opt.domOption);
      $select.appendChild(opt.domOption);
      ix += 1;
    });
    $dom.appendChild($select);
    this.shut();
  }
}


class ImageResourceSelect extends HTMLElement {

  constructor() {
    super(...arguments);
    this.options = [];
  }

  connectedCallback() {

    this.showingCount = this.showingCount || 0;
    this.domButton = document.createElement('BUTTON');

    this.style.position = 'absolute';
    this.style.top = '7px';
    this.style.right = '0px';

    this.domButton.style.background = 'black';
    this.domButton.style.color = 'lightgrey';
    this.domButton.style.border = '1px solid #555555';
    this.domButton.style.borderTopLeftRadius = '3px';
    this.domButton.style.borderBottomLeftRadius = '3px';

    this.domButton.style.margin = '0px';
    this.domButton.style.padding = '0px';
    this.domButton.style.marginTop = '-4px';
    this.domButton.style.width = '32px';
    this.domButton.style.height = '27px';

    this.domButton.innerText = this.text || this.innerText || "\u2630";
    this.domButton.style.position = 'absolute';
    this.domButton.style.marginLeft = "-32px";

    this.innerText = "";

    this.domText = document.createElement('SPAN');
    this.domText.style.position = 'absolute';


    this.domText.style.color = 'lightgrey';
    this.domText.style.right = "7px";
    this.domText.style.borderRadius = '3px';
    this.domText.style.minWidth = '110px';
    this.domText.style.height = '19px';
    this.domText.style.border = '1px solid #555555';
    this.domText.style.font = '400 11.3333px Arial';
    this.domText.style.padding = '3px';
    this.domText.style.paddingLeft = '4px';

    this.domText.style.paddingRight = '30px';
    this.domText.style.background = '#222222';
    this.domText.appendChild(this.domButton);

    this.appendChild(this.domText);

    var $ctrl = this;

    this.domButton.onclick = function(evt) {
      console.log('showing type-select with:' + evt.clientX + '::' + evt.clientY);
      $ctrl.show(evt.clientX, evt.clientY);
      evt.preventDefault();
      return false;
    };

    this.timer = 0;

  }

  Options(textList, callback) {
    var $ctrl = this;
    textList.forEach(function(object) {
      $ctrl.options.push(object);
    });
    return this;
  }

  Value(v, src) {
    this.value = v;
    this.domText.innerHTML = "";
    this.domText.appendChild(this.domButton);

    var span = document.createElement('SPAN'),
      img = document.createElement('IMG');

    span.style.paddingLeft = '4px';
    span.innerText = v;
    img.src = src;

    img.style.width = '22px';
    img.style.height = 'auto';
    img.style.float = 'right';

    img.style.position = 'absolute';
    img.style.right = '3px';
    img.style.top = '1px';

    this.domText.appendChild(span);
    this.domText.appendChild(img);
    return this;
  }

  hide() {

    this.style.display = 'none';

  }

  show(x, y) {

    this.showingCount += 1;

    x = x + 30;
    y = y - 20;

    this.domList = document.createElement('div');
    this.domList.style.position = 'fixed';
    this.domList.style.zIndex = '9999';
    this.domList.style.top = y + 'px';
    this.domList.style.left = x + 'px';
    this.domList.style.minWidth = '100px';
    this.domList.style.minHeight = '100px';
    this.domList.style.background = 'rgba(0, 0, 0, 0.8)';
    this.domList.style.border = '1px solid #555555';
    this.domList.style.overflow = 'hidden';

    this.appendChild(this.domList);
    this.objects = this.options;

    function pos(dom, V) {
      var y = 0;
      if (dom.style.top) {
        y = parseFloat(dom.style.top);
      }
      y += V;
      dom.style.top = y + "px";
    };

    var $domList = this.domList;

    window.addEventListener("wheel", function(evt) {
      pos($domList, Math.round(evt.deltaY * 0.35 * -1));
    });

    setTimeout(function() {

      $('body').click(function(event) {
        var $target = $(event.target);
        if (!$target.closest('image-select button').length &&
          $('image-select div').is(":visible")) {
          $('image-select div').hide();
        }
      });

    }, 200);


    var $ctrl = this;

    this.objects.forEach(function(obj) {

      var text = document.createElement('SPAN');
      text.style.fontSize = '0.7em';
      text.style.padding = '1px';
      text.style.position = 'relative';
      text.style.display = 'block';
      text.style.width = '100%';
      text.style.textAlign = 'center';
      text.style.color = '#aaaaaa';
      text.classList.add('select-option');
      text.style.cursor = 'pointer';
      $ctrl.domList.appendChild(text);

      var domText = document.createElement('SPAN');
      domText.innerText = obj.text || '*untitled';

      var img = document.createElement('IMG');

      img.src = obj.src || obj.path || "NONE";
      img.style.display = 'block';
      img.style.position = 'relative';

      img.style.width = "25%";
      img.style.height = 'auto';
      img.style.marginLeft = '4px';
      img.style.display = 'block';
      img.style.textAlign = 'center';
      img.style.marginLeft = '35%';

      text.appendChild(domText);
      text.appendChild(img);

      text.onclick = function() {
        $ctrl.Value(this.innerText, img.src);
        $ctrl.domList.style.display = 'none';
        $ctrl.showingCount -= 1;
      };

    });

  }

}


class UserHint extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.style.fontSize = '12px';
    this.domButton = document.createElement('BUTTON');
    this.domButton.style.position = "relative";
    this.domButton.style.cursor = 'pointer';
    this.domButton.style.color = '#dddddd';
    this.domButton.style.display = 'inline-block';
    this.domButton.style.border = '1px solid #555555';
    this.domButton.style.background = "#111111";
    this.domButton.style.marginLeft = "12px";
    this.domButton.innerText = "?";
    this.parentElement.appendChild(this.domButton);
  }

}

customElements.define('arrow-color-input', ArrowColorInput);
customElements.define('arrow-flex-buttons', ArrowFlexButtons);
customElements.define('arrow-button-group', ArrowButtonGroup);
customElements.define('user-hint', UserHint);
customElements.define('arrow-select', ArrowSelect);
customElements.define('image-select', ImageResourceSelect);


if (typeof module == 'object') {
  module.exports = Arrow;
}