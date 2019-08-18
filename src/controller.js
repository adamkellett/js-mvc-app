export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.bindEvents(this);
    this.view.bindEvents(this);

    // Display initial todos
    this.onTodoListChanged(this.model.todos);
  }

  /**
   * Initilises the todo list when changed
   *
   * @memberof Controller
   */
  onTodoListChanged = todos => {
    this.view.displayTodos(todos);
  };

  /**
   * Handle submit event for adding a todo
   *
   * @memberof Controller
   */
  handleAddTodo = event => {
    event.preventDefault();

    if (this.view.todoText) {
      this.model.addTodo({ text: this.view.todoText });
      this.view.resetInput();
    }
  };

  /**
   * Handle click event for deleting a todo
   *
   * @memberof Controller
   */
  handleDeleteTodo = event => {
    if (event.target.className === "delete") {
      const id = parseInt(
        event.target.parentElement.getAttribute("data-todo-id")
      );
      this.model.deleteTodo(id);
    }
  };

  /**
   * Handle change event for toggling a todo
   *
   * @memberof Controller
   */
  handleToggle = event => {
    if (event.target.type === "checkbox") {
      const id = parseInt(
        event.target.parentElement.getAttribute("data-todo-id")
      );

      this.model.toggleTodo(id);
    }
  };
}
