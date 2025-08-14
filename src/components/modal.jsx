import { createPortal } from "react-dom";

export function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9998] grid place-items-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-[9999] w-[92vw] max-w-md card p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
          <button className="text-rose-700/70 hover:text-rose-900" onClick={onClose}>✕</button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({ open, title, message, onCancel, onConfirm, confirmText = "Confirm" }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-rose-800/90">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn bg-rose-200 text-rose-900" onClick={onCancel}>Cancel</button>
        <button className="btn bg-pink-600 text-white" onClick={onConfirm}>{confirmText}</button>
      </div>
    </Modal>
  );
}
