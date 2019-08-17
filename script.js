class Model {
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

class View {
  constructor() {
    // The root element
    this.app = this.getElement("#root");

    // The title of the app
    this.title = this.createElement("h1");
    this.title.textContent = "Todos";

    // The form, with a [type="text"] input, and a submit button
    this.form = this.createElement("form");

    this.input = this.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "Add todo";
    this.input.name = "todo";

    this.submitButton = this.createElement("button");
    this.submitButton.textContent = "Submit";

    // The visual representation of the todo list
    this.todoList = this.createElement("ul", "todo-list");

    // Append the input and submit button to the form
    this.form.append(this.input, this.submitButton);

    // Append the title, form, and todo list to the app
    this.app.append(this.title, this.form, this.todoList);
  }

  bindEvents(controller) {
    this.form.addEventListener("submit", controller.handleAddTodo);
    this.todoList.addEventListener("click", controller.handleDeleteTodo);
    this.todoList.addEventListener("change", controller.handleToggle);
  }

  /**
   * Get the current todo text
   *
   * @readonly
   * @memberof View
   */
  get todoText() {
    return this.input.value;
  }

  /**
   * Reset the todo input text
   *
   * @memberof View
   */
  resetInput() {
    this.input.value = "";
  }

  displayTodos(todos) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    // Show default message
    if (todos.length === 0) {
      const p = this.createElement("p");
      p.textContent = "Nothing to do!, Add a task?";
      this.todoList.append(p);
    } else {
      // Create todo item nodes for each todo in state
      todos.forEach(todo => {
        const li = this.createElement("li");
        li.setAttribute("data-todo-id", todo.id);

        // Each todo item will have a checkbox you can toggle
        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;

        // The todo item text will be in a comtenteditable span
        const span = this.createElement("span");
        span.contentEditable = true;
        span.classList.add("editable");

        // If the todo is complete, it will have a striketrhough
        if (todo.complete) {
          const strike = this.createElement("s");
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          // otherwise just display the text
          span.textContent = todo.text;
        }

        // The todos will also have a delete button
        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "Delete";
        li.append(checkbox, span, deleteButton);

        // Append nodes to the todo list
        this.todoList.append(li);
      });
    }
  }

  /**
   * Create an element with an optional CSS class
   *
   * @param {String} tag
   * @param {String} className
   * @returns
   * @memberof View
   */
  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  }

  /**
   * Retrieve an element from the DOM
   *
   * @param {String} selector
   * @returns
   * @memberof View
   */
  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }
}

class Controller {
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

const app = new Controller(new Model(), new View());
