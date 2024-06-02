import {Task} from "./task.js";
import {taskCollectionRenderer} from "./task-view.js";

let app = document.querySelector('#app');

// Check tasks in Local Storage
let tempTasks = localStorage.getItem('tasks');
let tasks;
if (tempTasks === null) {
    tasks = [];
} else {

    tasks = JSON.parse(tempTasks).map(obj => Task.fromJSON(obj));
}

app.innerHTML = taskCollectionRenderer(tasks);

/* Use Clicked Checkbox */
document.addEventListener('change', function (event) {
    if (event.target.matches('[type="checkbox"]')) {
        let input = event.target;

        let idx = tasks.findIndex(elem => elem.uid === input.value);
        if (idx === -1) {
            console.error(`Task ${input.value} was not found in the list`);
            return undefined;
        }

        tasks[idx].done = input.checked;  // Update the Task State

        app.innerHTML = taskCollectionRenderer(tasks);

        // Store to Local Storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});

/* Delete Button Clicked */
document.addEventListener('click', function (event) {
    if (event.target.matches('[alt="Delete"]')) {
        let obj = event.target;
        let parent = obj.parentNode;
        let input = parent.querySelector('[name="done"]');
        let taskId = input.value;

        let idx = tasks.findIndex(elem => elem.uid === taskId);

        tasks.splice(idx, 1);

        app.innerHTML = taskCollectionRenderer(tasks);

        // Store to Local Storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});

/* Add Task Button Clicked */
document.querySelector('#buttonAdd').addEventListener('click', function (event) {
    let taskName = document.querySelector('#taskName').value;
    let taskDescription = document.querySelector('#taskDescription').value;

    if (taskName === null || taskName.trim() === '') {
        const errorMsg = 'Task Name cannot be empty.';
        clearTaskInputForm();
        throw new Error(errorMsg);
    }

    let newTask = new Task(taskName, taskDescription);
    tasks.push(newTask);

    app.innerHTML = taskCollectionRenderer(tasks);

    clearTaskInputForm();

    // Store to Local Storage
    localStorage.setItem('tasks', JSON.stringify(tasks));
});


/* Clear Task Input Form */
function clearTaskInputForm() {
    document.querySelector('#taskName').value = null;
    document.querySelector('#taskDescription').value = null;
}
