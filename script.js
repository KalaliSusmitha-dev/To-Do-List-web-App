const taskDate = document.getElementById('taskDate');
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const progressCircle = document.querySelector('.progress');
const progressText = document.getElementById('progressText');

const today = new Date().toISOString().slice(0, 10);
taskDate.value = today;

taskDate.addEventListener('change', loadTasks);
addBtn.addEventListener('click', () => {
  const date = taskDate.value;
  const text = taskInput.value.trim();
  if (!text) {
    alert("Please enter a task.");
    return;
  }
  const tasks = JSON.parse(localStorage.getItem(date) || "[]");
  tasks.push({ text, completed: false });
  localStorage.setItem(date, JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();
});

taskInput.addEventListener('keydown', (e) => {
  if (e.key === "Enter") addBtn.click();
});

function loadTasks() {
  const date = taskDate.value;
  const tasks = JSON.parse(localStorage.getItem(date) || "[]");
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = "<li><em>No tasks for this date.</em></li>";
    updateCircle(0, 0);
    return;
  }

  tasks.forEach((task, i) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    if (task.completed) li.classList.add('completed');

    const btnGroup = document.createElement('div');
    btnGroup.className = 'btn-group';

    const doneBtn = document.createElement('button');
    doneBtn.textContent = task.completed ? 'Undo' : 'Done';
    doneBtn.onclick = () => {
      tasks[i].completed = !tasks[i].completed;
      localStorage.setItem(date, JSON.stringify(tasks));
      loadTasks();
    };
    btnGroup.appendChild(doneBtn);

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      tasks.splice(i, 1);
      localStorage.setItem(date, JSON.stringify(tasks));
      loadTasks();
    };
    btnGroup.appendChild(delBtn);

    li.appendChild(btnGroup);
    taskList.appendChild(li);
  });

  const completed = tasks.filter(t => t.completed).length;
  updateCircle(completed, tasks.length);
}

function updateCircle(completed, total) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const ratio = total ? completed / total : 0;
  const offset = circumference - (circumference * ratio);
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = offset;
  progressText.textContent = `${completed}/${total}`;
}

window.addEventListener('load', loadTasks);
