import Card from "../ui/Card";
import Skeleton from "../ui/Skeleton";

function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
      </div>
    </Card>
  );
}

function MemoryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default MemoryGridSkeleton;
