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

        var timeStepMillis = Math.floor(context.timeStep * 1000);

        setTimeout(context.step, timeStepMillis);

    },

    render: function (context, game) {

        window.requestAnimationFrame( context.render );

        this.draw(context, game);

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
