// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleSpriteRendererController() {

}

ParticleSpriteRendererController.prototype = {

    init: function (context, level, particle) {

        particle.info.texture = context.assetManager.getAsset(particle.info.sprite);

    },

    render: function (context, renderer, particle) {

        renderer.drawImageSimpleAlpha(particle.info.texture, particle.x, particle.y, particle.internalAlpha);

    }

};
