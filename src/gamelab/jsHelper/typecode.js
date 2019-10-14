let TypeCode = {

  DEV:false,

  //Display message in console
  info: function(arg1, arg2) {

    if(!this.DEV)
    return;

    console.info(arg1, arg2);

  },

  log:function(arg1, arg2){

    if(!this.DEV)
    return;

      console.log(arg1, arg2);

  },

  /* ERRORS always show */
  error:function(arg1, arg2){

    if(!this.DEV)
    return;

      console.error(arg1, arg2);

  },


  warn:function(arg1, arg2){

    if(!this.DEV)
    return;

      console.error(arg1, arg2);

  },

  //obj is number or becomes fallback
  number: function(number, fallback = 0) {

    number = typeof(number) == 'number' ? number : fallback;

  },

  //obj is string or becomes fallback
  string: function(string, fallback) {

    string = typeof(string) == 'string' ? string : fallback;

  },

  //obj is Array or becomes wrapped in [] as [obj]
  arrayWrap: function(obj) {
    if (obj instanceof Array)
      return obj;
    else
      return [obj];
  },

  //obj or array-of-objects are ALL truthy (return=true) or not (return=false)
  allDefined: function(obj_all) {

    var list = this.arrayWrap(obj_all);

    var failed = false;

    for (var x in list) {
      if (!list[x]) {
        failed = true;
        console.error('Failed to define @ TypeCode.Define()');
      }
    };

    return !failed;
  },

  //getPreferredPropertyByKey(): uses the property[key] if present, if not returns same property passed in
  getPreferredPropertyByKey:function(property, key, warning){

    if(property.hasOwnProperty(key))
    {
      this.warn(warning);
      return property[key];
    }

    else {
      return property;
    }
  },

  //obj's are all of type or return false
  psuedoTypeCheck: function(obj, psuedotype = [], throwing = false) //obj is type or is encapsulated into type
  {
    var list = this.arrayWrap(obj);

    for (var x in list) {
      if (typeof(list[x]) !== psuedotype && !(list[x] instanceof psuedotype)) {
        if (!throwing)
          return console.error(error);
        else
          throw new console.error(error);
      }
    }

    return true;
  },

  getAllFuncs: function(obj) {

    return Object.getOwnPropertyNames(obj).filter(function (p) {
        return typeof obj[p] === 'function';
    });

  },

  getProtoFuncs: function(obj) {

    return Object.getOwnPropertyNames(obj.__proto__).filter(function (p) {
        return typeof obj[p] === 'function';
    });

  },

  truthOrDie:function(list, exitMessage) //All members of Array are truthy or the program exits with Error()
  {
    function findError(obj, error) {
      return obj || new Error(error)
    };

    for (var x in list) {

        let e = findError(list[x], exitMessage);

        if (e instanceof Error) {
            console.Error(e);
        }
      };
  },

  truthyPropsPerArray: function(obj, propKeys, kill) {

    var list = this.arrayWrap(obj),
      keys = this.arrayWrap(propKeys);

    let error = "The required truthy property has non-truthy value.";

    function findError(obj, prop) {
      return obj[prop] || new Error(error)
    };

    var failed = false;

    for (var x in list) {
      for (var y in keys) {
        let e = findError(list[x], keys[y]);
        if (e instanceof Error) {
          failed = true;
          if (kill)
            throw e;
          else
            console.error(e);
        }
      }
    }

    return !failed;
  },

  typeArgsExtract: function(obj, type) //obj is type or is each-converted into type
  {
    if (obj instanceof type) {
      return obj;
    } else {
      obj = [obj];
    }
    return obj;
  },

  typeOrHalt: function(obj, type) //obj is type or error is thrown
  {
    if (obj instanceof type) {
      return obj;
    } else {
      throw new Error('object not of required type');
      console.info(obj);
      console.info(type + "?");
    }
    return obj;
  },

  typeOrError: function(obj, type) //obj is type or error is logged, execution continues
  {
    if (obj instanceof type) {
      return obj;
    } else {
      console.log(new Error('object not of required type'));
      console.info(obj);
      console.info(type + "?");
    }
    return obj;
  },

  check:function(object, propKey, propValue)
  {
    if(!object[propKey])
    {
       object[propKey] = propValue;
    }
  }
};
