function AudioPreview() {
  return (
    <div
      className="
        h-52
        flex
        flex-col
        items-center
        justify-center
        bg-gradient-to-br
        from-purple-900
        to-purple-950
      "
    >
      <div className="text-7xl mb-3">
        🎵
      </div>

      <p className="text-xl font-semibold text-purple-100">
        Audio Recording
      </p>
    </div>
  );
}

export default AudioPreview;