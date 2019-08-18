export default class Model {
  constructor() {
    // The state of the model, an array of todo objects, stored in localStorage
    const todosStorage = localStorage.getItem("todos");

    if (todosStorage) {
      this.todos = JSON.parse(localStorage.getItem("todos"));
    } else {
      this.todos = [];
    }
  }

  bindEvents(controller) {
    this.onTodoListChanged = controller.onTodoListChanged;
  }

  update() {
    localStorage.setItem("todos", JSON.stringify(this.todos));
    this.onTodoListChanged(this.todos);
  }

  /**
   * Append a todo to the todos array
   *
   * @param {Object} todo
   * @memberof Model
   */
  addTodo(todo) {
    const nextTodoId =
      this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1;

    todo = {
      id: nextTodoId,
      ...todo,
      complete: false
    };

    this.todos = [...this.todos, todo];
    this.update();
  }

  /**
   * Map through all todos, and replace the text of the todo with the specified id
   *
   * @param {Number} id
   * @param {String} updatedText
   * @memberof Model
   */
  editTodo(id, updatedText) {
    this.todos = this.todos.map(todo =>
      todo.id === id
        ? { id: todo.id, text: updatedText, complete: todo.complete }
        : todo
    );

    this.update();
  }

  /**
   * Filter a todo out of the array by id
   *
   * @param {Number} id
   * @memberof Model
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);

    this.update();
  }

  /**
   * Flip the complete boolean on the specified todo
   *
   * @param {Number} id
   * @memberof Model
   */
  toggleTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id
        ? { id: todo.id, text: todo.text, complete: !todo.complete }
        : todo
    );

    this.update();
  }
}
