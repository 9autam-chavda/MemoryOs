import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AppLayout from "../components/layout/AppLayout";
import memoryService from "../services/memory.service";

function MemoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemory();
  }, []);

  const fetchMemory = async () => {
    try {
      const response = await memoryService.getMemoryById(id);
      setMemory(response.data);
    } catch (error) {
      toast.error("Failed to load memory.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Delete this memory?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await memoryService.deleteMemory(id);

      toast.success("Memory deleted successfully.");

      navigate("/gallery");
    } catch (error) {
      toast.error("Failed to delete memory.");
    }
  };

  const formattedDate = memory
    ? new Date(memory.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-96">
          <h1 className="text-3xl font-bold">
            Loading...
          </h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>

      <button
        onClick={() => navigate("/gallery")}
        className="text-blue-400 hover:text-blue-300 mb-6"
      >
        ← Back to Gallery
      </button>

      <h1 className="text-4xl font-bold mb-8">
        Memory Details
      </h1>

      <div className="max-w-6xl mx-auto">

                {/* Preview */}

        {memory.fileType === "image" && (
          <img
            src={memory.fileUrl}
            alt={memory.fileName}
            className="
              w-full
              rounded-2xl
              border
              border-zinc-800
              mb-8
            "
          />
        )}

        {memory.fileType === "pdf" && (
          <div className="mb-8">

            <iframe
              src={memory.fileUrl}
              title={memory.fileName}
              className="
                w-full
                h-[700px]
                rounded-2xl
                border
                border-zinc-800
              "
            />

            <a
              href={memory.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block
                mt-4
                text-blue-400
                hover:text-blue-300
              "
            >
              📄 Open PDF in New Tab
            </a>

          </div>
        )}

        {memory.fileType === "audio" && (
          <div
            className="
              mb-8
              bg-zinc-900
              rounded-2xl
              p-6
              border
              border-zinc-800
            "
          >
            <audio controls className="w-full">
              <source
                src={memory.fileUrl}
                type="audio/mpeg"
              />
            </audio>
          </div>
        )}

        {memory.fileType === "video" && (
          <div className="mb-8">
            <video
              controls
              className="
                w-full
                rounded-2xl
                border
                border-zinc-800
              "
            >
              <source src={memory.fileUrl} />
            </video>
          </div>
        )}

        {memory.fileType === "text" && (
          <div
            className="
              mb-8
              rounded-2xl
              border
              border-zinc-800
              bg-zinc-900
              p-6
            "
          >
            <pre className="whitespace-pre-wrap text-gray-300">
              {memory.extractedText}
            </pre>
          </div>
        )}

        {/* Header */}

        <div className="mb-8">

          <h2 className="text-4xl font-bold mb-4">
            {memory.fileName}
          </h2>

          <div className="flex flex-wrap gap-4 text-gray-400">

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-blue-500/10
                text-blue-400
              "
            >
              📂 {memory.category}
            </span>

            <span>
              📝 {memory.wordCount} words
            </span>

            <span>
              📅 {formattedDate}
            </span>

          </div>

        </div>

        {/* AI Insights */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
            mb-8
          "
        >

          <h3 className="text-2xl font-bold mb-6">
            🧠 AI Insights
          </h3>

          <div className="mb-6">

            <h4 className="text-zinc-400 mb-2">
              Summary
            </h4>

            <p className="leading-7 text-gray-300">
              {memory.summary ||
                "No AI summary available."}
            </p>

          </div>

          <div className="mb-6">

            <h4 className="text-zinc-400 mb-2">
              Category
            </h4>

            <span
              className="
                inline-flex
                rounded-full
                bg-blue-600/10
                px-4
                py-2
                text-blue-400
                font-medium
              "
            >
              {memory.category}
            </span>

          </div>

          <div>

            <h4 className="text-zinc-400 mb-2">
              Tags
            </h4>

            <div className="flex flex-wrap gap-2">

              {memory.tags?.length ? (

                memory.tags.map((tag) => (

                  <span
                    key={tag}
                    className="
                      rounded-full
                      bg-zinc-800
                      px-3
                      py-1
                      text-sm
                      border
                      border-zinc-700
                    "
                  >
                    #{tag}
                  </span>

                ))

              ) : (

                <span className="text-gray-500">
                  No tags generated.
                </span>

              )}

            </div>

          </div>

        </div>

        {/* Extracted Text */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
            mb-10
          "
        >

          <h3 className="text-2xl font-bold mb-5">
            📄 Extracted Text
          </h3>

          <div
            className="
              max-h-[500px]
              overflow-y-auto
              whitespace-pre-wrap
              leading-7
              text-gray-300
            "
          >
            {memory.extractedText ||
              "No extracted text available."}
          </div>

        </div>

                {/* Danger Zone */}

        <div
          className="
            border
            border-red-900/40
            bg-red-950/10
            rounded-2xl
            p-6
            mb-10
          "
        >

          <h3 className="text-xl font-bold text-red-400 mb-2">
            Danger Zone
          </h3>

          <p className="text-gray-400 mb-6">
            Deleting this memory will permanently remove the
            uploaded file and all AI generated information.
            This action cannot be undone.
          </p>

          <button
            onClick={handleDelete}
            className="
              bg-red-600
              hover:bg-red-700
              transition
              px-6
              py-3
              rounded-xl
              font-semibold
            "
          >
            Delete Memory
          </button>

        </div>

      </div>

    </AppLayout>
  );
}

export default MemoryDetails;