const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const toggleDarkBtn = document.getElementById("toggle-dark");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCount() {
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeCount} task${activeCount !== 1 ? 's' : ''}`;
}

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `flex justify-between items-center px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 transition`;

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "cursor-pointer flex-1";
    if (task.completed) span.classList.add("completed");

    // Add click event to toggle completion
    span.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks(); // Re-render tasks to reflect the change
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "ml-3 text-red-500 hover:text-red-700";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.append(span, delBtn);
    taskList.appendChild(li);
  });

  updateCount();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove("active-filter"));
    btn.classList.add("active-filter");
    renderTasks();
  });
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

// Dark mode toggle
toggleDarkBtn.addEventListener("click", () => {
  const isDarkMode = document.documentElement.classList.toggle("dark");
  toggleDarkBtn.textContent = isDarkMode ? "☀️ Light" : "🌙 Dark";
});

window.addEventListener("DOMContentLoaded", () => {
  renderTasks();
});
