import { useEffect, useMemo, useState } from "react";
import Section from "../components/section.jsx";
import Button from "../components/button.jsx";
import NoteCard from "../components/note-card.jsx";
import { Modal, ConfirmModal } from "../components/modal.jsx";
import { useToast } from "../components/toast.jsx";
import {
  listFolders, createFolder, renameFolder, deleteFolder,
  listNotesByFolder, deleteNote
} from "../lib/storage.js";

export default function Notes() {
  const toast = useToast();
  const [folders, setFolders] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState("");
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  // modal state
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameId, setRenameId] = useState(null);
  const [renameName, setRenameName] = useState("");
  const [confirm, setConfirm] = useState(null); // { type: "folder"|"note", id, message }

  useEffect(() => {
    const f = listFolders();
    setFolders(f);
    setActiveFolderId(f[0]?.id || "");
  }, []);

  useEffect(() => {
    if (!activeFolderId) { setNotes([]); return; }
    setNotes(listNotesByFolder(activeFolderId));
    setActive(null);
  }, [activeFolderId]);

  const filtered = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(n =>
      (n.title || "").toLowerCase().includes(q) ||
      (n.raw || "").toLowerCase().includes(q) ||
      (n.bullets || []).some(b => (b || "").toLowerCase().includes(q))
    );
  }, [notes, query]);

  function addFolder() {
    setNewFolderName("");
    setShowNewFolder(true);
  }
  function handleCreateFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    const f = createFolder(name);
    const nf = [f, ...folders];
    setFolders(nf); setActiveFolderId(f.id); setShowNewFolder(false);
    toast.push(`Folder “${name}” created.`, "success");
  }

  function doRenameFolder(id) {
    const f = folders.find(x => x.id === id);
    setRenameId(id);
    setRenameName(f?.name || "");
  }
  function handleRenameFolder() {
    const name = renameName.trim();
    if (!name) return;
    renameFolder(renameId, name);
    setFolders(listFolders());
    setRenameId(null);
    toast.push("Folder renamed.", "success");
  }

  function doDeleteFolder(id) {
    const f = folders.find(x => x.id === id);
    setConfirm({ type: "folder", id, message: `Delete folder “${f?.name}” and all its notes?` });
  }
  function confirmDeleteFolder() {
    deleteFolder(confirm.id);
    const nf = listFolders();
    setFolders(nf);
    setActiveFolderId(nf[0]?.id || "");
    setConfirm(null);
    toast.push("Folder deleted.", "success");
  }

  function onDeleteNote(id) {
    setConfirm({ type: "note", id, message: "Delete this note?" });
  }
  function confirmDeleteNote() {
    deleteNote(confirm.id);
    setNotes(listNotesByFolder(activeFolderId));
    if (active?.id === confirm.id) setActive(null);
    setConfirm(null);
    toast.push("Note deleted.", "success");
  }

  function toMD(n) {
    const title = n.title || "Untitled";
    const bullets = (n.bullets && n.bullets.length ? n.bullets : n.raw.split(/\r?\n/).filter(Boolean).map(l => `• ${l}`))
      .map(l => `- ${l.replace(/^•\s?/, "")}`)
      .join("\n");
    return `# ${title}\n\n${bullets}\n`;
  }
  function downloadMD(n) {
    const md = toMD(n);
    const url = URL.createObjectURL(new Blob([md], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${(n.title || "notes").toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.push("Downloaded .md ✅", "success");
  }
  function printPDF(n) {
    const md = toMD(n);
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${n.title || "Notes"}</title>
<style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial;margin:32px;color:#1f2937}
h1{font-size:24px;margin:0 0 12px;color:#9f1239}pre{white-space:pre-wrap;word-wrap:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
hr{border:0;height:1px;background:#fecdd3;margin:16px 0}</style></head>
<body><h1>${n.title || "Notes"}</h1><hr/><pre>${md.replace(/[&<>]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]))}</pre>
<script>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    w.document.open(); w.document.write(html); w.document.close();
    toast.push("Opened print dialog. Select “Save as PDF”.", "info");
  }

  return (
    <Section title="Notes Library" subtitle="Folders on the left. Previews on the right.">
      <div className="grid gap-6 lg:grid-cols-[300px,1fr]">
        {/* FOLDERS */}
        <aside className="card p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-rose-900 font-semibold">Folders</h3>
            <Button className="bg-rose-200 text-rose-900" onClick={addFolder}>New</Button>
          </div>
          <div className="space-y-1 max-h-[58vh] overflow-auto pr-1">
            {folders.length === 0 && <p className="text-sm text-rose-700/70">No folders yet.</p>}
            {folders.map(f => (
              <div
                key={f.id}
                className={`rounded-xl p-2.5 flex items-center justify-between cursor-pointer transition ${
                  activeFolderId === f.id ? "bg-rose-100/80" : "hover:bg-rose-50"
                }`}
                onClick={() => setActiveFolderId(f.id)}
              >
                <div className="truncate text-rose-900">{f.name}</div>
                <div className="flex items-center gap-2 text-xs">
                  <button className="text-rose-700/70 hover:text-rose-900" onClick={(e)=>{e.stopPropagation(); doRenameFolder(f.id);}}>Rename</button>
                  <button className="text-rose-700/70 hover:text-rose-900" onClick={(e)=>{e.stopPropagation(); doDeleteFolder(f.id);}}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <input
            className="mt-2 w-full rounded-xl border border-rose-200 bg-white/70 p-2.5 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            placeholder="Search notes in folder..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </aside>

        {/* NOTES GRID + READER */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 ? (
              <div className="card p-6 text-rose-800/80">No notes yet in this folder.</div>
            ) : (
              filtered.map(n => (
                <NoteCard
                  key={n.id}
                  note={n}
                  onOpen={(nn) => setActive(nn)}
                  onDownload={downloadMD}
                  onPrint={printPDF}
                  onDelete={onDeleteNote}
                />
              ))
            )}
          </div>

          {/* Reader panel */}
          <div className="card p-5 sm:p-6">
            {!active ? (
              <p className="text-rose-800/80">Select a note card to open, or keep browsing the previews.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-rose-900">
                    {active.title || "Untitled"}
                  </h2>
                  <div className="flex gap-2">
                    <Button className="bg-rose-300 text-rose-900" onClick={() => downloadMD(active)}>Download .md</Button>
                    <Button className="bg-rose-400 text-white" onClick={() => printPDF(active)}>Print / PDF</Button>
                    <Button className="bg-rose-200 text-rose-900" onClick={() => onDeleteNote(active.id)}>Delete</Button>
                  </div>
                </div>
                <p className="mt-1 text-xs text-rose-700/70">
                  Updated {new Date(active.updatedAt || active.createdAt).toLocaleString()}
                </p>
                <hr className="my-4 border-rose-100" />
                <div className="prose prose-sm max-w-none">
                  {(active.bullets && active.bullets.length ? active.bullets : active.raw.split(/\r?\n/).filter(Boolean))
                    .map((line, i) => <p key={i} className="text-rose-900">• {line.replace(/^•\s?/, "")}</p>)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New Folder Modal */}
      <Modal open={showNewFolder} title="Create new folder" onClose={() => setShowNewFolder(false)}>
        <input
          autoFocus
          className="w-full rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn bg-rose-200 text-rose-900" onClick={() => setShowNewFolder(false)}>Cancel</button>
          <button className="btn bg-pink-600 text-white" onClick={handleCreateFolder}>Create</button>
        </div>
      </Modal>

      {/* Rename Folder Modal */}
      <Modal open={!!renameId} title="Rename folder" onClose={() => setRenameId(null)}>
        <input
          autoFocus
          className="w-full rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Folder name"
          value={renameName}
          onChange={(e) => setRenameName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRenameFolder()}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn bg-rose-200 text-rose-900" onClick={() => setRenameId(null)}>Cancel</button>
          <button className="btn bg-pink-600 text-white" onClick={handleRenameFolder}>Save</button>
        </div>
      </Modal>

      {/* Confirm delete modal */}
      <ConfirmModal
        open={!!confirm}
        title="Please confirm"
        message={confirm?.message || ""}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm?.type === "folder" ? confirmDeleteFolder() : confirmDeleteNote()}
        confirmText="Delete"
      />
    </Section>
  );
}
