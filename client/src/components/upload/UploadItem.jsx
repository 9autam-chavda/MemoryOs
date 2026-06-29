import UploadProgressCircle from "./UploadProgressCircle";

function UploadItem({ upload }) {

  return (

    <div className="flex items-center gap-4 p-4 border-b border-zinc-800 last:border-none">

      <div className="relative">

        <UploadProgressCircle
          progress={upload.progress}
        />

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-xs
            font-semibold
          "
        >
          {upload.progress}%
        </div>

      </div>

      <div className="flex-1 min-w-0">

        <p className="font-medium truncate">
          {upload.fileName}
        </p>

        <p className="text-sm text-zinc-400">
          {upload.message}
        </p>

      </div>

    </div>

  );

}

export default UploadItem;