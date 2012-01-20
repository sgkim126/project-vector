// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function CircleBody(entity, world, level, x, y, radius, group, userData) {

    this.entity = entity;

    this.world = world;

    this.level = level;

    this.enabled = true;

    this.object = null;

    this.userData = userData;

    this.group = group;

    this.x = x;
    this.y = y;
    this.radius = radius;

}

CircleBody.prototype = {

    onInitalize: function (context) {

        var ballSd = new box2d.CircleDef();
        ballSd.density = 0.01;
        ballSd.radius = this.radius;
        ballSd.restitution = 0.5;
        ballSd.friction = 1;
        ballSd.groupIndex = this.group;

        var ballBd = new box2d.BodyDef();
        ballBd.linearDamping = .03;
        ballBd.allowSleep = false;
        ballBd.AddShape(ballSd);
        ballBd.position.Set(this.x, this.y);
        ballBd.userData = this.userData;

        this.object = this.world.CreateBody(ballBd);

    },

    onRemove: function (context) {

        this.level.destroyBody(this.object);

    }

};
