import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import AssistantComposer from "../components/assistant/AssistantComposer";
import AssistantHeader from "../components/assistant/AssistantHeader";
import Conversation from "../components/assistant/Conversation";

import AppLayout from "../components/layout/AppLayout";
import Skeleton from "../components/ui/Skeleton";

import assistantService from "../services/assistant.service";
import memorySessionService from "../services/memorySession.service";

import AssistantHeroAnimation from "../components/assistant/AssistantHeroAnimation";

const SESSION_STORAGE_KEY = "assistant-active-session";

const sortByNewest = (list) =>
  [...list].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

function Assistant() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [, setSessions] = useState([]);
  const [currentSession, setCurrentSession] =
    useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] =
    useState(true);
  const [failedQuestion, setFailedQuestion] =
    useState("");

  const endRef = useRef(null);

  async function loadMessages(sessionId) {
    try {
      const data =
        await memorySessionService.getSession(
          sessionId
        );

      setMessages(data.messages || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not load this conversation."
      );
    }
  }

  const initialize = useCallback(async () => {
    try {
      const fetched =
        await memorySessionService.getSessions();

      const sorted = sortByNewest(fetched);

      setSessions(sorted);

      const urlSessionId =
        searchParams.get("session");

      const storedSessionId =
        sessionStorage.getItem(
          SESSION_STORAGE_KEY
        );

      const sessionId =
        urlSessionId || storedSessionId;

      if (sessionId) {
        const selected = sorted.find(
          (session) =>
            session._id === sessionId
        );

        if (selected) {
          setCurrentSession(selected);

          sessionStorage.setItem(
            SESSION_STORAGE_KEY,
            selected._id
          );

          await loadMessages(selected._id);

          return;
        }
      }

      setCurrentSession(null);
      setMessages([]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not load your sessions."
      );
    } finally {
      setInitializing(false);
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = "Assistant · MemoryOS";
    initialize();
}, [initialize]);

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function handleNewSession() {
    sessionStorage.removeItem(
      SESSION_STORAGE_KEY
    );

    setCurrentSession(null);
    setMessages([]);
    setQuestion("");
    setFailedQuestion("");

    navigate("/assistant", {
      replace: true,
    });
  }

 async function ask(questionOverride) {
  const value =
    (typeof questionOverride === "string"
      ? questionOverride
      : question).trim();

  if (!value || loading) return;

  let session = currentSession;

  // Create a session only when the first message is sent
  if (!session) {
    try {
      session =
        await memorySessionService.createSession();

      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        session._id
      );

      setCurrentSession(session);

      setSessions((current) => [
        session,
        ...current,
      ]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not create a new session."
      );

      return;
    }
  }

  setMessages((current) => [
    ...current,
    {
      role: "user",
      content: value,
    },
  ]);

  setQuestion("");
  setLoading(true);
  setFailedQuestion("");

  try {
    const result =
      await assistantService.askAssistant(
        session._id,
        value
      );

    setMessages((current) => [
      ...current,
      {
        role: "assistant",
        content: result.answer,
        sources: result.sources || [],
      },
    ]);

    const sorted = sortByNewest(
      await memorySessionService.getSessions()
    );

    setSessions(sorted);

    const updated =
      sorted.find(
        (item) => item._id === session._id
      ) || session;

    setCurrentSession(updated);

    sessionStorage.setItem(
      SESSION_STORAGE_KEY,
      updated._id
    );
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "The assistant is unavailable. Please try again.";

    setFailedQuestion(value);

    setMessages((current) => [
      ...current,
      {
        role: "error",
        content: message,
      },
    ]);
  } finally {
    setLoading(false);
  }
}
  if (initializing) {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-4xl space-y-6 py-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="mx-auto h-40 max-w-3xl rounded-3xl" />
      </div>
    </AppLayout>
  );
}

const isEmpty = messages.length === 0;

return (
  <AppLayout>
    <section
      className="
        mx-auto
        flex
        min-h-full
        w-full
        max-w-[920px]
        flex-1
        flex-col
      "
    >
      <AssistantHeader
        onNewSession={handleNewSession}
      />

      {isEmpty ? (
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-3xl
            flex-1
            flex-col
            justify-center

            py-16
          "
        >
          <div className="mb-10 text-center">
            <AssistantHeroAnimation />

            <p
            className="
              mt-1
              text-sm
              text-[var(--text-secondary)]
            "
          >
            Search across your personal knowledge instantly.
          </p>
          </div>

          <AssistantComposer
            value={question}
            onChange={setQuestion}
            onSubmit={ask}
            loading={loading}
          />
        </div>
      ) : (
        <>
          <Conversation
            ref={endRef}
            messages={messages}
            loading={loading}
            onOpenSource={(sourceId) =>
              navigate(`/memory/${sourceId}`)
            }
            onRetry={() =>
              ask(failedQuestion)
            }
            onRegenerate={(value) =>
              value && ask(value)
            }
          />

          <div
            className="
              sticky
              bottom-0

              border-t
              border-[var(--border-subtle)]

              bg-[color:color-mix(in_srgb,var(--surface-canvas)_88%,transparent)]

              p-4

              backdrop-blur-xl
            "
          >
            <div className="mx-auto max-w-4xl">
              <AssistantComposer
                value={question}
                onChange={setQuestion}
                onSubmit={ask}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}
    </section>
  </AppLayout>
);
}

export default Assistant;
