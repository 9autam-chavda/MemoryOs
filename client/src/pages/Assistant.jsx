import { useEffect, useRef, useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import toast from "react-hot-toast";
import AppLayout from "../components/layout/AppLayout";
import Conversation from "../components/assistant/Conversation";
import AssistantComposer from "../components/assistant/AssistantComposer";
import assistantService from "../services/assistant.service";
import memorySessionService from "../services/memorySession.service";
import { useNavigate, useSearchParams } from "react-router-dom";

const suggestions = [
  "What medicines did my doctor prescribe?",
  "What invoices did I upload?",
  "Summarize my React notes.",
  "What did my professor teach about DBMS?",
];

function Assistant() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

      setSessions(sorted);

      const sessionId = searchParams.get("session");

      let selectedSession;

      if (sessionId) {
        selectedSession = sorted.find(
          (session) => session._id === sessionId
        );
      }

      if (!selectedSession) {
        selectedSession = sorted[0];
      }

      setCurrentSession(selectedSession);

      await loadMessages(selectedSession._id);
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
        navigate("/assistant", { replace: true });
        return;
      }

      const newSession = await memorySessionService.createSession();

      setSessions((current) => [newSession, ...current]);
      setCurrentSession(newSession);
      setMessages([]);

      navigate("/assistant", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not create a new session."
      );
    }
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
        <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col py-4 sm:py-8">
          <header className="mb-8">
            <div className="relative flex items-start justify-center">

              {/* New Session Button */}
              <div className="absolute right-0 top-0">
                <button
                  type="button"
                  onClick={handleNewSession}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-panel)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]"
                >
                  <Plus size={16} />
                  New Session
                </button>
              </div>

              {/* Header */}
              <div className="text-center">
                <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Sparkles size={20} />
                </span>

                <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-4xl">
                  MemoryOS Assistant
                </h1>

                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Ask anything about your memories.
                </p>
              </div>

            </div>
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
    </AppLayout>
  );
}

export default Assistant;