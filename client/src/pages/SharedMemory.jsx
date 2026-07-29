import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Download, FileQuestion } from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import memoryService from "../services/memory.service";
import { getDownloadUrl, getImageUrl, getOriginalUrl, getVideoThumbnail, getVideoUrl } from "../utils/media.util";

function SharedMemory() {
  const { token } = useParams();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `Shared memory · MemoryOS`;

    const fetch = async () => {
      try {
        const res = await memoryService.getSharedPublic(token);
        setMemory(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Share link invalid or expired");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  if (loading) {
    return (
      <AppLayout>
        <div className="h-64 rounded-[2rem] border border-white/[0.06] bg-white/[0.02]" />
      </AppLayout>
    );
  }

  if (!memory) {
    return (
      <AppLayout>
        <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] p-8 text-zinc-400">Shared memory not found.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideNavigation hideUploadManager>
      <div className="mx-auto max-w-4xl space-y-6 py-8">
        <div className="rounded-2xl border border-white/[0.06] bg-[var(--surface-panel)] p-6">
          <h1 className="text-2xl font-semibold text-zinc-100">{memory.fileName}</h1>
          <p className="mt-2 text-sm text-zinc-400">Shared on {new Date(memory.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <div className="rounded-xl overflow-hidden bg-zinc-950 text-zinc-100 shadow-sm">
            {memory.fileType === "image" && <img src={getImageUrl(memory) || getOriginalUrl(memory)} alt={memory.fileName} className="w-full object-contain" />}
            {memory.fileType === "video" && <video controls preload="metadata" poster={getVideoThumbnail(memory) || undefined} className="max-h-[680px] w-full"><source src={getVideoUrl(memory)} type="video/mp4" /></video>}
            {memory.fileType === "audio" && <div className="p-8"><audio controls preload="metadata" className="w-full"><source src={getOriginalUrl(memory)} type={memory.metadata?.mimeType || "audio/mpeg"} /></audio></div>}
            {memory.fileType === "pdf" && <iframe src={getOriginalUrl(memory)} title={memory.fileName} className="h-[680px] w-full bg-white" />}
            {memory.fileType === "text" && <div className="p-5"><p className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">{memory.extractedText || memory.summary || "No text preview available."}</p></div>}
            {!["image", "video", "audio", "pdf", "text"].includes(memory.fileType) && <div className="flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-zinc-400"><FileQuestion size={32} /><a href={getDownloadUrl(memory)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-900"><Download size={16} />Download file</a></div>}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Summary</h3>
              <p className="mt-2 text-sm text-zinc-400">{memory.summary || "No summary available."}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {memory.tags?.length ? memory.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-400">{t}</span>
                )) : <span className="text-sm text-zinc-500">No tags</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default SharedMemory;
