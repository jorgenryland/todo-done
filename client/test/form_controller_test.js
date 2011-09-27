TestCase("FormControllerTest", {
    setUp: function () {
        /*:DOC form = <form action="/todo-items" method="post">
          <fieldset>
            <label for="item">Add new item</label>
            <input type="text" id="item" name="item" value="Buy milk">
            <input type="submit" value="GO!">
          </fieldset>
        </form>*/

        this.backend = {};
        this.controller = new tddjs.FormController(this.form, this.backend);
        this.input = jQuery(this.form).find("input[type=text]")[0];
    },

    "test should add item when submitting form": function () {
        this.backend.add = sinon.spy();
        jQuery(this.form).trigger("submit");

        sinon.assert.calledOnce(this.backend.add);
        sinon.assert.calledWith(this.backend.add, "Buy milk");
    },

    "test should not add empty items": function () {
        this.input.value = "";
        this.backend.add = sinon.spy();
        jQuery(this.form).trigger("submit");

        sinon.assert.notCalled(this.backend.add);
    },

    "test should clear input when item is added": function () {
        this.backend.add = function (text, callback) {
            callback(null, { text: "Item" });
        };

        jQuery(this.form).trigger("submit");

        assertEquals("", this.input.value);
    },

    "test should disable input while item is being added": function () {
        this.backend.add = function (text, callback) {};

        jQuery(this.form).trigger("submit");

        assert(this.input.disabled);
    },

    "test should re-enable input when item is added": function () {
        this.backend.add = function (text, callback) {
            callback(null, { text: "Item" });
        };

        jQuery(this.form).trigger("submit");

        assert(!this.input.disabled);
    },

    "test should not clear input when item is not added": function () {
        this.backend.add = function (text, callback) {
            callback({ message: "Oops" });
        };

        jQuery(this.form).trigger("submit");

        assertEquals("Buy milk", this.input.value);
    },

    "test should render error message": function () {
        this.backend.add = function (text, callback) {
            callback({ message: "Oops" });
        };

        jQuery(this.form).trigger("submit");

        assertTagName("p", this.form.firstChild);
        assertClassName("error", this.form.firstChild);
        assertEquals("Oops", this.form.firstChild.innerHTML);
    }
});
