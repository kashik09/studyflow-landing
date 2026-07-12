import { useState } from "react";
import Section from "../components/section.jsx";
import Button from "../components/button.jsx";

// Paste a Formspree form URL (free tier) to capture messages in a dashboard.
// Leave empty to fall back to opening the visitor's own email app via mailto.
const FORMSPREE_ENDPOINT = "";
const CONTACT_EMAIL = "kashiku789@gmail.com";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", msg: "Please fill all fields." });
      return;
    }
    setStatus({ type: "info", msg: "Sending..." });

    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus({ type: "ok", msg: "Message sent. Talk soon!" });
          setForm({ name: "", email: "", message: "" });
        } else {
          setStatus({ type: "error", msg: "Could not send. Please try again." });
        }
      } catch {
        setStatus({ type: "error", msg: "Network error. Please try again." });
      }
      return;
    }

    const subject = encodeURIComponent(`StudyFlow message from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus({ type: "ok", msg: "Opening your email app to send..." });
  }

  return (
    <Section title="Contact" subtitle="Say hi. We love feedback.">
      <form onSubmit={handleSubmit} className="card p-6 max-w-xl">
        <label className="block mb-3">
          <span className="text-sm text-rose-900">Name</span>
          <input
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-rose-900">Email</span>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-rose-900">Message</span>
          <textarea
            className="mt-1 w-full h-32 rounded-xl border border-rose-200 bg-white/70 p-3 text-rose-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="What should we build next?"
          />
        </label>

        <div className="flex items-center gap-3">
          <Button type="submit">Send</Button>
          {status && (
            <span
              className={
                status.type === "ok"
                  ? "text-sm text-green-700"
                  : status.type === "info"
                  ? "text-sm text-rose-500"
                  : "text-sm text-rose-700"
              }
            >
              {status.msg}
            </span>
          )}
        </div>
      </form>
    </Section>
  );
}
