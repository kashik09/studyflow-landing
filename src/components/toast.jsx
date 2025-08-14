import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "info", ms = 2200) => {
    const id = crypto.randomUUID?.() || String(Date.now() + Math.random());
    setToasts((t) => [...t, { id, msg, type }]);
    if (ms > 0) setTimeout(() => setToasts((t) => t.filter(x => x.id !== id)), ms);
  }, []);
  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      {createPortal(
        <div className="fixed inset-x-0 bottom-4 z-[9999] flex justify-center px-4 pointer-events-none">
          <div className="flex w-full max-w-lg flex-col gap-2">
            {toasts.map(t => (
              <div
                key={t.id}
                className={`pointer-events-auto card px-4 py-3 text-sm shadow-md ${
                  t.type === "error" ? "ring-rose-300 bg-rose-50" :
                  t.type === "success" ? "ring-green-200 bg-green-50" :
                  "ring-rose-100 bg-white/80"
                }`}
              >
                <span className="text-rose-900">{t.msg}</span>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
