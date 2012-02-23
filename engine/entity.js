// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Entity(context, world) {

    this.components = new ComponentManager();

    this.id = Entity.idCounter++;

};

Entity.idCounter = 0;

Entity.prototype = {

    initalize: function (context) {

        this.components.initalize(context);

        if (this.onInitalize) {

            this.onInitalize(context);

        }

    },

    remove: function (context) {

        var that = this;

        setTimeout(function () {

            if (this.onRemove) {

                that.onRemove(context);

            }

        }, 100);

    },

    update: function (context) {

        this.components.update(context);

        if (this.onUpdate) {

            this.onUpdate(context);

        }

    },

    render: function (context) {

        this.components.render(context);

        if (this.onRender) {

            this.onRender(context);

        }

    },

};
