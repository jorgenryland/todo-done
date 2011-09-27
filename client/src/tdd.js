var tddjs = this.tddjs || {};

tddjs.extend = function (target) {
    var extensions = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, l = extensions.length; i < l; ++i) {
        for (var prop in extensions[i]) {
            target[prop] = extensions[i][prop];
        }
    }

    return target;
};

tddjs.eventEmitter = {
    on: function (event, callback) {
        if (typeof callback != "function") {
            throw new TypeError("callback is not a function");
        }

        this.listeners = this.listeners || {};
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(callback);
    },

    emit: function (event) {
        var listeners = this.listeners && this.listeners[event] || [];
        var data = Array.prototype.slice.call(arguments, 1);

        for (var i = 0, l = listeners.length; i < l; ++i) {
            try {
                listeners[i].apply(null, data);
            } catch (e) {
                setTimeout(function () { throw e; }, 0);
            }
        }
    }
};