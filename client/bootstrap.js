/**
 * @depend src/todo_list.js
 * @depend src/list_controller.js
 * @depend src/form_controller.js
 * @depend src/error_handler.js
 */
(function () {
    var errorMessages = {
        "add": "saving your item, please try again",
        "getAll": "retrieving todo items, please reload the page",
        "completeItem": "while completing your item, please try again"
    };

    var errorContainer = document.getElementById("errors");
    var backend = new tddjs.TodoList();
    var errorHandler = new tddjs.ErrorHandler(errorContainer);

    backend.on("ajax-error", function (error) {
        errorHandler.handleError("An error occurred " + errorMessages[error.action]);
    });

    var view = document.getElementById("todo-items");
    var form = document.getElementById("todo-form");
    var formController = new tddjs.FormController(form, backend);
    var listController = new tddjs.ListController(view, backend);
    listController.init();
}());
