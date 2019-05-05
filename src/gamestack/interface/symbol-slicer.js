
class SymbolSlicer
{
    constructor(classInstance)
    {

        this.instance = classInstance;

    }
    on(symbol, callback)
    {
      var syms = Object.getOwnPropertySymbols(this.instance);

        syms.forEach(function(s){

              if(symbol == s)
              callback();

        });
    }

}
