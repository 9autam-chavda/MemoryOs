import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import memoryService from "../services/memory.service";
import StatCard from "../components/ui/StatCard";
import MemoryCard from "../components/memory/MemoryCard";

function Dashboard() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalWords = memories.reduce(
    (sum, memory) => sum + (memory.wordCount || 0),
    0
    );

    const categoryCount = new Set(
    memories.map((memory) => memory.category)
    ).size;

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const response = await memoryService.getMemories();

      setMemories(response.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <h1 className="text-3xl font-bold">Loading...</h1>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

        <h1 className="text-4xl font-bold mb-8">
            Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <StatCard
            title="Memories"
            value={memories.length}
        />

        <StatCard
            title="OCR Words"
            value={totalWords}
        />

        <StatCard
            title="Categories"
            value={categoryCount}
        />

        </div>

        <h2 className="text-2xl font-semibold mb-4">
        Recent Memories
        </h2>

      {memories.length === 0 ? (

          <div className="text-center py-20">

              <div className="text-7xl mb-4">
                  📂
              </div>

              <h2 className="text-2xl font-semibold mb-2">
                  No memories yet
              </h2>

              <p className="text-gray-400">
                  Upload your first memory to get started.
              </p>

          </div>

      ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {memories.map((memory) => (

                  <MemoryCard
                      key={memory.id}
                      memory={memory}
                  />

              ))}

          </div>

      )}

    </AppLayout>
  );
}

export default Dashboard;