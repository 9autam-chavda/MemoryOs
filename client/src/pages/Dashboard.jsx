import { useEffect, useState } from "react";
import { Heart, MessageSquare, Search, Sparkles } from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import RecentConversationCard from "../components/dashboard/RecentConversationCard";
import RecentMemoryCard from "../components/dashboard/RecentMemoryCard";
import SectionHeader from "../components/dashboard/SectionHeader";
import AppLayout from "../components/layout/AppLayout";
import EmptyState from "../components/ui/EmptyState";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../contexts/AuthContext";
import memoryService from "../services/memory.service";
import memorySessionService from "../services/memorySession.service";

function Dashboard() {
  const { user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionPreviews, setSessionPreviews] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard - MemoryOS";
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      const [memoryResult, sessionResult] = await Promise.allSettled([
        memoryService.getMemories(),
        memorySessionService.getSessions(),
      ]);

      if (memoryResult.status === "fulfilled") setMemories(memoryResult.value.data || []);
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

  const recentMemories = [...memories]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);
  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 4);
  const favoriteCount = memories.filter((memory) => memory.isFavorite).length;
  const categoryCount = new Set(memories.map((memory) => memory.category || memory.fileType).filter(Boolean)).size;

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 py-3 sm:py-5">
        {loading ? <DashboardSkeleton /> : <>
          <DashboardHeader name={user?.name} />

          <section aria-label="Memory overview">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard compact title="Memories" value={memories.length} icon={Sparkles} />
              <StatCard compact title="Categories" value={categoryCount} icon={Search} />
              <StatCard compact title="Favorites" value={favoriteCount} icon={Heart} />
              <StatCard compact title="Assistant sessions" value={sessions.length} icon={MessageSquare} />
            </div>
          </section>

          <section aria-labelledby="recent-memories">
            <SectionHeader
              title={<span id="recent-memories">Recent memories</span>}
            />
            <div className="mt-4">
              {recentMemories.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{recentMemories.map((memory) => <RecentMemoryCard key={memory.id} memory={memory} />)}</div>
              ) : (
                <EmptyState compact icon={Search} title="No memories yet" description="Your saved memories will appear here once they are available to search." />
              )}
            </div>
          </section>

          <section aria-labelledby="recent-conversations">
            <SectionHeader
              title={<span id="recent-conversations">Recent assistant conversations</span>}
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
