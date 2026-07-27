import { CheckCircle2, LoaderCircle, AlertCircle, Sparkles, X } from "lucide-react";

import UploadProgressCircle from "./UploadProgressCircle";
import useUpload from "../../hooks/useUpload";

function UploadItem({ upload }) {
  const { removeUpload, retryUpload } = useUpload();
  const isCompleted = upload.status === "completed";
  const isFailed = upload.status === "failed";

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3 last:border-none">
      <div className="relative flex h-11 w-11 items-center justify-center">
        {isCompleted ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : isFailed ? (
          <AlertCircle size={18} className="text-rose-400" />
        ) : upload.status === "processing" ? (
          <LoaderCircle size={20} className="animate-spin text-blue-300" />
        ) : (
          <>
            <UploadProgressCircle progress={upload.progress} active={upload.status === "uploading"} />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-zinc-300">
          {upload.progress}%
            </div>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-zinc-100">{upload.fileName}</p>
          {upload.stage === "analyzing" && <Sparkles size={14} className="animate-pulse text-blue-300" />}
        </div>
        <p className="mt-1" role="status" aria-live="polite"><span className="text-sm text-zinc-500">{upload.message}</span>{isFailed && <button type="button" onClick={() => retryUpload(upload.id)} className="ml-2 text-sm font-medium text-blue-300 hover:text-blue-200">Retry</button>}</p>
      </div>
      {!isCompleted && <button type="button" onClick={() => removeUpload(upload.id)} className="text-zinc-500 transition hover:text-zinc-200" aria-label={`Cancel upload of ${upload.fileName}`}><X size={16} /></button>}
    </div>
  );
}

export default UploadItem;
