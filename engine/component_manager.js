// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ComponentManager() {

    this.components = {};

}

ComponentManager.prototype = {

    update: function (context) {

        for (var id in this.components) {

            var component = this.components[id];

            if (component.enabled && component.onUpdate) {

                component.onUpdate(context);

            }

        }

    },

    render: function (context) {

        for (var id in this.components) {

            var component = this.components[id];

            if (component.enabled && component.onRender) {

                component.onRender(context);

            }

        }

    },

    initalize: function (context) {

    },

    add: function(context, component, id) {

        if (!component.initalized) {

            if (component.onInitalize) {

                component.initalized = true;

                component.onInitalize(context);

            }

        }

        if (component.onAdd) {

            component.onAdd(context);

        }

        this.components[id] = component;

    },

    remove: function (context, id) {

        var removedComponent = this.components[id];

        if (!removedComponent)
            return;

        if (removedComponent.onRemove) {

            removedComponent.onRemove(context);

        }

        delete this.components[id];

    },

    removeAll: function (context) {

        for (var id in this.components) {

            var removedComponent = this.components[id];

            this.components[id] = null;

            if (removedComponent.onRemove) {

                removedComponent.onRemove(context);

            }

        }

        this.components.length = 0;

    },

    get: function (id) {

        return this.components[id];

    }

};
