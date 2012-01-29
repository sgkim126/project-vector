// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleSpriteRendererController() {

}

ParticleSpriteRendererController.prototype = {

    init: function (context, level, particle) {

        particle.info.animationLength = particle.info.spriteAnimation.length;

    },

    render: function (context, renderer, particle) {

        var info = particle.info;

        var animationSpeed = info.animationSpeed;

        var frame = Math.floor((particle.lifeTimer / info.animationLength) * 60 * animationSpeed);

        var a = info.spriteAnimation[frame % info.animationLength];

        var texture = context.assetManager.getAsset(a[0]);

        renderer.drawSprite(texture, a[1], a[2], a[3], a[4], particle.x, particle.y);

    }

};
