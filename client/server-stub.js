(function () {
    var server = sinon.fakeServer.create();
    server.autoRespond = true;

    var list = [{
        text: "Put the lotion on its skin",
        id: 1,
        done: false
    }, {
        text: "Put the lotion in the basket",
        id: 2,
        done: false
    }, {
        text: "Test",
        id: 3,
        done: false
    }, {
        text: "Get the hose again",
        id: 4,
        done: false
    }];

    var headers = { "Content-Type": "application/json" };
    var id = 5;

    server.respondWith(
        "GET", "/todo-items",
        [200, headers, JSON.stringify(list)]);

    server.respondWith("POST", "/todo-items", function (req) {
        req.respond(200, headers, JSON.stringify({
            done: false,
            id: id++,
            text: decodeURIComponent(req.requestBody.substr(5)).replace(/\+/g, " ")
        }));
    });

    server.respondWith(
        "POST", "/todo-items/2", [404, headers, JSON.stringify(list[0])]);

    server.respondWith(
        "POST", /\/todo\-items\/\d+/, [200, headers, JSON.stringify(list[0])]);
}());
