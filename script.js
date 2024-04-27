const LOCAL_STORAGE_TASKS_KEY = 'tasks';

const taskForm = document.getElementById('newTaskForm');
const taskInput = document.getElementById('taskText');
const dateTimeInput = document.getElementById('taskDate');
const tasksContainer = document.getElementById('tasksContainer');
const newTaskContainer = document.getElementById('newTaskContainer');
const newTaskButton = document.getElementById('newTaskButton');

newTaskButton.onclick = openNewTaskModal;

dateTimeInput.onchange = () => {
    dateTimeInput.setCustomValidity('');
}

newTaskContainer.onclick = (e) => {
    if (e.target === newTaskContainer) {
        closeNewTaskModal();
    }
}

taskForm.onsubmit = (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(dateTimeInput.value);

    if (selectedDate <= currentDate) {
        dateTimeInput.setCustomValidity('A data escolhida deve ser posterior à data atual');
    }

    taskInput.value = taskInput.value.trim();

    if (!taskForm.checkValidity()) {
        taskForm.reportValidity();
        return;
    }

    let tasks;
    if (localStorage.getItem(LOCAL_STORAGE_TASKS_KEY) === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_KEY));
    }
    const newTask = { id: Date.now(), text: taskInput.value, dueDate: dateTimeInput.value };
    tasks.push(newTask);
    localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
    setupNotifications(newTask);
    getTasks();
    closeNewTaskModal();
};

function getTasks() {
    let tasks;
    if (localStorage.getItem(LOCAL_STORAGE_TASKS_KEY) === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_KEY));
    }

    tasksContainer.innerHTML = '';

    if (tasks.length === 0 || tasks === null) return;

    tasks.forEach((task) => {
        const row = document.createElement('div');
        row.className = 'task'
        const button = createButton(task);
        const content = document.createElement('div');
        content.className = 'content';
        row.appendChild(content);
        createContent(task, content);
        setInterval(() => {
            createContent(task, content);
        }, 1000);
        row.appendChild(button);

        tasksContainer.appendChild(row);
    });
}

function createContent(task, content) {
    let { days, hours, minutes, seconds, dateTime } = remainingTime(task.dueDate);
    content.innerHTML = `
            <h3>${task.text}</h3>
            <p class="reamin-time">Tempo Restante: 
                ${days > 0 ? `${days} dias, ` : ''}
                ${hours > 0 ? `${hours} horas, ` : ''}
                ${minutes > 0 ? `${minutes} minutos` : ''}
                ${seconds > 0 ? ` e ${seconds} segundos` : ''}
            </p>
            <p class="limit-time">Prazo limite: ${dateTime}</p>
        `;
}

function createButton(task) {
    const button = document.createElement('button');
    button.innerHTML = 'Concluir';
    button.addEventListener('click', () => {
        let tasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TASKS_KEY));
        tasks = tasks.filter(function (e) {
            return e.id !== task.id;
        });
        localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks));
        getTasks();
    });
    return button;
}

function remainingTime(dueDate) {
    let dateTime = new Date(dueDate).toLocaleString('pt-BR');
    let remain = new Date(dueDate).getTime() - new Date().getTime();
    let days = Math.round(remain / (1000 * 60 * 60 * 24));
    let hours = Math.round((remain % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.round((remain % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.round((remain % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, dateTime };
}

function setupNotifications(task) {
    const timeUntilDue = new Date(task.dueDate) - Date.now();
    console.log(timeUntilDue, task.dueDate, Date.now());
    if (timeUntilDue > 0) {
        setTimeout(() => {
            const notification = new Notification('Tarefa Vencida', {
                body: task.text,
                requireInteraction: true,
            });
        }, timeUntilDue);
    }
}

function openNewTaskModal() {
    newTaskContainer.style.display = 'flex';
    taskInput.focus();
    newTaskButton.style.display = 'none';
}

function closeNewTaskModal() {
    taskForm.reset();
    newTaskContainer.style.display = 'none';
    newTaskButton.style.display = 'block';
}

window.addEventListener('load', function () {
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }
    getTasks();
});