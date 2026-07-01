function ImagePreview({ fileUrl, fileName }) {
  return (
    <div className="h-48 overflow-hidden bg-zinc-950">
      <img
        src={fileUrl}
        alt={fileName}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />
    </div>
  );
}

export default ImagePreview;
