// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function TimerRegistery() {

    this.timers = {};

    this.anonTimers = [];
    this.deadAnonTimers = [];

}

TimerRegistery.prototype = {

    update: function (context) {

        for (var id in this.timers) {

            var timer = this.timers[id];

            this.processTimer(context, timer);

            if (timer.time <= 0) {

                delete this.timers[id];

                timer.callback(context);

            }

        }

        for (var i = 0; i < this.anonTimers.length; i++) {

            var timer = this.anonTimers[i];

            this.processTimer(context, timer);

            if (timer.time <= 0) {

                this.deadAnonTimers.push(timer);

                timer.callback(context);

            }

        }

        while (this.deadAnonTimers.length > 0) {

            var deadTimer = this.deadAnonTimers.pop();

            var i = this.anonTimers.indexOf(deadTimer);

            this.anonTimers.splice(i, 1);

        }

    },

    processTimer: function (context, timer) {

        timer.time -= context.timeStep;

        if (timer.func) {

            timer.func(context, timer.time);

        }

    },

    addFunction: function (id, time, func, callback) {

        this.timers[id] = { time: time, func: func, callback: callback };

    },

    add: function (id, time, callback) {

        this.timers[id] = { time: time, callback: callback };

    },

    addAnon: function (time, callback) {

        this.anonTimers.push( { time: time, callback: callback } );

    },

    remove: function (id) {

        delete this.timers[id];

    }

};
