// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Projectile(context, world, level, position, vector, id) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    this.id = id;

    this.vector = vector;

    var events = context.events;

    var timerRegistery = context.timerRegistery;

    this.data = new function() {

        this.contactEvent = function ( body, contact ) {

            timerRegistery.add('bullet_' + that.id, 0.15, that.die);

            that.bodyComponent.object.m_shapeList.m_groupIndex = -1;

            var fadeOutTween = new Tween(events, that.vectorDraw3DComponent, 'alpha', Tween.regularEaseIn, 1, 0, 0.15);

            fadeOutTween.start();

        }

        this.name = 'projectile';

    }

    this.die = function (context) {

        level.removeEntity(context, that);

    }

    this.bodyComponent = new SquareBody(this, world, level, 5, 5, position.x, position.y, 1, this.data);

    this.vectorDraw3DComponent = new VectorDraw3D(this, this.bodyComponent, '#FF5500', 0.4);

    this.components.add(context, this.vectorDraw3DComponent, 'sprite');

    this.components.add(context, this.bodyComponent, 'body');

};

Projectile.prototype = {

    onInitalize: function (context) {

        var timerRegistery = context.timerRegistery;

        var events = context.events;

        var body = this.bodyComponent.object;

        body.m_force.add( this.vector );

        timerRegistery.add('bullet_' + this.id, 5, this.die);

        var fadeInTween = new Tween(events, this.vectorDraw3DComponent, 'alpha', Tween.regularEaseIn, 0, 1, 0.05);

        fadeInTween.start();

    },

    onRemove: function (context) {

    },

    onRender: function (context) {

    }

};
