// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Player(context, world, level, x, y, textureId) {

    this.prototype = Object.extend(this, new GeomWarsEntity(context, world));

    var that = this;

    this.weaponPower = 250000;

    this.weaponVector = new box2d.Vec2(0, 1 * this.weaponPower);

    this.timerRegistery = context.timerRegistery;

    this.playerInvincible = false;

    this.flashTween = new Tween();

    this.blurTween = new Tween();

    this.events = context.events;

    this.data = {

        name: 'player',

        contactEvent: function( collidingBody, contact ) {
            
            if( collidingBody.m_userData && collidingBody.m_userData.name === 'enemy1' ) {

                if( !that.playerInvincible ) {
                    
                    context.score -= 10;

                    if(context.score < 0) {
                        context.score = 0;
                    }
                    
                    that.flashTween.init( that.events, level, 'flashAlpha', null, 0.5, 0, 1 );

                    that.flashTween.start();

                    that.blurTween.init( that.events, that.basicSprite, 'shadowBlur', null, 20, 0, 2 );

                    that.blurTween.start();

                    that.playerInvincible = true;

                    that.timerRegistery.add( 'playerInvincible', 2, function() {
                        
                        that.playerInvincible = false;

                    });
                    
                }
            }
        }
    }

    this.bodyComponent = new CircleBody(this, world, level, x, y, 12, 1, this.data);

    this.cameraFollowComponent = new CameraFollow(this, this.bodyComponent);

    this.controlMoveComponent = new ControlMove(this, this.bodyComponent);

    this.weaponComponent = new Weapon(this, world, level, this.bodyComponent, this.weaponVector);

    this.basicSprite = new BasicSprite(this, this.bodyComponent, 'player');

    this.basicSprite.scaleModify = 0.7;

    this.basicSprite.overrideRotation = true;

    this.basicSprite.shadowColor = 'rgba(255, 0, 0, 1)';

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
