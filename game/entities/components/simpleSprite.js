// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function SimpleSprite(entity, position, textureId) {

    this.position = position;

    this.entity = entity;

    this.enabled = true;

    this.textureId = textureId;

    this.matrix = new box2d.Mat33();
    this.worldMatrix = new box2d.Mat33();

    this.alpha = 1;

    this.brightness = 0;

    this.scaleModify = 1;

    this.handleOffsetX = 1;
    this.handleOffsetY = 1;

    this.rotation = 0;
    this.rotationMatrix = new box2d.Mat22();

}

SimpleSprite.prototype = {

    onInitalize: function (context) {

        var assetManager = context.assetManager;

        this.sprite = assetManager.getAsset(this.textureId);

        this.handleX = -this.sprite.width / 2;
        this.handleY = -this.sprite.height / 2;

    },

    onRender: function (context) {

        var camera = context.camera;
        var renderer = context.renderer;

        this.rotationMatrix.Set(this.rotation);

        this.matrix.SetIdentity();
        this.matrix.ConcatM22(this.rotationMatrix);
        this.matrix.Scale(this.scaleModify, this.scaleModify);
        this.matrix.TranslateV(this.position);

        camera.spriteTransform(this.matrix, 1, this.handleX * this.handleOffsetX, this.handleY * this.handleOffsetY, this.worldMatrix);
        renderer.drawImage(camera, this.sprite, this.worldMatrix, this.brightness, this.alpha);

    }

};
