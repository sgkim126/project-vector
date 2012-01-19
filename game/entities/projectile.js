// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Projectile(context, world, level, position, vector, id) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    this.id = id;

    this.vector = vector;

    var timerRegistery = context.timerRegistery;

    this.data = new function() {

        this.contactEvent = function ( body, contact ) {

            timerRegistery.add('bullet_' + that.id, 0.15, that.die);

            that.bodyComponent.object.m_shapeList.m_groupIndex = -1;

        }

        this.name = 'projectile';

    }

    this.die = function (context) {

        level.removeEntity(context, that);

    }

    this.bodyComponent = new SquareBody(this, world, level, 5, 5, position.x, position.y, 1, this.data);

    this.components.add(context, this.bodyComponent, 'body');

};

Projectile.prototype = {

    onInitalize: function (context) {

        var timerRegistery = context.timerRegistery;
        var body = this.bodyComponent.object;

        body.m_force.add( this.vector );

        timerRegistery.add('bullet_' + this.id, 5, this.die);

    },

    onRemove: function (context) {

    },

    onRender: function (context) {

    }

};
