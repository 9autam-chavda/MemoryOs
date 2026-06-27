import { useNavigate } from "react-router-dom";

function MemoryCard({ memory }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/memory/${memory.id}`)}
      className="
                cursor-pointer
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900
                overflow-hidden
                hover:border-blue-500
                hover:shadow-xl
                hover:shadow-blue-500/20
                hover:scale-[1.02]
                transition-all
                duration-300"
    >
      <img
        src={memory.fileUrl}
        alt={memory.fileName}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h2 className="font-semibold truncate">
          {memory.fileName}
        </h2>

        <p className="text-sm text-gray-400 mt-2">
          {memory.category}
        </p>

        <p className="text-sm text-gray-500">
          {memory.wordCount} words
        </p>

      </div>

    </div>
  );
}

export default MemoryCard;