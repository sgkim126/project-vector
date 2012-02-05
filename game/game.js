// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.World');
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');

function Game() {

    this.rootUIDisplayNode = new DisplayNode();

}

Game.prototype = {

    initalize: function (context) {

        var engine = context.engine;

        context.controls = new Controls(context);

        engine.addLevel('GeomWars', new GeomWarsLevel(context));

        this.buildUI(context, this.rootUIDisplayNode);

    },

    buildUI: function (context, root) {

        var that = this;

        var background = new UIBackground();

        var level = new UILevel();

        var title = new UIBasic(context, 'title');
        title.x = 0.5; title.y = 0.25;

        var toggle0 = new UIToggle(context);
        toggle0.x = 0.82; toggle0.y = 0.475;

        var controlsContainer = new DisplayContainer();
        controlsContainer.y = 1;

        var hudContainer = new DisplayContainer();
        hudContainer.alpha = 0;

        var playButton = new UIButton(context, 'btn_play_up', 'btn_play_down', function () {

            playButton.disableClick();

            var titleAlphaOut = new Tween(events, title, 'alpha', Tween.regularEaseIn, 1, 0, 1);

            var controlsSlideOut = new Tween(events, controlsContainer, 'y', Tween.regularEaseIn, 0, 1, 1);

            controlsSlideOut.addEventListener('onMotionFinished', function(e) {

                var backgroundAlphaOut = new Tween(events, background, 'alpha', Tween.regularEaseIn, 1, 0, 0.5);

                backgroundAlphaOut.start();

                var hudAlphaIn = new Tween(events, hudContainer, 'alpha', Tween.regularEaseIn, 0, 1, 0.5);

                hudAlphaIn.start();

                context.score = 0;

                that.startGame(context);

            });

            controlsSlideOut.start();

            titleAlphaOut.start();

        });

        playButton.x = 0.5; playButton.y = 0.5;

        root.addChild(level);

        root.addChild(hudContainer);

        var score = new UIScore(context);
        score.x = 0.05; score.y = 0.05; score.scale = 0.75;

        hudContainer.addChild(score);

        if (!context.startMenu) {

            that.startGame(context);

            return;

        }

        root.addChild(background);

        root.addChild(title);

        root.addChild(controlsContainer);

        controlsContainer.addChild(toggle0);

        controlsContainer.addChild(playButton);

        var events = context.menuEvents;

        var backgroundAlphaIn = new Tween(events, background, 'alpha', Tween.regularEaseOut, 0, 1, 1.5);

        var titleAlphaIn = new Tween(events, title, 'alpha', Tween.regularEaseOut, 0, 1, 1);

        var titleScaleIn = new Tween(events, title, 'scale', Tween.regularEaseOut, 3, 1, 1);

        titleAlphaIn.addEventListener('onMotionFinished', function(e) {

            var controlsSlideIn = new Tween(events, controlsContainer, 'y', Tween.regularEaseOut, 1, 0, 1);

            controlsSlideIn.addEventListener('onMotionFinished', function(e) {

                playButton.enableClick();

            });

            controlsSlideIn.start();

        });

        backgroundAlphaIn.start();

        titleAlphaIn.start();

        titleScaleIn.start();

    },

    startGame: function (context) {

        var engine = context.engine;

        engine.setLevel('GeomWars');

    },

    update: function (context) {

        var camera = context.camera;

        camera.update(context);

    },

    updateUI: function (context) {

        var controls = context.controls;

        controls.update(context);
        controls.updateEvents();

        this.rootUIDisplayNode.update(context);
        this.rootUIDisplayNode.traverse(context, 'ui');

    },

    renderUI: function (context) {

        this.rootUIDisplayNode.render(context);

    }

};
