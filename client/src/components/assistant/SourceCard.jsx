import {
  ArrowUpRight,
  FileText,
  Image as ImageIcon,
  Music4,
  Video,
} from "lucide-react";

import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { getFileIcon } from "../../utils/media.util";

const iconMap = {
  image: ImageIcon,
  audio: Music4,
  video: Video,
  pdf: FileText,
  document: FileText,
};

function SourceCard({ source, onOpen }) {
  const match = Number(source.similarity);

  const Icon =
    iconMap[getFileIcon(source)] || FileText;

  return (
    <Card
      as="button"
      interactive
      type="button"
      onClick={onOpen}
      className="
        group
        w-full

        rounded-2xl

        border
        border-[var(--border-subtle)]

        p-4

        text-left

        transition-all
        duration-200

        hover:border-[var(--border-strong)]
        hover:-translate-y-0.5
      "
    >
      <div className="flex items-center gap-4">

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center

            rounded-xl

            bg-[var(--surface-muted)]

            text-[var(--text-secondary)]
          "
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">

          <h4
            className="
              truncate

              text-[15px]

              font-medium

              text-[var(--text-primary)]
            "
          >
            {source.title}
          </h4>

          <div className="mt-2 flex flex-wrap items-center gap-2">

            {source.category && (
              <Badge>
                {source.category}
              </Badge>
            )}

            {Number.isFinite(match) && (
              <span
                className="
                  rounded-full

                  bg-[var(--surface-muted)]

                  px-2.5
                  py-1

                  text-[11px]

                  text-[var(--text-secondary)]
                "
              >
                {Math.round(match * 100)}% Match
              </span>
            )}

          </div>

        </div>

        <div
          className="
            flex
            items-center
            gap-1

            text-xs

            text-[var(--text-tertiary)]

            transition-colors

            group-hover:text-[var(--text-primary)]
          "
        >
          Open

          <ArrowUpRight
            size={15}
            className="
              transition-transform
              duration-200

              group-hover:translate-x-0.5
              group-hover:-translate-y-0.5
            "
          />
        </div>

      </div>
    </Card>
  );
}

export default SourceCard;