import { useEffect, useState } from "react";
import { ChevronRight, Heart, MessageSquare, Search, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import RecentConversationCard from "../components/dashboard/RecentConversationCard";
import SectionHeader from "../components/dashboard/SectionHeader";
import AppLayout from "../components/layout/AppLayout";
import MemoryCard from "../components/memory/MemoryCard";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../contexts/AuthContext";
import memoryService from "../services/memory.service";
import memorySessionService from "../services/memorySession.service";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [memoryStats, setMemoryStats] = useState({ totalCount: 0, favoriteCount: 0, categoryCount: 0 });
  const [sessions, setSessions] = useState([]);
  const [sessionPreviews, setSessionPreviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - MemoryOS";
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      const [memoryResult, sessionResult] = await Promise.allSettled([
        memoryService.getMemories("all", { limit: 4 }),
        memorySessionService.getSessions(),
      ]);

      if (memoryResult.status === "fulfilled") {
        setMemories(memoryResult.value.data || []);
        setMemoryStats({
          totalCount: memoryResult.value.totalCount || 0,
          favoriteCount: memoryResult.value.favoriteCount || 0,
          categoryCount: memoryResult.value.categoryCount || 0,
        });
      }
      else console.error(memoryResult.reason);

      if (sessionResult.status === "fulfilled") {
        const fetchedSessions = sessionResult.value || [];
        setSessions(fetchedSessions);

        const mostRecent = [...fetchedSessions]
          .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
          .slice(0, 4);
        const messages = await Promise.all(mostRecent.map(async (session) => {
          try {
            const data = await memorySessionService.getSession(session._id);
            const firstUserMessage = data.messages?.find((message) => message.role === "user" && message.content?.trim());
            return [session._id, firstUserMessage?.content?.trim()];
          } catch (error) {
            console.error(error);
            return [session._id, undefined];
          }
        }));
        setSessionPreviews(Object.fromEntries(messages.filter(([, preview]) => preview)));
      } else console.error(sessionResult.reason);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const recentMemories = memories.slice(0, 4);
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 4);

  const viewAllAction = (label, onClick) => (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-0.5 bg-transparent p-0 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
      {label}<ChevronRight size={15} strokeWidth={1.8} />
    </button>
  );

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-3 sm:py-5">
        {loading ? <DashboardSkeleton /> : <>
          <DashboardHeader name={user?.name} />

          <section aria-label="Memory overview">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard compact title="Memories" value={memoryStats.totalCount} icon={Sparkles} />
              <StatCard compact title="Categories" value={memoryStats.categoryCount} icon={Search} />
              <StatCard compact title="Favorites" value={memoryStats.favoriteCount} icon={Heart} />
              <StatCard compact title="Assistant sessions" value={sessions.length} icon={MessageSquare} />
            </div>
          </section>

          <section aria-labelledby="recent-memories">
            <SectionHeader
              title={<span id="recent-memories">Recent memories</span>}
              action={memoryStats.totalCount > 4 ? viewAllAction("View all", () => navigate("/gallery")) : null}
            />
            <div className="mt-4">
              {recentMemories.length ? (
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{recentMemories.map((memory) => <MemoryCard key={memory.id} memory={memory} variant="dashboard" />)}</div>
              ) : (
                <EmptyState compact icon={Search} title="No memories yet" description="Upload your first memory to begin building your second brain." action={<Button as="a" href="/gallery">Upload memory</Button>} />
              )}
            </div>
          </section>

          <section aria-labelledby="recent-conversations">
            <SectionHeader
              title={<span id="recent-conversations">Recent assistant conversations</span>}
              action={sessions.length > 4 ? viewAllAction("View all", () => navigate("/settings?tab=history")) : null}
            />
            <div className="mt-4">
              {recentSessions.length ? (
                <div className="grid gap-3 lg:grid-cols-2">{recentSessions.map((session) => <RecentConversationCard key={session._id} session={session} preview={sessionPreviews[session._id]} />)}</div>
              ) : (
                <EmptyState compact icon={MessageSquare} title="No assistant conversations" description="Conversations you start with the assistant will be available here." />
              )}
            </div>
          </section>
        </>}
      </div>
    </AppLayout>
  );
}

export default Dashboard;
