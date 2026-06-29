import { useState } from "react";

import useUpload from "../../hooks/useUpload";
import UploadItem from "./UploadItem";

function UploadManager() {

  const [collapsed, setCollapsed] = useState(false);

  const { uploads } = useUpload();

  if (uploads.length === 0) {
    return null;
  }

  return (

    <div
      className="
        fixed
        bottom-5
        right-5
        w-96
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        shadow-2xl
        z-50
      "
    >

      <div
        onClick={() => setCollapsed(!collapsed)}
        className="
          cursor-pointer
          px-4
          py-3
          border-b
          border-zinc-800
          flex
          items-center
          justify-between
        "
      >

        <span className="font-semibold">
          Uploads ({uploads.length})
        </span>

        <span
          className={`
            transition-transform duration-300
            ${collapsed ? "-rotate-90" : ""}
          `}
        >
          ▼
        </span>

      </div>

      {!collapsed && (

        <div className="max-h-96 overflow-y-auto">

          {uploads.map((upload) => (

            <UploadItem
              key={upload.id}
              upload={upload}
            />

          ))}

        </div>

      )}

    </div>

  );

}

export default UploadManager;