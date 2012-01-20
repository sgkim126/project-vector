// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function VectorDraw3D(entity, bodyComponent) {

    this.entity = entity;

    this.enabled = true;

    this.bodyComponent = bodyComponent;

    this.matrix = new box2d.Mat33();
    this.worldMatrix = new box2d.Mat33();

this.xRotation = 0;

    this.transformedVertex0 = [0, 0, 0];
    this.transformedVertex1 = [0, 0, 0];

    this.vertexList = [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
                       [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]];

    this.linesList = [[0, 1], [1, 2], [2, 3], [3, 0],
                      [4, 5], [5, 6], [6, 7], [7, 4],
                      [0, 4], [1, 5], [2, 6], [3, 7]];

    for (var i =0; i < this.vertexList.length; i++) {

        var vertex = this.vertexList[i];
        vertex[0] *= 25;
        vertex[1] *= 25;
        vertex[2] *= 25;

    }

}

VectorDraw3D.prototype = {

    onInitalize: function (context) {

    },

    onUpdate: function (context) {

        this.xRotation += 0.001;

    },

    onRender: function (context) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var body = this.bodyComponent.object;

        this.matrix.SetIdentity();
        this.matrix.ConcatM22(body.m_R);
        //this.matrix.RotateX(this.xRotation);
        this.matrix.TranslateV(body.m_position);

        camera.spriteTransform(this.matrix, 1, 0, 0, this.worldMatrix);

        var transformFunction = box2d.Math.b2MulM33A3;

        renderer.beginLines('#FFFF00', 2, 0, 1, this.worldMatrix);

        var linesCount = this.linesList.length;

        for (var i = 0; i < linesCount; i++) {

            var line = this.linesList[i];

            var vertex0 = this.vertexList[line[0]];
            var vertex1 = this.vertexList[line[1]];

            transformFunction(this.worldMatrix, vertex0, this.transformedVertex0);
            transformFunction(this.worldMatrix, vertex1, this.transformedVertex1);

            var b = 150;
            var c = 80;
            var tx0 = this.transformedVertex0[0] / (vertex0[2] + b) * c;
            var ty0 = this.transformedVertex0[1] / (vertex0[2] + b) * c;
            var tx1 = this.transformedVertex1[0] / (vertex1[2] + b) * c;
            var ty1 = this.transformedVertex1[1] / (vertex1[2] + b) * c;

            renderer.moveTo(tx0, ty0);
            renderer.lineTo(tx1, ty1);

        }

        renderer.endLines();

    }

};
