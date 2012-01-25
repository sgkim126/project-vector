// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.World');
goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');

function Game() {

    this.rootUIDisplayNode = new DisplayNode();

    this.buildUI = function (context, root) {

        var toggle0 = new UIToggle(context);
        toggle0.x = 0.05;
        toggle0.y = 0.05;
        root.addChild(toggle0, root);

        var toggle1 = new UIToggle(context);
        toggle1.x = 0.05;
        toggle1.y = 0.15;
        root.addChild(toggle1, root);

        var elephant0 = new UIElephant(context, toggle0);
        var transformer0 = new UITransformer(context);

        elephant0.child = transformer0;
        transformer0.parent = elephant0;

        root.addChild(elephant0);

        elephant0.addChild(transformer0);

        toggle1.addEventListener('toggle', function (e) {

            if (e.data == 'OFF') {
                context.engine.currentLevel.world.m_gravity = new box2d.Vec2(0, 0);
            }

            else {
                context.engine.currentLevel.world.m_gravity = new box2d.Vec2(0, 300);
            }

        });

    };

}

Game.prototype = {

    initalize: function (context) {

        var engine = context.engine;

        context.controls = new Controls(context);

        this.buildUI(context, this.rootUIDisplayNode);

        engine.addLevel('GeomWars', new GeomWarsLevel());

    },

    startGame: function (context) {

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

    render: function (context) {

        var engine = context.engine;

        engine.renderLevel(context);

    },

    renderUI: function (context) {

        this.rootUIDisplayNode.render(context);

    }

};
