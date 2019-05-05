



let CSSMath = {

  Number(value){
    return typeof value == 'string' ? parseFloat(value):
    typeof value == 'number' ? value :
    '0px';

    if(typeof value == 'number')
    return value;
  }

  Pixels(value){
    return typeof value == 'string' ? value:
    typeof value == 'number' ? value + 'px':
    '0px';
  }

  Portional_NumericString(portionFloat, total, string_suffix=''){
    return Math.round(dimen * float);
  }

};
