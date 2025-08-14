export default function Footer() {
  return (
    <footer className="container-p">
      <div className="mx-auto max-w-6xl py-10">
        <div className="card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-rose-900/80 text-sm">
            Built for students who want flow, not fluff.
          </p>
          <div className="flex items-center gap-3 text-rose-700/80 text-sm">
            <a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
            <span>•</span>
            <a href="#contact">Support</a>
          </div>
        </div>
        <p className="mt-6 text-xs text-rose-700/60">© {new Date().getFullYear()} StudyFlow.</p>
      </div>
    </footer>
  );
}
