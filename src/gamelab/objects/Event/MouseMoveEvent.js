class MouseMoveEvent {
  constructor(callback) {
    callback = callback || function(x, y) {};

    this.Callback(callback);
  }
  Callback(cb) {
    Gamelab.InputSystem.extend('mousemove', function(x, y) {

      cb(x, y);

    });
  }
};

Gamelab.MouseMoveEvent = MouseMoveEvent;