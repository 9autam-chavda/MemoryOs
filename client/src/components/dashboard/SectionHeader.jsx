function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
      {action}
    </div>
  );
}

export default SectionHeader;
