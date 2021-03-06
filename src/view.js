export default class View {
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
