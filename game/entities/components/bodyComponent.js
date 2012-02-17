// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function BodyComponent() {

    this.object = null;

    this.adjustedForce = new box2d.Vec2();

}

BodyComponent.prototype = {

    applyForce: function (context, force) {

        var stepDifference = (1/60) / context.timeStep;

        this.adjustedForce.SetV(force);

        this.adjustedForce.Mul(stepDifference);

        this.object.m_force.add(this.adjustedForce);

    },


};
