import { useEffect, useMemo, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConversationCard from "./ConversationCard";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";
import memorySessionService from "../../services/memorySession.service";

function AssistantHistory() {
  const navigate = useNavigate(); const [sessions, setSessions] = useState([]); const [search, setSearch] = useState(""); const [editingSessionId, setEditingSessionId] = useState(null);
  async function loadSessions() { try { setSessions((await memorySessionService.getSessions()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))); } catch (error) { console.error(error); } }
  useEffect(() => { loadSessions(); }, []); // one-time history request
  const filtered = useMemo(() => sessions.filter((session) => session.title.toLowerCase().includes(search.toLowerCase())), [sessions, search]);
  const saveRename = async (session, title) => { const previous = session.title; setSessions((current) => current.map((item) => item._id === session._id ? { ...item, title } : item)); setEditingSessionId(null); try { await memorySessionService.renameSession(session._id, title); } catch { setSessions((current) => current.map((item) => item._id === session._id ? { ...item, title: previous } : item)); toast.error("Unable to rename conversation"); } };
  const deleteSession = async (session) => { setSessions((current) => current.filter((item) => item._id !== session._id)); try { await memorySessionService.deleteSession(session._id); } catch { setSessions((current) => [...current, session].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))); toast.error("Failed to delete conversation"); } };
  return <section aria-labelledby="history-heading"><h2 id="history-heading" className="text-base font-semibold text-[var(--text-primary)]">Assistant history</h2><p className="mt-1 text-sm text-[var(--text-secondary)]">Browse and manage previous conversations.</p>{sessions.length > 0 && <div className="relative mt-5"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search conversations..." className="ui-input h-12 rounded-xl pl-10 pr-3 text-sm" /></div>}{filtered.length ? <div className="premium-scrollbar mt-4 max-h-[500px] overflow-y-auto">{filtered.map((session) => <ConversationCard key={session._id} session={session} isEditing={editingSessionId === session._id} onOpen={(sessionId) => navigate(`/assistant?session=${sessionId}`)} onStartRename={setEditingSessionId} onCancelRename={() => setEditingSessionId(null)} onSaveRename={saveRename} onDelete={deleteSession} />)}</div> : <EmptyState compact className="mt-8" icon={MessageSquare} title={search ? "No conversations found" : "No conversations yet"} description={search ? "Try another conversation title." : "Your assistant conversations will appear here."} action={!search && <Button variant="secondary" onClick={() => navigate("/assistant")}>Open Assistant</Button>} />}</section>;
}
export default AssistantHistory;
