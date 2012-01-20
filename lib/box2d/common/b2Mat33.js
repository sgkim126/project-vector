/*
* Copyright (c) 2006-2007 Erin Catto http:
*
* This software is provided 'as-is', without any express or implied
* warranty.  In no event will the authors be held liable for any damages
* arising from the use of this software.
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
* 1. The origin of this software must not be misrepresented; you must not
* claim that you wrote the original software. If you use this software
* in a product, an acknowledgment in the product documentation would be
* appreciated but is not required.
* 2. Altered source versions must be plainly marked, and must not be
* misrepresented the original software.
* 3. This notice may not be removed or altered from any source distribution.
*/

goog.provide('box2d.Mat33');

goog.require('box2d.Vec3');

box2d.Mat33 = function() {
    this.__varz();
    this.__constructor.apply(this, arguments);
}
box2d.Mat33.prototype.__constructor = function(c1, c2, c3) {
    if (!c1 && !c2 && !c3) {
        this.col1.x = 1.0;
        this.col2.x = 0.0;
        this.col3.x = 0.0;
        this.col1.y = 0.0;
        this.col2.y = 1.0;
        this.col3.y = 0.0;
        this.col1.z = 0.0;
        this.col2.z = 0.0;
        this.col3.z = 1.0;
    }
    else {
        this.col1.SetV(c1);
        this.col2.SetV(c2);
        this.col3.SetV(c3);
    }
}
box2d.Mat33.prototype.__varz = function() {
    this.col1 = new box2d.Vec3();
    this.col2 = new box2d.Vec3();
    this.col3 = new box2d.Vec3();
}
box2d.Mat33.prototype.Default = function() {
  this.SetIdentity();
};
// static methods
// static attributes
// methods
box2d.Mat33.prototype.SetVVV = function(c1, c2, c3) {
    this.col1.SetV(c1);
    this.col2.SetV(c2);
    this.col3.SetV(c3);
}
box2d.Mat33.prototype.Copy = function() {
    return new b2Mat33(this.col1, this.col2, this.col3);
}
box2d.Mat33.prototype.SetM22 = function(A) {
    this.col1.x = A.col1.x;
    this.col2.x = A.col2.x;
    this.col3.x = 0;
    this.col1.y = A.col1.y;
    this.col2.y = A.col2.y;
    this.col3.y = 0;
    this.col1.z = 0;
    this.col2.z = 0;
    this.col3.z = 1;
}
box2d.Mat33.prototype.SetM = function(m) {
    this.col1.SetV(m.col1);
    this.col2.SetV(m.col2);
    this.col3.SetV(m.col3);
}
box2d.Mat33.prototype.Translate = function(x, y) {
    var a13 = x;
    var a23 = y;

    var b11 = this.col1.x;
    var b21 = this.col2.x;
    var b31 = this.col3.x;
    var b12 = this.col1.y;
    var b22 = this.col2.y;
    var b32 = this.col3.y;
    var b13 = this.col1.z;
    var b23 = this.col2.z;
    var b33 = this.col3.z;

    this.col1.x = b11 + a13 * b31;
    this.col2.x = b21 + a23 * b31;
    this.col1.y = b12 + a13 * b32;
    this.col2.y = b22 + a23 * b32;
    this.col1.z = b13 + a13 * b33;
    this.col2.z = b23 + a23 * b33;
}
box2d.Mat33.prototype.TranslateV = function(v) {
    this.Translate(v.x, v.y);
}
box2d.Mat33.prototype.AddM = function(m) {
    this.col1.x += m.col1.x;
    this.col1.y += m.col1.y;
    this.col1.z += m.col1.z;
    this.col2.x += m.col2.x;
    this.col2.y += m.col2.y;
    this.col2.z += m.col2.z;
    this.col3.x += m.col3.x;
    this.col3.y += m.col3.y;
    this.col3.z += m.col3.z;
}
box2d.Mat33.prototype.SetIdentity = function() {
    this.col1.x = 1.0;
    this.col2.x = 0.0;
    this.col3.x = 0.0;
    this.col1.y = 0.0;
    this.col2.y = 1.0;
    this.col3.y = 0.0;
    this.col1.z = 0.0;
    this.col2.z = 0.0;
    this.col3.z = 1.0;
}
box2d.Mat33.prototype.SetZero = function() {
    this.col1.x = 0.0;
    this.col2.x = 0.0;
    this.col3.x = 0.0;
    this.col1.y = 0.0;
    this.col2.y = 0.0;
    this.col3.y = 0.0;
    this.col1.z = 0.0;
    this.col2.z = 0.0;
    this.col3.z = 0.0;
}
box2d.Mat33.prototype.Solve22 = function(out, bX, bY) {
    var a11 = this.col1.x;
    var a12 = this.col2.x;
    var a21 = this.col1.y;
    var a22 = this.col2.y;
    var det = a11 * a22 - a12 * a21;
    if (det != 0.0) {
        det = 1.0 / det;
    }
    out.x = det * (a22 * bX - a12 * bY);
    out.y = det * (a11 * bY - a21 * bX);
    return out;
}
box2d.Mat33.prototype.Solve33 = function(out, bX, bY, bZ) {
    var a11 = this.col1.x;
    var a21 = this.col1.y;
    var a31 = this.col1.z;
    var a12 = this.col2.x;
    var a22 = this.col2.y;
    var a32 = this.col2.z;
    var a13 = this.col3.x;
    var a23 = this.col3.y;
    var a33 = this.col3.z;
    var det = a11 * (a22 * a33 - a32 * a23) + a21 * (a32 * a13 - a12 * a33) + a31 * (a12 * a23 - a22 * a13);
    if (det != 0.0) {
        det = 1.0 / det;
    }
    out.x = det * (bX * (a22 * a33 - a32 * a23) + bY * (a32 * a13 - a12 * a33) + bZ * (a12 * a23 - a22 * a13));
    out.y = det * (a11 * (bY * a33 - bZ * a23) + a21 * (bZ * a13 - bX * a33) + a31 * (bX * a23 - bY * a13));
    out.z = det * (a11 * (a22 * bZ - a32 * bY) + a21 * (a32 * bX - a12 * bZ) + a31 * (a12 * bY - a22 * bX));
    return out;
}
box2d.Mat33.prototype.Scale = function(x, y) {
    var a11 = x;
    var a22 = y;

    var b11 = this.col1.x;
    var b21 = this.col2.x;
    var b12 = this.col1.y;
    var b22 = this.col2.y;
    var b13 = this.col1.z;
    var b23 = this.col2.z;

    this.col1.x = a11 * b11;
    this.col2.x = a22 * b21;
    this.col1.y = a11 * b12;
    this.col2.y = a22 * b22;
    this.col1.z = a11 * b13;
    this.col2.z = a22 * b23;
};
box2d.Mat33.prototype.ScaleV = function(v) {
    this.Scale(v.x, v.y);
};
box2d.Mat33.prototype.Invert = function() {
    var m0 = this.col1.x;
    var m1 = this.col1.y;
    var m2 = this.col1.z;
    var m4 = this.col2.x;
    var m5 = this.col2.y;
    var m6 = this.col2.z;
    var m8 = this.col3.x;
    var m9 = this.col3.y;
    var m10 = this.col3.z;

    var a11 = m10 * m5 - m6 * m9;
    var a21 = -m10 * m1 + m2 * m9;
    var a31 = m6 * m1 - m2 * m5;
    var a12 = -m10 * m4 + m6 * m8;
    var a22 = m10 * m0 - m2 * m8;
    var a32 = -m6 * m0 + m2 * m4;
    var a13 = m9 * m4 - m5 * m8;
    var a23 = -m9 * m0 + m1 * m8;
    var a33 = m5 * m0 - m1 * m4;

    var det = m0 * (a11) + m1 * (a12) + m2 * (a13);

    if (det === 0)
        throw "matrix not invertible";

    var idet = 1.0 / det;
    this.col1.x = idet * a11;
    this.col1.y = idet * a12;
    this.col1.z = idet * a13;
    this.col2.x = idet * a21;
    this.col2.y = idet * a22;
    this.col2.z = idet * a23;
    this.col3.x = idet * a31;
    this.col3.y = idet * a32;
    this.col3.z = idet * a33;
};
/** @param {number} angle */
box2d.Mat33.prototype.SetRotation = function(angle) {
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    this.col1.x = c;
    this.col2.x = -s;
    this.col3.x = 0;
    this.col1.y = s;
    this.col2.y = c;
    this.col3.y = 0;
    this.col1.z = 0;
    this.col2.z = 0;
    this.col3.z = 1;
};
box2d.Mat33.prototype.Concat = function(B) {
    var a11 = this.col1.x;
    var a21 = this.col2.x;
    var a31 = this.col3.x;
    var a12 = this.col1.y;
    var a22 = this.col2.y;
    var a32 = this.col3.y;
    var a13 = this.col1.z;
    var a23 = this.col2.z;
    var a33 = this.col3.z;

    var b11 = B.col1.x;
    var b21 = B.col2.x;
    var b31 = B.col3.x;
    var b12 = B.col1.y;
    var b22 = B.col2.y;
    var b32 = B.col3.y;
    var b13 = B.col1.z;
    var b23 = B.col2.z;
    var b33 = B.col3.z;

    this.col1.x = a11 * b11 + a12 * b21 + a13 * b31;
    this.col2.x = a21 * b11 + a22 * b21 + a23 * b31;
    this.col3.x = a31 * b11 + a32 * b21 + a33 * b31;
    this.col1.y = a11 * b12 + a12 * b22 + a13 * b32;
    this.col2.y = a21 * b12 + a22 * b22 + a23 * b32;
    this.col3.y = a31 * b12 + a32 * b22 + a33 * b32;
    this.col1.z = a11 * b13 + a12 * b23 + a13 * b33;
    this.col2.z = a21 * b13 + a22 * b23 + a23 * b33;
    this.col3.z = a31 * b13 + a32 * b23 + a33 * b33;
};
box2d.Mat33.prototype.ConcatM22 = function(B) {
    var a11 = this.col1.x;
    var a21 = this.col2.x;
    var a31 = this.col3.x;
    var a12 = this.col1.y;
    var a22 = this.col2.y;
    var a32 = this.col3.y;
    var a13 = this.col1.z;
    var a23 = this.col2.z;

    var b11 = B.col1.x;
    var b12 = B.col2.x;
    var b21 = B.col1.y;
    var b22 = B.col2.y;

    this.col1.x = a11 * b11 + a12 * b21;
    this.col2.x = a21 * b11 + a22 * b21;
    this.col3.x = a31 * b11 + a32 * b21;
    this.col1.y = a11 * b12 + a12 * b22;
    this.col2.y = a21 * b12 + a22 * b22;
    this.col3.y = a31 * b12 + a32 * b22;
};
box2d.Mat33.prototype.RotateX = function(angle) {
    var b22 = Math.cos(angle);
    var b23 = Math.sin(angle);
    var b32 = -Math.sin(angle);
    var b33 = Math.cos(angle);

    var a11 = this.col1.x;
    var a21 = this.col2.x;
    var a31 = this.col3.x;
    var a12 = this.col1.y;
    var a22 = this.col2.y;
    var a32 = this.col3.y;
    var a13 = this.col1.z;
    var a23 = this.col2.z;
    var a33 = this.col3.z;

    this.col1.x = a11;
    this.col2.x = a21;
    this.col3.x = a31;
    this.col1.y = a12 * b22 + a13 * b32;
    this.col2.y = a22 * b22 + a23 * b32;
    this.col3.y = a32 * b22 + a33 * b32;
    this.col1.z = a12 * b23 + a13 * b33;
    this.col2.z = a22 * b23 + a23 * b33;
    this.col3.z = a32 * b23 + a33 * b33;
};
box2d.Mat33.prototype.RotateY = function(angle) {
    var b11 = Math.cos(angle);
    var b12 = 0;
    var b21 = 0;
    var b22 = 1;
    var b23 = 0;
    var b13 = -Math.sin(angle);
    var b31 = Math.sin(angle);
    var b32 = 0;
    var b33 = Math.cos(angle);

    var a11 = this.col1.x;
    var a21 = this.col2.x;
    var a31 = this.col3.x;
    var a12 = this.col1.y;
    var a22 = this.col2.y;
    var a32 = this.col3.y;
    var a13 = this.col1.z;
    var a23 = this.col2.z;
    var a33 = this.col3.z;

    this.col1.x = a11 * b11 + a13 * b31;
    this.col2.x = a21 * b11 + a23 * b31;
    this.col3.x = a31 * b11 + a33 * b31;
    this.col1.y = a12;
    this.col2.y = a22;
    this.col3.y = a32;
    this.col1.z = a11 * b13 + a13 * b33;
    this.col2.z = a21 * b13 + a23 * b33;
    this.col3.z = a31 * b13 + a33 * b33;
};
box2d.Mat33.prototype.ApplyScaleV = function(v) {
    this.col1.x *= v.x;
    this.col1.y *= v.y;
    this.col2.x *= v.x;
    this.col2.y *= v.y;
    this.col3.x *= v.x;
    this.col3.y *= v.y;
};
box2d.Mat33.prototype.ApplyScale = function(x, y) {
    this.col1.x *= x;
    this.col1.y *= y;
    this.col2.x *= x;
    this.col2.y *= y;
    this.col3.x *= x;
    this.col3.y *= y;
};
// attributes
box2d.Mat33.prototype.col1 = new box2d.Vec3();
box2d.Mat33.prototype.col2 = new box2d.Vec3();
box2d.Mat33.prototype.col3 = new box2d.Vec3();
