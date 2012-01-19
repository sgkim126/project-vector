// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.provide('engine.Collision');

goog.require('box2d.Mat33');
goog.require('box2d.Math');
goog.require('box2d.Vec2');
goog.require('box2d.Vec3');

engine.Collision.BoxPointTest = function(x, y, sx, sy, transform, getResult) {
    var collisionMatrix = new box2d.Mat33();
    collisionMatrix.Concat(transform);
    collisionMatrix.Invert();
    collisionMatrix.ApplyScale(1 / sx, 1 / sy);
    var transformedPoint = new box2d.Vec3();
    box2d.Math.b2MulM33V3(collisionMatrix, new box2d.Vec3(x, y, 1), transformedPoint);
    if (getResult) {
        return transformedPoint;
    }
    if (transformedPoint.y >= 0 && transformedPoint.y <= 1) {
        if (transformedPoint.x >= 0 && transformedPoint.x <= 1) {
            return true;
        }
    }
    return false;
};
