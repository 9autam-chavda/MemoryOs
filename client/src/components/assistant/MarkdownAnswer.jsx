function formatInline(text) {
  return String(text).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index} className="rounded bg-black/20 px-1 py-0.5 text-xs">{part.slice(1, -1)}</code>;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

function MarkdownAnswer({ content }) {
  const blocks = [];
  let codeLines = null;
  String(content || "").split("\n").forEach((line) => {
    if (line.startsWith("```")) {
      if (codeLines) { blocks.push({ type: "code", value: codeLines.join("\n") }); codeLines = null; }
      else codeLines = [];
    } else if (codeLines) codeLines.push(line);
    else blocks.push({ type: "line", value: line });
  });
  if (codeLines) blocks.push({ type: "code", value: codeLines.join("\n") });

  return <div className="space-y-3 text-sm leading-7 text-[var(--text-secondary)]">
    {blocks.map((block, index) => {
      if (block.type === "code") return <pre key={index} className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-black/20 p-4 text-xs leading-6 text-[var(--text-primary)]"><code>{block.value}</code></pre>;
      const line = block.value;
      if (line.startsWith("### ")) return <h3 key={index} className="pt-2 text-base font-semibold text-[var(--text-primary)]">{formatInline(line.slice(4))}</h3>;
      if (line.startsWith("## ") || line.startsWith("# ")) return <h2 key={index} className="pt-2 text-lg font-semibold text-[var(--text-primary)]">{formatInline(line.replace(/^#{1,2} /, ""))}</h2>;
      if (/^[-*] /.test(line)) return <div key={index} className="flex gap-2"><span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />{formatInline(line.slice(2))}</div>;
      if (/^\d+\. /.test(line)) return <div key={index}>{formatInline(line)}</div>;
      return line ? <p key={index}>{formatInline(line)}</p> : null;
    })}
  </div>;
}

export default MarkdownAnswer;
