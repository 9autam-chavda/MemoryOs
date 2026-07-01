import { AlignLeft } from "lucide-react";

function TextPreview({ memory }) {
  const text = memory?.summary || memory?.extractedText || "Text memory indexed for search and summarization.";

  return (
    <div className="flex h-48 flex-col bg-[#f5f5f1] p-5 text-zinc-950">
      <div className="flex items-center justify-between">
        <AlignLeft size={18} className="text-zinc-500" />
        <span className="rounded-md bg-zinc-950 px-2 py-1 text-[11px] uppercase text-white">Text</span>
      </div>
      <p className="mt-5 line-clamp-5 text-[15px] leading-6 text-zinc-800">{text}</p>
      <div className="mt-auto h-px w-full bg-zinc-300/70" />
    </div>
  );
}

export default TextPreview;
