// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Weapon(entity, world, level, bodyComponent, vector) {

    var that = this;

    this.projectilePool = new ObjectPool(Projectile);

    this.projectilePool.allowInstanceNew = false;

    this.counter = 0;

    this.vector = vector;

    this.shootDelay = 0.2;

    this.shoot = function (context) {

        var timerRegistery = context.timerRegistery;

        that.counter++;

        var body = bodyComponent.object;

        var projectile = that.projectilePool.create();

        if (!projectile) {

            projectile = new Projectile(context, that, world, level, body.m_position, that.vector, that.counter);

        } else {

            projectile.reset(context, body.m_position, that.vector);

        }

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
