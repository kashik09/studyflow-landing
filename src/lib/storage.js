// Local storage keys
const LEGACY_KEY = "sf_notes";
const KEY = "sf_notes_v2";

/** Load full dataset { folders: [], notes: [] } */
export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // If v2 missing, try migrate legacy
  return migrateFromLegacy();
}

/** Save full dataset */
export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/** One-time migration from flat list to folders */
function migrateFromLegacy() {
  let legacy = [];
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (raw) legacy = JSON.parse(raw) || [];
  } catch {}
  const defaultFolderId = crypto.randomUUID?.() || String(Date.now());
  const data = {
    folders: [
      { id: defaultFolderId, name: "My Notes", createdAt: new Date().toISOString() }
    ],
    notes: legacy.map(n => ({
      id: n.id || crypto.randomUUID?.() || String(Math.random()),
      folderId: defaultFolderId,
      title: n.title || "Untitled",
      raw: n.raw || "",
      bullets: n.bullets || null,
      createdAt: n.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  };
  saveData(data);
  return data;
}

/** Folder ops */
export function listFolders() {
  return loadData().folders;
}
export function createFolder(name) {
  const data = loadData();
  const folder = { id: crypto.randomUUID?.() || String(Date.now()), name: name.trim(), createdAt: new Date().toISOString() };
  data.folders.unshift(folder);
  saveData(data);
  return folder;
}
export function renameFolder(id, name) {
  const data = loadData();
  const f = data.folders.find(x => x.id === id);
  if (f) f.name = name.trim();
  saveData(data);
}
export function deleteFolder(id) {
  const data = loadData();
  data.folders = data.folders.filter(f => f.id !== id);
  data.notes = data.notes.filter(n => n.folderId !== id);
  saveData(data);
}

/** Note ops */
export function listNotesByFolder(folderId) {
  const { notes } = loadData();
  return notes.filter(n => n.folderId === folderId).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}
export function getNote(id) {
  const { notes } = loadData();
  return notes.find(n => n.id === id) || null;
}
export function saveNote(note) {
  const data = loadData();
  const i = data.notes.findIndex(n => n.id === note.id);
  if (i >= 0) data.notes[i] = { ...note, updatedAt: new Date().toISOString() };
  else data.notes.unshift({ ...note, updatedAt: new Date().toISOString() });
  saveData(data);
}
export function deleteNote(id) {
  const data = loadData();
  data.notes = data.notes.filter(n => n.id !== id);
  saveData(data);
}
