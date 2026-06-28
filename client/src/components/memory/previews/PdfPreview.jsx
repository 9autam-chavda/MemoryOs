function ImagePreview({ fileUrl, fileName }) {
  return (
    <div className="overflow-hidden">
      <img
        src={fileUrl}
        alt={fileName}
        className="
          h-52
          w-full
          object-cover
          transition-transform
          duration-500
          group-hover:scale-105
        "
      />
    </div>
  );
}

export default ImagePreview;