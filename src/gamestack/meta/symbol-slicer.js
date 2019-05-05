
class SymbolSlicer
{
    constructor()
    {

        if (new.target === SymbolSlicer) {
          throw new TypeError("Cannot construct SymbolSlicer instance directly. Use a subclass instead.");
        }
    }
    on(object, symbol, callback)
    {
      var syms = Object.getOwnPropertySymbols(object);

        syms.forEach(function(s){

              if(Symbol.keyFor(symbol) == s)
              callback();

        });
    }
}
