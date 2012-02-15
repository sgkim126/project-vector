// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Enemy1(context, world, level, target, x, y, type) {

    var that = this;

    this.prototype = Object.extend(this, new GeomWarsEntity(context, world));

    this.hitCount = 2;

    this.target = target;

    this.level = level;

    this.velocity = new box2d.Vec2();

    var vec2Pool = context.vec2Pool;

    this.explosionForce = 0;

    var model = models.cube;

    var events = context.events;

    var timerRegistery = context.timerRegistery;

    this.brightTween = new Tween();

    this.explodeForceTween = new Tween();

    this.fadeOutTween = new Tween();

    this.explodeTween = new Tween();

    this.state = 'enter';

    this.data = {

        contactEvent: function ( body, contact ) {

            if (body.m_userData && body.m_userData.name === 'projectile') {

                that.hitCount--;

                body.m_userData.name = 'spent_projectile';

                if (that.hitCount > 0) {

                    that.brightTween.init(events, that.basicSprite, 'brightness', Tween.regularEaseOut, 1, 0, 0.33);

                    that.brightTween.start();

                }

                else if (that.hitCount === 0) {

                    that.state = 'dead';

                    context.score += 12;

                    //that.target.components.remove(context, 'weapon');

                    timerRegistery.add('entity_' + that.id, 0.5, that.die);

                    var thatbody = that.bodyComponent.object;

                    thatbody.m_shapeList.m_groupIndex = -1;

                    var position = thatbody.m_position;

                    var fluidSolver = that.level.fluidSolver;

                    var N = fluidSolver.N;

                    var particleSpread = 150;

                    for (var i = 0; i < 20; i++) {

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

                    that.explodeForceTween.init(events, that, 'explosionForce', Tween.regularEaseOut, 135, 0, 0.2);

                    that.fadeOutTween.init(events, that.basicSprite, 'alpha', Tween.regularEaseOut, 1, 0, 0.15);

                    that.explodeTween.init(events, that.basicSprite, 'scaleModify', Tween.regularEaseOut, 1, 2, 0.15);

                    that.fadeOutTween.start();

                    that.explodeTween.start();

                    that.explodeForceTween.start();

                    var explodeEntity = new Explosion(context, world, level, thatbody.m_position, that.type);

                    level.addEntity(context, explodeEntity);

                }

            }

        },

        name: 'enemy1'

    }

    this.die = function (context) {

        level.removeEntity(context, that);

    }

    var textureId = 'enemy1';

    this.type = type;

    switch (type) {
        case 1:
            textureId = 'enemy1';
            break;
        case 2:
            textureId = 'enemy2';
            break;
        case 3:
            textureId = 'enemy3';
            break;
        case 4:
            textureId = 'enemy4';
            break;
    }

    this.bodyComponent = new CircleBody(this, world, level, x, y, 20, 0, this.data);

    this.components.add(context, this.bodyComponent, 'body');

    this.basicSprite = new BasicSprite(this, this.bodyComponent, textureId);

    this.components.add(context, this.basicSprite, 'sprite');

    var fadeInTween = new Tween(events, this.basicSprite, 'alpha', Tween.regularEaseOut, 0, 1, 1.5);

    fadeInTween.start();

    fadeInTween.addEventListener('onMotionFinished', function(e) {

        that.state = 'follow';

    });

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

        if (this.state == 'follow') {

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

        }

    },

    onRender: function (context) {

    }

};
