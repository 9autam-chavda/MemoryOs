import { useEffect, useRef } from "react";
import Button from "./Button";

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {

  const dialogRef = useRef(null);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector("button")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);
  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="presentation">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="ui-card w-full max-w-md p-6">
        <h2 id="confirm-dialog-title" className="text-lg font-semibold text-[var(--text-primary)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>{cancelText}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmText}</Button>
        </div>

      </div>

    </div>

  );
}

export default ConfirmDialog;
