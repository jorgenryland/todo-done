TestCase("TodoListGetAllTest", sinon.testCase({
    setUp: function () {
        this.todoList = new tddjs.TodoList();
    },

    "test should GET /todo-items": function () {
        this.todoList.getAll(function (err, items) {});

        assertEquals(1, this.requests.length);
        assertEquals("GET", this.requests[0].method);
        assertEquals("/todo-items", this.requests[0].url);
    },

    "test should yield results to callback": function () {
        this.server.respondWith(
            "GET", "/todo-items",
            [200, { "Content-Type": "application/json" },
             JSON.stringify([{ text: "Buy milk", id: 1, done: false }])]);

        var callback = sinon.spy();
        this.todoList.getAll(callback);
        this.server.respond();

        sinon.assert.called(callback);
        var data = callback.getCall(0).args[1];
        assertEquals(1, data.length);
        assertEquals("Buy milk", data[0].text);
    },

    "test should yield error when server fails": function () {
        this.server.respondWith("GET", "/todo-items", [500, {}, ""]);

        var callback = sinon.spy();
        this.todoList.getAll(callback);
        this.server.respond();

        sinon.assert.called(callback);
        var error = callback.getCall(0).args[0];
        assertEquals("Server failed", error.message);
    },

    "test should yield error when server returns invalid JSON": function () {
        this.server.respondWith(
            "GET", "/todo-items",
            [200, { "Content-Type": "application/json" }, '[{]']);

        var callback = sinon.spy();
        this.todoList.getAll(callback);
        this.server.respond();

        sinon.assert.called(callback);
        var error = callback.getCall(0).args[0];
        assertNotNull(error.message);
        //assertMatch(/Unexpected/, error.message);
    },

    "test should emit ajax-error event": function () {
        this.server.respondWith("GET", "/todo-items", [500, {}, ""]);

        var callback = sinon.spy();
        this.todoList.on("ajax-error", callback);
        this.todoList.getAll(function () {});
        this.server.respond();

        sinon.assert.called(callback);
        var error = callback.getCall(0).args[0];
        assertEquals("Server failed", error.message);
        assertEquals("getAll", error.action);
    }
}));

TestCase("TodoListAddTest", sinon.testCase({
    setUp: function () {
        this.todoList = new tddjs.TodoList();
    },

    "test should POST /todo-items": function () {
        this.todoList.add("Buy milk", function (err, items) {});

        assertEquals(1, this.requests.length);
        assertEquals("POST", this.requests[0].method);
        assertEquals("/todo-items", this.requests[0].url);
        assertEquals("item=Buy+milk", this.requests[0].requestBody);
    },

    "test should yield new item to callback": function () {
        this.server.respondWith(
            "POST", "/todo-items",
            [200, { "Content-Type": "application/json" },
             JSON.stringify({ text: "Buy milk", id: 1, done: false })]);

        var callback = sinon.spy();
        this.todoList.add("Buy milk", callback);
        this.server.respond();

        sinon.assert.called(callback);
        var item = callback.getCall(0).args[1];
        assertEquals("Buy milk", item.text);
    },

    "test should emit new item": function () {
        this.server.respondWith(
            "POST", "/todo-items",
            [200, { "Content-Type": "application/json" },
             JSON.stringify({ text: "Buy milk", id: 1, done: false })]);

        var callback = sinon.spy();
        this.todoList.on("todo-item", callback);
        this.todoList.add("Buy milk");
        this.server.respond();

        sinon.assert.calledOnce(callback);
        sinon.assert.calledWith(callback, { text: "Buy milk", id: 1, done: false });
    },

    "test should yield error if adding fails": function () {
        this.server.respondWith("POST", "/todo-items", [403, {}, '']);

        var callback = sinon.spy();
        this.todoList.add("Buy milk", callback);
        this.server.respond();

        sinon.assert.called(callback);
        var error = callback.getCall(0).args[0];
        assertEquals("Server failed", error.message);
    },

    "test should emit ajax-error if adding fails": function () {
        this.server.respondWith("POST", "/todo-items", [403, {}, '']);

        var callback = sinon.spy();
        this.todoList.on("ajax-error", callback);
        this.todoList.add("Buy milk", callback);
        this.server.respond();

        sinon.assert.called(callback);
        var error = callback.getCall(0).args[0];
        assertEquals("Server failed", error.message);
        assertEquals("add", error.action);
    }
}));

TestCase("TodoListCompleteItemTest", sinon.testCase({
    setUp: function () {
        this.todoList = new tddjs.TodoList();
    },

    "test should POST to /todo-items/1 with done=true in body": function () {
        this.todoList.completeItem(1);

        assertEquals(1, this.server.requests.length);
        assertEquals("POST", this.server.requests[0].method);
        assertEquals("/todo-items/1", this.server.requests[0].url);
        assertEquals("done=true", this.server.requests[0].requestBody);
    },

    "test should yield updated item to callback on success": function () {
        this.server.respondWith(
            "POST", "/todo-items/1",
            [200, { "Content-Type": "application/json" },
             '{"text":"Fetch eggs","done":true,"id":1}']);

        var callback = sinon.spy();

        this.todoList.completeItem(1, callback);
        this.server.respond();

        sinon.assert.calledOnce(callback);
        assertEquals({ text: "Fetch eggs", done: true, id: 1 }, callback.args[0][1]);
    },

    "test should call callback with error if failure": function () {
        this.server.respondWith("POST", "/todo-items/1", [404, {}, ""]);

        var callback = sinon.spy();
        this.todoList.completeItem(1, callback);
        this.server.respond();

        sinon.assert.calledOnce(callback);
        assertEquals("Server failed", callback.args[0][0].message);
    },

    "test should emit ajax-error if completing fails": function () {
        this.server.respondWith("POST", "/todo-items/1", [403, {}, '']);

        var callback = sinon.spy();
        this.todoList.on("ajax-error", callback);
        this.todoList.completeItem(1, callback);
        this.server.respond();

        sinon.assert.called(callback);
        var error = callback.getCall(0).args[0];
        assertEquals("Server failed", error.message);
        assertEquals("completeItem", error.action);
    }
}));
