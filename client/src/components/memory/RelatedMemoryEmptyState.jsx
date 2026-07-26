import { Link2Off } from "lucide-react";
import EmptyState from "../ui/EmptyState";

function RelatedMemoryEmptyState() {
  return (
    <EmptyState compact className="mt-3" icon={Link2Off} title="No related memories" description="Related memories will appear when relevant context is available." />
  );
}

export default RelatedMemoryEmptyState;
