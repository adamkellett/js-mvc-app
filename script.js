class Model {
  constructor() {
    // The state of the model, an array of todo objects, prepopulated with some data
    this.todos = [
      { id: 1, text: "Run a marathon", complete: false },
      { id: 1, text: "Plant a garden", complete: false }
    ];
  }

  /**
   * Append a todo to the todos array
   *
   * @param {Object} todo
   * @memberof Model
   */
  addTodo(todo) {
    this.todos = [...this.todos, todo];
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
  }

  /**
   * Filter a todo out of the array by id
   *
   * @param {Number} id
   * @memberof Model
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
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
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());
