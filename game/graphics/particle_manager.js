// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ParticleManager(fluidSolver, level, maxParticles) {

    this.particles = [];

    this.level = level;

    this.fluidSolver = fluidSolver;

    this.pointer = 0;

}

ParticleManager.prototype = {

    add: function (x, y) {

        this.particles.push( { x: x, y: y } );

    },

    setPosition: function (x, y) {

        var index = this.pointer % this.particles.length;

        var particle = this.particles[index];

        particle.x = x;

        particle.y = y;

        this.pointer++;

    },

    update: function(context, vScale) {

        this.numParticles = this.particles.length;

        var fluidSolver = this.fluidSolver;

        var n = this.fluidSolver.N;

        var cellWidth = this.level.width / n;
        var cellHeight = this.level.height / n;

        for (var i = 0; i < this.numParticles; i++) {

            var p = this.particles[i];

            var cellX = Math.floor(p.x / cellWidth);
            var cellY = Math.floor(p.y / cellHeight);

            var dx = fluidSolver.getDx(cellX, cellY);
            var dy = fluidSolver.getDy(cellX, cellY);

            var lX = p.x - cellX * cellWidth - cellWidth / 2;
            var lY = p.y - cellY * cellHeight - cellHeight / 2;

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

            p.x += dx * 10;
            p.y += dy * 10;

            if (p.x < 10 || p.x >= this.level.width-10) {
                p.x = Math.random() * this.level.width;
            }

            if (p.y < 10 || p.y >= this.level.height-20) {
                p.y = Math.random() * this.level.height;
            }

        }

    },

    render: function (context, matrix) {

        var renderer = context.renderer;

        renderer.beginTransform(matrix);

        for (var i = 0; i < this.numParticles; i++) {

            var p = this.particles[i];

            renderer.drawCircle(p.x, p.y, 3, 4);

        }

        renderer.endTransform();

    },

    lerp: function (v1, v2, i) {

        return v2 * i + v1 * (1 - i);

    }

}
