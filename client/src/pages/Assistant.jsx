import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import AssistantComposer from "../components/assistant/AssistantComposer";
import AssistantHeader from "../components/assistant/AssistantHeader";
import Conversation from "../components/assistant/Conversation";
import SuggestionCard from "../components/assistant/SuggestionCard";
import AppLayout from "../components/layout/AppLayout";
import Skeleton from "../components/ui/Skeleton";
import assistantService from "../services/assistant.service";
import memorySessionService from "../services/memorySession.service";

const suggestions = ["Find my internship report", "Summarize React notes", "Show invoices from June", "What did I learn about DBMS?"];
const sortByNewest = (list) => [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

function Assistant() {
  const navigate = useNavigate(); const [searchParams] = useSearchParams();
  const [sessions, setSessions] = useState([]); const [currentSession, setCurrentSession] = useState(null); const [messages, setMessages] = useState([]); const [question, setQuestion] = useState(""); const [loading, setLoading] = useState(false); const [initializing, setInitializing] = useState(true); const [failedQuestion, setFailedQuestion] = useState("");
  const endRef = useRef(null);
  async function loadMessages(sessionId) { try { const data = await memorySessionService.getSession(sessionId); setMessages(data.messages || []); } catch (error) { toast.error(error.response?.data?.message || "Could not load this conversation."); } }
  async function initialize() { try { const fetched = await memorySessionService.getSessions(); if (!fetched.length) { const session = await memorySessionService.createSession(); setSessions([session]); setCurrentSession(session); return; } const sorted = sortByNewest(fetched); setSessions(sorted); const selected = sorted.find((session) => session._id === searchParams.get("session")) || sorted[0]; setCurrentSession(selected); await loadMessages(selected._id); } catch (error) { toast.error(error.response?.data?.message || "Could not load your sessions."); } finally { setInitializing(false); } }
  // The session is loaded once for the route selected at mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { document.title = "Assistant · MemoryOS"; initialize(); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  async function handleNewSession() { try { const existing = sessions.find((session) => session.title === "New Memory Session" && !session.lastMessage?.trim()); if (existing) { setCurrentSession(existing); await loadMessages(existing._id); navigate("/assistant", { replace: true }); return; } const session = await memorySessionService.createSession(); setSessions((current) => [session, ...current]); setCurrentSession(session); setMessages([]); navigate("/assistant", { replace: true }); } catch (error) { toast.error(error.response?.data?.message || "Could not create a new session."); } }
  async function ask(questionOverride) { const value = (questionOverride || question).trim(); if (!value || loading || !currentSession) return; setMessages((current) => [...current, { role: "user", content: value }]); setQuestion(""); setLoading(true); setFailedQuestion(""); try { const result = await assistantService.askAssistant(currentSession._id, value); setMessages((current) => [...current, { role: "assistant", content: result.answer, sources: result.sources || [] }]); const sorted = sortByNewest(await memorySessionService.getSessions()); setSessions(sorted); setCurrentSession(sorted.find((session) => session._id === currentSession._id) || currentSession); } catch (error) { const message = error.response?.data?.message || "The assistant is unavailable. Please try again."; setFailedQuestion(value); setMessages((current) => [...current, { role: "error", content: message }]); } finally { setLoading(false); } }
  if (initializing) return <AppLayout><div className="mx-auto w-full max-w-4xl space-y-6 py-4"><Skeleton className="h-14 w-full" /><Skeleton className="mx-auto h-32 max-w-2xl rounded-[var(--radius-lg)]" /></div></AppLayout>;
  const isEmpty = messages.length === 0;
  return <AppLayout><section className="mx-auto flex min-h-full w-full max-w-[860px] flex-1 flex-col py-3 sm:py-5"><AssistantHeader onNewSession={handleNewSession} />{isEmpty ? <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-10"><div><AssistantComposer value={question} onChange={setQuestion} onSubmit={ask} loading={loading} /></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{suggestions.map((item) => <SuggestionCard key={item} onClick={() => setQuestion(item)}>{item}</SuggestionCard>)}</div></div> : <><Conversation ref={endRef} messages={messages} loading={loading} onOpenSource={(sourceId) => navigate(`/memory/${sourceId}`)} onRetry={() => ask(failedQuestion)} onRegenerate={(value) => value && ask(value)} /><div className="sticky bottom-0 bg-[var(--surface-canvas)] py-3"><AssistantComposer value={question} onChange={setQuestion} onSubmit={ask} loading={loading} /></div></>}</section></AppLayout>;
}
export default Assistant;
