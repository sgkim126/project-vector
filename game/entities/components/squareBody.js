// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function SquareBody(entity, world, level, width, height, x, y, group, userData) {

    this.entity = entity;

    this.world = world;

    this.level = level;

    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.group = group;

    this.enabled = true;

    this.userData = userData;

    this.object = null;

}

SquareBody.prototype = {

    onInitalize: function (context) {

        var boxSd = new box2d.BoxDef();
        boxSd.density = 0.1;
        boxSd.extents.Set(this.width, this.height);
        boxSd.restitution = 0.5;
        boxSd.friction = 1;
        boxSd.groupIndex = this.group;
        this.shape = boxSd;

        var boxBd = new box2d.BodyDef();
        boxBd.linearDamping = .0000003;
        boxBd.allowSleep = false;
        boxBd.userData = this.userData;
        boxBd.AddShape(boxSd);
        boxBd.position.Set(this.x, this.y);
        boxBd.userData = this.userData;

        this.object = this.world.CreateBody(boxBd);

    },

    onRemove: function (context) {

        this.level.destroyBody(this.object);

    }

};
