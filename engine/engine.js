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

        context.events = new function() {

            this.prototype += Object.extend(this, new EventDispatcher());

        }

        context.vec2Pool = new ObjectPool(box2d.Vec2);

        context.mat33Pool = new ObjectPool(box2d.Mat33);

        context.camera = new Camera(context);

        context.assetManager = new AssetManager();

        context.timerRegistery = new TimerRegistery();

        this.loadResources(context, resourceList, function () {

            callback();

        });

    },

    loadResources: function (context, resourceList, callback) {

        var assetManager = context.assetManager;

        $j.get(resourceList, function(data) {

            assetManager.queueDownloads(JSON.parse(data));

            assetManager.addEventListener('error', function(event) {

                alert(event.data);

            });

            assetManager.downloadAll(function() {

                callback();

            });

        });

    },

    addLevel: function(id, level) {

        this.levels[id] = level;

    },

    setLevel: function(id) {

        this.queuedLevel = this.levels[id];

    },

    start: function(context, game) {

        var that = this;

        game.initalize(context);

        context.step = function() {

            that.step(context, game);

        };

        context.step();

    },

    step: function(context, game) {

        var events = context.events;
        var timerRegistery = context.timerRegistery;

        var stepping = false;

        if (this.queuedLevel) {

            this.queuedLevel.initalize(context);
            this.currentLevel = this.queuedLevel;
            this.queuedLevel = null;

        }

        game.update(context);

        this.currentLevel.update(context);

        timerRegistery.update(context);

        events.dispatchEvent(tickEvent);

        this.render(context, game);

        // FIXME: use context timestep
        setTimeout(context.step, 10);

    },

    render: function (context, game) {

        game.render(context);

        game.renderUI(context);

    },

    renderLevel: function (context) {

        this.currentLevel.render(context);

    },

}
