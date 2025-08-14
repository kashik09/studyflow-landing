import Section from "../components/section.jsx";
import Button from "../components/button.jsx";
import NoteCompiler from "../components/note-compiler.jsx";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Section
        title="StudyFlow"
        subtitle="Your notes, compiled clean. Minimal clicks. Max focus."
        className="pt-10"
      >
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-5">
            <p className="text-rose-900/90">
              Drop all your messy thoughts. StudyFlow turns chaos into tidy bullets you can revise fast.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button as={Link} to="/features">See features</Button>
              <Button as={Link} to="/contact" className="bg-rose-200 text-rose-900">
                Talk to us
              </Button>
            </div>
            <ul className="mt-2 list-disc pl-5 text-rose-900/80 space-y-1 text-sm">
              <li>Unlimited input size in the real app vision.</li>
              <li>Clean, distraction free interface.</li>
            </ul>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="rounded-xl bg-gradient-to-br from-pink-100 to-rose-50 p-4">
              <p className="text-sm text-rose-800/80">Sneak peek</p>
              <h3 className="text-xl font-semibold text-rose-900 mt-1">Chat‑style layout</h3>
              <div className="mt-3 space-y-3">
                <div className="rounded-xl bg-white/80 p-3 text-rose-900 shadow">
                  You: “show me my notes on the OSI model”
                </div>
                <div className="rounded-xl bg-rose-100/70 p-3 text-rose-900 shadow">
                  StudyFlow: 5 key bullets, 2 diagrams, 1 mini quiz. Ready.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <NoteCompiler />
      </Section>

      <Section
        title="Why StudyFlow"
        subtitle="Cute, calm, and powerful for real students."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-semibold text-rose-900">Focus first</h3>
            <p className="text-rose-800/90">Design that respects your brain. No clutter. No stress.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold text-rose-900">Note superpowers</h3>
            <p className="text-rose-800/90">Compile, highlight, and pin key ideas for quick review.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
