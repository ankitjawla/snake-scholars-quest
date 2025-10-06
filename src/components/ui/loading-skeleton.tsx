import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: "text" | "card" | "avatar" | "button";
}

export const LoadingSkeleton = ({ className, variant = "text" }: LoadingSkeletonProps) => {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  const variantClasses = {
    text: "h-4 w-full",
    card: "h-32 w-full",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  );
};

export const TopicLoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    <LoadingSkeleton variant="text" className="w-3/4" />
    <LoadingSkeleton variant="card" />
    <LoadingSkeleton variant="card" />
    <LoadingSkeleton variant="card" />
  </div>
);

export const LessonLoadingSkeleton = () => (
  <div className="space-y-6 p-6">
    <LoadingSkeleton variant="text" className="w-1/2 h-8" />
    <LoadingSkeleton variant="card" className="h-48" />
    <div className="space-y-2">
      <LoadingSkeleton variant="text" />
      <LoadingSkeleton variant="text" />
      <LoadingSkeleton variant="text" className="w-4/5" />
    </div>
  </div>
);
