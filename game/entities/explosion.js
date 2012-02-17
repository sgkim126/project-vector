// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Explosion(context, world, level, position, type) {

    var that = this;

    this.prototype = Object.extend(this, new Entity(context, world));

    var events = context.events;

    var timerRegistery = context.timerRegistery;

    this.scaleInTween0 = new Tween();

    this.scaleInTween1 = new Tween();

    this.scaleInTween2 = new Tween();

    this.fadeOutTween1 = new Tween();

    this.fadeOutTween2 = new Tween();

    this.sprite0 = new SimpleSprite(this, position, 'exp' + type + '_01');

    this.sprite1 = new SimpleSprite(this, position, 'exp' + type + '_02');

    this.sprite2 = new SimpleSprite(this, position, 'exp' + type + '_03');

    this.sprite0.alpha = 0.75;

    this.sprite0.enabled = false;

    this.sprite1.enabled = false;

    this.sprite2.enabled = false;

    this.sprite0.lighten = true;

    this.sprite1.lighten = true;

    this.sprite2.lighten = true;

    this.components.add(context, this.sprite0, 'sprite0');

    this.components.add(context, this.sprite1, 'sprite1');

    this.components.add(context, this.sprite2, 'sprite2');

    this.die = function (context) {

        level.removeEntity(context, that);

    }

};

Explosion.prototype = {

    onInitalize: function (context) {

        var that = this;

        var timerRegistery = context.timerRegistery;

        var events = context.events;

        this.scaleInTween0.init(events, this.sprite0, 'scaleModify', null, 0.2, 2, 0.2);

        this.startTweenDelayed(context, 0.01, this.sprite0, this.scaleInTween0);

        this.scaleInTween0.addEventListener('onMotionFinished', function(e) {

            that.sprite0.enabled = false;

        });


        this.scaleInTween1.init(events, this.sprite1, 'scaleModify', null, 0.7, 2.2, 0.5);

        this.startTweenDelayed(context, 0.08, this.sprite1, this.scaleInTween1);

        this.scaleInTween1.addEventListener('onMotionFinished', function(e) {

            that.sprite1.enabled = false;

        });

        this.fadeOutTween1.init(events, this.sprite1, 'alpha', Tween.regularEaseIn, 1, 0.8, 0.5);

        this.startTweenDelayed(context, 0.08, this.sprite1, this.fadeOutTween1);


        this.scaleInTween2.init(events, this.sprite2, 'scaleModify', Tween.regularEaseOut, 1.25, 2.3, 0.9);

        this.startTweenDelayed(context, 0.25, this.sprite2, this.scaleInTween2);

        this.scaleInTween2.addEventListener('onMotionFinished', function(e) {

            that.sprite2.enabled = false;

            that.die(context);

        });

        this.fadeOutTween2.init(events, this.sprite2, 'alpha', Tween.regularEaseIn, 1, 0, 0.9);

        this.startTweenDelayed(context, 0.25, this.sprite2, this.fadeOutTween2);

    },

    onUpdate: function (context) {


    },

    onRemove: function (context) {

    },

    onRender: function (context) {

    },

    startTweenDelayed: function (context, delay, sprite, tween) {

        sprite.enabled = false;

        context.timerRegistery.addAnon(delay, function () {

            sprite.enabled = true;

            tween.start();

        });

    }

};

/*img{position:absolute; opacity:0;}
#exp_001{top: 183px; left: 183px; -webkit-animation:exp001 0.3s ease-out 2s;}
#exp_002{top: 123px; left: 123px; -webkit-animation:exp002 0.5s ease-out 2.1s;}
#exp_003{top: 0px; left: 0px; -webkit-animation:exp003 1s ease-out 2.1s;}
#exp_004{top: 0px; left: 0px; -webkit-animation:exp004 1.3s ease-out 2.3s;}

@-webkit-keyframes exp001{ 0%{-webkit-transform:scale(0.2,0.2) rotate(0deg);} 30%{-webkit-transform:scale(2,2); opacity:1;} 100%{-webkit-transform:scale(1,1) rotate(50deg);}}
@-webkit-keyframes exp002{ 0%{-webkit-transform:scale(0.3,0.3) rotate(0deg);} 10%{opacity:1;} 100%{-webkit-transform:scale(2,2) rotate(-40deg);} }
@-webkit-keyframes exp003{ 0%{-webkit-transform:scale(0.2,0.2) rotate(0deg);} 10%{opacity:1;} 30%{opacity:1;} 100%{-webkit-transform:scale(2.5,2.5) rotate(30deg);} }
@-webkit-keyframes exp004{ 0%{-webkit-transform:scale(0.5,0.5) rotate(0deg);} 10%{opacity:1;} 30%{opacity:1;} 100%{-webkit-transform:scale(2,2) rotate(-10deg);} }

#emy_003{top: 224px; left: 224px; -webkit-animation:emy003 1.9s;}

@-webkit-keyframes emy003{ 0%{opacity:1;} 100%{opacity:1;}}
*/