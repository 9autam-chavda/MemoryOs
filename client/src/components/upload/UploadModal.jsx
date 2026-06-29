import { useState } from "react";
import toast from "react-hot-toast";

import useUpload from "../../hooks/useUpload";

function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addUpload } = useUpload();

  const handleUpload = () => {

  if (!file) {

    toast.error("Please choose a file.");

    return;

  }

  addUpload(file, () => {

    toast.success("Memory uploaded successfully!");

    onUploadSuccess();

  });

  setFile(null);

  onClose();

};

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (

    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-zinc-900 rounded-xl p-6 w-[420px] border border-zinc-800">

        <h2 className="text-2xl font-bold mb-6">
          Upload Memory
        </h2>

        <input
          type="file"
          accept="
            image/*,
            application/pdf,
            audio/*,
            video/*,
            .txt,
            .md
          "
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-6 w-full"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={handleClose}
            disabled={loading}
            className="
              px-4
              py-2
              rounded
              bg-zinc-700
              hover:bg-zinc-600
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="
              px-4
              py-2
              rounded
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-gray-600
            "
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>

    </div>

  );
}

export default UploadModal;