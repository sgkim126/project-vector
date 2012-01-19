// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIToggle(context) {
    this.prototype += Object.extend(this, new DisplayNode());
    this.prototype += Object.extend(this, new EventDispatcher());

    this.context = context;
    var assetManager = context.assetManager;
    this.sprite = assetManager.getAsset('toggle_back');
    this.width = this.sprite.width;
    this.height = this.sprite.height;
    this.centerX = 0;
    this.centerY = 0;
    this.brightness = 0;
    this.scale = 1;

    var that = this;
    this.toggle = new UIBasic(context, 'toggle_slider');
    this.toggle.x = 0.024;
    this.toggle.y = 0.0258;
    this.addChild(this.toggle);
    this.toggle.slideOff = function (context) {
        var events = context.events;
        var xTween;
        if (that.status === 'ON') {
            xTween = new Tween(events, this, 'x', Tween.strongEaseOut, parseFloat(this.x), 0.084, 0.5);
        }
        else {
            xTween = new Tween(events, this, 'x', Tween.strongEaseOut, parseFloat(this.x), 0.025, 0.5);
        }
        xTween.addEventListener('onMotionFinished', function (e) {
            that.EnableClick();
        });
        xTween.start();
    }
    this.status = 'OFF';

    this.EnableClick();
}

UIToggle.prototype.EnableClick = function() {
    this.context.controls.addEventListener('end', this.Toggle, this);
};

UIToggle.prototype.Toggle = function(e, target) {
    if (engine.Collision.BoxPointTest(e.x, e.y, target.width, target.height, target.drawMatrix)) {
        if (target.status === 'OFF') {
            target.status = 'ON';
        }
        else {
            target.status = 'OFF';
        }
        var brightnessTween = new Tween(target.context.events, target, 'brightness', Tween.regularEaseOut, 0.75, 0, 0.5);
        brightnessTween.start();
        target.dispatchEvent({
            type: 'toggle',
            data: target.status
        });
        target.toggle.slideOff(target.context);
        target.context.controls.removeEventListener('end', target.testToggle, target);
    }
};

UIToggle.prototype.onUpdate = function(context) {
    this.matrix.SetIdentity();
    this.matrix.Translate(this.x, this.y);
    this.matrix.Scale(this.scale, this.scale);
};

UIToggle.prototype.onRender = function(context) {
    context.renderer.drawImage(context.camera, this.sprite, this.drawMatrix, this.brightness);
};
