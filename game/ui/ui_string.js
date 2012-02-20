// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIString(context, reference, value, text, font, color, stroke) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.context = context;

    this.scale = 1;

    this.brightness = 0;

    this.alpha = 1;

    this.x = 0;

    this.y = 0;

    this.reference = reference;

    this.value = value;

    this.text = text;

    this.font = font;

    this.color = color;

    this.stroke = stroke;

    this.strokeColor = color;

    this.blur = 0;

}

UIString.prototype = {

    onUpdate: function(context) {

        this.matrix.SetIdentity();

        this.matrix.Scale(this.scale, this.scale);

        this.matrix.Translate(this.x, this.y);

    },

    onRender: function(context) {

        var renderer = context.renderer;

        var text = this.text;

        if(this.reference !== null) {

            text = '' + this.text + this.reference[this.value];

        }

        renderer.beginTransform(this.drawMatrix);

        renderer.drawText(text, this.font, this.color, this.stroke, this.strokeColor, 0, 0, this.blur, this.alpha);

        renderer.endTransform();

    }

};
