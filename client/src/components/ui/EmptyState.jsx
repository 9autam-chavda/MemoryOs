import Card from "./Card";

function EmptyState({ icon: Icon, title, description, action, compact = false, className = "" }) {
  return (
    <Card className={`flex flex-col items-center justify-center px-6 text-center ${compact ? "py-6" : "min-h-56 py-10"} ${className}`.trim()}>
      {Icon && <span className={`${compact ? "mb-3 h-9 w-9" : "mb-4 h-11 w-11"} flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-overlay)] text-[var(--text-secondary)]`}><Icon size={compact ? 17 : 20} strokeWidth={1.7} /></span>}
      <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">{description}</p>}
      {action && <div className={compact ? "mt-4" : "mt-5"}>{action}</div>}
    </Card>
  );
}

export default EmptyState;
