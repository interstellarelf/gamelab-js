/**
 * Creates a GravityForce instance.
 *
 *@param   {Object} args the object of arguments
 * @param   {string} args.name optional
 * @param   {string} args.description optional
 * @param   {Array} args.subjects the subjects to be pulled by the GravityForce
 * @param   {Array} args.clasticObjects any clastic object or array-of-objects that should have collision-stop behavior with subjects
 * @param   {Vector} args.max the max speed of the gravity-force, similar to concept of 'terminal velocity'
 * @param   {number} args.accel the increment of acceleration for each update called, while subjects are falling
 *
 * @returns {GravityForce} a GravityForce object
 */

(function () {
    console.log('Force class... creating');

    class GravityForce {
        constructor(args = {}) {
            this.name = args.name || "";

            this.description = args.description || "";

            this.subjects = args.subjects || [];

            this.clasticObjects = args.clasticObjects || [];

            this.topClastics = args.topClastics || [];

            this.max = args.max || new Vector3(3, 3, 3);
            this.accel = args.accel || new Vector3(1.3, 1.3, 1.3);


            for (var x in this.clasticObjects) {
                if (!this.clasticObjects[x] instanceof Gamestack.Sprite) {
                    this.clasticObjects[x] = Gamestack.getById(this.clasticObjects[x].id);
                }

            }


            for (var x in this.topClastics) {
                if (!this.topClastics[x] instanceof Gamestack.Sprite) {
                    this.topClastics[x] = Gamestack.getById(this.topClastics[x].id);
                }

            }


            for (var x in this.subjects) {
                if (!this.subjects[x] instanceof Gamestack.Sprite) {
                    this.subjects[x] = Gamestack.getById(this.subjects[x].id);
                }

            }

        }

        getArg(args, key, fallback) {

            if (args.hasOwnProperty(key)) {
                return args[key];
            }
            else {
                return fallback;

            }
        }


        /**
         * Updates position for all objects effected by this instance.
         * @memberof GravityForce
         */

        update() {

            var subjects = this.subjects;

            var clasticObjects = this.clasticObjects;

            var topClastics = this.topClastics;

            var accel = this.accel || {};

            var max = this.max || {};

            Gamestack.each(subjects, function (ix, itemx) {

                if(!itemx.jumping && !itemx.flying)
                itemx.accelY(accel, max);

                itemx.__inAir = true;


                if (itemx.position.y >= itemx.groundMaxY) {


                    itemx.position.y = itemx.groundMaxY;

                }

                itemx.groundMaxY = 3000000; //some crazy number you'll never reach in-game

                Gamestack.each(topClastics, function (iy, itemy) {

                //    itemx.collide_stop_top(itemy);

                });

            });
        }
    };

    let Force = GravityForce;

    Gamestack.Force = Force;

    Gamestack.GForce = Force;

    Gamestack.GravityForce = GravityForce;

})();
