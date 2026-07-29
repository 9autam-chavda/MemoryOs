import { createContext, useCallback, useRef, useState } from "react";

import memoryService from "../services/memory.service";

export const UploadContext = createContext();

const POLL_INTERVAL_MS = 1000;
const COMPLETE_DISMISS_MS = 2000;

const STAGE_PROGRESS = {
  queued: 5,
  uploading: 20,
  extracting: 35,
  analyzing: 70,
  saving: 90,
  completed: 100,
  failed: 100,
};

function UploadProvider({ children }) {
  const [uploads, setUploads] = useState([]);

  const controllersRef = useRef(new Map());
  const dismissedRef = useRef(new Set());
  const callbacksRef = useRef(new Map());

  const updateUpload = useCallback((id, updates) => {
    setUploads((current) =>
      current.map((upload) =>
        upload.id === id
          ? { ...upload, ...updates }
          : upload
      )
    );
  }, []);

  const removeUpload = useCallback((id) => {
    dismissedRef.current.add(id);

    controllersRef.current.get(id)?.abort();

    controllersRef.current.delete(id);
    callbacksRef.current.delete(id);

    setUploads((current) =>
      current.filter((upload) => upload.id !== id)
    );
  }, []);

  const waitForJob = useCallback(
    async (upload, controller, onSuccess) => {
      while (
        !controller.signal.aborted &&
        !dismissedRef.current.has(upload.id)
      ) {
        try {
          const response =
            await memoryService.getUploadStatus(
              upload.jobId,
              controller.signal
            );

          // The status endpoint has existed in both wrapped
          // ({ success, data: job }) and direct ({ status: ... }) forms.
          // Normalize at the polling boundary so a completed direct response
          // reaches the completion branch instead of throwing and retrying.
          const job = response?.data?.status ? response.data : response;


          if (job.status === "completed") {
            updateUpload(upload.id, {
              status: "completed",
              stage: "completed",
              progress: 100,
              message: "Completed",
            });

            onSuccess?.({
              memoryId: job.memoryId,
            });

            window.setTimeout(() => {
              removeUpload(upload.id);
            }, COMPLETE_DISMISS_MS);

            return;
          }

          if (job.status === "failed") {
            updateUpload(upload.id, {
              status: "failed",
              stage: "failed",
              progress: 100,
              message:
                job.error ||
                "Processing failed",
            });

            return;
          }

          updateUpload(upload.id, {
            status: job.status,
            stage: job.stage,
            progress:
              STAGE_PROGRESS[job.stage] ?? 95,
            message: job.message,
          });

        } catch (error) {

          if (controller.signal.aborted) {
            return;
          }

          console.warn(
            "Polling failed. Retrying...",
            error.message
          );

        }

        await new Promise((resolve) =>
          window.setTimeout(
            resolve,
            POLL_INTERVAL_MS
          )
        );
      }
    },
    [removeUpload, updateUpload]
  );

  const processUpload = useCallback(
    async (upload, onSuccess) => {
      const controller =
        new AbortController();

      controllersRef.current.set(
        upload.id,
        controller
      );

      try {
        updateUpload(upload.id, {
          status: "uploading",
          stage: "uploading",
          progress: 0,
          message: "Uploading...",
        });

        const formData = new FormData();

        formData.append(
          "file",
          upload.file
        );

        const response =
          await memoryService.uploadMemory(
            formData,
            (progress) => {
              updateUpload(upload.id, {
                progress,
              });
            },
            controller.signal
          );

        if (
          controller.signal.aborted ||
          dismissedRef.current.has(upload.id)
        ) {
          return;
        }

        const jobId =
          response?.data?.jobId || response?.jobId;

        if (!jobId) {
          throw new Error(
            "Upload job was not created."
          );
        }

        const queuedUpload = {
          ...upload,
          jobId,
        };

        updateUpload(upload.id, {
          jobId,
          status: "processing",
          stage: "queued",
          progress:
            STAGE_PROGRESS.queued,
          message:
            "Upload complete. Processing...",
        });

        await waitForJob(
          queuedUpload,
          controller,
          onSuccess
        );

      } catch (error) {

        if (
          controller.signal.aborted ||
          dismissedRef.current.has(upload.id)
        ) {
          return;
        }

        updateUpload(upload.id, {
          status: "failed",
          stage: "failed",
          progress: 100,
          message:
            error.response?.data?.message ||
            error.message ||
            "Upload failed",
        });

      } finally {

        controllersRef.current.delete(
          upload.id
        );

      }
    },
    [updateUpload, waitForJob]
  );

  const addUpload = useCallback(
    
    (file, onSuccess) => {
      const upload = {
        id: crypto.randomUUID(),
        file,
        fileName: file.name,
        fileType: file.type,
        progress: 0,
        status: "queued",
        stage: "queued",
        message: "Queued",
      };

      dismissedRef.current.delete(
        upload.id
      );

      callbacksRef.current.set(
        upload.id,
        onSuccess
      );

      setUploads((current) => [
        ...current,
        upload,
      ]);

      processUpload(
        upload,
        onSuccess
      );
    },
    [processUpload]
  );

  const retryUpload = useCallback(
    (id) => {
      let retryUploadItem;

      setUploads((current) =>
        current.map((upload) => {
          if (upload.id !== id) {
            return upload;
          }

          retryUploadItem = {
            ...upload,
            jobId: undefined,
            progress: 0,
            status: "queued",
            stage: "queued",
            message: "Queued",
          };

          return retryUploadItem;
        })
      );

      if (retryUploadItem) {
        processUpload(
          retryUploadItem,
          callbacksRef.current.get(id)
        );
      }
    },
    [processUpload]
  );

  return (
    <UploadContext.Provider
      value={{
        uploads,
        hasActiveUploads: uploads.some(
          (u) =>
            u.status === "uploading" ||
            u.status === "processing"
        ),
        addUpload,
        retryUpload,
        removeUpload,
      }}
    >
      {children}
    </UploadContext.Provider>
  );
}

export default UploadProvider;
