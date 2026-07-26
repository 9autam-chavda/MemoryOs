import Skeleton from "../ui/Skeleton";

function GalleryToolbarSkeleton() {
  return <div className="space-y-3"><Skeleton className="h-11 w-full" /><div className="flex gap-2">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-8 w-20 rounded-full" />)}</div></div>;
}

export default GalleryToolbarSkeleton;
