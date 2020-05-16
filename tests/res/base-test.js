

var MyTest = {

  call:function(){
    var value = 'string'.indexOf('g');
    console.log('got value::' + value);
    return value;
  }

};


describe('test', function () {
    describe('#call()', function () {
        it('should return numeric value', function () {
            var value = MyTest.call();
            assert.equal(value >= 0, true);
        });
    });
});
