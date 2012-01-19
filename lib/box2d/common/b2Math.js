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

goog.provide('box2d.Math');

goog.require('box2d.Mat22');
goog.require('box2d.Vec2');
goog.require('box2d.Mat33');
goog.require('box2d.Vec3');

goog.require('goog.math');

/**
 @param {!box2d.Mat22} A
 @param {!box2d.Vec2} v
 @return {!box2d.Vec2}
 */
box2d.Math.b2MulMV = function(A, v) {
  return new box2d.Vec2(A.col1.x * v.x + A.col2.x * v.y, A.col1.y * v.x + A.col2.y * v.y);
};

/**
 @return {!box2d.Vec2}
 */
box2d.Math.b2MulTMV = function(A, v) {
  return new box2d.Vec2(goog.math.Vec2.dot(v, A.col1), goog.math.Vec2.dot(v, A.col2));
};

box2d.Math.b2MulMM = function(A, B) {
  return new box2d.Mat22(0, box2d.Math.b2MulMV(A, B.col1), box2d.Math.b2MulMV(A, B.col2));
};

box2d.Math.b2AbsM = function(A) {
  return new box2d.Mat22(0, box2d.Vec2.abs(A.col1), box2d.Vec2.abs(A.col2));
};

/**
 @param {number} a
 @param {number} low
 @param {number} high
 @return {number}
 */
box2d.Math.b2Clamp = function(a, low, high) {
  return Math.max(low, Math.min(a, high));
};

box2d.Math.b2MulM33V3 = function(A, v, out) {
    out.x = v.x * A.col1.x + v.y * A.col2.x + v.z * A.col3.x;
    out.y = v.x * A.col1.y + v.y * A.col2.y + v.z * A.col3.y;
    out.z = v.x * A.col1.z + v.y * A.col2.z + v.z * A.col3.z;
}

box2d.Math.b2MulM33V2 = function(A, v, out) {
    out.x = v.x * A.col1.x + v.y * A.col2.x + 1 * A.col3.x;
    out.y = v.x * A.col1.y + v.y * A.col2.y + 1 * A.col3.y;
}

box2d.Math.b2MulM33M33 = function(A, B, out) {
    var a11 = A.col1.x;
    var a21 = A.col2.x;
    var a31 = A.col3.x;
    var a12 = A.col1.y;
    var a22 = A.col2.y;
    var a32 = A.col3.y;
    var a13 = A.col1.z;
    var a23 = A.col2.z;
    var a33 = A.col3.z;

    var b11 = B.col1.x;
    var b21 = B.col2.x;
    var b31 = B.col3.x;
    var b12 = B.col1.y;
    var b22 = B.col2.y;
    var b32 = B.col3.y;
    var b13 = B.col1.z;
    var b23 = B.col2.z;
    var b33 = B.col3.z;

    out.col1.x = a11 * b11 + a12 * b21 + a13 * b31;
    out.col2.x = a21 * b11 + a22 * b21 + a23 * b31;
    out.col3.x = a31 * b11 + a32 * b21 + a33 * b31;
    out.col1.y = a11 * b12 + a12 * b22 + a13 * b32;
    out.col2.y = a21 * b12 + a22 * b22 + a23 * b32;
    out.col3.y = a31 * b12 + a32 * b22 + a33 * b32;
    out.col1.z = a11 * b13 + a12 * b23 + a13 * b33;
    out.col2.z = a21 * b13 + a22 * b23 + a23 * b33;
    out.col3.z = a31 * b13 + a32 * b23 + a33 * b33;
};
box2d.Math.b2AddVV = function(a, b) {
    return new box2d.Vec2(a.x + b.x, a.y + b.y);
};
