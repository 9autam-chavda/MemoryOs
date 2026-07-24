import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import memorySessionService from "../../services/memorySession.service";
import ConversationCard from "./ConversationCard";

function AssistantHistory() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [editingSessionId, setEditingSessionId] = useState(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await memorySessionService.getSessions();

      setSessions(
        data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) =>
      session.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [sessions, search]);

  const handleOpen = (sessionId) => {
    navigate(`/assistant?session=${sessionId}`);
  };

  const handleStartRename = (sessionId) => {
    // Starting a new rename automatically exits any other one,
    // since editingSessionId can only hold a single id.
    setEditingSessionId(sessionId);
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
  };

  const handleSaveRename = async (session, newTitle) => {
    const previousTitle = session.title;

    // Optimistic update + exit edit mode immediately
    setSessions((prev) =>
      prev.map((s) =>
        s._id === session._id ? { ...s, title: newTitle } : s
      )
    );
    setEditingSessionId(null);

    try {
      await memorySessionService.renameSession(session._id, newTitle);
    } catch (error) {
      console.error(error);
      // Restore previous title on failure
      setSessions((prev) =>
        prev.map((s) =>
          s._id === session._id ? { ...s, title: previousTitle } : s
        )
      );
      toast.error("Unable to rename conversation");
    }
  };

  const handleDelete = async (session) => {
    setSessions((prev) => prev.filter((s) => s._id !== session._id));

    try {
      await memorySessionService.deleteSession(session._id);
    } catch (error) {
      console.error(error);
      setSessions((prev) =>
        [...prev, session].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )
      );
      toast.error("Failed to delete conversation");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
        Assistant History
      </h2>

      <p className="mt-2 text-sm text-[var(--text-secondary)]">
        Browse and manage previous assistant conversations.
      </p>

      <div className="relative mt-6">
        <Search
          size={18}
          className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="h-12 w-full rounded-2xl border border-[var(--border-subtle)] bg-transparent pl-12 pr-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]/30"
        />
      </div>

      {filteredSessions.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <div className="text-4xl">💬</div>
          <p className="mt-4 text-base font-medium text-[var(--text-primary)]">
            No conversations yet
          </p>
          <p className="mt-1 max-w-xs text-sm text-[var(--text-tertiary)]">
            Start chatting with MemoryOS Assistant to build your conversation history.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filteredSessions.map((session) => (
            <ConversationCard
              key={session._id}
              session={session}
              isEditing={editingSessionId === session._id}
              onOpen={handleOpen}
              onStartRename={handleStartRename}
              onCancelRename={handleCancelRename}
              onSaveRename={handleSaveRename}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AssistantHistory;