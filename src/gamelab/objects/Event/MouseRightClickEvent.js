class MouseRightClickEvent {
  constructor(callback) {
    callback = callback || function(x, y) {};

    this.Callback(callback);
  }
  Callback(cb) {
    Gamelab.InputSystem.extend('rightclick', function(x, y) {
      cb(x, y);
    });
  }
};

Gamelab.MouseRightClickEvent = MouseRightClickEvent;