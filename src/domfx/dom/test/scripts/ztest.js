
var Zt = function(object) {

  WebTest:function(parent_tag, child_tag){

  this.__should = undefined;

    var $object = this;

    this.should = function(v){
        this.__should = ':should --' + v;
        return this;
    };

    this.prove = function(condition){
      if(!condition())
      {
        alert('1 test failed');
      }
      else{
        alert('condition was true');
      }

      return this;
    };

  },

  allType:function(){

  },

  isType:function(){

  },

  equals:function(){

  }

};
