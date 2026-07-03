import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Copy, Download, FileText, Network, Share2, Sparkles, Tag, Trash2, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../components/layout/AppLayout";
import UploadModal from "../components/upload/UploadModal";
import RelatedMemoryList from "../components/memory/RelatedMemoryList";
import memoryService from "../services/memory.service";

function MemoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareInfo, setShareInfo] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [relatedMemories, setRelatedMemories] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    document.title = "Memory details · MemoryOS";

    const fetchMemory = async () => {
      try {
        const response = await memoryService.getMemoryById(id);
        setMemory(response.data);
        setIsFav(!!response.data.isFavorite);
      } catch {
        toast.error("Failed to load memory.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async () => {
      if (!id) {
        return;
      }

      setRelatedLoading(true);
      try {
        const response = await memoryService.getRelatedMemories(id);
        setRelatedMemories(response.data || []);
      } catch {
        setRelatedMemories([]);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchMemory();
    fetchRelated();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this memory?");
    if (!confirmDelete) {
      return;
    }

    try {
      await memoryService.deleteMemory(id);
      toast.success("Memory deleted.");
      navigate("/gallery");
    } catch {
      toast.error("Failed to delete memory.");
    }
  };

  const toggleFavorite = async () => {
    setIsFav((s) => !s);
    try {
      const res = await memoryService.toggleFavorite(id);
      const msg = res.message || (res.data?.isFavorite ? "Added to favorites" : "Removed from favorites");
      toast.success(msg);
    } catch {
      setIsFav((s) => !s);
      toast.error("Failed to update favorite");
    }
  };

  const openShare = () => {
    setShareModalOpen(true);
    setShareInfo(memory.shareToken ? { shareToken: memory.shareToken, shareEnabled: memory.shareEnabled } : null);
  };

  // focus management for share modal
  useEffect(() => {
    if (!shareModalOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") {
        setShareModalOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);

    // focus first focusable element inside modal after open
    const t = setTimeout(() => {
      const el = document.querySelector(".share-modal input, .share-modal button");
      if (el) el.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [shareModalOpen]);

  const handleCreateShare = async () => {
    try {
      const res = await memoryService.createShare(id);
      setShareInfo({ shareToken: res.data.shareToken, shareEnabled: true });
      setMemory((m) => ({ ...m, shareToken: res.data.shareToken, shareEnabled: true }));
      toast.success("Share link generated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create share link");
    }
  };

  const handleDisableShare = async () => {
    try {
      await memoryService.disableShare(id);
      setShareInfo(null);
      setMemory((m) => ({ ...m, shareToken: undefined, shareEnabled: false }));
      toast.success("Sharing disabled");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to disable sharing");
    }
  };

  const copyShareLink = async () => {
    if (!shareInfo?.shareToken) return toast.error("No share link available");
    const link = `${window.location.origin}/shared/${shareInfo.shareToken}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Share link copied");
    } catch {
      toast.error("Failed to copy link to clipboard");
    }
  };

  const copySummary = async () => {
    const summary = memory.summary || "";
    if (!summary) {
      return toast.error("No summary available to copy.");
    }
    try {
      await navigator.clipboard.writeText(summary);
      toast.success("Summary copied.");
    } catch {
      toast.error("Unable to copy summary.");
    }
  };

  const formattedDate = memory
    ? new Date(memory.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";

  const insights = useMemo(() => {
    if (!memory) {
      return [];
    }
    return [
      { label: "Processing", value: memory.processingStatus || "completed", icon: Network },
      { label: "Embeddings", value: memory.embedding?.length ? "Vector ready" : "Pending", icon: FileText },
      { label: "Words", value: (memory.wordCount || 0).toLocaleString("en-IN"), icon: FileText },
    ];
  }, [memory]);

  const renderPreview = () => {
    if (memory.fileType === "image") {
      return <img src={memory.fileUrl} alt={memory.fileName} className="h-full max-h-[640px] w-full rounded-[1.5rem] object-contain" />;
    }
    if (memory.fileType === "pdf") {
      return <iframe src={memory.fileUrl} title={memory.fileName} className="h-[640px] w-full rounded-[1.5rem] border border-white/[0.06] bg-white" />;
    }
    if (memory.fileType === "audio") {
      return (
        <div className="flex h-full min-h-[320px] items-center justify-center rounded-[1.5rem] border border-white/[0.06] bg-white/[0.03] p-6">
          <audio controls className="w-full max-w-xl">
            <source src={memory.fileUrl} type={memory.metadata?.mimeType || "audio/mpeg"} />
          </audio>
        </div>
      );
    }
    if (memory.fileType === "video") {
      return (
        <video controls className="h-full max-h-[640px] w-full rounded-[1.5rem] border border-white/[0.06] bg-black object-contain">
          <source src={memory.fileUrl} />
        </video>
      );
    }
    return (
      <div className="premium-scrollbar max-h-[640px] overflow-y-auto rounded-[1.5rem] border border-white/[0.06] bg-[#f6f3eb] p-6 text-zinc-900">
        <pre className="whitespace-pre-wrap text-sm leading-7">{memory.extractedText || "No extracted text available."}</pre>
      </div>
    );
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="h-64 rounded-[2rem] border border-white/[0.06] bg-white/[0.03]" />
      </AppLayout>
    );
  }

  if (!memory) {
    return (
      <AppLayout>
        <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03] p-8 text-zinc-400">Memory not found.</div>
      </AppLayout>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "text", label: "Extracted text" },
    { id: "metadata", label: "Metadata" },
  ];

  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate("/gallery")} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-zinc-400 transition hover:text-zinc-100" aria-label="Back to gallery">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-medium text-blue-200">{memory.category || "Memory"}</span>
                <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-zinc-500">{memory.fileType || "file"}</span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50">{memory.fileName}</h1>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href={memory.fileUrl} download className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white">
              <Download size={15} /> Download
            </a>
            <button type="button" onClick={openShare} className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white">
              <Share2 size={15} /> Share
            </button>
            <button type="button" onClick={toggleFavorite} className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white">
              <Heart size={15} className={isFav ? "text-red-400" : "text-zinc-300"} /> {isFav ? "Favorited" : "Favorite"}
            </button>
            <button type="button" onClick={handleDelete} className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300 transition hover:border-red-500/40">
              <Trash2 size={15} /> Delete
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
          <section className="rounded-[2rem] border border-white/[0.06] bg-[var(--surface-panel)] p-3 sm:p-4">
            {renderPreview()}
          </section>

          <aside className="space-y-4">
            <section className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-zinc-100"><Sparkles size={15} className="text-[var(--accent)]" /> Summary</p>
                  <p className="mt-1 text-xs text-zinc-500">Generated from the extracted content</p>
                </div>
                <button type="button" onClick={copySummary} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-100" aria-label="Copy summary">
                  <Copy size={15} />
                </button>
              </div>
              <p className="mt-4 text-sm leading-7 text-zinc-300">{memory.summary || "No AI summary available yet."}</p>
            </section>

            <section className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] p-5">
              <p className="text-sm font-semibold text-zinc-100">Quick facts</p>
              <div className="mt-3 space-y-2 text-sm text-zinc-500">
                <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                  <span className="flex items-center gap-2"><CalendarDays size={14} /> Created</span>
                  <span className="text-zinc-300">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                  <span>Type</span>
                  <span className="text-zinc-300">{memory.fileType || "file"}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                  <span>Size</span>
                  <span className="text-zinc-300">{memory.metadata?.size ? `${Math.round(memory.metadata.size / 1024)} KB` : "Unknown"}</span>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] border border-white/[0.06] bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Related memories</p>
                  <p className="mt-1 text-xs text-zinc-500">Semantic suggestions powered by embeddings</p>
                </div>
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-medium text-blue-200">AI</span>
              </div>
              <RelatedMemoryList memories={relatedMemories} loading={relatedLoading} onUploadClick={() => setIsUploadOpen(true)} />
            </section>
          </aside>
        </div>

        <section className="rounded-[2rem] border border-white/[0.06] bg-white/[0.03]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`rounded-full px-3 py-1.5 text-sm transition ${activeTab === tab.id ? "bg-white text-zinc-950" : "text-zinc-500 hover:text-zinc-200"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-sm text-zinc-500">{memory.category || "Memory"}</span>
          </div>

          <div className="p-5">
            {activeTab === "overview" && (
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[1.5rem] border border-white/[0.06] bg-zinc-950/60 p-5">
                  <p className="text-sm font-semibold text-zinc-100">What this memory contains</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{memory.summary || "The workspace will surface the AI-generated summary and key context here."}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/[0.06] bg-zinc-950/60 p-5">
                  <p className="text-sm font-semibold text-zinc-100">Related memories</p>
                  <div className="mt-3 space-y-2 text-sm text-zinc-500">
                    <div className="rounded-xl bg-white/[0.03] px-3 py-2">Shared project context</div>
                    <div className="rounded-xl bg-white/[0.03] px-3 py-2">Similar concepts</div>
                    <div className="rounded-xl bg-white/[0.03] px-3 py-2">Recent references</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div className="rounded-[1.5rem] border border-white/[0.06] bg-zinc-950/70 p-5">
                <pre className="premium-scrollbar max-h-[360px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-zinc-300">{memory.extractedText || "No extracted text available."}</pre>
              </div>
            )}

            {activeTab === "metadata" && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/[0.06] bg-zinc-950/60 p-5">
                  <p className="text-sm font-semibold text-zinc-100">Insights</p>
                  <div className="mt-3 space-y-2 text-sm text-zinc-500">
                    {insights.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                          <span className="flex items-center gap-2"><Icon size={14} /> {item.label}</span>
                          <span className="text-zinc-300">{item.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-[1.5rem] border border-white/[0.06] bg-zinc-950/60 p-5">
                  <p className="text-sm font-semibold text-zinc-100">Tags</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {memory.tags?.length ? (
                      memory.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-white/[0.05] px-3 py-1.5 text-sm text-zinc-400">
                          <Tag size={13} /> {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-zinc-500">No tags generated.</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onUploadSuccess={() => setIsUploadOpen(false)} />

      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" role="presentation" onClick={() => setShareModalOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            aria-describedby="share-modal-description"
            className="share-modal mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 text-zinc-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 id="share-modal-title" className="text-lg font-semibold">Share memory</h3>
                <p id="share-modal-description" className="mt-1 text-sm text-zinc-500">Create a secure, read-only link to share this memory.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShareModalOpen(false)} className="text-sm text-zinc-500">Close</button>
              </div>
            </div>

            <div className="mt-4">
              <div className="rounded-lg border border-zinc-200 bg-white/[0.02] p-4">
                {shareInfo?.shareToken ? (
                  <div className="flex items-center gap-3">
                    <input readOnly value={`${window.location.origin}/shared/${shareInfo.shareToken}`} className="flex-1 rounded-md bg-transparent px-3 py-2 text-sm text-zinc-300 outline-none" />
                    <button onClick={copyShareLink} className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white">Copy</button>
                    <button onClick={handleCreateShare} className="rounded-md bg-white/5 px-3 py-2 text-sm text-zinc-100">Regenerate</button>
                    <button onClick={handleDisableShare} className="rounded-md bg-red-600 px-3 py-2 text-sm text-white">Disable</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={handleCreateShare} className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white">Create share link</button>
                    <button onClick={() => setShareModalOpen(false)} className="rounded-md bg-white/5 px-3 py-2 text-sm text-zinc-100">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default MemoryDetails;
