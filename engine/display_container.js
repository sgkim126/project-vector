// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function DisplayContainer(context) {

    this.prototype = Object.extend(this, new DisplayNode());

    this.scale = 1;
    this.alpha = 1;

    this.x = 0;
    this.y = 0;

}

DisplayContainer.prototype = {

    onUpdate: function(context) {

        this.matrix.SetIdentity();
        this.matrix.Scale(this.scale, this.scale);
        this.matrix.Translate(this.x, this.y);

    }

};
