let Logger = {

        options: {

            error: true,

            info: true,

            warning: true

        },

        log: function (message) {


        },

        interlog: function (message, loopDuration) {


        },

        info: function (message) {


        },

        warning: function (message) {


        },

        error: function (message) {


        }
    }
;


let E = function(msg, halt){ //basic Error
    console.error(msg);
};

let L = function(str1, str2){
    console.log(str1, str2);
};

let I = function(str1, str2){
    console.info(str1, str2);
};

let R = function(obj, callback){
    for(var x in obj)
    {
        callback(obj[x]);
    }

  };
