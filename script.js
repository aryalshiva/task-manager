// script.js
document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    // Function to create a new task
    function createTask(taskText, completed = false) {
        const li = document.createElement('li');
        li.className = completed ? 'completed' : '';

        li.innerHTML = `
            <span>${taskText}</span>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Add event listener for the Complete button
        li.querySelector('.complete-btn').addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks(); // Save tasks when marked complete
        });

        // Add event listener for the Delete button
        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks(); // Save tasks when deleted
        });

        return li;
    }

    // Function to save tasks to local storage
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            const newTask = createTask(task.text, task.completed);
            taskList.appendChild(newTask);
        });
    }

    // Load tasks when the page loads
    loadTasks();

    // Add task when clicking the Add Task button
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const newTask = createTask(taskText);
            taskList.appendChild(newTask);
            taskInput.value = ''; // Clear the input field
            saveTasks(); // Save tasks when a new task is added
        }
    });

    // Add task when pressing Enter key
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click();
        }
    });
});