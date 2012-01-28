// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Particle() {

}

Particle.prototype = {

    init: function (context, level, x, y, info, logicController, renderController) {

        this.x = x;

        this.y = y;

        this.info = info;

        this.lifeTimer = 0;

        this.internalAlpha = 1;

        this.remove = false;

        this.logicController = logicController;

        this.renderController = renderController;

        logicController.init(context, level, this);

        renderController.init(context, level, this);

    },

    update: function (context, level) {

        this.logicController.update(context, level, this);

        this.lifeTimer += context.timeStep;

    },

    render: function (context, renderer) {

        this.renderController.render(context, renderer, this);

    },

    Default: function () {

        this.init();

    }

};
