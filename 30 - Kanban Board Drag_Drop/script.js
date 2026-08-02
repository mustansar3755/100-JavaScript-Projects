

const STORAGE_KEY = "kanbanTasks";

const board = document.getElementById("board");
const addTaskBtn = document.getElementById("addTaskBtn");
const modalOverlay = document.getElementById("modalOverlay");
const modalTitle = document.getElementById("modalTitle");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescInput = document.getElementById("taskDesc");
const taskPriorityInput = document.getElementById("taskPriority");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const toast = document.getElementById("toast");
const taskLists = document.querySelectorAll(".task-list");

let tasks = [];
let draggedTaskId = null;

// ===== Load / Save =====
function loadTasks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    tasks = JSON.parse(stored);
  } else {
    // Seed with a few sample tasks on first run
    tasks = [
      { id: cryptoId(), title: "Design homepage wireframe", desc: "Sketch layout for hero, features, footer.", priority: "medium", status: "todo" },
      { id: cryptoId(), title: "Set up project repo", desc: "Init git, add README, folder structure.", priority: "low", status: "todo" },
      { id: cryptoId(), title: "Build navbar component", desc: "Responsive nav with mobile toggle.", priority: "high", status: "inprogress" },
      { id: cryptoId(), title: "Record intro video", desc: "Script + record for Project 30.", priority: "medium", status: "done" }
    ];
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function cryptoId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ===== Render =====
function render() {
  const statuses = ["todo", "inprogress", "done"];

  statuses.forEach(status => {
    const list = document.getElementById(status);
    const countEl = document.getElementById(`count-${status}`);
    const items = tasks.filter(t => t.status === status);

    countEl.textContent = items.length;
    list.innerHTML = "";

    if (items.length === 0) {
      list.innerHTML = `<div class="empty-state">No tasks yet</div>`;
      return;
    }

    items.forEach(task => {
      const card = document.createElement("div");
      card.className = `task-card priority-${task.priority}`;
      card.draggable = true;
      card.dataset.id = task.id;

      card.innerHTML = `
        <button class="task-delete" title="Delete task">&times;</button>
        <div class="task-title"></div>
        <div class="task-desc"></div>
        <div class="task-footer">
          <span class="priority-badge ${task.priority}">${task.priority}</span>
        </div>
      `;

      // Set text via textContent to avoid HTML injection from user input
      card.querySelector(".task-title").textContent = task.title;
      card.querySelector(".task-desc").textContent = task.desc || "";

      list.appendChild(card);
    });
  });
}

// ===== Drag & Drop =====
board.addEventListener("dragstart", e => {
  const card = e.target.closest(".task-card");
  if (!card) return;
  draggedTaskId = card.dataset.id;
  setTimeout(() => card.classList.add("dragging"), 0);
});

board.addEventListener("dragend", e => {
  const card = e.target.closest(".task-card");
  if (card) card.classList.remove("dragging");
  taskLists.forEach(list => list.classList.remove("drag-over"));
});

taskLists.forEach(list => {
  list.addEventListener("dragover", e => {
    e.preventDefault();
    list.classList.add("drag-over");
  });

  list.addEventListener("dragleave", () => {
    list.classList.remove("drag-over");
  });

  list.addEventListener("drop", e => {
    e.preventDefault();
    list.classList.remove("drag-over");

    const newStatus = list.dataset.status;
    const task = tasks.find(t => t.id === draggedTaskId);
    if (task && task.status !== newStatus) {
      task.status = newStatus;
      saveTasks();
      render();
      showToast(`Moved to "${labelFor(newStatus)}"`);
    }
    draggedTaskId = null;
  });
});

function labelFor(status) {
  return { todo: "To Do", inprogress: "In Progress", done: "Done" }[status];
}

// ===== Delete Task =====
board.addEventListener("click", e => {
  if (e.target.classList.contains("task-delete")) {
    const card = e.target.closest(".task-card");
    const id = card.dataset.id;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
    showToast("Task deleted");
  }
});

// ===== Modal (Add Task) =====
addTaskBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", e => {
  if (e.target === modalOverlay) closeModal();
});

function openModal() {
  modalTitle.textContent = "Add New Task";
  taskTitleInput.value = "";
  taskDescInput.value = "";
  taskPriorityInput.value = "medium";
  modalOverlay.classList.add("active");
  taskTitleInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove("active");
}

saveBtn.addEventListener("click", () => {
  const title = taskTitleInput.value.trim();
  if (!title) {
    taskTitleInput.style.outline = "1px solid var(--accent-red)";
    taskTitleInput.focus();
    return;
  }

  const newTask = {
    id: cryptoId(),
    title,
    desc: taskDescInput.value.trim(),
    priority: taskPriorityInput.value,
    status: "todo"
  };

  tasks.unshift(newTask);
  saveTasks();
  render();
  closeModal();
  showToast("Task added to To Do");
});

// Allow Enter key (without Shift) to save from the title field
taskTitleInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    saveBtn.click();
  }
});

// ===== Toast =====
let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("show");
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

// ===== Init =====
loadTasks();
render();