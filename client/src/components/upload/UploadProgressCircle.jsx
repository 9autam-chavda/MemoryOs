function UploadProgressCircle({ progress, active = true }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width="44" height="44" className="-rotate-90">
      <circle cx="22" cy="22" r={radius} stroke="#27272a" strokeWidth="4" fill="none" />
      <circle
        cx="22"
        cy="22"
        r={radius}
        stroke={active ? "#60a5fa" : "#71717a"}
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
