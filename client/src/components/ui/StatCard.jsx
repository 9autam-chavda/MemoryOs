function StatCard({ title, value, detail, icon: Icon }) {
  return (
    <div className="rounded-lg border border-white/[0.07] bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{title}</p>
        {Icon && <Icon size={16} className="text-zinc-500" />}
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-100">{value}</h2>
      {detail && <p className="mt-1 text-xs leading-5 text-zinc-500">{detail}</p>}
    </div>
  );
}

export default StatCard;
