// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleFluidLogicController(level, fluidSolver) {

    this.fluidSolver = fluidSolver;

    this.n = this.fluidSolver.N;

    this.cellWidth = level.width / this.n;

    this.cellHeight = level.height / this.n;

}

ParticleFluidLogicController.prototype = {

    init: function (context, level, particle) {

    },

    update: function (context, level, particle) {

        var fluidSolver = this.fluidSolver;

        var cellWidth = this.cellWidth;

        var cellHeight = this.cellHeight;

        var n = this.n;

        var cellX = Math.floor(particle.x / cellWidth);

        var cellY = Math.floor(particle.y / cellHeight);

        var dx = fluidSolver.getDx(cellX, cellY);

        var dy = fluidSolver.getDy(cellX, cellY);

        var lX = particle.x - cellX * cellWidth - cellWidth / 2;

        var lY = particle.y - cellY * cellHeight - cellHeight / 2;

        var v, h, vf, hf;

        if (lX > 0) {

            v = Math.min(n, cellX + 1);

            vf = 1;

        } else {

            v = Math.min(n, cellX - 1);

            vf = -1;

        }

        if (lY > 0) {

            h = Math.min(n, cellY + 1);

            hf = 1;

        } else {

            h = Math.min(n, cellY - 1);

            hf = -1;

        }

        var dxv = fluidSolver.getDx(v, cellY);

        var dxh = fluidSolver.getDx(cellX, h);

        var dxvh = fluidSolver.getDx(v, h);

        var dyv = fluidSolver.getDy(v, cellY);

        var dyh = fluidSolver.getDy(cellX, h);

        var dyvh = fluidSolver.getDy(v, h);

        var lerp = this.lerp;

        dx = lerp(lerp(dx, dxv, hf * lY / cellWidth), lerp(dxh, dxvh, hf * lY / cellWidth), vf * lX / cellHeight);

        dy = lerp(lerp(dy, dyv, hf * lY / cellWidth), lerp(dyh, dyvh, hf * lY / cellWidth), vf * lX / cellHeight);

        particle.x += dx * 10;

        particle.y += dy * 10;

        if (particle.x < 10 || particle.x >= level.width - 10) {

            particle.x = Math.random() * level.width;

        }

        if (particle.y < 10 || particle.y >= level.height - 20) {

            particle.y = Math.random() * level.height;

        }

    },

    lerp: function (v1, v2, i) {

        return v2 * i + v1 * (1 - i);

    }

};
