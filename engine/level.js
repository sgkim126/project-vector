// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.AABB');
goog.require('box2d.Vec2');
goog.require('box2d.World');

function Level() {

    this.entities = [];

    this.addQueueEntities = [];

    this.removeQueueEntities = [];

    this.world = null;

    this.destroyBodyList = [];

    this.components = new ComponentManager();

}

Level.prototype = {

    initalize: function (context) {

        box2d.Settings.b2_linearSlop = 0.05;
        box2d.Settings.b2_angularSlop = 0.005;
        box2d.Settings.b2_maxLinearCorrection = 12;

        var worldAABB = new box2d.AABB();

        worldAABB.minVertex.Set(-100, -100);
        worldAABB.maxVertex.Set(1000, 800);

        var gravity = new box2d.Vec2(0, 0);

        var doSleep = true;

        this.world = new box2d.World(worldAABB, gravity, doSleep);

        if (this.onInitalize) {

            this.onInitalize(context);

        }

    },

    destroy: function (context) {

        if (this.onDestroy) {

            this.onDestroy(context);

        }

    },

    update: function (context) {

        this.components.update(context);

        if (this.onUpdate) {

            this.onUpdate(context);

        }

        while (this.addQueueEntities.length > 0) {

            var entity = this.addQueueEntities.pop();

            entity.initalize(context);

            this.entities.push(entity);

        }

        while (this.removeQueueEntities.length > 0) {

            var entity = this.removeQueueEntities.pop();

            var index = this.entities.indexOf(entity);

            if (index != -1) {

                this.entities.splice(index, 1);
                entity.remove(context);
                entity = null;

            }

        }

        for (var i = 0; i < this.entities.length; i++) {

            this.entities[i].update(context);

        }

        this.world.Step(context.timeStep, 1);

        while (this.destroyBodyList.length > 0) {

            var body = this.destroyBodyList.pop();

            this.world.DestroyBody(body);

        }

        //this.world.CleanBodyList();

        for (var c = this.world.GetContactList(); c; c = c.GetNext()) {

            if (c.GetManifoldCount() > 0) {

                var body1 = c.GetShape1().GetBody();
                var body2 = c.GetShape2().GetBody();

                if (body1.m_userData)
                    if (body1.m_userData.contactEvent)
                        body1.m_userData.contactEvent( body2, c );

                if (body2.m_userData)
                    if (body2.m_userData.contactEvent)
                        body2.m_userData.contactEvent( body1, c );

            }

        }

    },

    render: function (context) {

        this.components.render(context);

        if (this.onRender) {

            this.onRender(context);

        }

    },

    drawEntities: function (context) {

        for (var i = 0; i < this.entities.length; i++) {

            this.entities[i].render(context);

        }

    },

    addEntity: function (context, entity) {

        if (this.entities.indexOf(entity) != -1)
            throw new Error('Entity already added to level.');

        this.addQueueEntities.push(entity);

    },

    removeEntity: function (context, entity) {

        this.removeQueueEntities.push(entity);

    },

    destroyBody: function (body) {

        this.destroyBodyList.push(body);

    }

}
