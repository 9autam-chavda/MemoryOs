import { useState } from "react";
import { ChevronUp, Sparkles } from "lucide-react";

import useUpload from "../../hooks/useUpload";
import UploadItem from "./UploadItem";

function UploadManager() {
  const [collapsed, setCollapsed] = useState(false);
  const { uploads } = useUpload();

  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border border-white/[0.08] bg-[var(--surface-panel)] shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur">
      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="flex w-full items-center justify-between border-b border-white/[0.07] px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-blue-200">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Processing queue</p>
            <p className="text-xs text-zinc-500">{uploads.length} item{uploads.length > 1 ? "s" : ""} in progress</p>
          </div>
        </div>
        <ChevronUp size={16} className={`text-zinc-400 transition-transform ${collapsed ? "rotate-180" : ""}`} />
      </button>

      {!collapsed && (
        <div className="max-h-80 overflow-y-auto">
          {uploads.map((upload) => (
            <UploadItem key={upload.id} upload={upload} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UploadManager;
