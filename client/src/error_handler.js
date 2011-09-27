/**
 * @depend tdd.js
 */
tddjs.ErrorHandler = function (root) {
    this.root = root;
};

tddjs.ErrorHandler.prototype = {
    timeout: 4000,
    fadeDuration: 250,

    handleError: function (msg) {
        var el = document.createElement("p");
        el.className = "error";
        el.innerHTML = msg;
        this.root.appendChild(el);
        this.startFadeOutTimer(el);

        return el;
    },

    startFadeOutTimer: function (element) {
        var self = this;

        setTimeout(function () {
            jQuery(element).hide(self.fadeDuration, function () {
                element.parentNode.removeChild(element);
            });
        }, this.timeout);
    }
};
