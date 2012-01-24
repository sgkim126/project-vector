// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.Mat33');
goog.require('box2d.Math');
goog.require('box2d.Vec2');

function Camera(context) {

    this.prototype += Object.extend(this, new EventDispatcher());

    this.context = context;
    this.vec2Pool = context.vec2Pool;

    this.displaySize = new box2d.Vec2(context.renderer.width, context.renderer.width);

    this.aspectRatio = this.displaySize.x / this.displaySize.y;

    // FIXME: make dynamic
    this.virtualScreenSize = new box2d.Vec2(600, 600);
    this.virtualScreenShape = new box2d.Vec2(600, 400);

    this.zoom = 1;
    this.position = new box2d.Vec2(0, 0);
    this.border = new box2d.Vec2(0, 0);

    this.targetPosition = new box2d.Vec2(0, 0);
    this.zoomTarget = 1;
    this.zoomMultiplier = 1;
    this.zoomSpeed = 0.01;
    this.speedMultiplier = 1;
    this.scrollSpeed = 0.025;
    this.maxSpeed = 2.5;

    this.lastPosition = new box2d.Vec2(0, 0);

    this.freeze = false;

    this.cachedTransform = null;

    this.orderHash = function (depth, layer, id) {

        return (depth / 8.0) + ((layer + 128) / 16384.0) + ((id + 256) / 16777216);

    }
}

Camera.prototype = {

    setPosition: function (x, y) {

        this.position.x = x;
        this.position.y = y;
        this.lastPosition.x = x;
        this.lastPosition.y = y;
        this.targetPosition.x = x;
        this.targetPosition.y = y;

    },

    update: function(context) {

        var vec2Pool = this.vec2Pool;
        var timeStep = context.timeStep;

        var positionDelta = vec2Pool.create();
 
        // FIXME: calculate in context
        var expectedTimeStep = 60;
        var timeAdjust = timeStep * expectedTimeStep;

        if (this.freeze) {
            return;
        }

        this.lastPosition.SetV(this.position);
        positionDelta.SetV(this.targetPosition);
        positionDelta.SubV(this.position);
        positionDelta.Mul(this.scrollSpeed * this.speedMultiplier * timeAdjust);
        this.position.AddV(positionDelta);

        var zoomDelta = ((this.zoomTarget * this.zoomMultiplier) - this.zoom) * (this.zoomSpeed * timeAdjust);
        this.zoom += zoomDelta;

        this.border.SetV(this.virtualScreenShape);
        this.border.Mul(this.zoom);
        this.border.Div(2);

        vec2Pool.release(positionDelta);

    },

    cachedTransform: function () {

    },

    worldTransform: function (matrix, depth, out) {

        var vec2Pool = this.context.vec2Pool;
        var scale = vec2Pool.create();
        var screenScale = vec2Pool.create();
        var screenCenter = vec2Pool.create();
        var drawPosition = vec2Pool.create();
        var drawScale = vec2Pool.create();

        screenCenter.Set(this.virtualScreenShape.x * 0.5, this.virtualScreenShape.y * 0.5);
        drawPosition.Set(matrix.col1.z, matrix.col2.z);
        drawScale.Set(1, 1);
        out.SetM(matrix);

        scale.SetV(this.virtualScreenSize);
        scale.Mul(this.zoom * (1.0 / depth));

        screenScale.SetV(this.displaySize);
        screenScale.DivV(scale);
        drawScale.MulV(screenScale);

        drawPosition.SubV(this.position);
        drawPosition.MulV(screenScale);
        drawPosition.AddV(screenCenter);

        out.ScaleV(drawScale);
        out.TranslateV(drawPosition);

        vec2Pool.release(scale);
        vec2Pool.release(screenScale);
        vec2Pool.release(screenCenter);
        vec2Pool.release(drawPosition);
        vec2Pool.release(drawScale);

    },

    uiTransform: function (matrix, depth, centerH, centerV, out) {

        var vec2Pool = this.context.vec2Pool;
        var screenScale = vec2Pool.create();
        var drawPosition = vec2Pool.create();
        var drawScale = vec2Pool.create();
        var centerAdjust = vec2Pool.create();
        var handle = vec2Pool.create();

        drawPosition.Set(matrix.col1.z, matrix.col2.z);
        drawScale.Set(1, 1);
        handle.Set(centerH, centerV);
        out.SetM(matrix);

        screenScale.SetV(this.displaySize);
        screenScale.DivV(this.virtualScreenSize);
        drawScale.MulV(screenScale);

        drawPosition.MulV(this.displaySize);

        box2d.Math.b2MulM33V2(matrix, handle, centerAdjust);

        out.Translate(centerAdjust.y, centerAdjust.x);
        out.ScaleV(drawScale);
        out.TranslateV(drawPosition);

        vec2Pool.release(screenScale);
        vec2Pool.release(drawPosition);
        vec2Pool.release(drawScale);
        vec2Pool.release(centerAdjust);
        vec2Pool.release(handle);

    },

    spriteTransform: function (matrix, depth, centerH, centerV, out) {

        var vec2Pool = this.context.vec2Pool;
        var screenScale = vec2Pool.create();
        var drawPosition = vec2Pool.create();
        var drawScale = vec2Pool.create();
        var centerAdjust = vec2Pool.create();
        var handle = vec2Pool.create();
        var scale = vec2Pool.create();
        var screenCenter = vec2Pool.create();

        drawScale.Set(1, 1);
        screenCenter.Set(this.virtualScreenShape.x * 0.5, this.virtualScreenShape.y * 0.5);
        handle.Set(centerV, centerH);
        out.SetM(matrix);

        scale.SetV(this.virtualScreenSize);
        scale.Mul(this.zoom * (1.0 / depth));
        screenScale.SetV(this.displaySize);
        screenScale.DivV(scale);
        drawScale.MulV(screenScale);

        drawPosition.SubV(this.position);
        drawPosition.MulV(screenScale);
        drawPosition.AddV(screenCenter);

        box2d.Math.b2MulM33V2(out, handle, centerAdjust);

        out.Translate(centerAdjust.y, centerAdjust.x);
        out.ScaleV(drawScale);
        out.TranslateV(drawPosition);

        vec2Pool.release(screenScale);
        vec2Pool.release(drawPosition);
        vec2Pool.release(drawScale);
        vec2Pool.release(centerAdjust);
        vec2Pool.release(handle);
        vec2Pool.release(scale);
        vec2Pool.release(screenCenter);

    }

};
