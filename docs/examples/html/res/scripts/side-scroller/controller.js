

var module = module || {};

module.exports = function(object){

var Controller = object.Controller = {

  constant: {

    button_0: {
      pressed: false
    }

  },

  stick_left: {
    x: 0,
    y: 0
  },

  button_0: {
    pressed: false,
    timer: 0
  },

  button_1: {
    pressed: false,
    timer: 0
  },

  button_2: {
    pressed: false,
    timer: 0
  },

  button_3: {
    pressed: false,
    timer: 0
  },

  isPressed:function(key){

    return this[key].pressed;

  },

  press:function(key, pressed){

      if ((!Controller.constant[key].pressed && pressed) || (Controller.constant[key].pressed && !pressed)) {
        Controller.constant[key].pressed = pressed;

        if (Controller.constant[key].pressed)
        {
            Controller[key].timer = 0;
        }

        Controller[key].pressed = pressed;  

      }


      if(pressed)
      {

      Controller[key].timer += 1;

      if(Controller[key].timer > 4)
      {
        Controller.constant[key].pressed = false;
        Controller[key].pressed = false;
      }

      }

      Controller.constant[key].pressed = pressed;

  }


};


};
