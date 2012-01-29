// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleSpriteRendererController() {

}

ParticleSpriteRendererController.prototype = {

    init: function (context, level, particle) {

        particle.info.spriteAnimation = spriteAnimations.explosion;

        particle.info.animationLength = spriteAnimations.explosion.length;

        particle.info.texture = context.assetManager.getAsset('sprites_1');

    },

    render: function (context, renderer, particle) {

        var info = particle.info;

        var frame = Math.floor((particle.lifeTimer / info.animationLength) * 60 * 5);

        var a = info.spriteAnimation[frame % info.animationLength];

        renderer.drawSprite(particle.info.texture, a[1], a[2], a[3], a[4], particle.x, particle.y);

    }

};
