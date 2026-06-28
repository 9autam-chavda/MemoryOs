import { useNavigate } from "react-router-dom";

function MemoryCard({ memory }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/memory/${memory.id}`)}
      className="
        group
        cursor-pointer
        overflow-hidden
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500
        hover:shadow-2xl
        hover:shadow-blue-500/10
      "
    >

      {/* Image */}
      <div className="overflow-hidden">

        {memory.fileType === "pdf" ? (

          <div className="h-52 flex flex-col items-center justify-center bg-red-950">

            <div className="text-7xl">
              📄
            </div>

            <p className="mt-3 text-red-300 font-semibold">
              PDF Document
            </p>

          </div>

        ) : (

          <img
            src={memory.fileUrl}
            alt={memory.fileName}
            className="
              h-52
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />

        )}

      </div>

      {/* Content */}
      <div className="p-4">

        <h2
          className="
            text-lg
            font-semibold
            truncate
            mb-4
          "
        >
          {memory.fileName}
        </h2>

        <div className="flex items-center justify-between">

          <span
            className="
              rounded-full
              bg-blue-500/10
              px-3
              py-1
              text-xs
              font-medium
              text-blue-400
            "
          >
            {memory.category}
          </span>

          <span
            className="
              text-sm
              text-gray-500
            "
          >
            {memory.wordCount} words
          </span>

        </div>

      </div>

    </div>
  );
}

export default MemoryCard;