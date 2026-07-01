import { useState } from "react";
import { CheckCircle2, FileAudio, FileImage, FileText, FileUp, Film, X } from "lucide-react";
import toast from "react-hot-toast";

import useUpload from "../../hooks/useUpload";

function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const { addUpload } = useUpload();

  const handleUpload = () => {
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }

    addUpload(file, () => {
      toast.success("Memory uploaded.");
      onUploadSuccess();
    });

    setFile(null);
    onClose();
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border border-white/[0.08] bg-[var(--surface-panel)] shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] p-5">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">Upload memory</p>
            <h2 className="mt-1 text-xl font-semibold text-zinc-100">Add source material to your second brain</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Documents, screenshots, PDFs, audio, video, and notes are indexed through extraction, summary, tagging, category, and embedding steps.
            </p>
          </div>
          <button type="button" onClick={handleClose} className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-100" aria-label="Close upload modal">
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/[0.14] bg-zinc-950 px-6 py-12 text-center transition hover:border-[var(--accent)]/70 hover:bg-white/[0.035]">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-zinc-950">
              <FileUp size={22} />
            </div>
            <p className="mt-4 text-base font-medium text-zinc-100">Drop a file here or choose from your device</p>
            <p className="mt-2 text-sm text-zinc-500">PNG, JPG, PDF, TXT, MD, MP3, MP4 and more</p>
            <input
              type="file"
              accept="image/*,application/pdf,audio/*,video/*,.txt,.md"
              onChange={(event) => setFile(event.target.files[0])}
              className="hidden"
            />
          </label>

          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {[
              { label: "Images", icon: FileImage },
              { label: "PDFs", icon: FileText },
              { label: "Audio", icon: FileAudio },
              { label: "Video", icon: Film },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2 rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-sm text-zinc-500">
                  <Icon size={15} />
                  {item.label}
                </div>
              );
            })}
          </div>

          {file && (
            <div className="mt-4 rounded-lg border border-[var(--accent)]/20 bg-[var(--accent-soft)] p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={19} className="text-blue-200" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-blue-100">{file.name}</p>
                  <p className="text-sm text-blue-100/65">Ready for AI processing</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] p-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={handleClose} className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-white/[0.14] hover:text-zinc-100">
            Cancel
          </button>
          <button type="button" onClick={handleUpload} className="rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200">
            Upload and process
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
