function VideoPreview() {
  return (
    <div
      className="
        h-52
        flex
        flex-col
        items-center
        justify-center
        bg-gradient-to-br
        from-cyan-900
        to-blue-950
      "
    >
      <div className="text-7xl mb-3">
        🎬
      </div>

      <p className="text-xl font-semibold text-cyan-100">
        Video Memory
      </p>
    </div>
  );
}

export default VideoPreview;