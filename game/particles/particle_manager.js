// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleManager(fluidSolver, level, maxParticles) {

    this.activeParticles = [];

    this.particlePool = new ObjectPool(Particle);

    this.logicControllers = {};

    this.renderControllers = {};

    this.level = level;

    this.pointer = 0;

}

ParticleManager.prototype = {

    addLogicController: function (id, particleLogicController) {

        this.logicControllers[id] = particleLogicController;

    },

    addRenderController: function (id, particleRenderController) {

        this.renderControllers[id] = particleRenderController;

    },

    add: function (context, level, x, y, info, logicControllerId, renderControllerId) {

        var logicController = this.logicControllers[logicControllerId];

        var renderController = this.renderControllers[renderControllerId];

        var newParticle = this.particlePool.create();

        newParticle.init(context, level, x, y, info, logicController, renderController);

        this.activeParticles.push( newParticle );

        return newParticle;

    },

    setPosition: function (x, y) {

        /*var index = this.pointer % this.particles.length;

        var particle = this.particles[index];

        particle.x = x;

        particle.y = y;

        this.pointer++;*/

    },

    update: function(context, vScale) {

        this.numParticles = this.activeParticles.length;

        for (var i = 0; i < this.numParticles; i++) {

            var particle = this.activeParticles[i];

            if (particle.remove) {

                this.particlePool.release(particle);

            } else {

                this.activeParticles[i].update(context, this.level);

            }

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
