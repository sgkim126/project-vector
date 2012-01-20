// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Player(context, world, level, x, y, textureId) {

    this.prototype = Object.extend(this, new Entity(context, world));

    this.weaponPower = 250000;

    this.weaponVector = new box2d.Vec2(1 * this.weaponPower, 0);

    this.bodyComponent = new CircleBody(this, world, level, x, y, 12, 1);
    this.cameraFollowComponent = new CameraFollow(this, this.bodyComponent);
    this.controlMoveComponent = new ControlMove(this, this.bodyComponent);
    this.vectorDraw3DComponent = new VectorDraw3D(this, this.bodyComponent, '#FFFF00', 0.75);
    this.weaponComponent = new Weapon(this, world, level, this.bodyComponent, this.weaponVector);

    this.components.add(context, this.bodyComponent, 'body');
    this.components.add(context, this.cameraFollowComponent, 'camera');
    this.components.add(context, this.controlMoveComponent, 'control');
    this.components.add(context, this.weaponComponent, 'weapon');
    this.components.add(context, this.vectorDraw3DComponent, 'sprite');

};

Player.prototype = {

    onInitalize: function (context) {

        var body = this.bodyComponent;

        var events = context.events;

        var fadeInTween = new Tween(events, this.vectorDraw3DComponent, 'alpha', Tween.regularEaseIn, 0, 1, 0.25);

        fadeInTween.start();

        this.lastX = 0;
        this.lastY = 0;
        this.x = 0;
        this.y = 0;
    },

    onUpdate: function (context) {

        var controls = context.controls;

        if (controls.isDragging) {

        var body = this.bodyComponent.object;

            this.lastX = this.x;
            this.lastY = this.y;
            this.x = body.m_position.x;
            this.y = body.m_position.y;

            var dx = this.x - this.lastX;
            var dy = this.y - this.lastY;

            var d = Math.sqrt(dx * dx + dy * dy);

            if (d > 0.00001) {

                dx /= d;
                dy /= d;

                this.weaponVector.x = -dx * this.weaponPower;
                this.weaponVector.y = -dy * this.weaponPower;

            }

        }
    },

    onRender: function (context) {

    }

};
