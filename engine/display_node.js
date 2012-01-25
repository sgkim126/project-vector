// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.Mat33');
goog.require('box2d.Math');
goog.require('box2d.Vec2');

function DisplayNode() {

    this.matrix = new box2d.Mat33();

    this.children = [];

    this.centerX = 0;
    this.centerY = 0;

    this.alpha = 1;

    this.transformedMatrix = new box2d.Mat33();
    this.drawMatrix = new box2d.Mat33();
    this.drawAlpha = 1;

}

DisplayNode.prototype = {

    traverse: function (context, transformType, inputMatrix, parentAlpha, level) {

        var that = this;
        var b2math = box2d.Math;
        var mat33Pool = context.mat33Pool;
        var camera = context.camera;
        var parentMatrix = inputMatrix;

        if (!inputMatrix) {
            parentMatrix = mat33Pool.create();
            parentAlpha = 1;
            level = 0;
        }

        this.drawAlpha = this.alpha * parentAlpha;
        b2math.b2MulM33M33(parentMatrix, this.matrix, this.transformedMatrix);

        camera.uiTransform(this.transformedMatrix, 1, this.centerX, this.centerY, this.drawMatrix, level === 1);

        this.children.forEach(function (childNode) {
            childNode.traverse(context, transformType, that.transformedMatrix, that.drawAlpha, level + 1);
        });

        if (!inputMatrix) {
            mat33Pool.release(parentMatrix);
        }

    },

    addChild: function (childNode) {

        if (this.children.indexOf(childNode) === -1) {
            this.children.push(childNode);
        }

    },

    removeChild: function (childNode) {

        var index = this.children.indexOf(childNode);
        if (index !== -1) {
            this.children.splice(index, 1);
        }

    },

    update: function (context, childNode) {

        if (this.onUpdate) {
            this.onUpdate(context);
        }

        this.children.forEach(function (childNode) {
            childNode.update(context, childNode);
        });

    },

    render: function (context, childNode) {

        var that = this;

        if (this.drawAlpha <= 0)
            return;

        if (this.onRender) {
            this.onRender(context);
        }

        this.children.forEach(function (childNode) {
            childNode.render(context, childNode);
        });

    }

};
