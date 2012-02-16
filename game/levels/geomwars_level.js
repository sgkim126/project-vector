// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

goog.require('box2d.AABB');
goog.require('box2d.Vec2');
goog.require('box2d.World');
goog.require('box2d.BoxDef');

function GeomWarsLevel(context) {

    this.prototype = Object.extend(this, new Level());

    var that = this;

    this.vScale = 50;

    this.width = 1000;

    this.height = 600;

    this.player = null;

    this.flashAlpha = 0;

    this.fluidSolver = new FluidSolver(context.fluidSolverResolution, context.backgroundAccuracy);

    var n = this.fluidSolver.N;

    this.backgroundParticleManager = new ParticleManager(this.fluidSolver, this, 80);

    this.backgroundParticleManager.addLogicController('fluid', new ParticleFluidLogicController( this, this.fluidSolver ));

    this.backgroundParticleManager.addRenderController('dot', new ParticleBasicRendererController());

    this.backgroundParticleManager.addRenderController('image', new ParticleImageRendererController());

    this.explosionParticleManager = new ParticleManager(this.fluidSolver, this, 80);

    this.explosionParticleManager.addLogicController('fluid', new ParticleFluidLogicController( this, this.fluidSolver ));

    this.explosionParticleManager.addRenderController('dot', new ParticleBasicRendererController());

    this.explosionParticleManager.addRenderController('sprite', new ParticleSpriteRendererController());

    this.gridVertexPositions = new Array(n);

    this.backgroundRenderingEnabled = context.drawBackground;

    this.backgroundCalculationEnabled = context.calcBackground;

    this.particleRenderingEnabled = context.drawParticles;

    this.debugDraw = context.debugDraw;

    this.enemyProbability = [1,1,1,1,2,2,2,2,3,4];
    
    for (var y = 0; y < n; y++) {

        this.gridVertexPositions[y] = new Array(n);
    }

    for (var y = 0; y < n; y++) {

        for (var x = 0; x < n; x++) {

            this.gridVertexPositions[x][y] = [0, 0];

        }

    }

    for (var i = 0; i < context.particleCount; i++) {

        var x = Math.random() * this.width;

        var y = Math.random() * this.height;

        var particle = this.backgroundParticleManager.getNewParticle('fluid', 'image');

        particle.info.repositionOffScreen = true;

        particle.info.sprite = 'bp' + Math.floor(Math.random() * 9);

        this.backgroundParticleManager.add(particle, context, this, x, y);

    }

}

