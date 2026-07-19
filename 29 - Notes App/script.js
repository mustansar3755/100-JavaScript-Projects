// Select DOM Elements

const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("noteTitle");
const bodyInput = document.getElementById("noteBody");
const noteGrid = document.getElementById("noteGrid");
const noteCount = document.getElementById("noteCount");
const emptyState = document.getElementById("emptyState");
const swatches = document.querySelectorAll(".swatch");

const STORAGE_KEY = "smartlearning_notes";

let selectedColor = "amber";

// Local-Storage Helper

function getNotes() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveNotes(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// COLOR SWATCHE SELECTION

swatches.forEach((swatch) => {
  swatch.addEventListener("click", () => {
    swatches.forEach((s) => s.classList.remove("is-active"));
    swatch.classList.add("is-active");
    selectedColor = swatch.dataset.color;
  });
});

// CREATE A NOTE CARD (DOM ELEMENT)
function createNoteElement(note) {
  const card = document.createElement("div");
  card.className = `note note--${note.color}`;
  card.style.setProperty("--tilt", `${note.tilt}deg`);
  card.dataset.id = note.id;

  card.innerHTML = `
    ${note.title ? `<div class="note__title">${escapeHTML(note.title)}</div>` : ""}
    <div class="note__body">${escapeHTML(note.body)}</div>
    <div class="note__meta">${note.date}</div>
    <button class="note__delete" aria-label="Delete note">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  //   Delete This Specific Notr
  card.querySelector(".note__delete").addEventListener("click", () => {
    deleteNote(note.id);
  });
  return card;
}

// Prevent basic HTML injection from note text
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// RENDER ALL NOTES

function renderNotes() {
  const notes = getNotes();
  noteGrid.innerHTML = "";

  notes.forEach((note) => {
    noteGrid.appendChild(createNoteElement(note));
  });

  noteCount.textContent = notes.length;
  emptyState.classList.toggle("is-visible", notes.length === 0);
}

// ADD A NEW NOTE

noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!body) {
    bodyInput.focus();
    return;
  }

  const newNotes = {
    id: Date.now().toString(),
    title,
    body,
    color: selectedColor,
    tilt: (Math.random() * 4 - 2).toFixed(2), //Slight random tilt -2deg to 2 deg
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    }),
  };
  const notes = getNotes();
  notes.unshift(newNotes); // newest first
  saveNotes(notes);
  renderNotes();

  noteForm.reset();
  titleInput.focus();
});

// Delete A NOTE

function deleteNote(id) {
  const notes = getNotes().filter((note) => note.id !== id);
  saveNotes(notes);
  renderNotes();
}

// INITIAL RENDER ON PAGE LOAD

renderNotes();
