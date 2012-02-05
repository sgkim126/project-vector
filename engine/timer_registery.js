// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function TimerRegistery() {

    this.timers = {};

}

TimerRegistery.prototype = {

    update: function (context) {

        for (var id in this.timers) {

            var timer = this.timers[id];

            timer.time -= context.timeStep;

            if (timer.func) {

                timer.func(context, timer.time);

            }

            if (timer.time <= 0) {

                delete this.timers[id];

                timer.callback(context);

            }

        }

    },

    addFunction: function (id, time, func, callback) {

        this.timers[id] = { time: time, func: func, callback: callback };

    },

    add: function (id, time, callback) {

        this.timers[id] = { time: time, callback: callback };

    },

    remove: function (id) {

        delete this.timers[id];

    }

};
