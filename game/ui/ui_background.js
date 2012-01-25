// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIBackground() {

    this.prototype = Object.extend(this, new DisplayNode());

    this.alpha = 1;

}

UIBackground.prototype = {

    onRender: function(context) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var mat33Pool = context.mat33Pool;

        var matrix = mat33Pool.create();

        matrix.Scale(0.5, 0.5);

        renderer.drawImage(camera, assetManager.getAsset('back'), matrix, 0, this.alpha);

        mat33Pool.release(matrix);

    }

};