GeomWarsLevel.prototype = {

    createBox: function (world, x, y, width, height, fixed, userData) {

        if (typeof(fixed) == 'undefined') fixed = true;

        var boxSd = new box2d.BoxDef();

        if (!fixed) boxSd.density = 1.0;

        boxSd.userData = userData;

        boxSd.extents.Set(width, height);

        var boxBd = new box2d.BodyDef();

        boxBd.AddShape(boxSd);

        boxBd.position.Set(x, y);

        return world.CreateBody(boxBd);

    },

    spawnEnemy: function (context, player) {

        var timerRegistery = context.timerRegistery;

        for (var i = 0; i < 4; i++) {

            var randomX = (Math.random() * (this.width - 200)) + 100;

            var randomY = (Math.random() * (this.height - 200)) + 100;

            var playerPosition = this.player.bodyComponent.object.m_position;

            var dx = playerPosition.x - randomX;

            var dy = playerPosition.y - randomY;

            if (Math.sqrt(dx * dx + dy * dy) > 150 && context.enemyCount < 15) {

                var enemyType = this.enemyProbability[Math.floor(Math.random() * 9.99)];
            
                var enemy = new Enemy(context, this.world, this, player, randomX, randomY, enemyType);

                context.enemyCount += 1;

                this.addEntity(context, enemy);

            }
        }

        var that = this;

        timerRegistery.add('spawn', 2, function () {

            that.spawnEnemy(context, player); } 

        );

    },

    onInitalize: function (context) {

        var that = this;

        context.enemyCount = 0;

        context.timer = 59;

        context.paused = false;

        context.camera.zoom = 1.3;

        context.camera.zoomTarget = 1;

        var halfWidth = this.width / 2;

        var halfHeight = this.height / 2;

        context.camera.setPosition(halfWidth, halfHeight);

        this.createBox(this.world, 10, halfHeight, 10, halfHeight, true, 'ground');

        this.createBox(this.world, halfWidth, 10, halfWidth, 10, true, 'ground');

        this.createBox(this.world, this.width - 10, halfHeight, 10, halfHeight, true, 'ground');

        this.createBox(this.world, halfWidth, this.height - 10, halfWidth, 10, true, 'ground');

        var timerRegistery = context.timerRegistery;

        timerRegistery.add('startGame', 1, function () {

            that.startGame(context);

        });

    },

    createExplosionParticle: function (context, x, y) {

        var particle = this.explosionParticleManager.getNewParticle('fluid', 'sprite');

        particle.info.spriteAnimation = spriteAnimations.explosion;

        particle.info.animationSpeed = 18 + (Math.random() * 12);

        particle.info.animationRepeats = 1;

        particle.info.repositionOffScreen = false;

        this.explosionParticleManager.add(particle, context, this, x, y);

    },

    startGame: function (context) {

        var that = this;

        this.player = new Player(context, this.world, this, 500, 300, 'fur');

        this.addEntity(context, this.player);

        var timerRegistery = context.timerRegistery;

        timerRegistery.add('spawn', 2, function () {

            that.spawnEnemy(context, that.player); 
                        
        });

        timerRegistery.add('changeProbability1', 20, function() {

            that.enemyProbability = [1,1,1,1,2,2,3,3,3,4];

        });

        timerRegistery.add('changeProbability2', 40, function() {

            that.enemyProbability = [1,2,2,3,3,3,3,4,4,4];

        });

        timerRegistery.addFunction('gameOver', 60,

            function(context, time){

                context.timer = Math.floor(time);

            }, 
            
            function() {
                
                context.paused = true;

                context.game.gameOver();

            }
        );

    },

    pushEnemies: function(context, x, y, force) {

        var forceVector = new box2d.Vec2();

        for (var i in this.entities) {

            var entity = this.entities[i];

            if (entity.bodyComponent) {

            var body = entity.bodyComponent.object;

            if (body.m_userData && body.m_userData.name == 'enemy1') {

                var dx = body.m_position.x - x;

                var dy = body.m_position.y - y;

                var d = Math.sqrt(dx * dx + dy * dy);

                if (d > 10) {

                    //if (d<100) d = 100;

                    var inverseD = 1 / d;

                    dx *= inverseD;

                    dy *= inverseD;

                    forceVector.x = dx * force;// * inverseD;

                    forceVector.y = dy * force;// * inverseD;

                    body.m_force.add(forceVector);

                }
            }
            }

        }

    },

    onUpdate: function (context) {

        var visc = 0.0001;

        var diff = 0.3;

        this.vScale = context.timeStep * 1.25;

        var controls = context.controls;

        var camera = context.camera;

        var border = camera.border;

        var horizontalLimit = this.width - border.x;

        var verticalLimit = this.height - border.y;

        if (camera.position.x < border.x) camera.position.x = border.x;

        if (camera.position.y < border.y) camera.position.y = border.y;

        if (camera.position.x > horizontalLimit) camera.position.x = horizontalLimit;

        if (camera.position.y > verticalLimit) camera.position.y = verticalLimit;

        if (camera.zoom > 1.3) camera.zoom = 1.3;

        if (controls.isDragging && this.backgroundCalculationEnabled) {

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

        if (this.backgroundCalculationEnabled) {

            this.fluidSolver.tick(context.timeStep, visc, diff);

        }

        this.backgroundParticleManager.update(context, this.vScale);

        this.explosionParticleManager.update(context, this.vScale);

    },

    onRender: function (context) {

        var camera = context.camera;
        var renderer = context.renderer;
        var assetManager = context.assetManager;
        var mat33Pool = context.mat33Pool;

        var matrix = mat33Pool.create();
        var worldMatrix = mat33Pool.create();
        var backMatrix = mat33Pool.create();

        camera.worldTransform(matrix, 1, worldMatrix);
        camera.spriteTransform(matrix, 0.8, 320, 200, backMatrix);

        renderer.clearBlack();

        if (this.backgroundRenderingEnabled) {

            this.drawBackground(context, backMatrix);

        }

        if (this.debugDraw) {

            renderer.drawWorld(this.world, worldMatrix);

        }

        if (this.particleRenderingEnabled) {

            this.backgroundParticleManager.render(context, worldMatrix);

        }

        // FIXME: This is slow on mobile
        //this.drawBorder(context, worldMatrix);

        this.drawEntities(context);

        if (this.particleRenderingEnabled) {

            renderer.setBlendLighter();

            this.explosionParticleManager.render(context, worldMatrix);

            renderer.setBlendDefault();

        }

        this.drawFlash(context, this.flashAlpha);

        mat33Pool.release(matrix);
        mat33Pool.release(worldMatrix);
        mat33Pool.release(backMatrix);

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

        matrix.Scale(1.2, 1.2);
        matrix.Translate(-640* 0.8, -400 * 0.8);
        renderer.drawImage(camera, assetManager.getAsset('hexes'), matrix, 0, 1);

    },

    drawFlash: function (context, alpha) {
        
        if( alpha < 0 ) {
            return;
        }

        var renderer = context.renderer;

        renderer.endTransform();

        renderer.drawRect(0, 0, this.width, this.height, "#FFFFFF", 0, alpha);

    },

    drawGrid: function (context, alpha, vScale, matrix) {

        var renderer = context.renderer;

        var fluidSolver = this.fluidSolver;
        var n = fluidSolver.N;

        var xStep = 1 / n;
        var yStep = 1 / n;

        var scaleX = this.width;
        var scaleY = this.height;

        var x0 = 0;
        var y0 = 0;

        var gridVertexPositions = this.gridVertexPositions;

        for (var y = 0, y0 = 0; y < 1; y += yStep, y0++) {

            for (var x = 0, x0 = 0; x < 1; x += xStep, x0++) {

                if (this.backgroundCalculationEnabled) {

                    var dx1 = fluidSolver.getDx(x0, y0) * vScale * 2;
                    var dy1 = fluidSolver.getDy(x0, y0) * vScale * 2;

                    var lengthSquared = Math.abs(dx1 * dx1 + dy1 * dy1);
                    var maxLength = 0.2;

                    if (lengthSquared > maxLength * maxLength) {

                        var inverseLength = 1 / Math.sqrt(lengthSquared);
                        dx1 *= inverseLength * maxLength;
                        dy1 *= inverseLength * maxLength;

                    }

                    dx1 = (x + dx1) * scaleX;
                    dy1 = (y + dy1) * scaleY;

                    gridVertexPositions[x0][y0][0] = dx1;
                    gridVertexPositions[x0][y0][1] = dy1;

                } else {

                    gridVertexPositions[x0][y0][0] = x * scaleX;
                    gridVertexPositions[x0][y0][1] = y * scaleY;

                }

            }

        }

        renderer.beginLines('#000000', 2, 4, alpha, matrix);

        for (var y0 = 0; y0 < n; y0++) {

            for (var x0 = 0; x0 < n; x0++) {

                var dx1 = gridVertexPositions[x0][y0][0];
                var dy1 = gridVertexPositions[x0][y0][1];

                var dx2 = gridVertexPositions[x0+1][y0][0];
                var dy2 = gridVertexPositions[x0+1][y0][1];

                var dx3 = gridVertexPositions[x0][y0+1][0];
                var dy3 = gridVertexPositions[x0][y0+1][1];

                renderer.moveTo(dx2, dy2);
                renderer.lineTo(dx1, dy1);
                renderer.lineTo(dx3, dy3);

            }

        }

        renderer.endLines();

    }

}

