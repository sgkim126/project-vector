// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIButton(context, upSpriteId, downSpriteId, clickEvent) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;

    var assetManager = context.assetManager;

    this.upSprite = assetManager.getAsset(upSpriteId);
    this.downSprite = assetManager.getAsset(downSpriteId);

    this.width = this.upSprite.width;
    this.height = this.upSprite.height;

    this.centerX = -this.width / 2;
    this.centerY = -this.height / 2;

    this.scale = 1;
    this.brightness = 0;
    this.alpha = 1;

    this.x = 0;
    this.y = 0;

    this.clickEvent = clickEvent;

    this.pressedState = false;

}

UIButton.prototype = {

    enableClick: function() {

        this.context.controls.addEventListener('end', this.up, this);

        this.context.controls.addEventListener('start', this.down, this);

    },

    disableClick: function() {

        this.context.controls.removeEventListener('end', this.up, this);

        this.context.controls.removeEventListener('start', this.down, this);

    },

    down: function(e, target) {

        var hit = engine.Collision.BoxPointTest(e.x, e.y, target.width, target.height, target.drawMatrix);

        if (hit) {

            target.pressedState = true;

        }

    },

    up: function(e, target) {

        target.pressedState = false;

        var hit = engine.Collision.BoxPointTest(e.x, e.y, target.width, target.height, target.drawMatrix);

        if (hit) {

            target.clickEvent();

        }

    },

    onUpdate: function(context) {

        this.matrix.SetIdentity();
        this.matrix.Scale(this.scale, this.scale);
        this.matrix.Translate(this.x, this.y);

    },

    onRender: function(context) {

        var sprite = this.upSprite;

        if (this.pressedState)
            sprite = this.downSprite;

        context.renderer.drawImage(context.camera, sprite, this.drawMatrix, this.brightness, this.alpha);

    }

};
