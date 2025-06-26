document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const taskText = input.value.trim();
  if (taskText === "") return;

  const task = { text: taskText, priority: priority, completed: false };
  saveTask(task);
  renderTask(task);
  input.value = "";
}

function renderTask(task) {
  const li = document.createElement('li');
  li.className = task.priority;
  if (task.completed) li.classList.add('completed');

  const span = document.createElement('span');
  span.textContent = task.text;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.onchange = () => {
    task.completed = checkbox.checked;
    li.classList.toggle('completed');
    updateStoredTasks();
  };

  const delButton = document.createElement('button');
  delButton.textContent = "🗑️";
  delButton.onclick = () => {
    li.remove();
    removeTask(task.text);
  };

  const actions = document.createElement('div');
  actions.className = 'actions';
  actions.appendChild(checkbox);
  actions.appendChild(delButton);

  li.appendChild(span);
  li.appendChild(actions);
  document.getElementById('taskList').appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStoredTasks() {
  const taskElements = document.querySelectorAll('#taskList li');
  const updatedTasks = Array.from(taskElements).map(li => {
    return {
      text: li.querySelector('span').textContent,
      priority: li.classList.contains('high') ? 'high' :
                li.classList.contains('medium') ? 'medium' : 'low',
      completed: li.classList.contains('completed')
    };
  });
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function removeTask(taskText) {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const newTasks = tasks.filter(t => t.text !== taskText);
  localStorage.setItem("tasks", JSON.stringify(newTasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  tasks.forEach(task => renderTask(task));
}
