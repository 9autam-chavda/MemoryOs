import { useNavigate } from "react-router-dom";

import ImagePreview from "./previews/ImagePreview";
import PdfPreview from "./previews/PdfPreview";
import AudioPreview from "./previews/AudioPreview";
import VideoPreview from "./previews/VideoPreview";
import TextPreview from "./previews/TextPreview";

function MemoryCard({ memory }) {
  const navigate = useNavigate();

  const renderPreview = () => {
    switch (memory.fileType) {
      case "image":
        return (
          <ImagePreview
            fileUrl={memory.fileUrl}
            fileName={memory.fileName}
          />
        );

      case "pdf":
        return <PdfPreview />;

      case "audio":
        return <AudioPreview />;

      case "video":
        return <VideoPreview />;

      case "text":
        return <TextPreview />;

      default:
        return (
          <ImagePreview
            fileUrl={memory.fileUrl}
            fileName={memory.fileName}
          />
        );
    }
  };

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
      {/* Preview */}
      {renderPreview()}

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