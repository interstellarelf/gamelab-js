

function CreateGamestack()
{
    return Gamestack;
}


// UMD (Universal Module Definition)
(function (root) {

    if (typeof define === 'function' && define.amd) {

        // AMD
        define([], function () {
            return Gamestack;
        });

    } else if (typeof module !== 'undefined' && typeof exports === 'object') {

        // Node.js
        module.exports = Gamestack;

    } else if (root !== undefined) {

        // Global variable
        root.Gamestack = Gamestack;

    }

})(this);
