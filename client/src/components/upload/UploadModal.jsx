import { useState } from "react";
import memoryService from "../../services/memory.service";

function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
})  {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {

        if (!file) {
            alert("Please choose a file.");
            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();
                formData.append("file", file);

                for (const [key, value] of formData.entries()) {
                console.log(key, value);
                }

                console.log(formData);
                console.log(file);
                console.log(file instanceof File);

                await memoryService.uploadMemory(formData);

            onClose();

        } catch (error) {

   

    alert(error.response?.data?.message || error.message);

}finally {

            setLoading(false);

        }

    };

  if (!isOpen) {
    return null;
  }

  return (

    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

      <div className="bg-zinc-900 rounded-xl p-6 w-[420px]">

        <h2 className="text-2xl font-bold mb-6">
          Upload Memory
        </h2>

        <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-6 w-full"
        />

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
            >
            {loading ? "Uploading..." : "Upload"}
          </button>

        </div>

      </div>

    </div>

  );
}

export default UploadModal;