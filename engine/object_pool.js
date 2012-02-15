// Copyright (C) 2011 Company 100, Inc. All rights reserved.
//

'use strict';

function ObjectPool(objectClass) {

    this.objectClass = objectClass;

    this.pool = [];

    this.count = 0;

    this.allowInstanceNew = true;

}

ObjectPool.prototype = {

    create: function () {

        if (this.pool.length > 0) {

            var newObject = this.pool.pop();
            newObject.Default();

            return newObject;
        }

        this.count++;

        if (this.allowInstanceNew) {

            return new this.objectClass();
        }

        return null;

    },

    release: function (item) {

        if (this.pool.indexOf(item) != -1)
            throw new Error('Item already exists in pool.');

        this.pool.push(item);

    },

    debug: function () {

        console.log(this.pool.length);

    }

};
