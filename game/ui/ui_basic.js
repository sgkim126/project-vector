// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIBasic(context, spriteID) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;
    var assetManager = context.assetManager;

    this.sprite = assetManager.getAsset(spriteID);
    this.width = this.sprite.width;
    this.height = this.sprite.height;

    this.centerX = -this.width / 2;
    this.centerY = -this.height / 2;

    this.scale = 1;
    this.brightness = 0;
    this.alpha = 1;

    this.x = 0;
    this.y = 0;

}

UIBasic.prototype = {

    onUpdate: function(context) {

        this.matrix.SetIdentity();
        this.matrix.Scale(this.scale, this.scale);
        this.matrix.Translate(this.x, this.y);

    },

    onRender: function(context) {

        context.renderer.drawImage(context.camera, this.sprite, this.drawMatrix, this.brightness, this.alpha);

    }

};
