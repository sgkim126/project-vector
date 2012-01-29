// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Particle() {

    this.info = {};

}

Particle.prototype = {

    setControllers: function (logicController, renderController) {

        this.logicController = logicController;

        this.renderController = renderController;

    },

    init: function (context, level, x, y) {

        this.x = x;

        this.y = y;

        this.lifeTimer = 0;

        this.internalAlpha = 1;

        this.remove = false;

        this.logicController.init(context, level, this);

        this.renderController.init(context, level, this);

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
