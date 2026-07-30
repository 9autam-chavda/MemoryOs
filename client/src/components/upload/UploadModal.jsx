import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CheckCircle2,
  FileAudio,
  FileImage,
  FileText,
  FileUp,
  Film,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import useUpload from "../../hooks/useUpload";

function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}) {
  const [file, setFile] = useState(null);

  const { addUpload } = useUpload();

  const fileInputRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleClose = useCallback(() => {
    setFile(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener(
      "keydown",
      onKeyDown
    );

    const timer = setTimeout(
      () => closeButtonRef.current?.focus(),
      0
    );

    return () => {
      document.removeEventListener(
        "keydown",
        onKeyDown
      );

      clearTimeout(timer);
    };
  }, [handleClose, isOpen]);

  const FILE_LIMITS = {
  image: 10 * 1024 * 1024,       // 10 MB
  pdf: 100 * 1024 * 1024,        // 100 MB
  video: 100 * 1024 * 1024,      // 100 MB
  audio: 100 * 1024 * 1024,      // 100 MB
  text: 5 * 1024 * 1024,         // 5 MB
  document: 50 * 1024 * 1024,    // 50 MB
};

const getFileType = (file) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";

  if (
    file.type === "text/plain" ||
    file.type === "text/markdown"
  ) {
    return "text";
  }

  return "document";
};

  const handleUpload = () => {
    if (!file) {
      toast.error("Choose a file first.");
      return;
    }

    addUpload(file, () => {
      toast.success("Memory uploaded.");
      onUploadSuccess();
    });

    setFile(null);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
    aria-labelledby="upload-modal-title"
    tabIndex={-1}
    onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      }
    }}
  >
    <div
      className="
        w-full
        max-w-xl

        overflow-hidden

        rounded-3xl

        border
        border-[var(--border-subtle)]

        bg-[var(--surface-panel)]

        shadow-2xl
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between px-6 py-5">
        <div>
          <h2
            id="upload-modal-title"
            className="text-xl font-semibold tracking-tight text-[var(--text-primary)]"
          >
            Upload Memory
          </h2>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Choose a file to upload.
          </p>
        </div>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          aria-label="Close upload modal"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center

            rounded-xl

            text-[var(--text-secondary)]

            transition

            hover:bg-[var(--surface-overlay)]
            hover:text-[var(--text-primary)]
          "
        >
          <X size={18} />
        </button>
      </div>


              {/* Content */}

      <div className="px-6 pb-6">
        <label
          htmlFor="memory-file-input"
          tabIndex={0}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="
            group

            flex
            cursor-pointer
            flex-col
            items-center
            justify-center

            rounded-2xl

            border
            border-dashed
            border-[var(--border-subtle)]

            bg-[var(--surface-overlay)]

            px-6
            py-12

            transition-all
            duration-200

            hover:border-[var(--accent)]
            hover:bg-[var(--surface-hover)]
          "
        >
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-xl

              bg-[var(--surface-panel)]

              transition-transform
              duration-200

              group-hover:scale-105
            "
          >
            <FileUp
              size={22}
              className="text-[var(--accent)]"
            />
          </div>

          <p className="mt-5 text-base font-medium text-[var(--text-primary)]">
            Drop file here
          </p>

          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            or click to browse
          </p>

          <input
            id="memory-file-input"
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf,audio/*,video/*,.txt,.md"
            onChange={(event) => {
              const selectedFile = event.target.files[0];

              if (!selectedFile) return;

              const fileType = getFileType(selectedFile);
              const limit = FILE_LIMITS[fileType];

              if (selectedFile.size > limit) {
                toast.error(
                  `Maximum ${fileType.toUpperCase()} upload size is ${
                    limit / (1024 * 1024)
                  } MB.`
                );

                event.target.value = "";
                return;
              }

              setFile(selectedFile);
            }}
            className="sr-only"
          />
        </label>

        {/* Supported Types */}

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {[
            {
              label: "Image",
              icon: FileImage,
            },
            {
              label: "PDF",
              icon: FileText,
            },
            {
              label: "Audio",
              icon: FileAudio,
            },
            {
              label: "Video",
              icon: Film,
            },
          ].map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="
                flex
                items-center
                gap-2

                rounded-full

                border
                border-[var(--border-subtle)]

                px-3
                py-1.5

                text-xs
                text-[var(--text-secondary)]
              "
            >
              <Icon size={13} />
              {label}
            </div>
          ))}
        </div>

        {/* Selected File */}

        {file && (
          <div
            className="
              mt-6

              flex
              items-center
              justify-between

              rounded-2xl

              border
              border-[var(--border-subtle)]

              bg-[var(--surface-overlay)]

              px-4
              py-3
            "
          >
            <div className="flex items-center gap-3">
              <CheckCircle2
                size={18}
                className="text-emerald-500"
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                  {file.name}
                </p>

                <p className="text-xs text-[var(--text-secondary)]">
                  Ready
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

            {/* Footer */}

      <div
        className="
          flex
          items-center
          justify-end
          gap-3

          border-t
          border-[var(--border-subtle)]

          px-6
          py-5
        "
      >
        <button
          type="button"
          ref={closeButtonRef}
          onClick={handleClose}
          className="
            rounded-xl

            px-4
            py-2.5

            text-sm
            font-medium

            text-[var(--text-secondary)]

            transition-colors

            hover:bg-[var(--surface-overlay)]
            hover:text-[var(--text-primary)]
          "
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file}
          className="
            rounded-xl

            bg-[var(--text-primary)]

            px-5
            py-2.5

            text-sm
            font-medium

            text-[var(--surface-canvas)]

            transition-all
            duration-200

            hover:opacity-90
            active:scale-[0.98]

            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Upload
        </button>
      </div>
    </div>
  </div>
);
}

export default UploadModal;