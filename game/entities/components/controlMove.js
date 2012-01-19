// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ControlMove(entity, bodyComponent) {

    this.entity = entity;

    this.bodyComponent = bodyComponent;

    this.enabled = true;

    this.velocity = new box2d.Vec2();

}

ControlMove.prototype = {

    onUpdate: function (context) {

        var controls = context.controls;

        if (controls.isDragging) {

            var body = this.bodyComponent.object;

            this.velocity.x = controls.normalDeltaX * 2200000;
            this.velocity.y = controls.normalDeltaY * 2200000;

            body.m_force.add(this.velocity);

        }

    },

};
