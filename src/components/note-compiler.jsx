import { useMemo, useState, useEffect } from "react";
import Button from "./button.jsx";
import { Modal } from "./modal.jsx";
import { useToast } from "./toast.jsx";
import { listFolders, createFolder, saveNote } from "../lib/storage.js";
import CuteSelect from "./cute-select.jsx";

// ...

<div className="mb-3 flex flex-wrap items-center gap-2">
  <label className="text-sm text-rose-900">Folder</label>
  <CuteSelect
    options={folders.map(f => ({ value: f.id, label: f.name }))}
    value={folderId}
    onChange={(val) => setFolderId(val)}
    placeholder="Choose folder"
  />
  <Button className="bg-rose-200 text-rose-900" onClick={openNewFolder}>New folder</Button>
</div>

export default function NoteCompiler() {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [raw, setRaw] = useState("");
  const [bullets, setBullets] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState("");

  // modal state
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const f = listFolders();
    setFolders(f);
    setFolderId(f[0]?.id || "");
  }, []);

  const stats = useMemo(() => {
    const words = raw.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).filter(Boolean);
    const freq = {};
    words.forEach(w => (freq[w] = (freq[w] || 0) + 1));
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w, c]) => `${w} ×${c}`);
    return { count: words.length, top };
  }, [raw]);

  function compile() {
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const seen = new Set();
    const unique = [];
    for (const l of lines) {
      const key = l.toLowerCase();
      if (!seen.has(key)) { seen.add(key); unique.push(l); }
    }
    const out = unique.map(line => {
      if (line.includes(":")) {
        const i = line.indexOf(":");
        return `• ${line.slice(0, i).trim()} — ${line.slice(i + 1).trim()}`;
      }
      return `• ${line}`;
    });
    setBullets(out.slice(0, 200));
    toast.push("Compiled ✨", "success");
  }

  function clearAll() {
    setTitle(""); setRaw(""); setBullets([]);
    toast.push("Cleared.", "info");
  }

  function toMarkdown() {
    const safeTitle = title?.trim() || "Untitled";
    const lines = bullets.length ? bullets : raw.split(/\r?\n/).filter(Boolean).map(l => `• ${l}`);
    const mdBullets = lines.map(l => `- ${l.replace(/^•\s?/, "")}`).join("\n");
    return `# ${safeTitle}\n\n${mdBullets}\n`;
  }

  function downloadMD() {
    const blob = new Blob([toMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const name = (title?.trim() || "notes").toLowerCase().replace(/\s+/g, "-");
    a.href = url; a.download = `${name}.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.push("Downloaded .md ✅", "success");
  }

  function printPDF() {
    const md = toMarkdown();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title || "Notes"}</title>
<style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial;margin:32px;color:#1f2937}
h1{font-size:24px;margin:0 0 12px;color:#9f1239}pre{white-space:pre-wrap;word-wrap:break-word;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}
hr{border:0;height:1px;background:#fecdd3;margin:16px 0}</style></head>
<body><h1>${title || "Notes"}</h1><hr/><pre>${md.replace(/[&<>]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]))}</pre>
<script>window.print()</script></body></html>`;
    const w = window.open("", "_blank");
    w.document.open(); w.document.write(html); w.document.close();
    toast.push("Opened print dialog. Select “Save as PDF”.", "info");
  }

  function openNewFolder() {
    setNewFolderName("");
    setShowNewFolder(true);
  }

  function createNewFolder() {
    const name = newFolderName.trim();
    if (!name) return;
    const f = createFolder(name);
    setFolders(prev => [f, ...prev]);
    setFolderId(f.id);
    setShowNewFolder(false);
    toast.push(`Folder “${name}” created.`, "success");
  }

  function saveToFolder() {
    if (!folderId) {
      toast.push("Pick a folder first.", "error");
      return;
    }
    const note = {
      id: crypto.randomUUID?.() || String(Date.now()),
      folderId,
      title: title?.trim() || "Untitled",
      raw,
      bullets: bullets.length ? bullets : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveNote(note);
    toast.push("Saved to folder 📁", "success");
  }

  return (
    <div id="try" className="card p-5 sm:p-6">
      <h3 className="text-lg font-semibold text-rose-900 mb-2">Note Compiler & Saver</h3>
      <p className="text-sm text-rose-800/80 mb-4">
        Paste notes → Compile → Save to a folder → Download .md → Print to PDF.
      </p>

      {/* Folder picker */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <label className="text-sm text-rose-900">Folder</label>
        <select
          className="rounded-xl border border-rose-200 bg-white/70 p-2 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
        >
          {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <Button className="bg-rose-200 text-rose-900" onClick={openNewFolder}>New folder</Button>
      </div>

      <div className="grid gap-3">
        <input
          className="w-full rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Title (e.g., Biology — Cell Respiration)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full h-44 rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 placeholder:text-rose-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Paste notes here... one thought per line."
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button onClick={compile}>Compile</Button>
        <Button className="bg-rose-200 text-rose-900" onClick={clearAll}>Clear</Button>
        <Button className="bg-pink-600 text-white" onClick={saveToFolder}>Save to folder</Button>
        <Button className="bg-rose-300 text-rose-900" onClick={downloadMD}>Download .md</Button>
        <Button className="bg-rose-400 text-white" onClick={printPDF}>Print / PDF</Button>
        <span className="text-xs text-rose-700/70">Words: {stats.count} • Hot: {stats.top.join(", ")}</span>
      </div>

      {!!bullets.length && (
        <div className="mt-4 space-y-2 text-rose-900">
          {bullets.map((b, i) => <p key={i}>{b}</p>)}
        </div>
      )}

      {/* New Folder Modal */}
      <Modal open={showNewFolder} title="Create new folder" onClose={() => setShowNewFolder(false)}>
        <input
          autoFocus
          className="w-full rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
          placeholder="Folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && createNewFolder()}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn bg-rose-200 text-rose-900" onClick={() => setShowNewFolder(false)}>Cancel</button>
          <button className="btn bg-pink-600 text-white" onClick={createNewFolder}>Create</button>
        </div>
      </Modal>
    </div>
  );
}
