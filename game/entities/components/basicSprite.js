// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function BasicSprite(entity, bodyComponent, textureId) {

    this.entity = entity;

    this.enabled = true;

    this.textureId = textureId;

    this.bodyComponent = bodyComponent;

    this.matrix = new box2d.Mat33();
    this.worldMatrix = new box2d.Mat33();

    this.alpha = 1;

    this.brightness = 0;

    this.scaleModify = 1;

    this.handleOffsetX = 1;
    this.handleOffsetY = 1;

    this.overrideRotation = false;
    this.rotation = 0;
    this.rotationMatrix = new box2d.Mat22();

    this.shadowBlur = 0;
    this.shadowColor = 'rgba(0,0,0,0)';

}

BasicSprite.prototype = {

    onInitalize: function (context) {

        var assetManager = context.assetManager;

        this.sprite = assetManager.getAsset(this.textureId);

        this.handleX = -this.sprite.width / 2;
        this.handleY = -this.sprite.height / 2;

    },

    onRender: function (context) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var body = this.bodyComponent.object;

        if (!this.overrideRotation) {
            this.rotationMatrix.SetM(body.m_R);
        } else {
            this.rotationMatrix.Set(this.rotation);
        }

        this.matrix.SetIdentity();
        this.matrix.ConcatM22(this.rotationMatrix);
        this.matrix.Scale(this.scaleModify, this.scaleModify);
        this.matrix.TranslateV(body.m_position);

        camera.spriteTransform(this.matrix, 1, this.handleX * this.handleOffsetX, this.handleY * this.handleOffsetY, this.worldMatrix);

        renderer.setShadow(Math.round(this.shadowBlur), this.shadowColor);

        renderer.drawImage(camera, this.sprite, this.worldMatrix, this.brightness, this.alpha);

        renderer.setShadow(0, 'rgba(0,0,0,0)');

    }

};
