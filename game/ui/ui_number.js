// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UINumber(context, reference, value) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;

    var assetManager = context.assetManager;

    this.scale = 1;

    this.brightness = 0;

    this.alpha = 1;

    this.x = 0;

    this.y = 0;

    this.reference = reference;

    this.value = value;

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

UINumber.prototype = {

    onUpdate: function(context) {

        this.matrix.SetIdentity();

        this.matrix.Scale(this.scale, this.scale);

        this.matrix.Translate(this.x, this.y);

    },

    onRender: function(context) {

        var horizontal = 0;

        var renderer = context.renderer;

        var number = '' + this.reference[this.value];

        renderer.beginTransform(this.drawMatrix);

        var numberDigits = number.split('');

        for (var i = 0; i < numberDigits.length; i++) {

            var digit = numberDigits[i];
            var digitImage = this.digits[digit];

            if(digitImage) {

                renderer.drawImageSimpleAlpha(this.digits[digit], horizontal, 0, this.alpha);

                horizontal += this.digitWidth;

            }

        }

        numberDigits = null;

        number = null;

        renderer.endTransform();

    }

};
