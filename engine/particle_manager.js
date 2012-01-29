// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleManager(fluidSolver, level, maxParticles) {

    this.activeParticles = [];

    this.particlePool = new ObjectPool(Particle);

    this.logicControllers = {};

    this.renderControllers = {};

    this.level = level;

}

ParticleManager.prototype = {

    addLogicController: function (id, particleLogicController) {

        this.logicControllers[id] = particleLogicController;

    },

    addRenderController: function (id, particleRenderController) {

        this.renderControllers[id] = particleRenderController;

    },

    getNewParticle: function (logicControllerId, renderControllerId) {

        var logicController = this.logicControllers[logicControllerId];

        var renderController = this.renderControllers[renderControllerId];

        var particle = this.particlePool.create();

        particle.setControllers(logicController, renderController);

        return particle;

    },

    add: function (particle, context, level, x, y) {

        particle.init(context, level, x, y);

        this.activeParticles.push( particle );

        return particle;

    },

    update: function(context, vScale) {

        this.numParticles = this.activeParticles.length;

        for (var i = 0; i < this.numParticles; i++) {

            var particle = this.activeParticles[i];

            if (particle.remove) {

                this.activeParticles.splice(i, 1);

                this.particlePool.release(particle);

                this.numParticles--;

            }

        }

        this.numParticles = this.activeParticles.length;

        for (var i = 0; i < this.numParticles; i++) {

            var particle = this.activeParticles[i];

            this.activeParticles[i].update(context, this.level);

        }

    },

    render: function (context, matrix) {

        this.numParticles = this.activeParticles.length;

        var renderer = context.renderer;

        renderer.beginTransform(matrix);

        for (var i = 0; i < this.numParticles; i++) {

            this.activeParticles[i].render(context, renderer, this);

        }

        renderer.endTransform();

    }

}
