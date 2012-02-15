// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Projectile(context, world, level, position, vector, id) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    this.id = id;

    this.vector = vector;

    var model = models.octahedron;

    var events = context.events;

    var timerRegistery = context.timerRegistery;

    this.data = {

        contactEvent: function ( body, contact ) {

            timerRegistery.add('bullet_' + that.id, 0.35, that.die);

            that.bodyComponent.object.m_shapeList.m_groupIndex = -1;

            //var fadeOutTween = new Tween(events, that.basicSprite, 'alpha', Tween.regularEaseIn, 1, 0, 0.35);

            //fadeOutTween.start();

        },

        name: 'projectile'

    };

    this.die = function (context) {

        level.removeEntity(context, that);

    }

    this.bodyComponent = new SquareBody(this, world, level, 5, 5, position.x, position.y, 1, this.data);

    //this.vectorDraw3DComponent = new VectorDraw3D(this, model, this.bodyComponent, '#FF5500', 0.4);

    //this.components.add(context, this.vectorDraw3DComponent, 'sprite');

    this.components.add(context, this.bodyComponent, 'body');

    this.basicSprite = new BasicSprite(this, this.bodyComponent, 'bullet');

    this.basicSprite.handleOffsetY = 1.3;

    this.basicSprite.overrideRotation = true;

    this.components.add(context, this.basicSprite, 'sprite');

    this.velocity = new box2d.Vec2();

};

Projectile.prototype = {

    onInitalize: function (context) {

        var timerRegistery = context.timerRegistery;

        var events = context.events;

        var body = this.bodyComponent.object;

        body.m_force.add( this.vector );

        timerRegistery.add('bullet_' + this.id, 5, this.die);

        //var fadeInTween = new Tween(events, this.basicSprite, 'alpha', Tween.regularEaseIn, 0, 1, 0.05);

        //var brightInTween = new Tween(events, this.basicSprite, 'brightness', Tween.regularEaseIn, 1, 0, 0.25);

        //fadeInTween.start();

        //brightInTween.start();

    },

    onUpdate: function (context) {

        this.velocity.SetV(this.bodyComponent.object.m_linearVelocity);

        var v = this.velocity;

        if (Math.abs(v.x * v.x + v.y * v.y) > 0.01 * 0.01) {

            v.Normalize();

            this.rotation = Math.atan2(v.y, v.x);

            this.basicSprite.enabled = true;

        } else {

            this.basicSprite.enabled = false;

        }

        this.basicSprite.rotation = this.rotation - (Math.PI / 2);

    },

    onRemove: function (context) {

    },

    onRender: function (context) {

    }

};
