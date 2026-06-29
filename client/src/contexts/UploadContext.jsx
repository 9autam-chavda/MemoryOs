import { createContext, useState } from "react";

import memoryService from "../services/memory.service";

export const UploadContext = createContext();

function UploadProvider({ children }) {

  const [uploads, setUploads] = useState([]);

  const updateUpload = (id, updates) => {

    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id
          ? { ...upload, ...updates }
          : upload
      )
    );

  };

  const removeUpload = (id) => {

    setUploads((prev) =>
      prev.filter((upload) => upload.id !== id)
    );

  };

  const processUpload = async (
    upload,
    onSuccess
  ) => {

    try {

      updateUpload(upload.id, {
        status: "uploading",
        message: "Uploading..."
      });

      const formData = new FormData();
      formData.append("file", upload.file);

      await memoryService.uploadMemory(
        formData,
        (progress) => {

          updateUpload(upload.id, {
            progress
          });

        }
      );

      updateUpload(upload.id, {
        progress: 100,
        status: "processing",
        message: "Processing..."
      });

      onSuccess?.();

      updateUpload(upload.id, {
        status: "completed",
        message: "Completed"
      });

      setTimeout(() => {
        removeUpload(upload.id);
      }, 5000);

    } catch (error) {

      updateUpload(upload.id, {
        status: "failed",
        message: "Upload Failed"
      });

    }

  };

  const addUpload = (
    file,
    onSuccess
  ) => {

    const upload = {

      id: crypto.randomUUID(),

      file,

      fileName: file.name,

      fileType: file.type,

      progress: 0,

      status: "queued",

      message: "Waiting..."

    };

    setUploads((prev) => [...prev, upload]);

    processUpload(upload, onSuccess);

  };

  return (

    <UploadContext.Provider
      value={{
        uploads,
        addUpload,
        removeUpload
      }}
    >

      {children}

    </UploadContext.Provider>

  );

}

export default UploadProvider;