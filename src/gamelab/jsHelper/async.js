//Simplified expressions for setTimeout and setInterval
let delay = (fxn, timing) => {
  setTimeout(fxn, timing);
};

let repeat = (fxn, timing) => {
  setInterval(fxn, timing);
};
