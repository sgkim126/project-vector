// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('engine.Collision');

function UITransformer(context) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;

    var assetManager = context.assetManager;

    this.sprite = assetManager.getAsset('transformer');

    this.width = this.sprite.width;
    this.height = this.sprite.height

    this.centerX = -this.width / 2;
    this.centerY = -this.height / 2;

    this.counter = 0;

    this.scale = 0.35;

    this.brightness = 0;

    this.enableClick();
}

UITransformer.prototype = {

    enableClick: function() {

        this.context.controls.addEventListener('end', this.animateParent, this);

    },

    animateParent: function(e, target) {

        var hit = engine.Collision.BoxPointTest(e.x, e.y, target.width, target.height, target.drawMatrix);

        if (hit && target.parent.drawAlpha > 0.1) {

            target.testAnimation(target.context);
            target.parent.testAnimation(target.context);
            target.context.controls.removeEventListener('end', target.animateParent, target);

        }

    },

    onUpdate: function(context) {

        this.matrix.SetIdentity();
        this.matrix.Scale(this.scale, this.scale);
        this.matrix.Translate(0.1, -0.12);

    },

    onRender: function(context) {

        var renderer = context.renderer;

        renderer.drawImage(context.camera, this.sprite, this.drawMatrix, this.brightness, this.drawAlpha);

    },

    testAnimation: function(context) {

        var events = context.menuEvents;

        var tsc = new Tween(events, this, 'scale', Tween.bounceEaseOut, 0.45, 0.35, 0.5);
        var tbr = new Tween(events, this, 'brightness', Tween.regularEaseIn, 1, 0, 0.5);

        tsc.start();
        tbr.start();

    }

};
