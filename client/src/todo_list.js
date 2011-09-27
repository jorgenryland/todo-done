/**
 * @depend tdd.js
 */
(function () {
    function ajax(emitter, url, options) {
        jQuery.ajax({
            url: url,
            type: options.type || "GET",
            data: options.data,

            success: function (data) {
                options.callback(null, data);
            },

            error: function (xhr, opt, error) {
                error = error || new Error("Server failed");
                error.action = options.action;
                emitter.emit("ajax-error", error);

                if (typeof options.callback == "function") {
                    options.callback(error);
                }
            }
        });
    }

    tddjs.TodoList = function (url) {
        this.url = url || "/todo-items";
    };

    tddjs.TodoList.prototype = tddjs.extend({
        getAll: function (callback) {
            ajax(this, this.url, {
                action: "getAll",
                callback: callback
            });
        },

        add: function (text, callback) {
            var self = this;
            ajax(this, this.url, {
                type: "POST",
                data: { item: text },
                action: "add",
                callback: function (err, item) {
                    if (err) {
                        callback(err);
                    } else {
                        self.emit("todo-item", item);
                        callback(null, item);
                    }
                }
            });
        },

        completeItem: function (id, callback) {
            var self = this;
            ajax(this, this.url + "/" + id, {
                type: "POST",
                data: { done: true },
                action: "completeItem",
                callback: callback
            });
        }
    }, tddjs.eventEmitter);
}());
