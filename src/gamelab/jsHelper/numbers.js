
//TODO: list the fxns needed for numbers only

let numbers = {

  getMinAndMaxByPair:function(a, b){

    if(!(a || b))
    return console.error('null or undefined args');

    if(typeof a == 'number' && !b)
    return {min:a, max:a}
    else if(a >= b)
    {
      return {
        min:b, max:a
      }
    }
    else
    {
      return {
        min:a, max:b
      }
    }
  }

};
