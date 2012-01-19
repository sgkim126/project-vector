// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Enemy1(context, world, level, target, x, y, textureId) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    this.hitCount = 6;

    this.target = target;

    this.velocity = new box2d.Vec2();

    this.data = new function() {

        this.contactEvent = function ( body, contact ) {

            if (body.m_userData && body.m_userData.name === 'projectile') {

                that.hitCount--;

                body.m_userData.name = 'spent_projectile';

                if (that.hitCount <= 0) {

                    level.removeEntity(context, that);

                }

            }

        }

        this.name = 'enemy1';

    }

    this.bodyComponent = new CircleBody(this, world, level, x, y, 20, 0, this.data);

    this.components.add(context, this.bodyComponent, 'body');

};

Enemy1.prototype = {

    onInitalize: function (context) {

    },

    onUpdate: function (context) {

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
