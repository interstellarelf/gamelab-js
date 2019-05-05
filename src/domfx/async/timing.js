function repeat(callback, duration) {

  callback();

  var next = function() {
    repeat(callback, duration)
  };

  setTimeout(next, duration);
};


function call(callback) {
  callback();
};

function delay(callback, delay) {
  return setTimeout(callback, delay);
};
