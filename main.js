document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();

    const task = document.getElementById('task').value;
    const dateTime = document.getElementById('date').value;

    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    tasks.push({ id: tasks.length, task, dateTime });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
});

function getTasks() {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
        tasks = [];
    }
    else {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    if (tasks.length === 0 || tasks === null) {
        return;
    } else {
        const taskList = document.createElement('div');
        taskList.id = 'task-container';
        taskList.className = 'task-container';
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(taskList);
    }
    tasks.forEach(function (task) {
        const taskList = document.getElementById('task-container');
        const row = document.createElement('div');
        let dateTime = new Date(task.dateTime);
        dateTime = dateTime.toLocaleString('pt-BR', { timeZone: 'UTC' });

        let remain = new Date(task.dateTime).getTime() - new Date().getTime();
        let days = Math.floor(remain / (1000 * 60 * 60 * 24));
        let hours = Math.floor((remain % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60));

        const button = document.createElement('button');
        button.innerHTML = 'Concluir';
        button.addEventListener('click', function () {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks = tasks.filter(function (e) {
                return e.id !== task.id;
            });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            row.remove();
            location.reload();
        });

        row.className = 'task'
        row.innerHTML = `
            <h3>${task.task}</h3>
            <div>
                <p class="reamin-time">Tempo Restante: ${days} dias, ${hours} horas, ${minutes} minutos</p>
                <p class="limit-time">Prazo limite: ${dateTime}</p>
            </div>
        `;
        row.appendChild(button);
        taskList.appendChild(row);
    });
}

getTasks();
