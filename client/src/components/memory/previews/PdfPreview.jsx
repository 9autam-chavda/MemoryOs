import { FileText } from "lucide-react";

function PdfPreview({ fileUrl, fileName }) {
  return (
    <div className="relative h-48 overflow-hidden bg-zinc-100">
      {fileUrl ? (
        <iframe
          src={`${fileUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
          title={fileName}
          className="h-[260px] w-full origin-top scale-[0.82] bg-white"
          tabIndex={-1}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-zinc-100 text-zinc-500">
          <FileText size={28} />
        </div>
      )}
      <div className="absolute left-3 top-3 rounded-md bg-zinc-950/85 px-2 py-1 text-[11px] font-medium uppercase text-white">
        PDF
      </div>
    </div>
  );
}

export default PdfPreview;
