// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//
'use strict';
var tickEvent = {
    type: 'tick'
};

function Engine() {

    this.levels = {};

    this.queuedLevel = null;
    this.currentLevel = null;

    this.fpsArray = [];
    this.lastTime = new Date().getTime();

}

Engine.prototype = {

    initalise: function(context, resourceList, callback) {

        context.engine = this;

        this.createEventsAndTimers(context);

        context.menuEvents = new function() {

            this.prototype += Object.extend(this, new EventDispatcher());

        }

        context.vec2Pool = new ObjectPool(box2d.Vec2);

        context.mat33Pool = new ObjectPool(box2d.Mat33);

        context.camera = new Camera(context);

        context.assetManager = new AssetManager();

        context.menuTimerRegistery = new TimerRegistery();

        this.loadResources(context, resourceList, function () {

            callback();

        });

    },

    createEventsAndTimers: function (context) {

        context.events = new function() {

            this.prototype += Object.extend(this, new EventDispatcher());

        }

        context.timerRegistery = new TimerRegistery();

    },

    loadResources: function (context, resourceList, callback) {

        var assetManager = context.assetManager;

        assetManager.queueDownloads(resourceList);

        assetManager.addEventListener('error', function(event) {

            alert(event.data);

        });

        assetManager.downloadAll(context, function() {

            callback();

        });

    },

    addLevel: function(id, levelClass) {

        this.levels[id] = levelClass;

    },

    setLevel: function(id, context) {

        this.queuedLevel = new this.levels[id](context);

    },

    destroyLevel: function(context) {

        this.createEventsAndTimers(context);

        this.currentLevel.destroy();

        this.currentLevel = null;

        context.paused = true;

    },

    start: function(context, game) {

        var that = this;

        context.game = game;

        game.initalize(context);

        context.step = function() {

            that.step(context, game);

        };

        context.render = function () {

            that.render(context, game);

        };

        context.step();

        context.render();

    },

    step: function(context, game) {

        var d1 = new Date();
        var startTime = d1.getTime();

        var events = context.events;
        var menuEvents = context.menuEvents;

        var timerRegistery = context.timerRegistery;

        var menuTimerRegistery = context.menuTimerRegistery;

        var stepping = false;

        if (this.queuedLevel) {

            this.queuedLevel.initalize(context);
            this.currentLevel = this.queuedLevel;
            this.queuedLevel = null;

        }

        game.updateUI(context);

        menuTimerRegistery.update(context);

        menuEvents.dispatchEvent(tickEvent);

        if (!context.paused) {

            game.update(context);

            this.currentLevel.update(context);

            timerRegistery.update(context);

            events.dispatchEvent(tickEvent);

        }

        var d2 = new Date();
        var totalTime = d2.getTime() - startTime;

        var timeStepMillis = Math.floor(context.timeStep * 1000);

        setTimeout(context.step, timeStepMillis - totalTime);

    },

    render: function (context, game) {

        //var d1 = new Date();
        //var startTime = d1.getTime();

        window.requestAnimationFrame( context.render );

        this.draw(context, game);

        var d2 = new Date();
        var totalTime = d2.getTime() - this.lastTime;
        this.lastTime = d2.getTime();

        this.fpsArray.push(totalTime);

        if (this.fpsArray.length > 120) {
            
            this.fpsArray.shift();

            var averageFps = 0;

            for (var i = 0; i < this.fpsArray.length; i++) {
                
                averageFps += this.fpsArray[i];

            }

            averageFps /= this.fpsArray.length;

            averageFps /= 1000;

            averageFps /= (1/60);

            averageFps = (1/averageFps);

            averageFps *= 60;

            console.log(averageFps);
        }

    },

    draw: function (context, game) {

        game.renderUI(context);

    },

    renderLevel: function (context) {

        if (this.currentLevel) {

            this.currentLevel.render(context);

        }

    },

}
