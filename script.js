// script.js
document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const daysInput = document.getElementById('daysInput');
    const taskList = document.getElementById('taskList');
    const showCompletedBtn = document.getElementById('showCompletedBtn');
    const showIncompleteBtn = document.getElementById('showIncompleteBtn');
    const showAllBtn = document.getElementById('showAllBtn');

    function createTask(taskText, days, completed = false) {
        const li = document.createElement('li');
        const creationTimestamp = new Date().toLocaleString(); // Creation timestamp
        const dueDateTime = new Date();
        dueDateTime.setDate(dueDateTime.getDate() + parseInt(days, 10));
        const remainingTime = dueDateTime - new Date();

        if (remainingTime < 0) {
            alert("Due date must be in the future.");
            return null;
        }

        li.className = completed ? 'completed' : '';

        const updateCountdown = () => {
            const now = new Date().getTime();
            const remainingTime = dueDateTime - now;
            if (remainingTime < 0) {
                li.querySelector('.countdown').textContent = 'Due date passed';
                clearInterval(timerInterval);
            } else {
                const daysRemaining = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                const hoursRemaining = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutesRemaining = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const secondsRemaining = Math.floor((remainingTime % (1000 * 60)) / 1000);
                li.querySelector('.countdown').textContent = `${daysRemaining}d ${hoursRemaining}h ${minutesRemaining}m ${secondsRemaining}s remaining`;
            }
        };

        li.innerHTML = `
            <span>${taskText} <br><small>Created: ${creationTimestamp}</small></span>
            <div class="countdown"></div>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        updateCountdown();
        const timerInterval = setInterval(updateCountdown, 1000);

        li.querySelector('.complete-btn').addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks(); // Save tasks when marked complete
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks(); // Save tasks when deleted
        });

        return li;
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            tasks.push({
                text: li.querySelector('span').textContent.split(' <br>')[0],
                days: parseInt(li.querySelector('.countdown').textContent.split('d ')[0], 10),
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach((task) => {
            const newTask = createTask(task.text, task.days, task.completed);
            if (newTask) {
                taskList.appendChild(newTask);
            }
        });
    }

    function showCompletedTasks() {
        taskList.querySelectorAll('li').forEach((li) => {
            li.style.display = li.classList.contains('completed') ? 'flex' : 'none';
        });
    }

    function showIncompleteTasks() {
        taskList.querySelectorAll('li').forEach((li) => {
            li.style.display = !li.classList.contains('completed') ? 'flex' : 'none';
        });
    }

    function showAllTasks() {
        taskList.querySelectorAll('li').forEach((li) => {
            li.style.display = 'flex';
        });
    }

    loadTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const days = daysInput.value.trim();
        if (taskText !== '' && days !== '') {
            const newTask = createTask(taskText, days);
            if (newTask) {
                taskList.appendChild(newTask);
                taskInput.value = '';
                daysInput.value = '';
                saveTasks();
            }
        }
    });

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    showCompletedBtn.addEventListener('click', showCompletedTasks);
    showIncompleteBtn.addEventListener('click', showIncompleteTasks);
    showAllBtn.addEventListener('click', showAllTasks);
});