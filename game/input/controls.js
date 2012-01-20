// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function Controls(context) {

    var that = this;

    this.prototype += Object.extend(this, new EventDispatcher());

    this.isDragging = false;
    this.tempIsDragging = false;
    this.wasDragging = false;

    this.tempX = 0;
    this.tempY = 0;

    this.positionX = 0;
    this.positionY = 0;

    this.deltaX = 0;
    this.deltaY = 0;

    this.lastPositionX = 0;
    this.lastPositionY = 0;

    this.normalX = 0;
    this.normalY = 0;

    this.normalDeltaX = 0;
    this.normalDeltaY = 0;

    this.dragStartEvent = {
        type: 'start'
    };

    this.dragEvent = {
        type: 'drag'
    };

    this.dragEndEvent = {
        type: 'end'
    };

    $j(context.canvas).bind('touchmove', function (e) {

        e.preventDefault();

        that.tempX = e.originalEvent.touches[0].pageX - $j(context.canvas).offset().left;
        that.tempY = e.originalEvent.touches[0].pageY - $j(context.canvas).offset().top;

    });

    $j(context.canvas).bind('touchstart', function (e) {

        that.tempIsDragging = true;

        alert(e.originalEvent.touches[0].pageX);

        e.preventDefault();

        that.tempX = e.originalEvent.touches[0].pageX;
        that.tempY = e.originalEvent.touches[0].pageY;

    });

    $j(context.canvas).bind('touchend', function (e) {

        e.preventDefault();

        that.tempIsDragging = false;

    });

    $j(window).mousemove(function(e) {

        that.tempX = e.pageX - $j(context.canvas).offset().left;
        that.tempY = e.pageY - $j(context.canvas).offset().top;

    });

    $j(context.canvas).mousedown(function(e) {

        that.tempIsDragging = true;

        that.tempX = e.pageX - $j(context.canvas).offset().left;
        that.tempY = e.pageY - $j(context.canvas).offset().top;

    });

    $j(context.canvas).mouseup(function() {

        that.tempIsDragging = false;

    });

    $j(context.canvas).mouseleave(function() {

        that.tempIsDragging = false;

    });

}

Controls.prototype = {

    update: function (context) {

        this.wasDragging = this.isDragging;
        this.isDragging = this.tempIsDragging;

        var width = context.renderer.width;
        var height = context.renderer.height;

        this.lastPositionX = this.positionX;
        this.lastPositionY = this.positionY;
        this.positionX = this.tempX;
        this.positionY = this.tempY;

        if (!this.wasDragging && this.isDragging) {
            this.lastPositionX = this.positionX;
            this.lastPositionY = this.positionY;
        }

        this.deltaY = this.positionY - this.lastPositionY;
        this.deltaX = this.positionX - this.lastPositionX;

        this.normalDeltaX = this.deltaX / width;
        this.normalDeltaY = this.deltaY / height;

        this.normalPositionX = this.positionX / width;
        this.normalPositionY = this.positionY / height;

    },

    updateEvents: function () {

        if (!this.wasDragging && this.isDragging) {
            this.dragStartEvent.x = this.positionX;
            this.dragStartEvent.y = this.positionY;
            this.dispatchEvent(this.dragStartEvent);
        }

        if (this.isDragging) {
            this.dragEvent.x = this.positionX;
            this.dragEvent.y = this.positionY;
            this.dispatchEvent(this.dragEvent);
        }

        if (this.wasDragging && !this.isDragging) {
            this.dragEndEvent.x = this.positionX;
            this.dragEndEvent.y = this.positionY;
            this.dispatchEvent(this.dragEndEvent);
        }

    }

};
