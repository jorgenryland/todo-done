/**
 * @depend tdd.js
 */
(function () {
    function buildLi(className, text, id) {
        var html = "<li class=\"" + className + "\"";

        if (id != null) {
            html += " data-id=\"" + id + "\"";
        }

        return html + ">" + text + "</li>";
    }

    tddjs.ListController = function (listView, backend) {
        this.view = listView;
        this.backend = backend;
        var self = this;

        backend.on("todo-item", function (item) {
            self.displayItem(item);
        });

        jQuery(listView).click(function (event) {
            self.completeItem(event.target);
        });
    };

    tddjs.ListController.prototype = {
        init: function () {
            var self = this;

            this.backend.getAll(function (err, data) {
                if (err) return self.handleError(err);
                var todoHtml = "", doneHtml = "", className;

                for (var i = 0, l = data.length; i < l; ++i) {
                    if (data[i].done) {
                        doneHtml += buildLi("done", data[i].text, data[i].id);
                    } else {
                        todoHtml += buildLi("todo", data[i].text, data[i].id);
                    }
                }

                self.view.innerHTML = todoHtml + doneHtml;
            });
        },

        completeItem: function (itemElement) {
            var self = this;
            var id = itemElement.getAttribute("data-id");

            this.backend.completeItem(id, function (error, item) {
                if (!error) {
                    self.markItemDone(itemElement);
                }
            });
        },

        markItemDone: function (itemElement) {
            var items = this.view.getElementsByTagName("li");

            for (var i = 0, l = items.length; i < l; ++i) {
                if (items[i].className == "done") {
                    this.view.insertBefore(itemElement, items[i]);
                    itemElement.className = "done";
                    return;
                }
            }

            this.view.appendChild(itemElement);
            itemElement.className = "done";
        },

        displayItem: function (item) {
            this.view.innerHTML =
                buildLi("todo", item.text) + this.view.innerHTML;
        },

        handleError: function (err) {
            this.view.innerHTML =
                buildLi("error", "An error occurred: " + err.message);
        }
    };
}());