function TextPreview() {
  return (
    <div
      className="
        h-52
        flex
        flex-col
        items-center
        justify-center
        bg-gradient-to-br
        from-zinc-700
        to-zinc-900
      "
    >
      <div className="text-7xl mb-3">
        📝
      </div>

      <p className="text-xl font-semibold">
        Text Document
      </p>
    </div>
  );
}

export default TextPreview;