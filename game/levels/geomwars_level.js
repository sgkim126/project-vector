// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.AABB');
goog.require('box2d.Vec2');
goog.require('box2d.World');
goog.require('box2d.BoxDef');

function GeomWarsLevel() {

    this.prototype = Object.extend(this, new Level());

    var that = this;

    this.vScale = 50;

    this.width = 1000;
    this.height = 600;

    this.player = null;

    this.fluidSolver = new FluidSolver();

    this.particleManager = new ParticleManager(this.fluidSolver, this, 80);

    for (var i = 0; i < 80; i++) {

        var x = Math.random() * this.width;
        var y = Math.random() * this.height;

        this.particleManager.add(x, y);

    }

    this.createBox = function (world, x, y, width, height, fixed, userData) {

        if (typeof(fixed) == 'undefined') fixed = true;

        var boxSd = new box2d.BoxDef();
        if (!fixed) boxSd.density = 1.0;
        boxSd.userData = userData;
        boxSd.extents.Set(width, height);

        var boxBd = new box2d.BodyDef();
        boxBd.AddShape(boxSd);
        boxBd.position.Set(x, y);

        return world.CreateBody(boxBd);

    };

    this.spawnEnemy = function (context, player) {

        var timerRegistery = context.timerRegistery;

        var randomX = (Math.random() * 200) + 50;
        var randomY = (Math.random() * 200) + 50;

        var enemy1 = new Enemy1(context, that.world, that, player, randomX, randomY);

        this.addEntity(context, enemy1);

        timerRegistery.add('spawn', 4, function () { that.spawnEnemy(context, player); } );

    }

}

GeomWarsLevel.prototype = {

    onInitalize: function (context) {

        var that = this;

        this.player = new Player(context, this.world, this, 500, 300, 'fur');

        context.camera.setPosition(500, 300);

        this.addEntity(context, this.player);

        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;

        this.createBox(this.world, 10, halfHeight, 10, halfHeight, true, 'ground');
        this.createBox(this.world, halfWidth, 10, halfWidth, 10, true, 'ground');
        this.createBox(this.world, this.width - 10, halfHeight, 10, halfHeight, true, 'ground');
        this.createBox(this.world, halfWidth, this.height - 10, halfWidth, 10, true, 'ground');

        var timerRegistery = context.timerRegistery;

        timerRegistery.add('spawn', 4, function () { that.spawnEnemy(context, that.player); } );

    },

    onUpdate: function (context) {

        var visc = 0.0001;
        var diff = 0.3;

        this.vScale = context.timeStep * 1.25;

        var controls = context.controls;

        if (controls.isDragging) {

            var mat33Pool = context.mat33Pool;
            var camera = context.camera;
            var fluidSolver = this.fluidSolver;

            var matrix = mat33Pool.create();
            var backMatrix = mat33Pool.create();

            camera.worldTransform(matrix, 0.9, backMatrix);

            var hitPoint = engine.Collision.BoxPointTest(controls.positionX, controls.positionY, this.width, this.height, backMatrix, true);

            var hx = hitPoint.x * fluidSolver.N;
            var hy = hitPoint.y * fluidSolver.N;

            var px = controls.normalDeltaX * 200;
            var py = controls.normalDeltaY * 200;

            fluidSolver.applyForce(hx, hy, px, py);

            mat33Pool.release(matrix);
            mat33Pool.release(backMatrix);
        }

        this.fluidSolver.tick(context.timeStep, visc, diff);

        this.particleManager.update(context, this.vScale);

    },

    onRender: function (context) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var mat33Pool = context.mat33Pool;

        var matrix = mat33Pool.create();
        var worldMatrix = mat33Pool.create();
        var backMatrix = mat33Pool.create();
        var gridMatrix0 = mat33Pool.create();
        var gridMatrix1 = mat33Pool.create();
        var gridMatrix2 = mat33Pool.create();

        this.drawBackground(context, backMatrix);

        camera.worldTransform(matrix, 1, worldMatrix);
        camera.worldTransform(matrix, 0.9, gridMatrix0);
        camera.worldTransform(matrix, 0.8, gridMatrix1);
        camera.worldTransform(matrix, 0.7, gridMatrix2);

        this.drawGrid(context, 0.5, this.vScale, gridMatrix0);
        //this.drawGrid(context, 0.3, this.vScale * 0.66, gridMatrix1);
        //this.drawGrid(context, 0.1, this.vScale * 0.33, gridMatrix2);

        //renderer.drawWorld(this.world, worldMatrix);

        this.particleManager.render(context, worldMatrix);

        this.drawBorder(context, worldMatrix);

        this.drawEntities(context);

        mat33Pool.release(matrix);
        mat33Pool.release(worldMatrix);
        mat33Pool.release(backMatrix);
        mat33Pool.release(gridMatrix0);
        mat33Pool.release(gridMatrix1);
        mat33Pool.release(gridMatrix2);

    },

    drawBorder: function(context, matrix) {

        var renderer = context.renderer;

        renderer.beginLines('#FFFFFF', 8, 4, 1, matrix);

        renderer.moveTo(15, 15);
        renderer.lineTo(this.width - 20, 15);
        renderer.lineTo(this.width - 20, this.height - 20);
        renderer.lineTo(15, this.height - 20);
        renderer.lineTo(15, 15);
        renderer.endLines();

    },

    drawBackground: function (context, matrix) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var mat33Pool = context.mat33Pool;

        matrix.Scale(0.5, 0.5);
        renderer.drawImage(camera, assetManager.getAsset('light'), matrix, 0, 1);

    },

    drawGrid: function (context, alpha, vScale, matrix) {

        var renderer = context.renderer;

        renderer.beginLines('#000000', 2, 0, alpha, matrix);

        var fluidSolver = this.fluidSolver;
        var n = fluidSolver.N;

        var xStep = 1 / n;
        var yStep = 1 / n;

        var scaleX = this.width;
        var scaleY = this.height;

        var overflow = 0;

        var x0 = 0;
        var y0 = 0;

        for (var y = -yStep * overflow, y0 = 0; y < (1 - yStep) + (yStep * overflow); y += yStep, y0++) {

            for (var x = -xStep * overflow, x0 = 0; x < (1 - xStep) + (xStep * overflow); x += xStep, x0++) {

                var dx1 = fluidSolver.getDx(x0, y0) * vScale * 2;
                var dy1 = fluidSolver.getDy(x0, y0) * vScale * 2;

                var dx2 = fluidSolver.getDx(x0+1, y0) * vScale * 2;
                var dy2 = fluidSolver.getDy(x0+1, y0) * vScale * 2;

                var dx3 = fluidSolver.getDx(x0, y0+1) * vScale * 2;
                var dy3 = fluidSolver.getDy(x0, y0+1) * vScale * 2;

                var x1 = (x + dx1) * scaleX;
                var y1 = (y + dy1) * scaleY;
                var x2 = (x + xStep + dx2) * scaleX;
                var y2 = (y + dy2) * scaleY;
                var x3 = (x + dx3) * scaleX;
                var y3 = (y + yStep + dy3) * scaleY;

                renderer.moveTo(x1, y1);
                renderer.lineTo(x2, y2);
                renderer.moveTo(x1, y1);
                renderer.lineTo(x3, y3);

            }

        }

        renderer.endLines();

    }

}

