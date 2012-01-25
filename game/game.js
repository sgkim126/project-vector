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

        this.buildUI(context, this.rootUIDisplayNode);

        engine.addLevel('GeomWars', new GeomWarsLevel());

    },

    buildUI: function (context, root) {

        var background = new UIBackground();

        var level = new UILevel();

        var toggle0 = new UIToggle(context);
        toggle0.x = 0.05; toggle0.y = 0.05;

        var toggle1 = new UIToggle(context);
        toggle1.x = 0.05; toggle1.y = 0.15;
 
        var elephant0 = new UIElephant(context, toggle0);

        var transformer0 = new UITransformer(context);

        root.addChild(background);

        root.addChild(level);

        root.addChild(toggle0);

        root.addChild(toggle1);

        root.addChild(elephant0);

        elephant0.addChild(transformer0);

        elephant0.child = transformer0;

        transformer0.parent = elephant0;

        toggle1.addEventListener('toggle', function (e) {

            var level = context.engine.currentLevel;

            if (!level) return;

            if (e.data == 'OFF') {

                level.world.m_gravity = new box2d.Vec2(0, 0);

            }

            else {

                level.world.m_gravity = new box2d.Vec2(0, 300);

            }

        });

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
