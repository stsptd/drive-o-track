
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const LoadingScreen = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center", className)}>
      <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
      <div className="text-white text-2xl font-medium">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
