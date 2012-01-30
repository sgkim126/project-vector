// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function AssetManager() {

    this.prototype += Object.extend(this, new EventDispatcher());

    this.successCount = 0;
    this.errorCount = 0;

    this.cache = {};
    this.downloadQueue = [];

}

AssetManager.prototype = {

    queueDownload: function (item) {

        this.downloadQueue.push(item);

    },

    queueDownloads: function (data) {

        var that = this;

        data.forEach(function(item) {

            that.downloadQueue.push(item);

        });

    },

    downloadAll: function (context, downloadCallback) {

        var that = this;

        if (this.downloadQueue.length === 0) {

            downloadCallback();

        }

        for (var i = 0; i < this.downloadQueue.length; i++) {

            var path = this.downloadQueue[i][1];
            var name = this.downloadQueue[i][0];

            var img = new Image();

            img.addEventListener('load', function(e) {

                that.successCount += 1;
                var complete = that.successCount / that.downloadQueue.length;

                var event = {
                    type: 'progress',
                    data: complete,
                    target: that
                };

                that.dispatchEvent(event);

                context.renderer.drawImageSimpleAlpha(e.target, 0, 0, 0);

                if (that.isDone()) {

                    setTimeout(function() {

                        downloadCallback();

                    }, 200);
                }

            }, false);

            img.addEventListener('error', function() {

                that.errorCount += 1;

                var event = {
                    type: 'error',
                    data: 'Could not load: ' + img.src,
                    target: that
                };

                that.dispatchEvent(event);

                if (that.isDone()) {

                    downloadCallback();
                }

            }, false);

            img.src = path;
            this.cache[name] = img;

        }

    },

    isDone: function () {

        return (this.downloadQueue.length == this.successCount + this.errorCount);

    },

    getAsset: function (path) {

        return this.cache[path];

    }

};
