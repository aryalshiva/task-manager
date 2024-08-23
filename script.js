document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const daysInput = document.getElementById('daysInput');
    const taskList = document.getElementById('taskList');
    const showCompletedBtn = document.getElementById('showCompletedBtn');
    const showIncompleteBtn = document.getElementById('showIncompleteBtn');
    const showAllBtn = document.getElementById('showAllBtn');

    function createTask(taskText, days, completed = false, creationTimestamp = new Date().toISOString(), completionTime = null) {
        const li = document.createElement('li');
        const dueDateTime = new Date();
        dueDateTime.setDate(dueDateTime.getDate() + parseInt(days, 10));
        const dueDateISOString = dueDateTime.toISOString();

        li.className = completed ? 'completed' : '';

        // Function to update countdown based on due date
        const updateCountdown = () => {
            const now = new Date().getTime();
            const remainingTime = new Date(dueDateISOString).getTime() - now;
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
            <span class="task-name">${taskText}</span>
            <div class="countdown" data-due-date="${dueDateISOString}"></div>
            <div class="completion-time"></div>
            <div>
                <button class="complete-btn">Complete</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        if (completed && completionTime) {
            displayCompletionTime(li, completionTime);
            li.querySelector('.task-name').style.textDecoration = 'line-through';
        } else {
            updateCountdown();
            var timerInterval = setInterval(updateCountdown, 1000);
        }

        li.querySelector('.complete-btn').addEventListener('click', () => {
            if (!li.classList.contains('completed')) {
                li.classList.add('completed');
                clearInterval(timerInterval);
                li.querySelector('.task-name').style.textDecoration = 'line-through'; // Apply strikethrough to task name
                const completionTime = calculateTimeTaken(new Date().toISOString(), creationTimestamp);
                displayCompletionTime(li, completionTime);
                saveTasks(); // Save tasks with completion time
            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            saveTasks(); // Save tasks when deleted
        });

        return li;
    }


    // Display completion time and hide countdown
    function displayCompletionTime(li, completionTime) {
        li.querySelector('.countdown').style.display = 'none';
        li.querySelector('.completion-time').textContent = `Time taken: ${completionTime}`;
    }

    // Function to calculate time taken based on completion and creation time
    function calculateTimeTaken(completionTimeISOString, creationTimeISOString) {
        const creationTime = new Date(creationTimeISOString).getTime();
        const completedTime = new Date(completionTimeISOString).getTime();

        console.log(`Creation Time: ${creationTime}`);
        console.log(`Completion Time: ${completedTime}`);

        let elapsedTime = completedTime - creationTime;

        // Ensure elapsed time is non-negative
        if (elapsedTime < 0) {
            elapsedTime = 0;
        }

        const secondsTaken = Math.floor((elapsedTime / 1000) % 60);
        const minutesTaken = Math.floor((elapsedTime / (1000 * 60)) % 60);
        const hoursTaken = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
        const daysTaken = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));

        let timeTaken = "";
        if (daysTaken > 0) timeTaken += `${daysTaken}d `;
        if (hoursTaken > 0 || daysTaken > 0) timeTaken += `${hoursTaken}h `;
        if (minutesTaken > 0 || hoursTaken > 0 || daysTaken > 0) timeTaken += `${minutesTaken}m `;
        timeTaken += `${secondsTaken}s`;

        return timeTaken.trim();
    }

    // Save tasks to local storage
    function saveTasks() {
        try {
            const tasks = [];
            taskList.querySelectorAll('li').forEach((li) => {
                tasks.push({
                    text: li.querySelector('span').textContent,
                    dueDateTime: li.querySelector('.countdown').dataset.dueDate,
                    completed: li.classList.contains('completed'),
                    creationTimestamp: li.querySelector('small') ? li.querySelector('small').textContent.replace('Created: ', '') : '',
                    completionTime: li.querySelector('.completion-time').textContent.replace('Time taken: ', '')
                });
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks to localStorage:", error);
        }
    }

    // Load tasks from local storage
    function loadTasks() {
        let tasks = [];
        try {
            tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        } catch (error) {
            console.error("Error parsing tasks from localStorage:", error);
            localStorage.removeItem('tasks'); // Remove corrupted data
        }
        tasks.forEach((task) => {
            const newTask = createTask(task.text, 0, task.completed, task.creationTimestamp, task.completionTime);
            if (newTask) {
                newTask.querySelector('.countdown').dataset.dueDate = task.dueDateTime;
                taskList.appendChild(newTask);
                if (!task.completed) {
                    updateCountdownForTask(newTask, task.dueDateTime);
                }
            }
        });
    }

    // Update countdown for a specific task
    function updateCountdownForTask(li, dueDateISOString) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const remainingTime = new Date(dueDateISOString).getTime() - now;
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

        updateCountdown();
        const timerInterval = setInterval(updateCountdown, 1000);
    }

    // Show tasks based on their completion status
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

    loadTasks(); // Load tasks on page load

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const days = daysInput.value.trim();
        if (taskText !== '' && days !== '' && !isNaN(days) && parseInt(days, 10) > 0) {
            const newTask = createTask(taskText, days);
            if (newTask) {
                taskList.appendChild(newTask);
                taskInput.value = '';
                daysInput.value = '';
                saveTasks();
            }
        } else {
            // Handle invalid input
            alert("Please enter a valid task and a positive number of days.");
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