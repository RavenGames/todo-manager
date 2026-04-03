// ========================================
// TODO MANAGER - JavaScript
// ========================================

// Data structure
let tasks = [];
let currentFilter = "all";
let searchQuery = "";
let editingTaskId = null;
// DOM Elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const categorySelect = document.getElementById("categorySelect");
const tasksContainer = document.getElementById("tasksContainer");
const emptyState = document.getElementById("emptyState");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const clearCompletedBtn = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");

// Event Listeners
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderTasks();
});
clearCompletedBtn.addEventListener("click", deleteCompletedTasks);
themeToggle.addEventListener("click", toggleTheme);

// ========================================
// Task Management
// ========================================

function addTask() {
  const text = taskInput.value.trim();
  const category = categorySelect.value;

  if (!text) {
    alert("Please enter a task");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: text,
    category: category,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  // Clear input
  taskInput.value = "";
  taskInput.focus();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteCompletedTasks() {
  if (confirm("Delete all completed tasks?")) {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
  }
}

function setFilter(filter) {
  currentFilter = filter;

  // Update button states
  filterBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  renderTasks();
}

// ========================================
// Rendering
// ========================================

function renderTasks() {
  // Filter tasks
  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  // Search filter
  if (searchQuery) {
    filteredTasks = filteredTasks.filter((t) =>
      t.text.toLowerCase().includes(searchQuery),
    );
  }

  // Update counts
  updateCounts();

  // Empty state check
  if (filteredTasks.length === 0) {
    tasksContainer.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  // Render tasks
  tasksContainer.innerHTML = filteredTasks
    .map((task) => {
      // Check if this task is being edited
      if (editingTaskId === task.id) {
        return `
          <div class="task-item editing">
            <input 
              type="text" 
              id="edit-input-${task.id}" 
              class="task-edit-input" 
              value="${escapeHtml(task.text)}"
            >
            <div class="task-edit-actions">
              <button class="task-btn save-btn" onclick="saveEdit(${task.id})" title="Save" aria-label="Save edit">
                <i class="fas fa-check"></i> Save
              </button>
              <button class="task-btn cancel-btn" onclick="cancelEdit()" title="Cancel" aria-label="Cancel edit">
                <i class="fas fa-times"></i> Cancel
              </button>
            </div>
          </div>
        `;
      }

      return `
        <div class="task-item ${task.completed ? "completed" : ""}">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? "checked" : ""} 
            onchange="toggleTask(${task.id})"
            aria-label="Complete task"
          >
          <div class="task-content">
            <div class="task-text">${escapeHtml(task.text)}</div>
            <div class="task-meta">
              <span class="category-badge ${task.category}">${task.category}</span>
              <span>${task.createdAt}</span>
            </div>
          </div>
          <div class="task-actions">
            <button class="task-btn edit-btn" onclick="editTask(${task.id})" title="Edit task" aria-label="Edit task">
              <i class="fas fa-edit"></i>
            </button>
            <button class="task-btn delete-btn" onclick="deleteTask(${task.id})" title="Delete task" aria-label="Delete task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateCounts() {
  const all = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  document.getElementById("count-all").textContent = all;
  document.getElementById("count-active").textContent = active;
  document.getElementById("count-completed").textContent = completed;
}

// ========================================
// Storage & Persistence
// ========================================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// ========================================
// Theme Toggle
// ========================================

function toggleTheme() {
  const isDark = document.body.classList.toggle("light-mode");
  localStorage.setItem("theme", isDark ? "light" : "dark");
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = themeToggle.querySelector("i");
  const isDark = document.body.classList.contains("light-mode");
  icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}

function loadTheme() {
  const theme = localStorage.getItem("theme") || "dark";
  if (theme === "light") {
    document.body.classList.add("light-mode");
  }
  updateThemeIcon();
}

// ========================================
// Utilities
// ========================================

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  editingTaskId = id;
  renderTasks();

  // Focus on the input field
  setTimeout(() => {
    const input = document.getElementById(`edit-input-${id}`);
    if (input) {
      input.focus();
      input.select();
    }
  }, 0);
}

function saveEdit(id) {
  const input = document.getElementById(`edit-input-${id}`);
  const newText = input.value.trim();

  if (!newText) {
    alert("Task cannot be empty");
    input.focus();
    return;
  }

  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.text = newText;
    saveTasks();
  }

  editingTaskId = null;
  renderTasks();
}

function cancelEdit() {
  editingTaskId = null;
  renderTasks();
}

// ========================================
// Initialize
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadTheme();
  renderTasks();
  taskInput.focus();
});

// ========================================
// TODO / Enhancement Ideas
// ========================================
/*
1. Implement edit inline or modal
2. Add drag and drop reordering
3. Add priority levels (Low, Medium, High)
4. Add due dates with calendar
5. Add task tags
6. Add recurring tasks
7. Add task analytics / stats
8. Add export to CSV
9. Add keyboard shortcuts
10. Add PWA support
*/
