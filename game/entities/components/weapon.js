// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Weapon(entity, world, level, bodyComponent, vector) {

    var that = this;

    this.counter = 0;

    this.vector = vector;

    this.shootDelay = 0.2;

    this.shoot = function (context) {

        var timerRegistery = context.timerRegistery;

        that.counter++;

        var body = bodyComponent.object;

        var projectile = new Projectile(context, world, level, body.m_position, that.vector, that.counter);

        level.addEntity(context, projectile);

        timerRegistery.add('weapon', that.shootDelay, that.shoot);

    }

}

Weapon.prototype = {

    onInitalize: function (context) {

        var timerRegistery = context.timerRegistery;

        timerRegistery.add('weapon', this.shootDelay, this.shoot);

    },

    onRemove: function (context) {

        var timerRegistery = context.timerRegistery;

        timerRegistery.remove('weapon');

    }

};
