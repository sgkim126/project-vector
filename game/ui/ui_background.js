// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UIBackground() {

    this.prototype = Object.extend(this, new DisplayNode());

}

UIBackground.prototype = {

    onRender: function(context) {

        context.renderer.clear();

    }

};
