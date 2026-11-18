const STORAGE_KEY = "simple-notes";

const form = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const searchInput = document.getElementById("search");
const list = document.getElementById("notes");
const empty = document.getElementById("empty");

let notes = loadNotes();
let editingId = null;

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    alert("Couldn't save notes in this browser. Check that site storage is allowed.");
  }
}

function formatDate(ts) {
  return new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const shown = notes
    .filter(n => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
    .sort((a, b) => b.updated - a.updated);

  list.innerHTML = "";
  shown.forEach(note => {
    const li = document.createElement("li");
    li.className = "note";

    const h2 = document.createElement("h2");
    h2.textContent = note.title || "Untitled";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = "Edited " + formatDate(note.updated);

    const p = document.createElement("p");
    p.textContent = note.body;

    const row = document.createElement("div");
    row.className = "row";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(note.id));

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteNote(note.id));

    row.append(editBtn, delBtn);
    li.append(h2, meta);
    if (note.body) li.append(p);
    li.append(row);
    list.append(li);
  });

  empty.hidden = shown.length > 0;
  empty.textContent = q ? "No notes match that search." : "No notes yet. Write one above and select Add note.";
}

function resetForm() {
  editingId = null;
  form.reset();
  saveBtn.textContent = "Add note";
  cancelBtn.hidden = true;
}

function startEdit(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  editingId = id;
  titleInput.value = note.title;
  bodyInput.value = note.body;
  saveBtn.textContent = "Save changes";
  cancelBtn.hidden = false;
  titleInput.focus();
  window.scrollTo({ top: 0 });
}

function deleteNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  if (!confirm('Delete "' + (note.title || "Untitled") + '"?')) return;
  notes = notes.filter(n => n.id !== id);
  if (editingId === id) resetForm();
  saveNotes();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title && !body) {
    titleInput.focus();
    return;
  }
  const now = Date.now();
  if (editingId) {
    const note = notes.find(n => n.id === editingId);
    if (note) Object.assign(note, { title, body, updated: now });
  } else {
    notes.push({ id: String(now) + Math.random().toString(36).slice(2, 6), title, body, created: now, updated: now });
  }
  saveNotes();
  resetForm();
  render();
});

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", render);

render();
