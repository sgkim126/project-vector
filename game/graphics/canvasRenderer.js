// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.Vec2');
goog.require('box2d.ShapeDef');
goog.require('box2d.Math');

function CanvasRenderer(canvas) {
    this.canvas = canvas;
    this.graphics = canvas[0].getContext('2d');
    this.width = canvas[0].width;
    this.height = canvas[0].height;
    this.shadowsEnabled = true;
}

CanvasRenderer.prototype = {

    clear: function () {

        this.graphics.setTransform(1, 0, 0, 1, 0, 0);
        this.graphics.clearRect(0, 0, this.width, this.height);

    },

    clearBlack: function () {

        this.graphics.setTransform(1, 0, 0, 1, 0, 0);
        this.graphics.fillStyle = '#000000';
        this.graphics.fillRect (0, 0, this.width, this.height);

    },

    beginTransform: function (m) {

        this.graphics.save();

        this.graphics.setTransform(m.col1.x, m.col1.y, m.col2.x, m.col2.y, m.col1.z, m.col2.z);

    },

    endTransform: function () {

        this.graphics.restore();

    },

    beginLines: function (color, width, blur, alpha, m) {

        this.graphics.save();

        if (m) {

            this.graphics.setTransform(m.col1.x, m.col1.y, m.col2.x, m.col2.y, m.col1.z, m.col2.z);

        }

        this.graphics.strokeStyle = color;
        this.graphics.lineWidth = width;
        this.graphics.shadowColor = color;
        this.graphics.globalAlpha = alpha;

        if (this.shadowsEnabled) {
            this.graphics.shadowBlur = blur;
        }

        this.graphics.beginPath();

    },

    moveTo: function (x, y) {

        this.graphics.moveTo(x, y);

    },

    lineTo: function (x, y) {

        this.graphics.lineTo(x, y);

    },

    endLines: function () {

        this.graphics.stroke();

        this.graphics.restore();

    },

    drawCircle: function (x, y, radius, blur) {

        var graphics = this.graphics;

        if (this.shadowsEnabled) {
            graphics.shadowBlur = blur;
        }

        graphics.strokeStyle = "#000000";
        graphics.fillStyle = "#000000";
        graphics.beginPath();
        graphics.arc(x, y, radius, 0, Math.PI*2, true);
        graphics.closePath();
        graphics.stroke();
        graphics.fill();

    },

    drawImageSimple: function (texture, x, y) {

        this.graphics.drawImage(texture, x, y);

    },

    drawImage: function (camera, texture, matrix, brightness, alpha) {

        var a11 = matrix.col1.x;
        var a12 = matrix.col2.x;
        var a21 = matrix.col1.y;
        var a22 = matrix.col2.y;
        var x = matrix.col1.z;
        var y = matrix.col2.z;

        this.graphics.save();

        if (alpha === undefined) {
            alpha = 1;
        }
        if (alpha < 1) {
            this.graphics.globalAlpha = alpha;
        }

        this.graphics.setTransform(a11, a12, a21, a22, x, y);
        this.graphics.drawImage(texture, 0, 0);

        this.graphics.restore();

        if (brightness !== 0 && brightness !== undefined) {

            this.graphics.save();

            if (brightness > 0) {
                this.graphics.globalCompositeOperation = 'lighter';
            }
            else {
                this.graphics.globalCompositeOperation = 'darker';
            }
            this.graphics.globalAlpha = brightness * (alpha);
            this.graphics.setTransform(a11, a12, a21, a22, x, y);
            this.graphics.drawImage(texture, 0, 0);

            this.graphics.restore();
    
        }

    },

    drawWorld: function(world, m) {

        this.graphics.save();

        this.graphics.setTransform(m.col1.x, m.col1.y, m.col2.x, m.col2.y, m.col1.z, m.col2.z);

        for (var j = world.m_jointList; j; j = j.m_next) {
            this.DrawJoint(j);
        }

        for (var b = world.m_bodyList; b; b = b.m_next) {
            for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
                this.drawShape(s);
            }
        }

        this.graphics.restore();

    },

    drawJoint: function(joint) {

        var b1 = joint.m_body1;
        var b2 = joint.m_body2;
        var x1 = b1.m_position;
        var x2 = b2.m_position;
        var p1 = joint.GetAnchor1();
        var p2 = joint.GetAnchor2();

        this.graphics.strokeStyle = '#EEFFFF';
        this.graphics.beginPath();

        switch (joint.m_type) {

            case box2d.Joint.e_distanceJoint:

                this.graphics.moveTo(p1.x, p1.y);
                this.graphics.lineTo(p2.x, p2.y);

                break;

            case box2d.Joint.e_pulleyJoint:

                // TODO
                break;

            default:

                if (b1 == world.m_groundBody) {
                    this.graphics.moveTo(p1.x, p1.y);
                    this.graphics.lineTo(x2.x, x2.y);
                }

                else if (b2 == world.m_groundBody) {
                    this.graphics.moveTo(p1.x, p1.y);
                    this.graphics.lineTo(x1.x, x1.y);
                }

                else {
                    this.graphics.moveTo(x1.x, x1.y);
                    this.graphics.lineTo(p1.x, p1.y);
                    this.graphics.lineTo(x2.x, x2.y);
                    this.graphics.lineTo(p2.x, p2.y);
                }

                break;

        }

        this.graphics.stroke();

    },

    drawShape: function(shape) {

        this.graphics.strokeStyle = '#FFFFFF';
        this.graphics.beginPath();

        switch (shape.m_type) {

            case box2d.ShapeDef.Type.circleShape:
            {
                var circle = shape;
                var pos = circle.m_position;
                var r = circle.m_radius;
                var segments = 16.0;
                var theta = 0.0;
                var dtheta = 2.0 * Math.PI / segments;
                // draw circle
                this.graphics.moveTo(pos.x + r, pos.y);
                for (var i = 0; i < segments; i++) {
                    var d = new box2d.Vec2(r * Math.cos(theta), r * Math.sin(theta));
                    var v = box2d.Math.b2AddVV(pos, d);
                    this.graphics.lineTo(v.x, v.y);
                    theta += dtheta;
                }
                this.graphics.lineTo(pos.x + r, pos.y);
                // draw radius
                this.graphics.moveTo(pos.x, pos.y);
                var ax = circle.m_R.col1;
                var pos2 = new box2d.Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
                this.graphics.lineTo(pos2.x, pos2.y);
            }
            break;

            case box2d.ShapeDef.Type.polyShape:
            {
                var poly = shape;
                var tV = box2d.Math.b2AddVV(poly.m_position, box2d.Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
                this.graphics.moveTo(tV.x, tV.y);
                for (var i = 0; i < poly.m_vertexCount; i++) {
                    var v = box2d.Math.b2AddVV(poly.m_position, box2d.Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                    this.graphics.lineTo(v.x, v.y);
                }
                this.graphics.lineTo(tV.x, tV.y);
            }
            break;

        }

        this.graphics.lineWidth = 2;
        //this.graphics.shadowBlur = 6;
        this.graphics.shadowColor = '#FFFFFF';

        this.graphics.stroke();

    }

};
