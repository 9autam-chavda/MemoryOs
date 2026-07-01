import { CheckCircle2, LoaderCircle, AlertCircle } from "lucide-react";

import UploadProgressCircle from "./UploadProgressCircle";

function UploadItem({ upload }) {
  const isCompleted = upload.status === "completed";
  const isFailed = upload.status === "failed";

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3 last:border-none">
      <div className="relative flex h-11 w-11 items-center justify-center">
        {isCompleted ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : isFailed ? (
          <AlertCircle size={18} className="text-rose-400" />
        ) : (
          <>
            <UploadProgressCircle progress={upload.progress} />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-zinc-300">
          {upload.progress}%
            </div>
          </>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-sm font-medium text-zinc-100">{upload.fileName}</p>
          {upload.status === "processing" && <LoaderCircle size={14} className="animate-spin text-blue-300" />}
        </div>
        <p className="mt-1 text-sm text-zinc-500">{upload.message}</p>
      </div>
    </div>
  );
}

export default UploadItem;
