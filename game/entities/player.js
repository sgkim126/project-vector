// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Player(context, world, level, x, y, textureId) {

    this.prototype = Object.extend(this, new GeomWarsEntity(context, world));

    this.weaponPower = 250000;

    this.weaponVector = new box2d.Vec2(0, 1 * this.weaponPower);

    this.bodyComponent = new CircleBody(this, world, level, x, y, 12, 1);

    this.cameraFollowComponent = new CameraFollow(this, this.bodyComponent);

    this.controlMoveComponent = new ControlMove(this, this.bodyComponent);

    this.weaponComponent = new Weapon(this, world, level, this.bodyComponent, this.weaponVector);

    this.basicSprite = new BasicSprite(this, this.bodyComponent, 'player');

    this.basicSprite.scaleModify = 0.7;

    this.basicSprite.overrideRotation = true;

    this.components.add(context, this.bodyComponent, 'body');

    this.components.add(context, this.cameraFollowComponent, 'camera');

    this.components.add(context, this.controlMoveComponent, 'control');

    this.components.add(context, this.weaponComponent, 'weapon');

    this.components.add(context, this.basicSprite, 'sprite');

};

Player.prototype = {

    onInitalize: function (context) {

        var body = this.bodyComponent;

        var events = context.events;

        var fadeInTween = new Tween(events, this.basicSprite, 'alpha', Tween.regularEaseIn, 0, 1, 0.25);

        fadeInTween.start();

        this.lastX = 0;

        this.lastY = 0;

        this.x = 0;

        this.y = 0;

    },

    onUpdate: function (context) {

    },

    onRender: function (context) {

    }

};
