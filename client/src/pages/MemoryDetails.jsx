import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Copy, Download, Heart, Share2, Tag, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../components/layout/AppLayout";
import RelatedMemoryList from "../components/memory/RelatedMemoryList";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";
import memoryService from "../services/memory.service";
import { getDownloadUrl, getImageUrl, getOriginalUrl, getVideoThumbnail, getVideoUrl } from "../utils/media.util";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
const formatBytes = (value) => value ? `${(Number(value) / 1024).toFixed(Number(value) >= 1024 ? 1 : 0)} KB` : null;

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
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    document.title = "Memory details · MemoryOS";
    const load = async () => {
      setLoading(true); setRelatedLoading(true); setVideoReady(false); setVideoFailed(false);
      const [item, related] = await Promise.allSettled([memoryService.getMemoryById(id), memoryService.getRelatedMemories(id)]);
      if (item.status === "fulfilled") { setMemory(item.value.data); setIsFav(!!item.value.data.isFavorite); }
      else toast.error("Failed to load memory.");
      setRelatedMemories(related.status === "fulfilled" ? related.value.data || [] : []);
      setRelatedLoading(false); setLoading(false);
    };
    load();
  }, [id]);

  const handleDelete = async () => { if (!window.confirm("Delete this memory?")) return; try { await memoryService.deleteMemory(id); toast.success("Memory deleted."); navigate("/gallery"); } catch { toast.error("Failed to delete memory."); } };
  const toggleFavorite = async () => { setIsFav((value) => !value); try { const res = await memoryService.toggleFavorite(id); toast.success(res.message || (res.data?.isFavorite ? "Added to favorites" : "Removed from favorites")); } catch { setIsFav((value) => !value); toast.error("Failed to update favorite"); } };
  const openShare = () => { setShareInfo(memory.shareToken ? { shareToken: memory.shareToken } : null); setShareModalOpen(true); };
  const copy = async (value, success) => { try { await navigator.clipboard.writeText(value); toast.success(success); } catch { toast.error("Unable to copy."); } };
  const createShare = async () => { try { const res = await memoryService.createShare(id); setShareInfo({ shareToken: res.data.shareToken }); setMemory((current) => ({ ...current, shareToken: res.data.shareToken })); } catch (error) { toast.error(error.response?.data?.message || "Failed to create share link"); } };
  const disableShare = async () => { try { await memoryService.disableShare(id); setShareInfo(null); setMemory((current) => ({ ...current, shareToken: undefined })); toast.success("Sharing disabled"); } catch { toast.error("Failed to disable sharing"); } };

  const facts = useMemo(() => memory ? [
    ["Created", formatDate(memory.createdAt)], ["Updated", formatDate(memory.updatedAt)], ["File type", memory.fileType], ["Size", formatBytes(memory.metadata?.size)], ["Pages", memory.metadata?.pages], ["Duration", memory.metadata?.duration ? `${Math.round(memory.metadata.duration)} sec` : null], ["Language", memory.metadata?.language], ["Word count", memory.wordCount?.toLocaleString("en-IN")], ["Format", memory.metadata?.mimeType],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "") : [], [memory]);

  if (loading) return <AppLayout><div className="space-y-5"><Skeleton className="h-14 w-full" /><div className="grid gap-5 xl:grid-cols-[minmax(0,2.3fr)_minmax(18rem,1fr)]"><Skeleton className="h-[560px] rounded-[var(--radius-lg)]" /><Skeleton className="h-[560px] rounded-[var(--radius-lg)]" /></div></div></AppLayout>;
  if (!memory) return <AppLayout><EmptyState compact title="Memory not found" description="This memory may have been removed or is no longer available." /></AppLayout>;

  const renderPreview = () => {
    if (memory.fileType === "image") return <img src={getImageUrl(memory) || getOriginalUrl(memory)} alt={memory.fileName} className="max-h-[680px] w-full object-contain" />;
    if (memory.fileType === "pdf") return <iframe src={getOriginalUrl(memory)} title={memory.fileName} className="h-[680px] w-full bg-white" />;
    if (memory.fileType === "audio") return <div className="flex min-h-80 items-center justify-center p-8"><audio controls preload="metadata" className="w-full max-w-xl"><source src={getOriginalUrl(memory)} type={memory.metadata?.mimeType || "audio/mpeg"} /></audio></div>;
    if (memory.fileType === "video") return <div className="relative w-full"><video controls preload="metadata" poster={getVideoThumbnail(memory) || undefined} onLoadedData={() => setVideoReady(true)} onError={() => setVideoFailed(true)} className="max-h-[680px] w-full bg-black object-contain"><source src={getVideoUrl(memory)} type="video/mp4" /></video>{!videoReady && !videoFailed && <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/25 text-sm text-white">Loading video…</div>}{videoFailed && <div className="absolute inset-0 grid place-items-center bg-[var(--surface-muted)] text-sm text-[var(--text-secondary)]">Video preview is unavailable. Use Download to view the original file.</div>}</div>;
    return <div className="premium-scrollbar max-h-[680px] overflow-y-auto bg-[#f6f3eb] p-6 text-zinc-900"><pre className="whitespace-pre-wrap text-sm leading-7">{memory.extractedText || "No extracted text available."}</pre></div>;
  };
  const tabs = [["overview", "Overview"], ["text", "Extracted text"], ["metadata", "Metadata"]];

  return <AppLayout><div className="mx-auto w-full max-w-7xl space-y-5 py-3 sm:py-5">
    <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" className="h-9 min-h-9 w-9 shrink-0 p-0" onClick={() => navigate("/gallery")} aria-label="Back to gallery"><ArrowLeft size={17} /></Button><div className="min-w-0"><h1 className="truncate text-lg font-semibold tracking-tight text-[var(--text-primary)] sm:text-xl">{memory.fileName}</h1><div className="mt-1 flex flex-wrap gap-2"><Badge>{memory.category || "Memory"}</Badge><Badge>{memory.fileType || "File"}</Badge></div></div></div>
      <div className="flex flex-wrap gap-2"><Button as="a" href={getDownloadUrl(memory)} variant="secondary"><Download size={16} />Download</Button><Button variant="secondary" onClick={openShare} aria-label="Share memory"><Share2 size={16} />Share</Button><Button variant="secondary" onClick={toggleFavorite} aria-label={isFav ? "Remove favorite" : "Add favorite"}><Heart size={16} className={isFav ? "fill-current text-[var(--danger)]" : ""} /><span className="sr-only">Favorite</span></Button><Button variant="danger" onClick={handleDelete} aria-label="Delete memory"><Trash2 size={16} /><span className="sr-only">Delete</span></Button></div>
    </header>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,2.3fr)_minmax(18rem,1fr)]">
      <Card className="overflow-hidden p-2 sm:p-3"><div className="flex min-h-80 items-center justify-center overflow-hidden rounded-[calc(var(--radius-lg)-0.35rem)] bg-[var(--surface-muted)]">{renderPreview()}</div></Card>
      <aside className="space-y-4"><Card className="p-5"><div className="flex items-start justify-between gap-3"><h2 className="text-sm font-semibold text-[var(--text-primary)]">AI summary</h2>{memory.summary && <Button variant="ghost" className="h-8 min-h-8 w-8 p-0" onClick={() => copy(memory.summary, "Summary copied")} aria-label="Copy summary"><Copy size={15} /></Button>}</div><p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{memory.summary || "No summary is available for this memory."}</p></Card>
      <Card className="p-5"><h2 className="text-sm font-semibold text-[var(--text-primary)]">Quick facts</h2><dl className="mt-3 space-y-2">{facts.slice(0, 4).map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 text-sm"><dt className="text-[var(--text-tertiary)]">{label}</dt><dd className="truncate text-right text-[var(--text-secondary)]">{value}</dd></div>)}</dl></Card>
      <Card className="p-5"><h2 className="text-sm font-semibold text-[var(--text-primary)]">Related memories</h2><RelatedMemoryList memories={relatedMemories} loading={relatedLoading} /></Card></aside>
    </div>
    <Card><div className="flex gap-1 border-b border-[var(--border-subtle)] p-2">{tabs.map(([tab, label]) => <Button key={tab} variant={activeTab === tab ? "secondary" : "ghost"} className="min-h-9 px-3" onClick={() => setActiveTab(tab)}>{label}</Button>)}</div><div className="p-5">{activeTab === "overview" && <div>{memory.tags?.length ? <><h2 className="text-sm font-semibold text-[var(--text-primary)]">Tags</h2><div className="mt-3 flex flex-wrap gap-2">{memory.tags.map((tag) => <Badge key={tag}><Tag size={12} />{tag}</Badge>)}</div></> : <EmptyState compact title="No additional details" description="Tags and detected topics will appear here when available." />}</div>}{activeTab === "text" && <div>{memory.extractedText ? <><div className="flex items-center justify-between gap-3"><h2 className="text-sm font-semibold text-[var(--text-primary)]">Extracted text</h2><Button variant="secondary" className="min-h-9" onClick={() => copy(memory.extractedText, "Extracted text copied")}><Copy size={15} />Copy</Button></div><pre className="premium-scrollbar mt-4 max-h-[440px] overflow-y-auto whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{memory.extractedText}</pre></> : <EmptyState compact title="No extracted text" description="This memory does not have readable extracted text." />}</div>}{activeTab === "metadata" && <div>{facts.length ? <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">{facts.map(([label, value]) => <div key={label} className="border-b border-[var(--border-subtle)] pb-3"><dt className="text-xs font-medium text-[var(--text-tertiary)]">{label}</dt><dd className="mt-1 text-sm text-[var(--text-primary)]">{value}</dd></div>)}</dl> : <EmptyState compact title="No metadata available" description="Additional file details will appear here when available." />}</div>}</div></Card>
    {shareModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onClick={() => setShareModalOpen(false)}><Card as="section" role="dialog" aria-modal="true" aria-labelledby="share-title" className="w-full max-w-lg p-5" onClick={(event) => event.stopPropagation()}><h2 id="share-title" className="text-base font-semibold text-[var(--text-primary)]">Share memory</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">Create a read-only link for this memory.</p>{shareInfo?.shareToken ? <div className="mt-5 space-y-3"><input readOnly value={`${window.location.origin}/shared/${shareInfo.shareToken}`} className="ui-input px-3 py-2 text-sm" /><div className="flex flex-wrap gap-2"><Button onClick={() => copy(`${window.location.origin}/shared/${shareInfo.shareToken}`, "Share link copied")}>Copy link</Button><Button variant="danger" onClick={disableShare}>Disable link</Button></div></div> : <div className="mt-5 flex gap-2"><Button onClick={createShare}>Create link</Button><Button variant="ghost" onClick={() => setShareModalOpen(false)}>Cancel</Button></div>}</Card></div>}
  </div></AppLayout>;
}

export default MemoryDetails;
