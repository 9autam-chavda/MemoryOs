import { useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import AssistantComposer from "../components/assistant/AssistantComposer";
import MarkdownAnswer from "../components/assistant/MarkdownAnswer";
import SourceCard from "../components/assistant/SourceCard";
import assistantService from "../services/assistant.service";

const suggestions = ["What medicines did my doctor prescribe?", "What invoices did I upload?", "Summarize my React notes.", "What did my professor teach about DBMS?"];

function Assistant() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { document.title = "Assistant - MemoryOS"; }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const ask = async () => {
    const value = question.trim();
    if (!value || loading) return;
    setMessages((current) => [...current, { question: value }]); setQuestion(""); setLoading(true);
    try { const result = await assistantService.askAssistant(value); setMessages((current) => [...current, { answer: result.answer, sources: result.sources || [] }]); }
    catch (error) { const message = error.response?.data?.message || "The assistant is unavailable. Please try again."; setMessages((current) => [...current, { error: message }]); toast.error(message); }
    finally { setLoading(false); }
  };

  return <AppLayout><section className="mx-auto flex w-full max-w-4xl flex-1 flex-col py-4 sm:py-8">
    <header className="text-center"><span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Sparkles size={20} /></span><h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">MemoryOS Assistant</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">Ask anything about your memories.</p></header>
    {messages.length === 0 ? <div className="mx-auto mt-12 w-full max-w-2xl"><AssistantComposer value={question} onChange={setQuestion} onSubmit={ask} loading={loading} /><div className="mt-5 flex flex-wrap justify-center gap-2">{suggestions.map((item) => <button key={item} type="button" onClick={() => setQuestion(item)} className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]">{item}</button>)}</div></div> : <><div className="mt-10 flex flex-1 flex-col gap-6">{messages.map((message, index) => message.question ? <div key={index} className="ml-auto max-w-[88%] rounded-2xl bg-[var(--accent)] px-4 py-3 text-sm leading-6 text-white">{message.question}</div> : message.error ? <div key={index} className="rounded-2xl border border-red-500/25 bg-red-500/10 p-4 text-sm text-red-300">{message.error}</div> : <article key={index} className="rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 sm:p-6"><div className="mb-5 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Bot size={16} /></span><span className="text-sm font-medium text-[var(--text-primary)]">MemoryOS</span></div><MarkdownAnswer content={message.answer} />{message.sources.length > 0 && <div className="mt-6 border-t border-[var(--border-subtle)] pt-5"><p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">Sources</p><div className="grid gap-2 sm:grid-cols-2">{message.sources.map((source) => <SourceCard key={source.id} source={source} onOpen={() => navigate(`/memory/${source.id}`)} />)}</div></div>}</article>)}{loading && <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><LoaderCircle size={17} className="animate-spin text-[var(--accent)]" />Searching your memories and writing an answer…</div>}<div ref={endRef} /></div><div className="sticky bottom-0 mt-6 bg-[var(--surface-canvas)] pb-2 pt-3"><AssistantComposer value={question} onChange={setQuestion} onSubmit={ask} loading={loading} /></div></>}
  </section></AppLayout>;
}

export default Assistant;
