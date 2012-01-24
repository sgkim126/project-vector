// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.Mat22');
goog.require('box2d.Math');
goog.require('box2d.Vec2');

function UIElephant(context, controller) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;

    var assetManager = context.assetManager;

    this.sprite = assetManager.getAsset('elephant');

    this.centerX = -this.sprite.width / 2;
    this.centerY = -this.sprite.height / 2;

    this.counter = 0;
    this.scale = 0.5;

    this.x = 0.5;
    this.y = 0.5;

    this.rotation = 0;
    this.alpha = 0;

    controller.addEventListener('toggle', function (e, target) {

        var events = target.context.menuEvents;

        if (e.data === 'ON') {

            var alphaTween = new Tween(events, target, 'alpha', Tween.regularEaseIn, 0, 1, 0.5);
            alphaTween.start();

        }

        else {

            var alphaTween = new Tween(events, target, 'alpha', Tween.regularEaseIn, 1, 0, 0.5);
            alphaTween.start();

        }

    }, this);

}

UIElephant.prototype = {

    testAnimation: function(context) {

        var that = this;

        var events = context.menuEvents;

        var sc = parseFloat(this.scale);
        var xx = parseFloat(this.x);
        var yy = parseFloat(this.y);
        var rr = parseFloat(this.rotation);

        var rx = (Math.random() * 0.5) + 0.25;
        var ry = (Math.random() * 0.5) + 0.1;
        var r = Math.random() * Math.PI * 2;
        var s = (Math.random() * 0.5) + 0.5;

        var tsc = new Tween(events, this, 'scale', Tween.regularEaseOut, sc, s, 1);
        var tx = new Tween(events, this, 'x', Tween.regularEaseOut, xx, rx, 1);
        var ty = new Tween(events, this, 'y', Tween.regularEaseOut, yy, ry, 1);
        var tr = new Tween(events, this, 'rotation', Tween.regularEaseOut, rr, r, 1);
        
        tsc.addEventListener('onMotionFinished', function(e) {
            that.child.enableClick();
        });

        tsc.start();
        tx.start();
        ty.start();
        tr.start();

    },

    onUpdate: function (context) {

        var mat33Pool = context.mat33Pool;
        var m0 = mat33Pool.create();
        var m1 = mat33Pool.create();

        m0.SetRotation(this.rotation);
        m1.Scale(this.scale, this.scale);
        m1.Translate(this.x, this.y);

        box2d.Math.b2MulM33M33(m1, m0, this.matrix);

        mat33Pool.release(m0);
        mat33Pool.release(m1);

    },

    onRender: function (context) {

        context.renderer.drawImage(context.camera, this.sprite, this.drawMatrix, 0, this.drawAlpha);

    }
}
