/**
 * @depend tdd.js
 */
(function () {
    function bindSubmitHandler(controller, form) {
        form.bind("submit", function (e) {
            controller.addItem();
            e.preventDefault();
        });
    }

    tddjs.FormController = function (view, backend) {
        this.view = view;
        var form = jQuery(view);
        this.input = form.find("input[type=text]")[0];
        this.backend = backend;
        bindSubmitHandler(this, form);
    };
}());

tddjs.FormController.prototype = {
    addItem: function () {
        if (!this.input.value) return;
        this.input.disabled = true;
        var self = this;

        this.backend.add(this.input.value, function (err, item) {
            if (err) return self.handleError(err);
            self.input.value = "";
            self.input.disabled = false;
        });
    },

    handleError: function (err) {
        var element = document.createElement("p");
        element.className = "error";
        element.innerHTML = err.message;
        this.view.insertBefore(element, this.view.firstChild);
    }
};
