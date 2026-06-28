function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {

  if (!isOpen) return null;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

      <div className="w-[420px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-2xl font-bold mb-3">
          {title}
        </h2>

        <p className="text-gray-400 mb-8">
          {message}
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="
              rounded-lg
              bg-zinc-700
              px-4
              py-2
              hover:bg-zinc-600
            "
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="
              rounded-lg
              bg-red-600
              px-4
              py-2
              hover:bg-red-700
            "
          >
            {confirmText}
          </button>

        </div>

      </div>

    </div>

  );
}

export default ConfirmDialog;