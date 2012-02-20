// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ControlMove(entity, bodyComponent) {

    this.entity = entity;

    this.bodyComponent = bodyComponent;

    this.enabled = true;

    this.velocity = new box2d.Vec2();

    this.avgXLog = [];

    this.avgYLog = [];

    this.direction = new box2d.Vec2();

}

ControlMove.prototype = {

    onUpdate: function (context) {

        var controls = context.controls;

        var isDemo = context.gameMode == 'demo';

        //context.recordInput = true;

        var updateCounter = this.entity.updateCounter;

        if (controls.isDragging || isDemo) {

            if (context.recordInput) {

                console.log(updateCounter+ ': { x:' + controls.normalDeltaX + ', y: ' + controls.normalDeltaY + '},');

            }

            if (isDemo && !demoData[updateCounter])
                return;

            var controlX = 0;

            var controlY = 0;

            if (isDemo) {

                controlX = demoData[updateCounter].x;

                controlY = demoData[updateCounter].y;

            } else {

                controlX = controls.normalDeltaX;

                controlY = controls.normalDeltaY;

            }

            this.velocity.x = controlX * 220000;

            this.velocity.y = controlY * 220000;

            this.bodyComponent.applyForce(context, this.velocity);

            this.direction.x += controlX;

            //FIXME: Screen Ratio
            this.direction.y += controlY * (16 / 9);

            var dx = this.direction.x * 5;

            var dy = this.direction.y * 5;

            var d = Math.sqrt(dx * dx + dy * dy);

            if (d > 1) {

                this.direction.x /= d;

                this.direction.y /= d;

            }

            if (d > 0.00005) {

                dx /= d;

                dy /= d;

                this.entity.weaponVector.x = -dx * this.entity.weaponPower;

                this.entity.weaponVector.y = -dy * this.entity.weaponPower;

                var rotation = Math.atan2(dy, dx);

                this.entity.basicSprite.rotation = rotation + (Math.PI / 2);

            }

            if (this.avgXLog.length > 5) {

                this.avgXLog.shift();

                this.avgYLog.shift();
            }

        }

    },

};
