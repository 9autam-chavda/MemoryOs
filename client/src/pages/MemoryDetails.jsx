import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Copy, Download, FileText, Network, Share2, Sparkles, Tag, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../components/layout/AppLayout";
import memoryService from "../services/memory.service";

function MemoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const response = await memoryService.getMemoryById(id);
        setMemory(response.data);
      } catch {
        toast.error("Failed to load memory.");
      } finally {
        setLoading(false);
      }
    };

    fetchMemory();
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

  const copySummary = async () => {
    await navigator.clipboard.writeText(memory.summary || "");
    toast.success("Summary copied.");
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
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06] hover:text-white">
              <Share2 size={15} /> Share
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
    </AppLayout>
  );
}

export default MemoryDetails;
