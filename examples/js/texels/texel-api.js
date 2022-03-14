function matchValuesToArray(value, valueList) {

  return valueList.indexOf(value.toLowerCase().replace('-', '')) >= 0;

}


module.exports = function(texelMap, gameWindow) {

  var $data = texelMap.data;
  var ticker = 0;

  return {

    texelMap: texelMap,

    gameWindow: gameWindow,

    //check if boxes are populated as defined by vector --returns vector if true
    checkVectorValue: function(vector, value, ct) {

      ticker += 1;

      var fullSize = texelMap.size;

      var count = ct;

      var missedOne = false;

      var boxes = [];

      for (var y = 0; y < vector.y; y += 1) {
        for (var x = 0; x < vector.x; x += 1) {

          count = ct + (y * Math.ceil(fullSize.x / 40)) +
            x;

          boxes.push(count - 1);

          var indexVector = new Gamelab.Vector(x, y);
          var indexValue = this.indexToValue(ct);

          if (indexValue.toLowerCase().replace('-', '') ==
            value.toLowerCase().replace('-', '')) {

          } else {
            missedOne = true;
          }

        }
      }

      if (!missedOne) {
        let $module = this;
        //todo: remove each value
        boxes.forEach(function(boxValue) {

          //$module.remove(boxValue);

        });

        if (value == 'W-2') {
          console.log('FOUND W-2 with vector.x=' + indexVector.x + ':vector.y=' + indexVector.y);
        }

        //console.info('Found value / vector', indexVector, value);
      }
      return !missedOne ? new Gamelab.Vector(indexVector) : false;
    },

    remove: function(ct) {

      this.texelMap.data.texels.texels[ct] = 'x';

    },

    indexToValue: function(ct) {
      let index = 0,
        object = this.texelMap.data.texels.texels[ct];
      if (typeof object == 'object') {
        index = object.index;
      } else if (typeof object == 'number') {
        index = object;
      }
      return this.texelMap.sourceTexels[index].name;
    },

    search: function(values, vector, callback) {

      var ct = -1;

      ticker += 1;

      var fullSize = texelMap.size;

      var lastValue = 'xxx';


      let yix = 0;

      for (var y = 0; y < fullSize.y; y += 40) {
        for (var x = 0; x < fullSize.x; x += 40) {

          ct += 1;

          yix = Math.floor(y / 40);

          if (this.texelMap.data.texels.texels[ct] == 'x') {
            continue;
          }

          //x value --adjusted by yix * 40
          var pos = new Gamelab.Vector(x - (yix * 40), y);

          var value = this.indexToValue(ct);

          //if this value is new
          if (value !== '0' && matchValuesToArray(value, values)) {
            //test for the whole vector
            let vectorValue = this.checkVectorValue(vector, value, ct);
            if (vectorValue) {
              callback(pos, value);
            }
          }

          lastValue = value;

        }
      }


    },

    onTexels: function(matchValues, vector, getSprite) {


      this.search(matchValues, vector, function(position) {

        var sprite = getSprite();

        sprite.position.x = position.x;
        sprite.position.y = position.y;

        gameWindow.add(sprite);

      });

      //loop through entire texelMap for matchValues
      //test for match up to vectorSize
      //call getSprite and add to gameWindow at position

    }
  }

};
