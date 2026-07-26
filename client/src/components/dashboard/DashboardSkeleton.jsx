import Skeleton from "../ui/Skeleton";

function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading dashboard" aria-busy="true">
      <div className="flex justify-between gap-6"><Skeleton className="h-8 w-52" /><Skeleton className="h-11 w-80" /></div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-36 rounded-[var(--radius-lg)]" />)}</div>
      <Skeleton className="h-64 rounded-[var(--radius-lg)]" />
      <Skeleton className="h-48 rounded-[var(--radius-lg)]" />
    </div>
  );
}

export default DashboardSkeleton;
