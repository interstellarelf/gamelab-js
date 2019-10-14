

function CreateGamelab()
{
    return Gamelab;
}


// UMD (Universal Module Definition)
(function (root) {

    if (typeof define === 'function' && define.amd) {

        // AMD
        define([], function () {
            return Gamelab;
        });

    } else if (typeof module !== 'undefined' && typeof exports === 'object') {

        // Node.js
        module.exports = Gamelab;

    } else if (root !== undefined) {

        // Global variable
        root.Gamelab = Gamelab;

    }

})(this);
