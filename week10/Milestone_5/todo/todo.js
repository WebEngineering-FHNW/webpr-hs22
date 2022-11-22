// requires ../observable/observable.js

/**
 * @typedef TodoType
 * @property { () => Boolean }                                      getDone
 * @property { (Boolean) => void}                                   setDone
 * @property { (callback: onValueChangeCallback<Boolean>) => void } onDoneChanged
 */

/**
 * @constructor
 * @return { TodoType }
 */
const Todo = () => {                                // facade
    const textAttr = Observable("text");            // we currently don't expose it as we don't use it elsewhere
    const doneAttr = Observable(false);
    return {
        getDone:       doneAttr.getValue,
        setDone:       doneAttr.setValue,
        onDoneChanged: doneAttr.onChange,
    }
};

/**
 * @typedef TodoControllerType
 * @property { () => TodoType}                                  addTodo
 * @property { (cb: ObservableListCallback<TodoType>) => void } onTodoAdd
 * @property { (TodoType) => void }                             removeTodo
 * @property { (cb: ObservableListCallback<TodoType>) => void } onTodoRemove
 * @property { () => Number }                                   numberOfTodos
 * @property { () => Number }                                   numberOfOpenTasks
 * @property { (cb: ObservableListCallback<TodoType>) => void } removeTodoRemoveListener - for test cases only
 */

/**
 * @constructor
 * @return { TodoControllerType }
 */
const TodoController = () => {

    const todoModel = ObservableList([]); // observable array of Todos, this state is private

    const addTodo = () => {
        const newTodo = Todo();
        todoModel.add(newTodo);
        return newTodo;
    };

    return {
        numberOfTodos:            todoModel.count,
        numberOfOpenTasks:        () => todoModel.countIf(todo => ! todo.getDone() ),
        addTodo:                  addTodo,
        removeTodo:               todoModel.del,
        onTodoAdd:                todoModel.onAdd,
        onTodoRemove:             todoModel.onDel,
        removeTodoRemoveListener: todoModel.removeDeleteListener, // only for the test case, not used below
    }
};


// View-specific parts

/**
 * @constructor
 * @param { TodoControllerType } todoController
 * @param { HTMLElement }        rootElement
 * @return void
 */
const TodoItemsView = (todoController, rootElement) => {

    const render = todo => {

        function createElements() {
            const template = document.createElement('DIV'); // only for parsing
            template.innerHTML = `
                <button class="delete">&times;</button>
                <input type="text" size="36">
                <input type="checkbox">            
            `;
            return template.children;
        }
        const [deleteButton, inputElement, checkboxElement] = createElements();

        checkboxElement.onclick = _ => todo.setDone(checkboxElement.checked);
        deleteButton.onclick    = _ => todoController.removeTodo(todo);

        todoController.onTodoRemove( (removedTodo, removeMe) => {
            if (removedTodo !== todo) return;
            rootElement.removeChild(inputElement);
            rootElement.removeChild(deleteButton);
            rootElement.removeChild(checkboxElement);
            removeMe();
        } );

        rootElement.appendChild(deleteButton);
        rootElement.appendChild(inputElement);
        rootElement.appendChild(checkboxElement);
    };

    // binding

    todoController.onTodoAdd(render);

    // we do not expose anything as the view is totally passive.
};

/**
 * @constructor
 * @param { TodoControllerType } todoController
 * @param { HTMLElement }        numberOfTasksElement
 * @return void
 */
const TodoTotalView = (todoController, numberOfTasksElement) => {

    const render = () =>
        numberOfTasksElement.innerText = "" + todoController.numberOfTodos();

    // binding

    todoController.onTodoAdd(render);
    todoController.onTodoRemove(render);
};

/**
 * @constructor
 * @param { TodoControllerType } todoController
 * @param { HTMLElement }        numberOfOpenTasksElement
 * @return void
 */
const TodoOpenView = (todoController, numberOfOpenTasksElement) => {

    const render = () =>
        numberOfOpenTasksElement.innerText = "" + todoController.numberOfOpenTasks();

    // binding

    todoController.onTodoAdd(todo => {
        render();
        todo.onDoneChanged(render);
    });
    todoController.onTodoRemove(render);
};


