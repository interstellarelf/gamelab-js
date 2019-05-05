/**************************
 *
 **************************/
var DomFx = {
  Tag(tagName) {
    return document.createElement(tagName);
  },

  create_id: function() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
};
