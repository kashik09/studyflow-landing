export default function NoteCard({ note, onOpen, onDownload, onPrint, onDelete }) {
  const lines = (note.bullets && note.bullets.length ? note.bullets : note.raw.split(/\r?\n/).filter(Boolean))
    .slice(0, 3)
    .map(l => l.replace(/^•\s?/, ""));
  const words = (note.raw || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div className="card p-4 flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-rose-900 truncate">{note.title || "Untitled"}</h3>
        <button
          className="text-xs text-rose-700/70 hover:text-rose-900"
          onClick={() => onDelete(note.id)}
          title="Delete"
        >
          Delete
        </button>
      </div>

      <p className="mt-1 text-[11px] text-rose-700/70">
        {new Date(note.updatedAt || note.createdAt).toLocaleString()} • {words} words
      </p>

      <div className="mt-3 rounded-lg bg-rose-50/60 p-3 text-rose-900/90 text-sm min-h-[72px]">
        {lines.length ? (
          <ul className="list-disc pl-4 space-y-1">
            {lines.map((l, i) => <li key={i} className="truncate">{l}</li>)}
          </ul>
        ) : (
          <p className="text-rose-700/70">No preview yet.</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn bg-pink-500 text-white" onClick={() => onOpen(note)}>Open</button>
        <button className="btn bg-rose-300 text-rose-900" onClick={() => onDownload(note)}>Download .md</button>
        <button className="btn bg-rose-400 text-white" onClick={() => onPrint(note)}>Print / PDF</button>
      </div>
    </div>
  );
}
