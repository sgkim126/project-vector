// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleBasicRendererController() {

}

ParticleBasicRendererController.prototype = {

    init: function (context, level, particle) {

    },

    render: function (context, renderer, particle) {

        renderer.drawCircle(particle.x, particle.y, 6, 4, particle.internalAlpha * 0.5, particle.info.color);

    }

};
