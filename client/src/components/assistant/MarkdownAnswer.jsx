function formatInline(text) {
  return String(text)
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .map((part, index) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="
              rounded-lg
              border
              border-[var(--border-subtle)]
              bg-[var(--surface-muted)]
              px-1.5
              py-0.5
              font-mono
              text-[13px]
              text-[var(--text-primary)]
            "
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong
            key={index}
            className="font-semibold text-[var(--text-primary)]"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      return part;
    });
}

function MarkdownAnswer({ content }) {
  const blocks = [];
  let codeLines = null;

  String(content || "")
    .split("\n")
    .forEach((line) => {
      if (line.startsWith("```")) {
        if (codeLines) {
          blocks.push({
            type: "code",
            value: codeLines.join("\n"),
          });

          codeLines = null;
        } else {
          codeLines = [];
        }

        return;
      }

      if (codeLines) {
        codeLines.push(line);
      } else {
        blocks.push({
          type: "line",
          value: line,
        });
      }
    });

  if (codeLines) {
    blocks.push({
      type: "code",
      value: codeLines.join("\n"),
    });
  }

  return (
    <div
      className="
        space-y-4

        text-[15px]
        leading-8

        text-[var(--text-secondary)]
      "
    >
      {blocks.map((block, index) => {
        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="
                overflow-x-auto

                rounded-2xl

                border
                border-[var(--border-subtle)]

                bg-[var(--surface-muted)]

                p-5

                text-[13px]
                leading-6

                text-[var(--text-primary)]
              "
            >
              <code>{block.value}</code>
            </pre>
          );
        }

        const line = block.value;

        if (line.startsWith("# ")) {
          return (
            <h1
              key={index}
              className="
                pt-2

                text-2xl

                font-semibold

                tracking-tight

                text-[var(--text-primary)]
              "
            >
              {formatInline(line.slice(2))}
            </h1>
          );
        }

        if (line.startsWith("## ")) {
          return (
            <h2
              key={index}
              className="
                pt-2

                text-xl

                font-semibold

                tracking-tight

                text-[var(--text-primary)]
              "
            >
              {formatInline(line.slice(3))}
            </h2>
          );
        }

        if (line.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="
                pt-2

                text-lg

                font-semibold

                text-[var(--text-primary)]
              "
            >
              {formatInline(line.slice(4))}
            </h3>
          );
        }

        if (/^[-*] /.test(line)) {
          return (
            <div
              key={index}
              className="flex gap-3"
            >
              <span
                className="
                  mt-3

                  h-2
                  w-2

                  rounded-full

                  bg-[var(--accent)]
                "
              />

              <div className="flex-1">
                {formatInline(line.slice(2))}
              </div>
            </div>
          );
        }

        if (/^\d+\. /.test(line)) {
          return (
            <p key={index}>
              {formatInline(line)}
            </p>
          );
        }

        if (!line.trim()) {
          return <div key={index} className="h-2" />;
        }

        return (
          <p
            key={index}
            className="leading-8"
          >
            {formatInline(line)}
          </p>
        );
      })}
    </div>
  );
}

export default MarkdownAnswer;