// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Enemy1(context, world, level, target, x, y, textureId) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    this.hitCount = 6;

    this.target = target;

    this.level = level;

    this.velocity = new box2d.Vec2();

    this.explosionForce = 0;

    var model = models.icosahedron;

    var events = context.events;

    var timerRegistery = context.timerRegistery;

    this.data = new function() {

        this.contactEvent = function ( body, contact ) {

            if (body.m_userData && body.m_userData.name === 'projectile') {

                that.hitCount--;

                body.m_userData.name = 'spent_projectile';

                if (that.hitCount <= 0) {

                    timerRegistery.add('bullet_' + that.id, 0.15, that.die);

                    that.bodyComponent.object.m_shapeList.m_groupIndex = -1;

                    var position = that.bodyComponent.object.m_position;

                    var fluidSolver = that.level.fluidSolver;

                    that.explodeX = Math.floor((position.x / that.level.width) * fluidSolver.N);

                    that.explodeY = Math.floor((position.y / that.level.height) * fluidSolver.N);

                    var explodeForceTween = new Tween(events, that, 'explosionForce', Tween.regularEaseIn, 0, 200, 0.05);

                    var fadeOutTween = new Tween(events, that.vectorDraw3DComponent, 'alpha', Tween.regularEaseOut, 1, 0, 0.15);

                    var explodeTween = new Tween(events, that.vectorDraw3DComponent, 'scaleModify', Tween.regularEaseOut, 1, 2, 0.15);

                    fadeOutTween.start();

                    explodeTween.start();

                    explodeForceTween.start();

                }

            }

        }

        this.name = 'enemy1';

    }

    this.die = function (context) {

        level.removeEntity(context, that);

    }

    this.bodyComponent = new CircleBody(this, world, level, x, y, 20, 0, this.data);

    this.vectorDraw3DComponent = new VectorDraw3D(this, model, this.bodyComponent, '#2255FF', 1.05);

    this.components.add(context, this.vectorDraw3DComponent, 'sprite');

    this.components.add(context, this.bodyComponent, 'body');

};

Enemy1.prototype = {

    onInitalize: function (context) {

    },

    onUpdate: function (context) {

        if (this.explosionForce > 0) {

            var fluidSolver = this.level.fluidSolver;

            fluidSolver.applyForce(this.explodeX, this.explodeY, this.explosionForce, this.explosionForce);

        }

        var targetBody = this.target.bodyComponent.object;
        var body = this.bodyComponent.object;

        this.lastX = targetBody.m_position.x;
        this.lastY = targetBody.m_position.y;
        this.x = body.m_position.x;
        this.y = body.m_position.y;

        var dx = this.x - this.lastX;
        var dy = this.y - this.lastY;

        var d = Math.sqrt(dx * dx + dy * dy);

        if (d > 0.00001) {

            dx /= d;
            dy /= d;

            this.velocity.x = -dx * 5600;
            this.velocity.y = -dy * 5600;

            body.m_force.add(this.velocity);

        }

    },

    onRender: function (context) {

    }

};
