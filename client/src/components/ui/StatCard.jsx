function StatCard({ title, value, detail, icon: Icon }) {
  return (
    <div className="group min-h-36 rounded-[1.5rem] border border-[var(--border-subtle)] bg-[var(--surface-panel)] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:bg-[var(--surface-panel-raised)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-white/[0.03] text-[var(--text-tertiary)] transition group-hover:text-[var(--text-secondary)]">
            <Icon size={16} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">{value}</h2>
      {detail && <p className="mt-2 text-sm leading-5 text-[var(--text-tertiary)]">{detail}</p>}
    </div>
  );
}

export default StatCard;
