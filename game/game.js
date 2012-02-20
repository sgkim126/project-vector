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

        engine.addLevel('GeomWars', GeomWarsLevel);

        this.buildUI(context, this.rootUIDisplayNode);

    },

    buildUI: function (context, root) {

        var that = this;

        var background = new UIBackground();

        var level = new UILevel();

        var events = context.menuEvents;

        var title = new UIBasic(context, 'title');
        title.x = 0.5; title.y = 0.25;

        context.highScore = 0;

        if (localStorage['highScore'] !== undefined) {

            context.highScore = localStorage['highScore'];

        }

        var highScoreText = new UIString(context, null, null, 'High Score', 'bold 20pt Arial', '#FFFFFF', true, 6);
        highScoreText.x = 0.39; highScoreText.y = 0.35;
        highScoreText.strokeColor = '#3297FC';
        highScoreText.blur = 6;
        highScoreText.alpha = 0;

        var highScore = new UINumber(context, context, 'highScore');
        highScore.x = 0.5; highScore.y = 0.4;
        highScore.center = true;
        highScore.alpha = 0;

        var toggle0 = new UIToggle(context);
        toggle0.x = 1; toggle0.y = 0.475;

        var controlsContainer = new DisplayContainer();
        controlsContainer.y = 1;

        var hudContainer = new DisplayContainer();
        hudContainer.alpha = 0;

        this.gameOver = function() {

            that.showTitle(context, title, background, playButton, highScore, highScoreText, toggle0, function() {

                that.endGame(context);

            });

        }

        var quitButton = new UIButton(context, 'btn_quit', 'btn_quit', function () {

            pauseButton.disableClick();

            var x = parseFloat(quitButton.x);

            var quitSlideOut = new Tween(events, quitButton, 'x', Tween.regularEaseIn, x, -0.06, 0.33);

            quitSlideOut.start();

            that.gameOver();

        });

        var pauseButton = new UIButton(context, 'btn_pause_up', 'btn_pause_down', function () {

            context.paused = !context.paused;

            if (context.paused) {

                var x = parseFloat(quitButton.x);

                var quitSlideIn = new Tween(events, quitButton, 'x', Tween.regularEaseIn, x, 0.06, 0.33);

                quitSlideIn.start();

            } else {

                var x = parseFloat(quitButton.x);

                var quitSlideOut = new Tween(events, quitButton, 'x', Tween.regularEaseIn, x, -0.06, 0.33);

                quitSlideOut.start();

            }

        });

        pauseButton.x = 0.95; pauseButton.y = 0.05;

        quitButton.x = -0.06; quitButton.y = 0.54; quitButton.scale = 0.2;

        var playButton = new UIButton(context, 'btn_play_up', 'btn_play_down', function () {

            playButton.disableClick();

            var titleAlphaOut = new Tween(events, title, 'alpha', Tween.regularEaseIn, 1, 0, 1);

            var playButtonAlphaOut = new Tween(events, playButton, 'alpha', Tween.regularEaseIn, 1, 0, 1);

            var highScoreAlphaOut = new Tween(events, highScore, 'alpha', Tween.regularEaseIn, 1, 0, 1);

            var highScoreTextAlphaOut = new Tween(events, highScoreText, 'alpha', Tween.regularEaseIn, 1, 0, 1);

            var toggleSlideOut = new Tween(events, toggle0, 'x', Tween.regularEaseIn, 0.82, 1, 1);

            playButtonAlphaOut.addEventListener('onMotionFinished', function(e) {

                var backgroundAlphaOut = new Tween(events, background, 'alpha', Tween.regularEaseIn, 1, 0, 0.5);

                backgroundAlphaOut.start();

                var hudAlphaIn = new Tween(events, hudContainer, 'alpha', Tween.regularEaseIn, 0, 1, 0.5);

                hudAlphaIn.start();

                context.score = 0;

                that.startGame(context);

                pauseButton.enableClick();

                quitButton.enableClick();

            });

            highScoreAlphaOut.start();

            highScoreTextAlphaOut.start();

            toggleSlideOut.start();

            playButtonAlphaOut.start();

            titleAlphaOut.start();

        });

        playButton.x = 0.5; playButton.y = 0.5;
        playButton.alpha = 0;

        root.addChild(level);

        root.addChild(hudContainer);

        var score = new UIString(context, context, 'score', 'Score : ', 'bold 15pt Arial', '#FFFFFF', true, 0);
        score.x = 0.02; score.y = 0.05;
        score.strokeColor = '#ffe138';
        score.blur = 6;

        var timer = new UIString(context, context, 'timer', 'Time : ', '13pt Arial', '#FFFFFF', true, 0);
        timer.x = 0.02; timer.y = 0.09;
        timer.strokeColor = '#719d6f';
        timer.blur = 6;


        var fps = new UIString(context, context, 'fps', 'fps : ', 'bold 15pt Arial', '#FFFFFF', true, 6);
        fps.x = 0.45; fps.y = 0.05;
        fps.strokeColor = '#276ba9';
        fps.blur = 6;

        hudContainer.addChild(score);

        hudContainer.addChild(timer);

        hudContainer.addChild(fps);

        hudContainer.addChild(pauseButton);

        hudContainer.addChild(quitButton);

        if (!context.startMenu) {

            that.startGame(context);

            return;

        }



        root.addChild(background);

        root.addChild(title);

        root.addChild(highScoreText);

        root.addChild(highScore);

        root.addChild(toggle0);

        root.addChild(playButton);

        this.showTitle(context, title, background,  playButton, highScore, highScoreText, toggle0, null);
    },

    showTitle: function (context, title, background, playButton, highScore, highScoreText, toggle0, ready) {

        var events = context.menuEvents;

        var backgroundAlphaIn = new Tween(events, background, 'alpha', Tween.regularEaseOut, 0, 1, 1.5);

        var titleAlphaIn = new Tween(events, title, 'alpha', Tween.regularEaseOut, 0, 1, 1);

        var titleScaleIn = new Tween(events, title, 'scale', Tween.regularEaseOut, 3, 1, 1);

        titleAlphaIn.addEventListener('onMotionFinished', function(e) {

            if (ready) {

                ready();

            }

            var playButtonAlphaIn = new Tween(events, playButton, 'alpha', Tween.regularEaseOut, 0, 1, 1);

            playButtonAlphaIn.start();

            var toggleSlideIn = new Tween(events, toggle0, 'x', Tween.regularEaseOut, 1, 0.82, 1);

            var highScoreAlphaIn = new Tween(events, highScore, 'alpha', Tween.regularEaseOut, 0, 1, 1);

            var highScoreTextAlphaIn = new Tween(events, highScoreText, 'alpha', Tween.regularEaseOut, 0, 1, 1);

            highScoreAlphaIn.addEventListener('onMotionFinished', function(e) {

                playButton.enableClick();

            });

            highScoreAlphaIn.start();

            highScoreTextAlphaIn.start();

            toggleSlideIn.start();

        });



        backgroundAlphaIn.start();

        titleAlphaIn.start();

        titleScaleIn.start();

    },

    startGame: function (context) {

        var engine = context.engine;

        engine.setLevel('GeomWars', context);

    },

    endGame: function (context) {

        var engine = context.engine;

        engine.destroyLevel(context);

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
