function Skeleton({ className = "", ...props }) {
  return <div aria-hidden="true" className={`ui-skeleton rounded-[var(--radius-md)] ${className}`.trim()} {...props} />;
}

export default Skeleton;
