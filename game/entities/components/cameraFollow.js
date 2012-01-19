// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function CameraFollow(entity, bodyComponent) {

    this.entity = entity;

    this.bodyComponent = bodyComponent;

    this.enabled = true;

}

CameraFollow.prototype = {

    onInitalize: function (context) {

    },

    onUpdate: function (context) {

        var camera = context.camera;

        var body = this.bodyComponent.object;

        camera.targetPosition.x = body.m_position.x;
        camera.targetPosition.y = body.m_position.y;
        camera.zoomTarget = (body.m_linearVelocity.magnitude() / 300) + 1;

    }

};
