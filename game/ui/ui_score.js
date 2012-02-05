// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIScore(context) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;

    var assetManager = context.assetManager;

    this.scale = 1;

    this.brightness = 0;

    this.alpha = 1;

    this.x = 0;

    this.y = 0;

    this.digits = [];

    for (var i = 0; i < 10; i++) {

        this.digits[i] = assetManager.getAsset('d' + i);

    }

    this.width = this.digits[0].width;

    this.height = this.digits[0].height;

    this.centerX = -this.width / 2;

    this.centerY = -this.height / 2;

    this.digitWidth = this.width * 0.7;

}

UIScore.prototype = {

    onUpdate: function(context) {

        this.matrix.SetIdentity();

        this.matrix.Scale(this.scale, this.scale);

        this.matrix.Translate(this.x, this.y);

    },

    onRender: function(context) {

        var horizontal = 0;

        var renderer = context.renderer;

        var score = '' + context.score;

        renderer.beginTransform(this.drawMatrix);

        var scoreDigits = score.split('');

        for (var i = 0; i < scoreDigits.length; i++) {

            var digit = scoreDigits[i];

            renderer.drawImageSimpleAlpha(this.digits[digit], horizontal, 0, this.alpha);

            horizontal += this.digitWidth;

        }

        scoreDigits = null;

        score = null;

        renderer.endTransform();

    }

};
