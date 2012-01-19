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

goog.provide('box2d.Vec3');

goog.require('goog.math.Vec3');

box2d.Vec3 = function(x, y, z) {
    if (arguments.length == 3) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
goog.inherits(box2d.Vec3, goog.math.Vec3);

box2d.Vec3.prototype.SetZero = function() {
    this.x = this.y = this.z = 0.0;
}
box2d.Vec3.prototype.Set = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}
box2d.Vec3.prototype.SetV = function(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
}
box2d.Vec3.prototype.GetNegative = function() {
    return new box2d.Vec3(-this.x, -this.y, -this.z);
}
box2d.Vec3.prototype.NegativeSelf = function() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
}
box2d.Vec3.prototype.Copy = function() {
    return new box2d.Vec3(this.x, this.y, this.z);
}
box2d.Vec3.prototype.Add = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
}
box2d.Vec3.prototype.Subtract = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
}
box2d.Vec3.prototype.Multiply = function(a) {
    this.x *= a;
    this.y *= a;
    this.z *= a;
}
box2d.Vec3.prototype.DivV = function(v) {
    this.x /= v.x;
    this.y /= v.y;
    this.z /= v.z;
};
box2d.Vec3.prototype.MulV = function(v) {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
};
// attributes
box2d.Vec3.prototype.x = 0;
box2d.Vec3.prototype.y = 0;
box2d.Vec3.prototype.z = 0;
