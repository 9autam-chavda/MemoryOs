import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import AssistantSidebar from "../components/assistant/AssistantSidebar";
import Conversation from "../components/assistant/Conversation";
import AssistantComposer from "../components/assistant/AssistantComposer";
import assistantService from "../services/assistant.service";
import memorySessionService from "../services/memorySession.service";

const suggestions = [
  "What medicines did my doctor prescribe?",
  "What invoices did I upload?",
  "Summarize my React notes.",
  "What did my professor teach about DBMS?",
];

function Assistant() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const endRef = useRef(null);

  useEffect(() => {
    document.title = "Assistant - MemoryOS";
  }, []);

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sortByNewest = (list) => {
  return [...list].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
};

  const initialize = async () => {
    try {
      const fetchedSessions = await memorySessionService.getSessions();

      if (fetchedSessions.length === 0) {
        const newSession = await memorySessionService.createSession();
        setSessions([newSession]);
        setCurrentSession(newSession);
        setMessages([]);
        return;
      }

      const sorted = sortByNewest(fetchedSessions);
      const newest = sorted[0];

      setSessions(sorted);
      setCurrentSession(newest);
      await loadMessages(newest._id);
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not load your sessions.";
      toast.error(message);
    }
  };

  const loadMessages = async (sessionId) => {
    try {
      const data = await memorySessionService.getSession(sessionId);
      setMessages(data.messages || []);
    } catch (error) {
      const message =
        error.response?.data?.message || "Could not load this conversation.";
      toast.error(message);
    }
  };

  const handleNewSession = async () => {
    try {
      const existingEmptySession = sessions.find(
        (session) =>
          session.title === "New Memory Session" &&
          (!session.lastMessage || session.lastMessage.trim() === "")
      );

      if (existingEmptySession) {
        setCurrentSession(existingEmptySession);
        await loadMessages(existingEmptySession._id);
        return;
      }

      const newSession = await memorySessionService.createSession();

      setSessions((current) => [newSession, ...current]);
      setCurrentSession(newSession);
      setMessages([]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Could not create a new session.";

      toast.error(message);
    }
  };

  const handleDeleteSession = async (session) => {
  const confirmed = window.confirm(
    `Delete "${session.title}"?`
  );

  if (!confirmed) return;

  try {
    await memorySessionService.deleteSession(session._id);

    const updatedSessions =
      sessions.filter((s) => s._id !== session._id);

    if (updatedSessions.length === 0) {
      const newSession =
        await memorySessionService.createSession();

      setSessions([newSession]);
      setCurrentSession(newSession);
      setMessages([]);
      return;
    }

    const nextSession = updatedSessions[0];

    setSessions(updatedSessions);
    setCurrentSession(nextSession);

    await loadMessages(nextSession._id);

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Unable to delete session."
    );
  }
};

  const handleSelectSession = async (session) => {
    if (session._id === currentSession?._id) return;
    setCurrentSession(session);
    await loadMessages(session._id);
  };

  const handleOpenSource = (sourceId) => {
    navigate(`/memory/${sourceId}`);
  };

  const ask = async () => {
    const value = question.trim();
    if (!value || loading || !currentSession) return;

    const userMessage = { role: "user", content: value };
    setMessages((current) => [...current, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const result = await assistantService.askAssistant(
        currentSession._id,
        value
      );

      console.log("Assistant Result:", result);
console.log("Sources:", result.sources);

      const assistantMessage = {
        role: "assistant",
        content: result.answer,
        sources: result.sources || [],
      };

      setMessages((current) => [...current, assistantMessage]);
      

      const refreshedSessions =
        await memorySessionService.getSessions();

      const sorted = sortByNewest(refreshedSessions);

      setSessions(sorted);

      const updatedCurrent = sorted.find(
        (session) => session._id === currentSession._id
      );

      if (updatedCurrent) {
        setCurrentSession(updatedCurrent);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "The assistant is unavailable. Please try again.";
      setMessages((current) => [...current, { role: "error", content: message }]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full w-full">
        <AssistantSidebar
          sessions={sessions}
          currentSession={currentSession}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />

        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col py-4 sm:py-8">
          <header className="text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Sparkles size={20} />
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
              MemoryOS Assistant
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Ask anything about your memories.
            </p>
          </header>

          {messages.length === 0 ? (
            <div className="mx-auto mt-12 w-full max-w-2xl">
              <AssistantComposer
                value={question}
                onChange={setQuestion}
                onSubmit={ask}
                loading={loading}
              />
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestion(item)}
                    className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 text-sm text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <Conversation
                ref={endRef}
                messages={messages}
                loading={loading}
                onOpenSource={handleOpenSource}
              />
              <div className="sticky bottom-0 mt-6 bg-[var(--surface-canvas)] pb-2 pt-3">
                <AssistantComposer
                  value={question}
                  onChange={setQuestion}
                  onSubmit={ask}
                  loading={loading}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

export default Assistant;