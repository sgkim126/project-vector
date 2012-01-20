// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function VectorDraw3D(entity, bodyComponent, color, scale) {

    this.entity = entity;

    this.enabled = true;

    this.color = color;

    this.bodyComponent = bodyComponent;

    this.matrix = new box2d.Mat33();
    this.matrix2 = new box2d.Mat33();
    this.worldMatrix = new box2d.Mat33();

    this.xRotation = 0;
    this.yRotation = 0;
    this.scaleModify = 1;

    this.transformedVertex0 = [0, 0, 0];
    this.transformedVertex1 = [0, 0, 0];

    this.alpha = 1;

    this.vertexList = [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
                       [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]];

    this.linesList = [[0, 1], [1, 2], [2, 3], [3, 0],
                      [4, 5], [5, 6], [6, 7], [7, 4],
                      [0, 4], [1, 5], [2, 6], [3, 7]];

    for (var i =0; i < this.vertexList.length; i++) {

        var vertex = this.vertexList[i];
        vertex[0] *= scale * 25;
        vertex[1] *= scale * 25;
        vertex[2] *= scale * 25;

    }

}

VectorDraw3D.prototype = {

    onInitalize: function (context) {

        this.rotateSpeedX = Math.random() * 0.1;
        this.rotateSpeedY = Math.random() * 0.1;

    },

    onUpdate: function (context) {

        this.xRotation += this.rotateSpeedX;
        this.yRotation += this.rotateSpeedY;

    },

    onRender: function (context) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var body = this.bodyComponent.object;

        this.matrix.SetIdentity();
        this.matrix.ConcatM22(body.m_R);
        this.matrix.Scale(this.scaleModify, this.scaleModify);
        this.matrix.TranslateV(body.m_position);

        this.matrix2.SetIdentity();
        this.matrix2.RotateY(this.yRotation);
        this.matrix2.RotateX(this.xRotation);

        camera.spriteTransform(this.matrix, 1, 0, 0, this.worldMatrix);

        var transformFunction = box2d.Math.b2MulM33A3;

        renderer.beginLines(this.color, 2, 4, this.alpha, this.worldMatrix);

        var linesCount = this.linesList.length;

        for (var i = 0; i < linesCount; i++) {

            var line = this.linesList[i];

            var vertex0 = this.vertexList[line[0]];
            var vertex1 = this.vertexList[line[1]];

            transformFunction(this.matrix2, vertex0, this.transformedVertex0);
            transformFunction(this.matrix2, vertex1, this.transformedVertex1);

            var b = 150;
            var c = 80;

            var tx0 = this.transformedVertex0[0] / (this.transformedVertex0[2] + b) * c;
            var ty0 = this.transformedVertex0[1] / (this.transformedVertex0[2] + b) * c;
            var tx1 = this.transformedVertex1[0] / (this.transformedVertex1[2] + b) * c;
            var ty1 = this.transformedVertex1[1] / (this.transformedVertex1[2] + b) * c;

            renderer.moveTo(tx0, ty0);
            renderer.lineTo(tx1, ty1);

        }

        renderer.endLines();

    }

};
