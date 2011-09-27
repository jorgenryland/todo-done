function controllerSetUp() {
    this.view = document.createElement("ol");
    var self = this;
    this.error = null;

    this.backend = tddjs.extend({
        getAll: function (callback) {
            callback(self.error, self.data);
        },

        completeItem: function (id, callback) {
            self.completedId = id;
            callback(self.error, self.data);
        }
    }, tddjs.eventEmitter);

    this.controller = new tddjs.ListController(this.view, this.backend);
}

TestCase("ListControllerInitTest", {
    setUp: controllerSetUp,

    "test should display items from backend": function () {
        this.data = [
            { text: "Buy milk", id: 1, done: false },
            { text: "Take a shower", id: 2, done: false }];
        this.controller.init();

        assertEquals(2, this.view.childNodes.length);
        assertEquals("Buy milk", this.view.childNodes[0].innerHTML);
        assertEquals("Take a shower", this.view.childNodes[1].innerHTML);
    },

    "test should render todo items with todo class": function () {
        this.data = [{ text: "Buy milk", id: 1, done: false }];
        this.controller.init();

        assertClassName("todo", this.view.firstChild);
    },

    "test should render done items with done class": function () {
        this.data = [{ text: "Buy milk", id: 1, done: true }];
        this.controller.init();

        assertClassName("done", this.view.firstChild);
    },

    "test should render todo items before done items": function () {
        this.data = [
            { text: "Buy milk", id: 1, done: true },
            { text: "Sleep", id: 2, done: false },
            { text: "Wake up", id:3, done: true }];

        this.controller.init();

        assertEquals("Sleep", this.view.childNodes[0].innerHTML);
        assertEquals("Buy milk", this.view.childNodes[1].innerHTML);
        assertEquals("Wake up", this.view.childNodes[2].innerHTML);
    },

    "test should handle errors": function () {
        this.error = new Error("Server failed");
        this.controller.init();

        assertEquals(1, this.view.childNodes.length);
        assertClassName("error", this.view.firstChild);
        assertEquals("An error occurred: Server failed",
                     this.view.firstChild.innerHTML);
    }
});

TestCase("ListControllerEventListenerTest", {
    setUp: controllerSetUp,

    "test should listen for todo-item event on backend": function () {
        this.backend.emit("todo-item", { text: "Buy milk", id: 1, done: false });

        assertEquals(1, this.view.childNodes.length);
        assertEquals("Buy milk", this.view.childNodes[0].innerHTML);
    }
});

TestCase("ListControllerCompleteItemTest", sinon.testCase({
    setUp: function () {
        controllerSetUp.call(this);
        this.data = [
            { text: "Buy milk", id: 1, done: false },
            { text: "Take a shower", id: 2, done: false },
            { text: "Eat breakfast", id: 3, done: false }];

        this.controller.init();
        this.data = null;
    },

    "test clicking list item should call completeItem method": function () {
        sinon.stub(this.controller, "completeItem");
        var li = jQuery(this.view.firstChild);

        li.trigger("click");

        assert(this.controller.completeItem.called);
        sinon.assert.calledWith(this.controller.completeItem,
                                this.view.firstChild);
    },

    "test should complete item on backend": function () {
        this.controller.completeItem(this.view.firstChild);

        assertEquals(1, this.completedId);
    },

    "test should move item below todo's when completing item": function () {
        this.data = { text: "Buy milk", id: 1, done: true };
        this.controller.completeItem(this.view.firstChild);

        var items = this.view.childNodes;
        assertEquals("Take a shower", items[0].innerHTML);
        assertEquals("Eat breakfast", items[1].innerHTML);
        assertEquals("Buy milk", items[2].innerHTML);
    },

    "test should move item on top of done items when completing it": function () {
        this.data = { text: "Buy milk", id: 1, done: true };
        this.controller.completeItem(this.view.firstChild);

        this.data = { text: "Take a shower", id: 2, done: true };
        this.controller.completeItem(this.view.firstChild);

        var items = this.view.childNodes;
        assertEquals("Eat breakfast", items[0].innerHTML);
        assertEquals("Take a shower", items[1].innerHTML);
        assertEquals("Buy milk", items[2].innerHTML);
    },

    "test should change item's class name when completing item": function () {
        var li = this.view.firstChild;
        this.data = { text: "Buy milk", id: 1, done: true };
        this.controller.completeItem(li);

        assertClassName("done", li);
    },

    "test should not modify item if completeItem does not succeed": function () {
        this.data = null;
        this.error = { message: "Oops" };
        this.controller.completeItem(this.view.firstChild);

        assertEquals("Buy milk", this.view.firstChild.innerHTML);
        assertClassName("todo", this.view.firstChild);
    }
}));
