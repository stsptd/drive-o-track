
import { cn } from "@/lib/utils";

const LoadingScreen = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 bg-neutral-950 flex items-center justify-center", className)}>
      <div className="text-white text-2xl font-medium">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
