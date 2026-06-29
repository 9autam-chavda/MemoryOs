function UploadProgressCircle({ progress }) {

  const radius = 18;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  return (
    <svg
      width="44"
      height="44"
      className="-rotate-90"
    >

      <circle
        cx="22"
        cy="22"
        r={radius}
        stroke="#3f3f46"
        strokeWidth="4"
        fill="none"
      />

      <circle
        cx="22"
        cy="22"
        r={radius}
        stroke="#2563eb"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-300"
      />

    </svg>
  );
}

export default UploadProgressCircle;