// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function UILevel() {

    this.prototype = Object.extend(this, new DisplayNode());

}

UILevel.prototype = {

    onRender: function(context) {

        context.engine.renderLevel(context);

    }

};
