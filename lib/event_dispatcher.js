 
/**
 * Object that during their initialization can call this function
 * This will extend the calling object with basic
 * Event Dispatching functionality
 *
 */
function EventDispatcher() {

    this._listeners = [];

    this.isEventDispatcher = true;

}

EventDispatcher.prototype = {

        dispatchEvent: function(eventObject) {
            for (var i = 0; i < this._listeners.length; i++) {
                var test = this._listeners[i];
                if (test.type === eventObject.type) {
                    test.callback(eventObject, test.target);
                }
            }
        },

        removeEventListener: function(type, callback, target) {
            var declared = false;
            for (var i = 0; i < this._listeners.length; i++) {
                var test = this._listeners[i];
                if (test.type === type && test.callback === callback && test.target === target) {
                    this._listeners.splice(i, 1);
                }
            }
        },

        addEventListener: function(type, callback, target) {
            var declared = false;
            for (var i = 0; i < this._listeners.length; i++) {
                var test = this._listeners[i];
                if (test.type === type && test.callback === callback && test.target === target) {
                    declared = true;
                    break;
                }
            }
            if (!declared) {
                this._listeners.push({
                    'type': type,
                    'callback': callback,
                    'target': target
                });
            }
        },

}
