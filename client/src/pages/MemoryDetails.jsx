import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";
import memoryService from "../services/memory.service";

function MemoryDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [memory, setMemory] = useState(null);
    const [loading, setLoading] = useState(true);

    const formattedDate = memory
    ? new Date(memory.createdAt).toLocaleDateString(
          "en-IN",
          {
              day: "numeric",
              month: "short",
              year: "numeric",
          }
      )
    : "";

    useEffect(() => {
        fetchMemory();
    }, []);

    const fetchMemory = async () => {

        try {

            const response =
                await memoryService.getMemoryById(id);

            setMemory(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const handleDelete = async () => {

        const confirmDelete =
            window.confirm(
                "Delete this memory?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await memoryService.deleteMemory(id);

            navigate("/gallery");

        } catch (error) {

            console.error(error);

            alert("Failed to delete memory");

        }

    };

    if (loading) {

        return (
            <AppLayout>
                <h1 className="text-3xl font-bold">
                    Loading...
                </h1>
            </AppLayout>
        );

    }

    return (

        <AppLayout>

            <button
                onClick={() => navigate("/gallery")}
                className="
                    text-blue-400
                    hover:text-blue-300
                    mb-6
                "
            >
                ← Back to Gallery
            </button>

            <h1 className="text-4xl font-bold mb-8">
                Memory Details
            </h1>

            <div className="max-w-5xl">

                <img
                    src={memory.fileUrl}
                    alt={memory.fileName}
                    className="w-full rounded-xl mb-8"
                />

                <h2 className="text-3xl font-bold">
                    {memory.fileName}
                </h2>

                <div className="flex gap-6 mt-4 text-gray-400">

                    <span>
                        📂 {memory.category}
                    </span>

                    <span>
                        📝 {memory.wordCount} words
                    </span>

                    <span>
                        📅 {formattedDate}
                    </span>

                </div>

                <div className="mt-10">

                    <h3 className="text-2xl font-semibold mb-4">
                        OCR Text
                    </h3>

                    <div className="bg-zinc-900 rounded-xl p-6 whitespace-pre-wrap leading-7">

                        {memory.extractedText}

                    </div>

                </div>

                <div className="mt-10">

                  <button
                      onClick={handleDelete}
                      className="
                          bg-red-600
                          hover:bg-red-700
                          px-6
                          py-3
                          rounded-lg
                          font-semibold
                          transition
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