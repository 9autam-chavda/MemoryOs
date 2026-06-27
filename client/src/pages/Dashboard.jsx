import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import memoryService from "../services/memory.service";
import StatCard from "../components/ui/StatCard";

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

      <div className="space-y-4">

        {memories.map((memory) => (

          <div
            key={memory._id}
            className="border border-gray-700 rounded-lg p-4"
          >

            <h2 className="font-semibold">
              {memory.fileName}
            </h2>

            <p className="text-gray-400">
              {memory.category}
            </p>

            <p className="text-sm text-gray-500">
              {memory.wordCount} words
            </p>

          </div>

        ))}

      </div>

    </AppLayout>
  );
}

export default Dashboard;