// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Enemy1(context, world, level, target, x, y, textureId) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    this.hitCount = 1;

    this.target = target;

    this.level = level;

    this.velocity = new box2d.Vec2();

    var vec2Pool = context.vec2Pool;

    this.explosionForce = 0;

    var model = models.cube;

    var events = context.events;

    var timerRegistery = context.timerRegistery;

    this.data = new function() {

        this.contactEvent = function ( body, contact ) {

            if (body.m_userData && body.m_userData.name === 'projectile') {

                that.hitCount--;

                body.m_userData.name = 'spent_projectile';

                if (that.hitCount <= 0) {

                    timerRegistery.add('entity_' + that.id, 0.5, that.die);

                    that.bodyComponent.object.m_shapeList.m_groupIndex = -1;

                    var position = that.bodyComponent.object.m_position;

                    var fluidSolver = that.level.fluidSolver;

                    var N = fluidSolver.N;

                    var particleSpread = 60;

                    for (var i = 0; i < 15; i++) {

                        var rx = position.x + ((Math.random() * particleSpread) - (particleSpread / 2));

                        var ry = position.y + ((Math.random() * particleSpread) - (particleSpread / 2));
 
                        level.createExplosionParticle(context, rx, ry);

                    }

                    that.explodeX = (position.x / level.width) * N;

                    that.explodeY = (position.y / level.height) * N;

                    var dx = position.x - body.m_position.x;

                    var dy = position.y - body.m_position.y;

                    var d = 1 / Math.sqrt(dx * dx + dy * dy);

                    that.explosionDirectionX = dx * d;

                    that.explosionDirectionY = dy * d;

                    var explodeForceTween = new Tween(events, that, 'explosionForce', Tween.regularEaseOut, 175, 0, 0.2);

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

            var dx = this.explosionDirectionX * this.explosionForce;

            var dy = this.explosionDirectionY * this.explosionForce;

            fluidSolver.applyForceIntegerPosition(this.explodeX, this.explodeY, dx, dy);

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
